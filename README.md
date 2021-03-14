# Ani-SS

Anime4k 3.x applied in web assembly.

Big thanks for the shaders and hard work from:
[https://github.com/bloc97/Anime4K](https://github.com/bloc97/Anime4K)

## What Is This?
Anime4K is a set of GLSL shaders meant to solve the issue of upscaling textures specifically and artistically in this use case, japanese animation.
The shaders intelligently push colour and luminance to clean artifacts and noise from linear scaling.

The target for the original Anime4K shaders is [mpv](https://mpv.io), but most people stream anime on the web these days, lucky these shaders compile* on and target modern browsers.
JavaScript is *ok*, but parsing text and wrapping them neatly in a package as well as doing so quickly and efficiently would be a great task for WebAssembly to take on instead.
This is where Ani-SS fits in - arbitrary mpv shaders would theoretically apply too (take a look at the bugs/inconsistencies section before submitting issues).

## Usage `wasm`
The `pkg` directory available after building should be where all your required files reside.
After importing (like as follows in the `www/js/init.js` file):
```js
import { AniSS } from '../../pkg';
...
```
To use Ani-SS, you must provide a WebGl2RenderingContext which can be obtained from a `<canvas>` element.

`index.html`
```html
<canvas id="canv"></canvas>
```
`<your_file>.js`
```js
const canvas = document.getElementById('canv');
const gl = canvas.getContext('webgl2');
```

Now ready to use:
```js
const aniSS = new AniSS(gl);
... // Obtain some <img>, <video> or <canvas> element to be the source
// After data is loaded
const videoElement = document.getElementById("vid"); // Some HtmlVideoElement <video id="vid"> or could be <img>, <canvas>
aniSS.setSource(videoElement);

function render() {
    aniSS.render();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

To add a shader/program:
```js
aniSS.addProgram('...') // Pass the program as a string, replacing '...' with that string
```

### Known Bugs/Inconsistencies
- Not sure if implementation of hooks or shaders themselves, but Anime4K shaders seem to lighten/increase luma of the render
- *GLSL: `szexpr` with `WIDTH` and `HEIGHT` are disregarded and the last parsable float is stored as the scale (looking to turn it into a multiplier/scale field)
