precision mediump float;
uniform sampler2D _HOOKED_tex;
uniform vec2 HOOKED_size;
uniform vec2 HOOKED_pt;
varying vec2 HOOKED_pos;
//!HOOKMOUNT

vec4 HOOKED_tex(vec2 pos) {
    return texture2D(_HOOKED_tex, pos);
}
//!HOOK

void main() {
    gl_FragColor = hook();
}
