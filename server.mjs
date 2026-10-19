import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import {DIALECTS,chooseDialect,commandFor,acknowledge,makePrompt,briefReply} from './bebo-core.mjs';

const ROOT=path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_UPSTREAM='https://waseet-ai-api-1041761245251.us-central1.run.app';
const STATIC=new Set(['index.html','preview.css','preview.js','robot.js','robot-sprites.png','robot-actions.png','robot-speaking.png','robot-antics.png','robot-emotions.png','kitten-sprites.png','bebo-chat.js','bebo-core.mjs','bebo-content.mjs','README.md','GENERATION.md']);
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.png':'image/png','.md':'text/plain; charset=utf-8'};
const VOICES=new Set(['Puck','Kore','Fenrir','Aoede','Zephyr','Sulafat','Charon','Leda']);
const MODELS=new Set(['gemini-3.8-flash-lite-tts','gemini-3.8-flash-tts','AUTO']);
const fault=(status,code,message)=>Object.assign(new Error(message),{status,code});
async function bodyJSON(req){
  if(!String(req.headers['content-type']||'').includes('application/json'))throw fault(415,'JSON_REQUIRED','الطلب لازم يكون JSON.');
  let length=0;const chunks=[];
  for await(const chunk of req){length+=chunk.length;if(length>32000)throw fault(413,'TOO_LARGE','الرسالة أطول من المسموح.');chunks.push(chunk);}
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw fault(400,'INVALID_JSON','صيغة الطلب غير صحيحة.');}
}
function sendJSON(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
export function extractAudio(data){
  const audio=data?.data?.audio||data?.audio||{};
  let encoded=audio.base64Audio||audio.base64;
  const dataURL=audio.audioUrl||audio.url||data?.data?.audioUrl;
  if(!encoded&&typeof dataURL==='string'&&dataURL.startsWith('data:audio/wav;base64,'))encoded=dataURL.split(',')[1];
  if(typeof encoded!=='string'||encoded.length<60||encoded.length>18000000||!/^[A-Za-z0-9+/=\s]+$/.test(encoded))throw fault(502,'INVALID_AUDIO','خدمة الصوت رجّعت ملف غير صالح.');
  const bytes=Buffer.from(encoded,'base64');
  if(bytes.length<44||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw fault(502,'INVALID_AUDIO','الصوت المستلم ليس WAV صالحًا.');
  return bytes;
}
export function createBeboServer({key='',upstream=DEFAULT_UPSTREAM,fetchImpl=fetch,publicOrigin='',root=ROOT,rateLimit=35,sharedBackend=false}={}){
  let catalogCache=null,catalogAt=0;const usage=new Map();
  async function remote(route,body,signal){
    if(!key)throw fault(503,'NOT_CONFIGURED','مفتاح خدمة وسيط غير مضبوط على الخادم.');
    let response;
    try{response=await fetchImpl(upstream+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.any([signal,AbortSignal.timeout(55000)])});}
    catch(error){if(signal.aborted)throw fault(499,'CANCELLED','تم إيقاف الطلب.');throw fault(504,'UPSTREAM_TIMEOUT','خدمة وسيط اتأخرت. جرّب تاني بعد شوية.');}
    if(!response.ok){const s=response.status;throw fault(s===429?429:502,'UPSTREAM_'+s,s===429?'خدمة وسيط مشغولة دلوقتي. استنى شوية وجرّب.':'تعذّر الوصول لخدمة وسيط. جرّب تاني.');}
    const length=Number(response.headers.get('content-length')||0);
    if(length>20000000)throw fault(502,'UPSTREAM_TOO_LARGE','الاستجابة أكبر من المسموح.');
    const text=await response.text();
    if(text.length>20000000)throw fault(502,'UPSTREAM_TOO_LARGE','الاستجابة أكبر من المسموح.');
    let parsed;try{parsed=JSON.parse(text);}catch{throw fault(502,'UPSTREAM_FORMAT','خدمة وسيط رجّعت استجابة غير مفهومة.');}
    if(parsed.success===false)throw fault(502,'UPSTREAM_REJECTED','خدمة وسيط لم تستطع إتمام الطلب.');
    return parsed;
  }
  async function remotePublic(route,body,signal,audio=false){
    try{
      const response=await fetchImpl(upstream+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])});
      if(!response.ok)throw fault(response.status===429?429:502,'BEBO_UPSTREAM_UNAVAILABLE',response.status===429?'بيبو مشغول دلوقتي. استنى شوية وجرّب.':'تعذّر الوصول لخدمة بيبو. جرّب تاني.');
      const limit=audio?4000000:32000;
      if(Number(response.headers.get('content-length')||0)>limit)throw fault(502,'BEBO_UPSTREAM_TOO_LARGE','الاستجابة أكبر من المسموح.');
      if(audio){
        const wav=Buffer.from(await response.arrayBuffer());
        if(wav.length<48||wav.length>limit||wav.toString('ascii',0,4)!=='RIFF'||wav.toString('ascii',8,12)!=='WAVE')throw fault(502,'INVALID_AUDIO','خدمة بيبو رجّعت صوت غير صالح.');
        return wav;
      }
      const text=await response.text();
      if(text.length>limit)throw fault(502,'BEBO_UPSTREAM_TOO_LARGE','الاستجابة أكبر من المسموح.');
      try{return JSON.parse(text);}catch{throw fault(502,'BEBO_UPSTREAM_FORMAT','خدمة بيبو رجّعت استجابة غير مفهومة.');}
    }catch(error){
      if(signal.aborted)throw fault(499,'CANCELLED','تم إيقاف الطلب.');
      if(error.status)throw error;
      throw fault(504,'BEBO_UPSTREAM_TIMEOUT','خدمة بيبو اتأخرت. جرّب تاني بعد شوية.');
    }
  }
  const server=http.createServer(async(req,res)=>{
    const controller=new AbortController();res.on('close',()=>{if(!res.writableEnded)controller.abort();});
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    try{
      const host=req.headers.host||'';
      const hostName=host.replace(/:\d+$/,'');
      const expectedHost=publicOrigin?new URL(publicOrigin).host:null;
      if(expectedHost?host!==expectedHost:!['127.0.0.1','localhost','[::1]'].includes(hostName))throw fault(403,'HOST_REJECTED','العنوان غير مسموح.');
      const url=new URL(req.url,'http://'+host);
      if(url.pathname.startsWith('/api/')){
        const origin=req.headers.origin;
        const expected=publicOrigin||'http://'+host;
        if((origin&&origin!==expected)||req.headers['sec-fetch-site']==='cross-site')throw fault(403,'ORIGIN_REJECTED','المصدر غير مسموح.');
        if(req.method==='GET'&&url.pathname==='/api/status'){sendJSON(res,200,{configured:sharedBackend||Boolean(key),recognition:'browser',dialects:Object.keys(DIALECTS)});return;}
        const client=req.socket.remoteAddress||'local',now=Date.now();
        if(usage.size>1000)for(const [ip,bucket]of usage)if(now>bucket.reset)usage.delete(ip);
        let bucket=usage.get(client);if(!bucket||now>bucket.reset){bucket={count:0,reset:now+60000};usage.set(client,bucket);}
        if(++bucket.count>rateLimit)throw fault(429,'RATE_LIMIT','طلبات كتير في وقت قصير. استنى دقيقة.');
        if(req.method==='GET'&&url.pathname==='/api/catalog'){
          if(!catalogCache||now-catalogAt>300000){catalogCache=(await remote('/v1/ai/tts/catalog',null,controller.signal)).data;catalogAt=now;}
          sendJSON(res,200,{success:true,data:catalogCache});return;
        }
        if(req.method!=='POST')throw fault(405,'METHOD','الطريقة غير مسموحة.');
        const input=await bodyJSON(req);
        if(!input||typeof input!=='object'||Array.isArray(input))throw fault(400,'BAD_BODY','بيانات الطلب غير صحيحة.');
        if(url.pathname==='/api/chat'){
          const message=typeof input.message==='string'?input.message.trim():'';
          if(!message||message.length>2000)throw fault(400,'MESSAGE_LENGTH','اكتب رسالة من حرف إلى ٢٠٠٠ حرف.');
          const chosen=chooseDialect(message,input.dialect,input.previousDialect);
          const action=commandFor(message);
          if(action){sendJSON(res,200,{reply:acknowledge(action,chosen.dialect),action,...chosen,source:'command',dialectSource:chosen.source});return;}
          const history=Array.isArray(input.history)?input.history.slice(-10).filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string').map(x=>({role:x.role,content:x.content.slice(0,1200)})):[];
          if(sharedBackend){
            const dialect=input.dialect==='auto'||Object.hasOwn(DIALECTS,input.dialect)?input.dialect:'auto';
            const previousDialect=input.previousDialect==='auto'||Object.hasOwn(DIALECTS,input.previousDialect)?input.previousDialect:'egyptian';
            const answer=await remotePublic('/v1/bebo/chat',{message,history,dialect,previousDialect},controller.signal);
            if(typeof answer?.reply!=='string'||!answer.reply.trim())throw fault(502,'EMPTY_REPLY','خدمة بيبو ما رجّعتش رد نصي. جرّب تاني.');
            const responseDialect=Object.hasOwn(DIALECTS,answer.dialect)?answer.dialect:chosen.dialect;
            sendJSON(res,200,{reply:briefReply(answer.reply),action:null,dialect:responseDialect,source:'waseet',dialectSource:['selected','detected','previous'].includes(answer.dialectSource)?answer.dialectSource:chosen.source});return;
          }
          const answer=await remote('/v1/ai/avatar/chat',{message:makePrompt(message,history,chosen.dialect),dialect:chosen.dialect},controller.signal);
          const reply=answer.data?.text||answer.data?.reply||answer.text;
          if(typeof reply!=='string'||!reply.trim())throw fault(502,'EMPTY_REPLY','الخدمة ما رجّعتش رد نصي. جرّب تاني.');
          sendJSON(res,200,{reply:briefReply(reply),action:null,...chosen,source:'waseet',dialectSource:chosen.source});return;
        }
        if(url.pathname==='/api/speech'){
          const text=typeof input.text==='string'?input.text.trim():'';
          if(!text||text.length>(sharedBackend?220:1800))throw fault(400,'TEXT_LENGTH','النص الصوتي أطول من المسموح أو فارغ.');
          const dialect=Object.hasOwn(DIALECTS,input.dialect)?input.dialect:'egyptian';
          const voice=VOICES.has(input.voice)?input.voice:'Puck';
          const model=MODELS.has(input.model)?input.model:'gemini-3.8-flash-lite-tts';
          if(sharedBackend){
            const wav=await remotePublic('/v1/bebo/speech',{text,dialect,voice,model},controller.signal,true);
            res.writeHead(200,{'Content-Type':'audio/wav','Content-Length':wav.length,'Cache-Control':'no-store'});res.end(wav);return;
          }
          const result=await remote('/v1/ai/tts/synthesize',{text,dialect,voice,model,speakingRate:'normal',mimeType:'audio/wav'},controller.signal);
          const wav=extractAudio(result);
          res.writeHead(200,{'Content-Type':'audio/wav','Content-Length':wav.length,'Cache-Control':'no-store'});res.end(wav);return;
        }
        throw fault(404,'NOT_FOUND','المسار غير موجود.');
      }
      if(!['GET','HEAD'].includes(req.method))throw fault(405,'METHOD','الطريقة غير مسموحة.');
      const name=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1));
      if(!STATIC.has(name))throw fault(404,'NOT_FOUND','الملف غير موجود.');
      const bytes=await readFile(path.join(root,name));
      res.writeHead(200,{'Content-Type':MIME[path.extname(name)]||'application/octet-stream','Cache-Control':'no-cache'});
      res.end(req.method==='HEAD'?undefined:bytes);
    }catch(error){
      if(res.destroyed||res.writableEnded)return;
      sendJSON(res,error.status||500,{error:{code:error.code||'SERVER_ERROR',message:error.status?error.message:'حدث خطأ في الخادم.'}});
    }
  });
  return server;
}
