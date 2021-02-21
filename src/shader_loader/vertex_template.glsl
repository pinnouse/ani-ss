precision mediump float;
attribute vec2 aPos;
varying vec2 HOOKED_pos;
//!BINDMOUNT

void main() {
   gl_Position = aPos;
   HOOKED_pos = aPos;
    //!BIND
}
