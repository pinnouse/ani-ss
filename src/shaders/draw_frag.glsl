#version 300 es
precision mediump float;
uniform sampler2D drawTexture;
in vec2 texCoords;
out vec4 fragColor;

void main() {
    fragColor = texture(drawTexture, texCoords);
}
