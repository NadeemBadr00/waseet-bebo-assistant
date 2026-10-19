# بيبو — الإصدار ٤: كلام وصوت وأوامر
روبوت Pixel Art للموقع، بيسمع من المايك أو يستقبل نص، ويرد كتابة وبصوت من خدمة وسيط. معه السحب والمشي والنط واللابتوب وحالات الاستماع والكلام والهرش والرقص ومطاردة دبّانة، والضحك والعياط والصعبانيات والجري مع قطة.

## التشغيل على الجهاز
1. تحتاج Node.js 22 أو أحدث. لا توجد حزم npm مطلوبة.
2. انسخ .env.example باسم .env.local وضع مفتاح وسيط في WASEET_API_KEY.
3. افتح start.cmd، أو نفّذ داخل هذا المجلد: node start.mjs
4. افتح http://127.0.0.1:8765 في Chrome أو Edge.
5. اكتب في الشريط الصغير تحت بيبو؛ أو اضغط المايك واسمح باستخدامه ثم اتكلم. الرد يظهر في السحابة فوقه.

النسخة الحالية تعمل أيضًا من مشغّل الجهاز outputs/start-bebo-local.cmd؛ يقرأ الإعداد الخاص من work/bebo-private.env خارج المجلد العام. الحزمة المضغوطة لا تحتوي هذا المفتاح.

فتح index.html مباشرة أو استخدام خادم ملفات فقط لا يشغّل API المحادثة. المايك يحتاج localhost أو HTTPS ودعم SpeechRecognition في المتصفح. إذا لم يدعمه متصفح، افتح الرابط في Chrome/Edge. الكتابة تظل متاحة. تشغيل الصوت قد يحتاج الضغط على «اسمع الرد» حسب سياسة المتصفح.

## استخدام المحادثة
- شريط الكتابة تحت بيبو، وأيقونة الكتابة تخفيه أو تظهره.
- الرد يظهر في سحابة فوق الشخصية، ويظل قصيرًا: حتى ٢٨ كلمة أو نحو ٢٢٠ حرفًا.
- زر «المحادثة كاملة» يفتح جميع رسائل الجلسة في لوحة منفصلة.
- أيقونة المايك تبدأ الاستماع بنقرة صريحة.
- النقر على المايك مرة ثانية ينهي الاستماع ويرسل النص النهائي، إن وُجد.
- النص الذي يتعرف عليه المتصفح يظهر أمامك. الرد المكتوب يظهر أولًا ثم يُجهّز الصوت.
- «إيقاف» يوقف التسجيل والطلب والصوت الحالي. إرسال رسالة جديدة يلغي الرد الجاري؛ إخفاء السحابة أو التبويب يوقفه أيضًا. إغلاق سجل المحادثة يعيدك للسحابة.
- «اسمع الرد» يعيد الصوت، و«مسح المحادثة» يمسح السياق المحلي.
- من السهم: اختر اللهجة، الصوت، جودة Flash/Flash-Lite، أو «كتابة بس».
- اللهجات: مصري، سعودي، خليجي، فصحى، English. الوضع التلقائي يقدّر اللهجة من مفردات النص؛ عند الغموض يحتفظ بآخر لهجة، والافتراضي مصري. يمكنك تصحيحه يدويًا. هذا تقدير لغوي بسيط، وليس تحليلًا مضمونًا للّكنة من الصوت.
- لغة الإملاء تُضبط قبل الاستماع حسب اختيارك أو آخر لهجة؛ للإنجليزية اختَر English قبل المايك إذا لم تكن آخر لغة مستخدمة.
- التسجيل بنظام «اضغط واتكلم ثم استمع للرد»، وليس مكالمة مفتوحة أو استماعًا مستمرًا.

## أوامر الحركة
أوامر قصيرة مباشرة تعمل محليًا، حتى إذا تعطلت خدمة الذكاء الاصطناعي. نطق التأكيد يحتاج الخدمة.

| الأمر | النتيجة |
|---|---|
| انط / اقفز / jump | قفزة |
| امشي / اتمشى / walk | مشي |
| سلم عليا / wave | تحية |
| افرح / celebrate | احتفال |
| اضحك / اضحك جامد / laugh | ضحك مع إيد على البطن |
| عيط / عيط جامد / cry | عياط كرتوني ودموع متحركة |
| صعبنيات / اعمل عيون قطط / kitten eyes | عيون كبيرة لامعة وحركة توسل لطيفة |
| اجري ورا القطة / chase the cat | جري وراء قطة، ثم تحية وراحة |
| ارقص / dance | رقصة هادئة يمين وشمال |
| اهرش راسك / scratch | هرش الرأس |
| طلع دبّانة / كل الدبانه / eat the fly | دبّانة تلف حوله ثم يلتقطها ويأكلها |
| افتح اللاب / اكتب / type | لابتوب وكتابة |
| ارتاح / اقعد / rest | راحة |
| نام / sleep | نوم |
| استني / وقف الحركة | انتظار |
| ارجع مكانك / reset | موضع البداية |
| اتحرك من نفسك / roam | تشغيل التجوال |
| وقف التجول / stop roaming | إلغاء التجوال |
| اسكت / وقف الصوت / stop | إيقاف الصوت |

السحب والإفلات والنط عند مرور الماوس والأسهم تظل تعمل. الأوامر تتحكم في شخصية بيبو فقط؛ أي عمليات حقيقية في حساب مستخدم أو طلبات منصة تحتاج تكاملًا منفصلًا مع صلاحيات الموقع.

## دمجه في موقعك
انسخ robot.js والصور الست robot-sprites.png وrobot-actions.png وrobot-speaking.png وrobot-antics.png وrobot-emotions.png وkitten-sprites.png وbebo-chat.js وbebo-core.mjs إلى مسار عام مثل /bebo/.

~~~html
<script defer src="/bebo/robot.js"></script>
<script type="module" src="/bebo/bebo-chat.js"></script>
<cute-robot id="bebo" size="112" floating interactive floor-offset="110" home-x="116"></cute-robot>
<bebo-chat robot="#bebo" api-base="/api"></bebo-chat>
~~~

شغّل الخادم start.mjs بمفتاح الخدمة في بيئة الخادم، ووجّه /api/* إليه من نفس نطاق موقعك. للموقع المنشور اضبط BEBO_PUBLIC_ORIGIN على الأصل الكامل مثل https://example.com، واضبط HOST/PORT حسب الاستضافة. أضف جلسة تسجيل الدخول وحدود استهلاك مناسبة لمنصتك قبل إتاحة المسارات للعامة. فحص الأصل ومحدد الطلبات المحلي الموجودان ليسا بديلًا عن مصادقة المستخدم.

لا تضع المفتاح في JavaScript العام أو HTML أو Firebase Hosting. ملفا server.mjs وstart.mjs وإعداد .env.local ملفات خادم، ولا يقدّمها الخادم للمتصفح.

عنصر المحادثة يدعم robots="#mini,#hero" لتحريك أكثر من نسخة كما في المعاينة. robot يشير للشخصية التي يتبعها شريط التحكم. لا تغيّر api-base إلى رابط وسيط الخارجي؛ استخدم الوسيط الخلفي الذي يحتفظ بالمفتاح.

## كيف يتصل بخدمة وسيط
- GET /api/status: حالة إعداد المفتاح فقط.
- POST /api/chat: message وhistory وdialect وpreviousDialect؛ يعيد reply وaction وdialect.
- POST /api/speech: text وdialect وvoice وmodel؛ يعيد WAV ثنائيًا.
- GET /api/catalog: كتالوج الخدمة، مخزن مؤقتًا خمس دقائق.

خلفيًا يُستخدم /v1/ai/avatar/chat للرد النصي ثم /v1/ai/tts/synthesize لنطق النص بالصوت واللهجة المختارين. مسار avatar يرجع صوتًا أيضًا، لكن تكامله الحالي لا يؤكد إعدادات النطق؛ نطلب النطق منفصلًا لضبط الاختيارات. لذلك قد يستغرق الرد عدة ثوانٍ ويستهلك طلبين للخدمة. لا ندّعي أنه بث صوت فوري.

المحوّل يدعم الحقل الفعلي data.audio.base64Audio والحقل base64 الموجود في الوصف السابق. يُرسل speakingRate: normal وmimeType: audio/wav، ويُتحقق من ترويسة WAV قبل إعادته.

تتعرف خدمة الإملاء الخاصة بالمتصفح على الكلام وقد ترسله لمزوّد المتصفح. نص المحادثة وسياق آخر الرسائل يُرسلان إلى وسيط لتوليد الرد؛ نص الرد يُرسل لتوليد الصوت. لا يسجّل التطبيق الصوت الخام ولا يحفظ سجل المحادثة على القرص. التفضيلات فقط محفوظة في localStorage. قد يكون لمزوّدي الخدمات سياسات احتفاظ مستقلة.

## أحداث ووظائف الربط
~~~js
await customElements.whenDefined('bebo-chat');
const chat = document.querySelector('bebo-chat');
chat.open();
chat.send('انط');
chat.stop();
chat.addEventListener('beboreply', e => console.log(e.detail.text, e.detail.dialect));
chat.addEventListener('bebocommand', e => console.log(e.detail.action));
chat.addEventListener('bebostatus', e => console.log(e.detail.mode));
~~~

الشخصية:
~~~js
const robot = document.querySelector('#bebo');
robot.play('laugh');
robot.play('cry');
robot.play('plead');
robot.play('chase'); // 10.5s running, then 2.8s friendly greeting
robot.play('wave');
robot.play('listening', {loop:true});
robot.play('speaking', {loop:true});
robot.setTyping(true);
robot.jump();
robot.walkTo(240);
robot.resetPosition();
robot.paused = true;
~~~

الحالات: idle، blink، wave، happy، thinking، sleep، walk، typing، jump، land، drag، rest، listening، speaking، scratch، dance، fly، catch، chew، laugh، cry، plead، chase، catrest.
حدث robotmove يعيد x وy. حركة الكلام تستخدم ٨ لقطات للبُق والإيدين في robot-speaking.png. محلّل Web Audio يقيس مستوى الصوت لتغيير فتحة البُق وإغلاقه أثناء السكتات. إذا لم يتاح المحلّل، تعمل دورة لقطات الكلام أثناء التشغيل. تغير الوضع كل نحو ٤٤٠ ملّي ثانية، مع تثبيت وضع البُق ٣٦٠ ملّي ثانية على الأقل وتنعيم مستوى الصوت؛ حركة الجسم دورة ناعمة مدتها ١٫٨ ثانية. هذه مزامنة مع شدة الصوت وليست تعرّفًا على مخارج كل حرف.
الحركات الجديدة في robot-antics.png، والدبّانة رسم SVG صغير يتحرك داخل الشخصية. مشهد الدبّانة يتدرج من المراقبة (٥٫٨ ثانية) إلى الالتقاط ثم المضغ والعودة للانتظار؛ الإيقاف المؤقت يجمّد المشهد، وبدء الاستماع أو حركة أخرى يقطعه. عند تشغيل التجوال تظهر بعض الحركات تلقائيًا بعد فترة خمول.

رسومات الانفعالات في robot-emotions.png والقطة في kitten-sprites.png. مشهد chase يحرك القطة وبيبو داخل حدود الحاوية أو نافذة الموقع مع التفاف عند الأطراف. يليه catrest تلقائيًا، ثم تختفي القطة ويعود بيبو للانتظار. عند السحب أو اختيار حركة أخرى أو بدء الاستماع تختفي القطة فورًا. زر الإيقاف المؤقت يجمّد الاثنين. الشخصية الثابتة تعرض اللعب داخل عرضها. العياط يعمل بطلبك؛ الضحك والصعبانيات والقطة قد تظهر تلقائيًا مع التجوال.

لتغيير مصدر الرسومات يمكنك استخدام emotions-sprite وcat-sprite مثل بقية سمات الصور.

الشخصية تحترم prefers-reduced-motion، وتتوقف الحركة عند إخفاء التبويب أو خروجها من الشاشة.

## الملفات والتحقق
- robot.js والصور الست: الشكل والحركات. الصور كما خرجت من imagegen؛ أصل التوليد في GENERATION.md.
- bebo-chat.js: المحادثة والمايك وتشغيل الصوت.
- bebo-core.mjs: اللهجات والأوامر والنص المرسل للمساعد.
- server.mjs وstart.mjs: وسيط API ومشغّل الخادم.
- index.html وpreview.css وpreview.js: تجربة الاستخدام.
- .env.example وstart.cmd: إعداد وتشغيل الحزمة.

تم اختبار الرد النصي الحقيقي من وسيط وتوليد WAV حقيقي 24 kHz، والرد الصوتي من الواجهة. نجح 78 اختبار حركة، و31 اختبار دورة المحادثة بمحاكاة الإملاء والصوت، و12 اختبارًا للخادم والأوامر والحماية. التقاط صوت المستخدم من مايك حقيقي يظل تجربة ينفّذها المستخدم بعد إذنه؛ لم نفتح المايك أثناء الاختبارات.

هذه نسخة ويب محلية جاهزة للدمج. لم يتم تعديل نشر وسيط الحالي أو مشروع Firebase/Cloud Run. لا تحتاج Blender.

مراجع: [توليد الصوت في Gemini](https://ai.google.dev/gemini-api/docs/speech-generation)، [دعم SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).


---

## Architecture & Latest Updates (Bebo + Nadeem/Scout + Cloud Cache + Angular Integration)

- **Dual-Persona Sprite & Animation Engine (`robot.js` + `scout/`):**
  Supports both **Bebo** and **Nadeem (Scout)** personas with full high-resolution sprite sheets (`scout/guide-*.png`, `robot-*.png`, `kitten-sprites.png`) and role/context-aware switching.
- **Complete Angular Integration Suite (`angular-integration/`):**
  - `bebo-avatar/`: Interactive avatar component, contextual commands, and dynamic script loader (`bebo-avatar.ts`, `bebo-commands.ts`, `bebo-loader.ts`) with full unit test specs (`*.spec.ts`).
  - `assistant-widget/` & `assistant-chat/`: Floating assistant widget, smart placement, persistent settings, and automated reply audio playback with unit tests (`*.spec.ts`).
  - `services-and-store/`: Reactive state store (`assistant.store.ts`) and real-time Socket.IO bridge (`help-assistant-socket.service.ts`).
- **Cloud Backend Routes & Shared Audio Cache (`cloud-backend/`):**
  Fastify routes for `/v1/bebo`, `/v1/ai/avatar`, `/v1/ai/tts`, instant quick-replies (`quick-replies.ts`), and 2-tier memory + Cloud Storage audio caching (`audio-cache.ts`).
- **Automated Tests, Benchmarks & Verification Reports (`tests/`):**
  - Standalone server, chat, and animation test suites (`bebo-server.test.mjs`, `bebo-chat-v4-tests.html`, `robot-v4-tests.html`).
  - Backend integration specs (`tests/backend-specs/`: `bebo.test.ts`, `bebo-audio-cache.test.ts`, `bebo-quick-replies.test.ts`, `help-character.test.ts`, `tts.test.ts`, `tts-latency.test.ts`).
  - Latency benchmarks (`tests/benchmarks/`) and verification artifacts (`tests/verification-reports/`).
