import { AniSS } from '../pkg';

let aniSS = null

const addSimpleProgram = function() {
    if (!aniSS) return;
    aniSS.addProgram(`
//!DESC Linear-Upscale
//!HOOK NATIVE
//!BIND HOOKED
//!WIDTH NATIVE.w 2 *
//!HEIGHT NATIVE.h 2 *

vec4 hook() {
    return HOOKED_tex(HOOKED_pos);
}
    `)
    alert('Added simple program')
}

/**
 * Links and adds a new hook/program to the ani-ss
 *
 * @param program {string} Program as string to add
 * @returns {boolean} whether or not the program added without errors
 */
const addCustomProgram = function(program) {
    if (!aniSS) return true
    return aniSS.addProgram(program)
}

const startup = function() {
    const vid = document.getElementById('vid')

    const canvas = document.getElementById('canv')
    const gl = canvas.getContext('webgl')

    vid.addEventListener('canplaythrough', function() {
        vid.play()
    }, true)
    vid.addEventListener('loadeddata', function() {
        if (!aniSS) {
            aniSS = new AniSS(gl)
        }
        aniSS.setSource(vid)
    }, true)
    vid.addEventListener('error', function() {
        alert("Can't load the video.")
    }, true)

    aniSS = new AniSS(gl)

    function render() {
        if (aniSS) {
            aniSS.render()
        }
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}

startup();

function getSourceType(uri) {
    const movTypes = ['mp4', 'webm', 'ogv', 'ogg']

    let ext = uri.split('.').pop().split(/\#|\?/)[0]

    for (let movType of movTypes) {
        if (ext === movType) {
            return 'mov'
        }
    }

    return 'img'
}

function changeImage(src) {
    const vid = document.getElementById('vid')
    const gl = document.getElementById('canv').getContext('webgl')
    if (!vid.paused)
        vid.pause()

    const inputImg = new Image()
    inputImg.crossOrigin = "Anonymous"
    inputImg.src = src
    inputImg.onload = function() {
        if (!aniSS) {
            aniSS = new AniSS(gl)
        }
        aniSS.setSource(inputImg)
    }
    inputImg.onerror = function() {
        alert("Can't load the image.")
    }
}

function changeVideo(src) {
    const vid = document.getElementById('vid');
    vid.src = src;
}

function onSelectFile(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = e => {
            let src = e.target.result
            if (getSourceType(input.value) === 'img') {
                changeImage(src)
            } else {
                changeVideo(src)
            }
        }
        reader.readAsDataURL(input.files[0])
    }
}

function onSelectShader(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.onload = e => {
            let src = e.target.result
            if (!addCustomProgram(src))  {
                alert('Custom program added with error, check log for details')
            } else {
                alert('Program was added successfully!')
            }
        }
        reader.readAsText(input.files[0])
    }
}

window.addSimpleProgram = addSimpleProgram;
window.onSelectShader = onSelectShader;
window.onSelectFile = onSelectFile