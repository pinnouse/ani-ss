import * as wasm from './pkg';

let scaler = null

let bold = 6.0
let blur = 2.0
let scale = 2.0

window.onload = function() {
    const vid = document.getElementById('vid')

    const canvas = document.getElementById('canv')
    const gl = canvas.getContext('webgl')

    vid.addEventListener('canplaythrough', function() {
        vid.play()
    }, true)
    vid.addEventListener('loadedmetadata', function() {
        scaler.input_video(vid)
        scaler.resize(scale)
    }, true)
    vid.addEventListener('error', function() {
        alert("Can't load the video.")
    }, true)

    scaler = wasm.Scaler.new(gl)

    function render() {
        if (scaler) {
            scaler.bold = bold
            scaler.blur = blur
            scaler.render()
        }
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
}


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
    if (!vid.paused)
        vid.pause()

    const inputImg = new Image()
    inputImg.crossOrigin = "Anonymous"
    inputImg.src = src
    inputImg.onload = function() {
        scaler.input_image(inputImg)
        scaler.resize(scale)
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