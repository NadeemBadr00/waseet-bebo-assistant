import {createBeboServer} from './server.mjs';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import process from 'node:process';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
async function envFile(file){
  try{const data=await readFile(file,'utf8');for(const line of data.split(/\r?\n/)){const match=line.match(/^([A-Z_]+)=(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].trim().replace(/^["']|["']$/g,'');}}catch(error){if(error.code!=='ENOENT')throw error;}
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
  await envFile(process.env.BEBO_ENV_FILE||path.join(ROOT,'.env.local'));
  const server=createBeboServer({sharedBackend:true,key:process.env.WASEET_API_KEY,publicOrigin:process.env.BEBO_PUBLIC_ORIGIN});
  const port=Number(process.env.PORT||8765),host=process.env.HOST||'127.0.0.1';
  server.listen(port,host,()=>console.log('Bebo: http://'+host+':'+port));
}
