precision mediump float;
attribute vec2 aPos;
varying vec2 HOOKED_pos;
//!BINDMOUNT

void main() {
   gl_Position = vec4(aPos.xy, 0.0, 1.0);
   HOOKED_pos = vec2((aPos + 1.0) / 2.0);
    //!BIND
}