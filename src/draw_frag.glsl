uniform sampler2D texture;
varying vec2 texCoords;

void main() {
    gl_FragColor = texture2D(texture, texCoords);
}
