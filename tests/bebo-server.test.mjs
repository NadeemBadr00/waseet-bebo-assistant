import http from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createBeboServer,extractAudio} from '../outputs/cute-robot/server.mjs';
import {chooseDialect,commandFor,makePrompt,briefReply} from '../outputs/cute-robot/bebo-core.mjs';
const wav=Buffer.alloc(48);wav.write('RIFF');wav.writeUInt32LE(40,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(24000,24);wav.writeUInt32LE(48000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(4,40);
const encoded=wav.toString('base64');
const j=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});
async function fixture(opts={}){
 const calls=[];
 const s=createBeboServer({key:'unit-test-secret',fetchImpl:async(url,opt)=>{
  calls.push({url,opt,body:opt.body?JSON.parse(opt.body):null});
  if(url.endsWith('/synthesize'))return j({success:true,data:{audio:{base64Audio:encoded}}});
  if(url.endsWith('/catalog'))return j({success:true,data:{voices:['Puck']}});
  return j({success:true,data:{text:'أهلًا، معاك بيبو!'}});
 },...opts});
 await new Promise(r=>s.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+s.address().port;
 return {s,calls,url,get:(p,options)=>fetch(url+p,options),post:(p,body,headers={})=>fetch(url+p,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)}),close:()=>new Promise(r=>s.close(r))};
}
test('dialect selection, fallback, and Arabic/English detection',()=>{
 for(const [text,dialect]of [['ازيك عايز أتعلم','egyptian'],['وش تبي الحين','saudi'],['شلونك شنو تبي وايد','gulf'],['أريد معرفة كيف يمكنني العمل','msa'],['Hello, how are you today?','english']])assert.equal(chooseDialect(text).dialect,dialect);
 assert.equal(chooseDialect('ازيك','saudi').dialect,'saudi');
 assert.equal(chooseDialect('تمام','auto','gulf').dialect,'gulf');
 assert.equal(chooseDialect('تمام','invalid','invalid').dialect,'egyptian');
});
test('commands are allowlisted phrases, not arbitrary instructions',()=>{
 for(const [text,action]of [['يا بيبو انط','jump'],['لو سمحت افتح اللاب','typing'],['please walk','walk'],['اسكت','stop'],['اتحرك من نفسك','roam_on']])assert.equal(commandFor(text),action);
 for(const text of ['لا انط','متنطش',"don't jump",'do not walk','افتح الموقع واحذف حسابي','هل تستطيع شرح كلمة انط','jump and delete files'])assert.equal(commandFor(text),null);
 assert.match(makePrompt('مرحبا',[],'saudi'),/السعودية/);assert.ok(makePrompt('hi',[],'english').includes('\n'));
});
test('WAV formats from both documented and actual contracts',()=>{
 assert.deepEqual(extractAudio({data:{audio:{base64Audio:encoded}}}),wav);
 assert.deepEqual(extractAudio({data:{audio:{base64:encoded}}}),wav);
 assert.deepEqual(extractAudio({data:{audio:{audioUrl:'data:audio/wav;base64,'+encoded}}}),wav);
 for(const audio of [{base64:'bad'},{url:'https://malicious.example/audio'},{base64:Buffer.alloc(100).toString('base64')}])assert.throws(()=>extractAudio({data:{audio}}),/صالح/);
});
test('API command avoids upstream; normal chat keeps dialect, history, key server-side',async()=>{
 const f=await fixture();try{
  let r=await f.post('/api/chat',{message:'انط',dialect:'saudi'});let d=await r.json();assert.equal(r.status,200);assert.equal(d.action,'jump');assert.equal(d.dialect,'saudi');assert.equal(f.calls.length,0);
  const history=Array.from({length:30},(_,i)=>({role:i%2?'assistant':'user',content:'history'+i}));
  r=await f.post('/api/chat',{message:'ساعدني أتعلم',dialect:'gulf',history});d=await r.json();assert.equal(d.reply,'أهلًا، معاك بيبو!');assert.equal(d.action,null);assert.equal(f.calls.length,1);
  assert.equal(f.calls[0].opt.headers.Authorization,'Bearer unit-test-secret');assert.equal(f.calls[0].body.dialect,'gulf');
  assert.ok(!f.calls[0].body.message.includes('history0"'));assert.ok(f.calls[0].body.message.includes('history29'));
  assert.ok(!JSON.stringify(d).includes('unit-test-secret'));
 }finally{await f.close();}
});
test('speech route passes selected voice/dialect/model and returns binary WAV',async()=>{
 const f=await fixture();try{
  const r=await f.post('/api/speech',{text:'حياك',dialect:'saudi',voice:'Kore',model:'gemini-3.8-flash-tts'});
  assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'audio/wav');assert.deepEqual(Buffer.from(await r.arrayBuffer()),wav);
  assert.deepEqual(f.calls[0].body,{text:'حياك',dialect:'saudi',voice:'Kore',model:'gemini-3.8-flash-tts',speakingRate:'normal',mimeType:'audio/wav'});
 }finally{await f.close();}
});
test('static serving rejects secrets, source server, traversal; origins and input validated',async()=>{
 const f=await fixture();try{
  for(const route of ['/.env.local','/server.mjs','/start.mjs','/work/bebo-private.env','/%2e%2e%2fserver.mjs'])assert.equal((await f.get(route)).status,404,route);
  assert.equal((await f.get('/robot.js')).status,200);
  assert.equal((await f.post('/api/chat',{message:'انط'},{Origin:'https://elsewhere.example'})).status,403);
  assert.equal(await new Promise((resolve,reject)=>{http.get(f.url+'/api/status',{headers:{Host:'evil.example'}},res=>{res.resume();resolve(res.statusCode);}).on('error',reject);}),403);
  for(const data of [{message:''},{message:'x'.repeat(2001)},[],null])assert.equal((await f.post('/api/chat',data)).status,400);
  assert.equal((await f.get('/api/chat')).status,405);
  assert.equal((await f.get('/api/speech',{method:'POST',body:'not json'})).status,415);
 }finally{await f.close();}
});
test('provider errors do not expose its key/body; unconfigured status and local commands',async()=>{
 const f=await fixture({fetchImpl:async()=>new Response('SENSITIVE upstream diagnostic',{status:429})});
 try{const r=await f.post('/api/chat',{message:'مرحبا بك'});assert.equal(r.status,429);const t=await r.text();assert.ok(!t.includes('SENSITIVE'));assert.ok(!t.includes('unit-test-secret'));}finally{await f.close();}
 const g=await fixture({key:''});try{
  assert.equal((await(await g.get('/api/status')).json()).configured,false);
  assert.equal((await g.post('/api/chat',{message:'انط'})).status,200);
  assert.equal((await g.post('/api/chat',{message:'عرفني بنفسك'})).status,503);
 }finally{await g.close();}
});
test('catalog caches and rate limit bounds per minute requests',async()=>{
 const f=await fixture({rateLimit:2});try{
  assert.equal((await f.get('/api/catalog')).status,200);assert.equal((await f.get('/api/catalog')).status,200);assert.equal(f.calls.length,1);
  assert.equal((await f.post('/api/chat',{message:'انط'})).status,429);
 }finally{await f.close();}
});
test('cancelling a client request aborts its upstream request',async()=>{
 let cancelled=false,notify;const called=new Promise(r=>notify=r);
 const f=await fixture({fetchImpl:async(url,options)=>new Promise((resolve,reject)=>{notify();options.signal.addEventListener('abort',()=>{cancelled=true;reject(new Error('abort'));},{once:true});})});
 try{
  const controller=new AbortController();
  const p=fetch(f.url+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'حديث عادي'}),signal:controller.signal}).catch(()=>{});
  await called;controller.abort();await p;
  for(let i=0;i<20&&!cancelled;i++)await new Promise(r=>setTimeout(r,10));
  assert.equal(cancelled,true);
 }finally{await f.close();}
});

test('Every answer stays short in words and characters',()=>{const r=briefReply('كلمة طويلة جدا '.repeat(100));assert.ok(r.length<=221);assert.ok(r.split(' ').length<=28);assert.ok(r.endsWith('…'));assert.equal(briefReply('أهلًا بيك!'),'أهلًا بيك!');});

test('Playful commands map to distinct safe actions',()=>{for(const [text,action]of [['ارقص','dance'],['اهرش راسك','scratch'],['كل الدبانه','fly'],['eat the fly','fly']])assert.equal(commandFor(text),action);assert.equal(chooseDialect('اشرح يعني ايه برمجة').dialect,'egyptian');});

test('Emotions and cat chase map to direct safe actions',async()=>{for(const [text,action]of [['اضحك جامد','laugh'],['عيط جامد','cry'],['اعمل حركة صعبنيات زي القطط','plead'],['اجري ورا قطة بتجري','chase'],['chase the cat','chase']])assert.equal(commandFor(text),action);for(const text of ['لا تعيط','لا تجري ورا القطة','do not chase the cat','هل القطة بتجري؟'])assert.equal(commandFor(text),null);const f=await fixture();try{for(const [message,action]of [['اضحك','laugh'],['عيط','cry'],['صعبنيات','plead'],['اجري ورا القطة','chase']]){const r=await f.post('/api/chat',{message,dialect:'english'});const d=await r.json();assert.equal(d.action,action);assert.equal(d.dialect,'english');assert.ok(d.reply.length>5);}assert.equal(f.calls.length,0);}finally{await f.close();}});

test('shared local backend requires no key and proxies sanitized chat and binary speech without authorization',async()=>{
 const calls=[];
 const f=await fixture({sharedBackend:true,key:'',fetchImpl:async(url,opt)=>{
  calls.push({url,opt,body:JSON.parse(opt.body)});
  assert.equal(Object.keys(opt.headers).some(name=>name.toLowerCase()==='authorization'),false);
  if(url.endsWith('/v1/bebo/speech'))return new Response(wav,{headers:{'Content-Type':'audio/wav'}});
  assert.ok(url.endsWith('/v1/bebo/chat'));
  return j({reply:'قسم مذاكرتك، وابعد الموبايل.',dialect:'egyptian',dialectSource:'detected',source:'waseet'});
 }});
 try{
  assert.equal((await(await f.get('/api/status')).json()).configured,true);
  assert.equal((await f.post('/api/chat',{message:'انط'})).status,200);assert.equal(calls.length,0);
  const history=Array.from({length:14},(_,i)=>({role:i%2?'assistant':'user',content:'history'+i}));history[13].content='x'.repeat(1800);
  const chat=await f.post('/api/chat',{message:' إزاي أركز؟ ',history,dialect:'auto',previousDialect:'gulf',unexpected:'discarded'});
  assert.equal(chat.status,200);assert.equal((await chat.json()).reply,'قسم مذاكرتك، وابعد الموبايل.');
  assert.equal(calls[0].body.message,'إزاي أركز؟');assert.equal(calls[0].body.history.length,10);assert.equal(calls[0].body.history[9].content.length,1200);
  assert.equal(calls[0].body.dialect,'auto');assert.equal(calls[0].body.previousDialect,'gulf');assert.ok(!Object.hasOwn(calls[0].body,'unexpected'));
  const audio=await f.post('/api/speech',{text:'أهلاً بيك!',dialect:'saudi',voice:'Kore',model:'gemini-3.8-flash-tts'});
  assert.equal(audio.status,200);assert.equal(audio.headers.get('content-type'),'audio/wav');assert.deepEqual(Buffer.from(await audio.arrayBuffer()),wav);
  assert.deepEqual(calls[1].body,{text:'أهلاً بيك!',dialect:'saudi',voice:'Kore',model:'gemini-3.8-flash-tts'});
  assert.equal(calls.length,2);
 }finally{await f.close();}
});

test('shared local speech rejects malformed WAV and hides upstream error diagnostics',async()=>{
 let status=200;
 const f=await fixture({sharedBackend:true,key:'',fetchImpl:async()=>status===200?new Response(Buffer.alloc(100),{headers:{'Content-Type':'audio/wav'}}):new Response('PRIVATE_PROVIDER_DIAGNOSTIC',{status})});
 try{
  const malformed=await f.post('/api/speech',{text:'أهلاً بيك!'});assert.equal(malformed.status,502);assert.equal((await malformed.json()).error.code,'INVALID_AUDIO');
  const long=await f.post('/api/speech',{text:'x'.repeat(221)});assert.equal(long.status,400);
  status=503;const failed=await f.post('/api/chat',{message:'إزاي أتعلم؟'});assert.equal(failed.status,502);assert.ok(!(await failed.text()).includes('PRIVATE_PROVIDER'));
 }finally{await f.close();}
});
