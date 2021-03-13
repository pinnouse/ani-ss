#version 300 es
precision mediump float;
out vec4 fragColor;
uniform sampler2D _HOOKED_tex;
uniform vec2 HOOKED_size;
uniform vec2 HOOKED_pt;
in vec2 HOOKED_pos;
//!HOOKMOUNT

vec4 HOOKED_tex(vec2 pos) {
    return texture(_HOOKED_tex, pos);
}
vec4 HOOKED_texOff(vec2 pos) {
    return texture(_HOOKED_tex, pos * HOOKED_pt);
}
vec4 NATIVE_tex(vec2 pos) {
    return texture(_HOOKED_tex, pos);
}
//!HOOK

void main() {
    fragColor = hook();
}
