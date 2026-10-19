import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const base='https://waseet-ai-api-1041761245251.us-central1.run.app/v1/bebo';
const measurements=[];
async function post(route,input){
 const started=performance.now();
 const response=await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:AbortSignal.timeout(20000)});
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.equal(response.status,200,bytes.toString());
 return {response,bytes,ms:Math.round(performance.now()-started)};
}
for(const message of ['عرفني بنفسك باختصار','يعني إيه ذكاء اصطناعي؟','إزاي أركز في المذاكرة؟']){
 const chat=await post('/chat',{message,history:[],dialect:'egyptian'});const reply=JSON.parse(chat.bytes).reply;
 assert.ok(reply.length<=120);assert.ok(reply.split(/\s+/).length<=16);
 const speechInput={text:reply,dialect:'egyptian',voice:'Puck',model:'gemini-3.8-flash-lite-tts'};
 const speech=await post('/speech',speechInput);assert.equal(speech.bytes.toString('ascii',0,4),'RIFF');assert.equal(speech.bytes.toString('ascii',8,12),'WAVE');
 const repeat=await post('/speech',speechInput);assert.deepEqual(repeat.bytes,speech.bytes);
 const measurement={message,reply,words:reply.split(/\s+/).length,chatMs:chat.ms,speechMs:speech.ms,totalMs:chat.ms+speech.ms,repeatedSpeechMs:repeat.ms,cache:speech.response.headers.get('x-bebo-speech-cache'),repeatCache:repeat.response.headers.get('x-bebo-speech-cache'),bytes:speech.bytes.length};
 measurements.push(measurement);console.log(JSON.stringify(measurement));
}
const alternate=await post('/speech',{text:'أهلاً بيك! أنا بيبو.',dialect:'egyptian',voice:'Kore',model:'gemini-3.8-flash-lite-tts'});
assert.equal(alternate.bytes.toString('ascii',0,4),'RIFF');console.log(JSON.stringify({alternateVoice:'Kore',speechMs:alternate.ms,bytes:alternate.bytes.length}));
await writeFile('./tmp/bebo-speed-after.json',JSON.stringify(measurements,null,2));
