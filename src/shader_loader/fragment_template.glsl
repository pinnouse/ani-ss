precision mediump float;
uniform sampler2D HOOKED_tex;
varying vec2 HOOKED_pos;
//!HOOKMOUNT

//!HOOK

void main() {
    gl_FragColor = hook();
}
