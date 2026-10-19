import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import path from 'node:path';
const source=path.resolve('outputs/cute-robot');
const destination='./dist/BeboAI-Ready';
const hosted='./public/bebo';
const api='https://waseet-ai-api-1041761245251.us-central1.run.app/v1/bebo';
const assets=['preview.css','preview.js','robot.js','robot-sprites.png','robot-actions.png','robot-speaking.png','robot-antics.png','robot-emotions.png','kitten-sprites.png'];
const core=await readFile(path.join(source,'bebo-core.mjs'),'utf8');
const chat=await readFile(path.join(source,'bebo-chat.js'),'utf8');
const cloudChat=chat.replace('الصوت والأسئلة محتاجين مفتاح وسيط على الخادم. أوامر الحركة متاحة.','تعذر الاتصال بخدمة بيبو. تأكد من الإنترنت؛ أوامر الحركة متاحة.').replace("this.getAttribute('api-base')||'/api'", "this.getAttribute('api-base')||'"+api+"'");
const bundle='/* Bebo standalone browser build: no credentials, no local server. */\n(()=>{\n'+core.replace(/^export /gm,'')+'\n'+cloudChat.replace(/^import[^\n]+\n/,'')+'\n})();\n';
let html=await readFile(path.join(source,'index.html'),'utf8');
html=html.replace(/<script type="module" src="bebo-chat.js\?v=[^"]+"><\/script>/,'<script defer src="bebo-chat.js?v=6-actions"></script>');
html=html.replace('api-base="/api"','api-base="'+api+'"');
html=html.replace('لتفعيل الصوت، شغّل server.mjs بمفتاح وسيط على الخادم. انسخ ملفات الشخصية والمحادثة من الحزمة واتبع دليل التركيب:','الشات والصوت متصلان بخدمة وسيط المشتركة على Cloud Run. انسخ ملفات الواجهة فقط، أو استخدم الرابط الجاهز:');
html=html.replace('&lt;script type="module" src="/bebo/bebo-chat.js"&gt;', '&lt;script defer src="/bebo/bebo-chat.js"&gt;');
html=html.replace('api-base="/api"', 'api-base="'+api+'"');
const guide=`# بيبو — نسخة جاهزة بباك إند واحد\n\nافتح index.html في Chrome أو Edge، أو افتح https://waaseet-ai.web.app/bebo/ . تحتاج اتصال إنترنت فقط. لا تحتاج Node أو Blender أو مفاتيح API أو ملفات env. كل نسخ الواجهة تتصل بخدمة Cloud Run نفسها للشات والصوت.\n\n## التركيب في موقع\nانسخ الصور وrobot.js وbebo-chat.js إلى /bebo/ في الموقع، ثم أضف:\n\n\`\`\`html\n<script defer src="/bebo/robot.js"></script>\n<script defer src="/bebo/bebo-chat.js"></script>\n<cute-robot id="bebo" size="112" floating interactive floor-offset="110" home-x="116"></cute-robot>\n<bebo-chat robot="#bebo" api-base="${api}"></bebo-chat>\n\`\`\`\n\nالصفحة الكاملة المعروضة في التجربة موجودة في index.html، ومعها preview.css وpreview.js.\n\nالكتابة تظهر تحت الشخصية، والردود قصيرة في السحابة. زر المحادثة يعرض السجل الكامل. الإعدادات تحتوي اللهجة والصوت وطريقة الرد. المايك يحتاج إذن المتصفح ودعم SpeechRecognition؛ للموقع المنشور استخدم HTTPS.\n\nجرّب: ارقص، اضحك، عيط، افتح اللاب، اجري ورا القطة، طلع دبّانة. أوامر الحركة تعمل محليًا؛ نطق التأكيد والردود الذكية تستخدم الخدمة المشتركة.\n\nالخدمة تدعم خمس لهجات وثمانية أصوات. حدود الطلبات وحالة مزود الذكاء الاصطناعي تطبق على الاستخدام. لا يتم إرسال مفاتيح إلى المتصفح. تُرسل رسائلك وسياق آخر المحادثة إلى وسيط ثم Gemini؛ الإملاء الصوتي تابع لخدمة المتصفح. السجل داخل الجلسة الحالية.\n\nهذه الملفات واجهة فقط؛ ملفات الخادم والإعدادات السرية ليست ضمن التسليم.\n`;
const motionGuide='\nزر النجمة «حركات بيبو» بجانب أيقونات الشات والصوت يفتح 23 خيارًا: الحركات والتعبيرات والتحكم في التجول والصوت. كل اختيارات القائمة تعمل فورًا محليًا، دون استدعاء AI أو TTS أو استهلاك كوتا. معاينات الكلام والاستماع بدون صوت. اختيار حركة يوقف الرد أو التسجيل الجاري؛ Escape أو زر الإغلاق يغلق القائمة.\n';
for(const folder of [destination,hosted]){
 await mkdir(folder,{recursive:true});
 for(const file of assets)await copyFile(path.join(source,file),path.join(folder,file));
 await writeFile(path.join(folder,'index.html'),html);
 await writeFile(path.join(folder,'bebo-chat.js'),bundle);
 await writeFile(path.join(folder,'README.md'),guide+motionGuide);
 await writeFile(path.join(folder,'OPEN_BEBO.url'),'[InternetShortcut]\nURL=https://waaseet-ai.web.app/bebo/\n');
}
await writeFile(path.join(hosted,'bebo-core.mjs'),core);
console.log('Prepared credential-free frontend and hosted copy.');
