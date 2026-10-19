# Image generation

Mode: built-in image_gen tool. Transparent background: true.

The PNG is the original generated atlas, used directly without pixel editing. Web animation is implemented separately in robot.js.

## Final generation prompt

Use case: stylized-concept.
Asset type: production 2D pixel-art animated website mascot sprite atlas.
Primary request: Draw one original irresistibly cute tiny blue robot companion in eight consistent poses, as a precisely aligned sprite atlas. It should feel like a cozy desktop coding companion: big rounded helmet, tiny body, very short chunky limbs, dark navy face display, two bright cyan eyes, tiny cheerful mouth, subtle pink cheek pixels, one small antenna with cyan tip. Cornflower blue and periwinkle shell, indigo pixel outlines, a small cyan heart on its chest. Friendly, soft, expressive, premium retro game pixel-art.
Canvas and layout: exactly 1024 pixels wide by 512 pixels tall. An invisible 4-column by 2-row uniform grid; each cell exactly 256x256. Eight full-body copies of the SAME character, one per cell. Absolutely no grid lines or labels. The character in each cell has the identical proportions, dimensions, front-facing camera and position, feet baseline y=214 within each cell, body centered on x=128 within each cell, highest antenna point y=38. Keep at least 28 pixels of padding in every cell. Head must occupy about 60% of body height. All poses perfectly registered: head center and chest remain exactly fixed, only facial pixels and specified arm angles vary. Both feet visible and same baseline in all frames.
Cell order left-to-right then top-to-bottom:
0 neutral happy idle: both eyes open, both arms lowered.
1 blink: exactly same as frame 0 but eyes closed as two cute short horizontal cyan strokes.
2 wave A: same body and face, right side arm (viewer's right) raised beside the head, hand facing viewer.
3 wave B: same as 2 but raised hand tilted outward slightly.
4 delighted: same robot with smiling upward-curved closed eyes and a small open smile, both arms slightly lifted.
5 celebrate: same happy face, both arms raised high; fixed body position and feet baseline.
6 thinking: eyes glance to viewer's left, tiny mouth, arms down.
7 sleepy: half-closed eyes, tiny neutral mouth, arms down.
Style: crisp hand-crafted pixel art on a consistent coarse square pixel grid, low-resolution aesthetic enlarged without blur, controlled stepped silhouettes, flat clusters of highlights and shadows. Cute, compact, easy to read at small web-widget size.
Background: truly transparent alpha across all empty pixels. No floor, no drop shadow, no glow outside silhouette, no scene, no props, no text, no letters, no logos, no watermarks. Each entire pose fully contained within its own cell. This is a functional aligned sprite atlas, not a character concept poster.


## V2 action atlas

Mode: built-in image_gen edit, referenced original robot-sprites.png. Transparent background: true. Saved unchanged as robot-actions.png.

Use case: precise-object-edit.
Asset type: additional action sprite atlas for an existing animated website mascot named Bebo.
Input image is the existing eight-frame Bebo atlas. Make a NEW action atlas, preserving this EXACT same robot identity, blue shell, tiny antenna, navy face screen, cyan eyes, pink cheek pixels, chest heart, body proportions, pixel resolution and crisp pixel-art rendering. Do not redesign the character.
Canvas: same 2:1 aspect ratio as input, four equal columns and two equal rows, invisible grid. Eight fully contained sprites, one in each equal cell, transparent empty background. Preserve the input's character scale and registration: centered at 50% x in each cell, top antenna around 8% y, standing feet baseline around 91% y. The helmet dimensions and position should match original idle wherever pose allows. Head about 60% of character height. No text, labels, grids, borders, shadows or extra detached objects.
Replace the eight old poses with these eight action frames, read left to right top row, then bottom row:
0 WALK A: facing mostly front with a tiny lean toward viewer's right, right foot forward and left foot slightly back, opposite arms swinging. Same friendly face, obvious walking leg pose.
1 WALK B: identical robot head and body registration, opposite feet and arms to frame 0, continuing rightward walking cycle. Clear alternate leg silhouette.
2 TYPING A: seated happily behind a tiny open dark navy laptop held at waist level, laptop back facing viewer with a small cyan heart, keyboard angled toward robot, both robot hands visibly resting on keyboard. Face completely visible. One hand slightly lifted as if typing. Keep helmet at same scale as input.
3 TYPING B: precisely same robot and laptop as frame 2, only swap typing hand movement a few pixels. Laptop must be identical and registered, joyful closed crescent eyes allowed. No change in camera.
4 JUMP: excited smiling robot, both arms out/up, both tiny legs lifted/tucked in air. Same helmet scale, no motion lines or extra effects.
5 LAND: same robot in a soft squashed landing crouch, feet at baseline, knees slightly bent, arms out to balance, cheerful expression.
6 PICKED UP: robot hanging as if held from antenna, tiny legs dangling separated, arms spread out, eyes round with a tiny surprised mouth, cute not distressed. All inside its cell.
7 REST: relaxed robot sitting with both small feet pointed forward, arms resting at sides, half-closed happy eyes.
Pixel edges must remain crisp; all components belong to one coherent character. Truly transparent alpha, no checkerboard paint. This is an animation-ready registered 4x2 atlas, not a concept sheet.


## Talking animation — v3

Generated with the built-in image_gen tool. Transparent 4×2 atlas; saved without pixel modification as robot-speaking.png.

Prompt:

Use case: identity-preserve. Asset: transparent pixel-art animation sprite sheet for an existing cute website robot. Reference image: the attached existing Bebo sprite atlas; preserve exactly this robot's blue shell, navy face screen, cyan oval eyes, pink cheeks, cyan chest heart, short legs, tiny antenna, chunky pixel style and its scale/alignment. Create a NEW companion talking-animation atlas, exactly FOUR columns by TWO rows, 8 evenly sized square cells in a 2:1 canvas, each full-body robot centered at the same coordinates and the same ground baseline as its corresponding reference cell. Real alpha transparent background; no background, no labels, no grid lines, no text, no shadows outside the character. Same fixed front-facing head, torso and feet across all frames; only mouth and hands change, no zoom or camera changes. Character occupies roughly 72% cell width and 83% cell height, antenna near 8% and soles near 90%. Eight sequential talking poses in left-to-right row-major order: frame0 relaxed neutral hands down, small closed cyan smile; frame1 small open cyan mouth, one hand starts rising; frame2 clearly open rounded cyan mouth with navy interior, right hand held palm up explaining; frame3 medium open smile mouth, right hand extended gently; frame4 small open mouth with left hand also gesturing slightly; frame5 larger open cyan mouth, both hands open in friendly explanation; frame6 narrow cyan mouth, right hand lowering; frame7 closed small smile, hands returning down. The mouth MUST visibly change size/shape frame by frame. Every frame has the exact same robot identity, dimensions and pixel shading as reference, simple cyan electronic mouth (no human teeth or lips). All 8 figures fully inside their equal grid cells, no cell overlaps. Seamless talking loop. Output only sprite sheet.


## Playful animation — v3

Generated with the built-in image_gen tool, preserving the supplied Bebo identity. Original transparent image copied unchanged to robot-antics.png. The fly is a separate small SVG actor animated in robot.js.

Prompt:

Use case: identity-preserve. Asset: NEW transparent pixel-art animation sprite atlas for Bebo cute robot, extending the supplied reference atlas. Keep the EXACT same Bebo character identity: blue rounded head and shell, navy digital face screen, cyan eyes and mouth, pink cheeks, cyan heart on chest, short feet, tiny glowing antenna, chunky pixel outlines, same shading and scale. Exactly FOUR columns and TWO rows of EIGHT equal square cells, 2:1 image aspect ratio; fixed frontal full-body robot centered in every cell at same coordinates. Same head size and torso dimensions and feet baseline as the reference. Transparent alpha background. No grid lines, labels, text, floor, external shadows or extra objects. Do not paint the fly itself; it will be animated separately in code. Pose plan, row-major: frame0 SCRATCH A: robot tilts head gently, right hand touches right upper side of head, mildly puzzled cute eyes. frame1 SCRATCH B: same robot almost identical, fingertip slightly higher on head as if scratching, small crooked smile; match frame0 in scale and placement. frame2 DANCE A: happy robot weight on left leg, arms loosely out, right foot slightly raised, small delighted smile. frame3 DANCE B: mirrored dancing pose, weight on right leg, left foot slightly raised, arms change angle gently. frame4 WATCHING FLY: eyes look up to viewer right, hands low, small surprised round cyan mouth, same frontal head. frame5 CATCH PREPARE: eyes still watch to viewer right, both hands slightly forward, cyan electronic mouth opens slightly. frame6 CATCH: very clearly wide-open large cyan digital mouth (navy interior), eyes squeezed joyfully, hands raised a little, as if catching a tiny bug playfully; no teeth, no insect parts, no gore. frame7 SATISFIED CHEW: mouth closed into little cyan puckered smile, round satisfied cheeks, eyes happy, one hand on belly. All 8 poses must be cohesive and fit completely inside their cells. Pixel art only, not smooth 3D. Prioritize precise matching to supplied Bebo.


## Emotions and kitten — v4

Both assets were generated using the built-in image_gen tool and copied unchanged with their transparency preserved.

- robot-emotions.png: Bebo laugh, cry, pleading kitten eyes, and run poses.
- kitten-sprites.png: a six-frame rightward run cycle plus two sitting poses.

### Robot emotion prompt

Use case: identity-preserve. Make a NEW transparent pixel-art sprite sheet extending the supplied existing Bebo robot atlas. Preserve EXACTLY the same blue rounded head, navy face screen, cyan eyes and mouth, pink cheeks, cyan heart on chest, short limbs, glowing antenna, chunky pixel style, shading, dimensions and baseline. EIGHT equal square cells, exactly FOUR columns by TWO rows, canvas 2:1, consistent centered full-body robot in every cell, scale aligned to reference (antenna at 8%, soles 91%). Alpha transparent background. No text, grid, cell labels, ground, extra props or outer shadows. Row-major poses: 0 LAUGH A: eyes closed in happy upturned arcs, big laughing electronic cyan mouth, right hand on tummy, left hand gently raised. 1 LAUGH B: same aligned robot laughing heartily, shoulders gently raised, both hands holding tummy, mouth changes open shape. 2 CRY A: exaggerated cartoon sobbing, eyes squeezed into sad downturned curves, wide wailing cyan electronic mouth, thick streams of bright cyan tears pouring down both pink cheeks, hands near face. 3 CRY B: same robot with tear streams and hands wiping eyes, slightly different wailing mouth; extremely expressive yet adorable and funny. 4 PLEADING A: tiny shy closed smile, HUGE round sparkling cyan kitten eyes with large navy pupils and white highlights, worried brows, hands clasped together at chest in a begging pose, gentle small head tilt. 5 PLEADING B: same huge shiny pleading cat eyes looking slightly upward, tiny pout, hands still clasped, small opposite head tilt; adorable 'please?' expression. 6 RUN RIGHT A: three-quarter facing viewer RIGHT, joyful focused expression, one foot forward and one back, arms in running position. 7 RUN RIGHT B: same three-quarter orientation to RIGHT, opposite foot forward, opposite arm, matching running cycle. No cat in this sheet. Each figure entirely inside its own equal cell. Keep robot proportions stable. Pixel art only; no smooth 3D or realistic metal.

### Kitten prompt

Use case: illustration-story. Asset: transparent pixel-art sprite sheet of one adorable small ginger kitten for a playful website robot companion. Exactly EIGHT equal square cells in FOUR columns and TWO rows, total canvas 2:1, transparent alpha background, no text/grid/floor/shadows. The SAME kitten in each cell, same scale, matching baseline (feet at 87%), centered. Cute warm orange fur, creamy muzzle and belly, triangular ears, tiny dark button nose, expressive big brown eyes, plump little body, short legs and long soft curved tail. Chunky clean pixel outline, cheerful saturated game-sprite shading matching a blue pixel robot. Frames row-major 0 through 5 are a clean six-frame RUN cycle strictly facing RIGHT, side/three-quarter view, happy playful face, tail trailing to LEFT. Frames show extended foreleg/hindleg, gathering paws, airborne stretched, landing, and opposite steps in a smooth loop; every frame same character size and a stable horizontal ground. Frame 6: kitten sitting calmly, still facing slightly RIGHT, looking back playfully toward viewer LEFT (where its robot friend will be), tail curled around feet. Frame 7: same sitting kitten blinking happily and raising one front paw. The full body and tail stay inside all cells with generous margins, kitten occupies about 78% cell width and 62% cell height, 12% margin all sides. No robot, no accessories, no other objects. Crisp pixel art, not 3D. It is playing chase, not scared or distressed.
