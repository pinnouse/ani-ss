import * as wasm from '../pkg';

let scaler = null

const add_program = function() {
    scaler.add_program(`
//!DESC Linear-Upscale
//!HOOK NATIVE
//!BIND HOOKED
//!WIDTH NATIVE.w 2 *
//!HEIGHT NATIVE.h 2 *

vec4 hook() {
    return HOOKED_tex(HOOKED_pos);
}
    `)
}

const startup = function() {
    const vid = document.getElementById('vid')

    const canvas = document.getElementById('canv')
    const gl = canvas.getContext('webgl')

    vid.addEventListener('canplaythrough', function() {
        vid.play()
    }, true)
    vid.addEventListener('loadeddata', function() {
        if (!scaler) {
            scaler = wasm.AniSS.new(gl)
        }
        scaler.set_source(vid)
    }, true)
    vid.addEventListener('error', function() {
        alert("Can't load the video.")
    }, true)

    scaler = wasm.AniSS.new(gl)
    add_program()

    function render() {
        if (scaler) {
            scaler.render()
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
        if (!scaler) {
            scaler = wasm.AniSS.new(gl)
        }
        scaler.set_source(inputImg)
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

window.onSelectFile = onSelectFile