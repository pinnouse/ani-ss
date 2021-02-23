precision mediump float;
attribute vec2 aPos;
varying vec2 texCoords;

void main() {
    gl_Position = vec4(aPos.xy, 0.0, 1.0);
    texCoords = vec2((aPos.x + 1.0) / 2.0, 1.0 - (aPos.y + 1.0) / 2.0);
}
