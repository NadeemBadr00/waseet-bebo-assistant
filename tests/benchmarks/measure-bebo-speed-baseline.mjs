import {writeFile} from 'node:fs/promises';
const base='https://waseet-ai-api-1041761245251.us-central1.run.app/v1/bebo';
const prompts=['يعني إيه ذكاء اصطناعي؟','إزاي أركز في المذاكرة؟'];
const results=[{message:'عرفني بنفسك باختصار',chatStatus:200,reply:'أنا بيبو، مساعد صغير أجيب عن الأسئلة وأستقبل أوامر الحركة. منورني!',wordCount:11,chatLatencyMs:1644,speechStatus:200,speechLatencyMs:6075,wavBytes:292148}];
for(const message of prompts){
  const chatStart=performance.now();
  const chat=await fetch(base+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,history:[],dialect:'egyptian'}),signal:AbortSignal.timeout(65000)});
  const response=await chat.json();
  const chatLatencyMs=Math.round(performance.now()-chatStart);
  const reply=typeof response.reply==='string'?response.reply:'';
  const entry={message,chatStatus:chat.status,reply,wordCount:reply.trim()?reply.trim().split(/\s+/).length:0,chatLatencyMs};
  if(chat.ok&&reply){
    const speechStart=performance.now();
    const speech=await fetch(base+'/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:reply,dialect:'egyptian',voice:'Puck',model:'gemini-3.8-flash-lite-tts'}),signal:AbortSignal.timeout(65000)});
    const bytes=new Uint8Array(await speech.arrayBuffer());
    entry.speechStatus=speech.status;entry.speechLatencyMs=Math.round(performance.now()-speechStart);entry.wavBytes=speech.ok?bytes.byteLength:0;
  }
  results.push(entry);console.log(JSON.stringify(entry));
  try{await writeFile('work/bebo-speed-baseline.json',JSON.stringify({measuredAt:new Date().toISOString(),results},null,2));}catch{await writeFile('./tmp/bebo-speed-baseline.json',JSON.stringify({measuredAt:new Date().toISOString(),results},null,2));}
}
