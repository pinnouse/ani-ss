pub const QUAD_VERT: &'static str = r#"
precision mediump float;
attribute vec2 a_pos;
varying vec2 v_tex_pos;
void main() {
    v_tex_pos = a_pos;
    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
}
"#;

pub const SCALE_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_size;
varying vec2 v_tex_pos;
vec4 interp(const vec2 uv) {
    vec2 px = 1.0 / u_size;
    vec2 vc = (floor(uv * u_size)) * px;
    vec2 f = fract(uv * u_size);
    vec4 tl = texture2D(u_texture, vc);
    vec4 tr = texture2D(u_texture, vc + vec2(px.x, 0));
    vec4 bl = texture2D(u_texture, vc + vec2(0, px.y));
    vec4 br = texture2D(u_texture, vc + px);
    return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
}
void main() {
    gl_FragColor = interp(1.0 - v_tex_pos);
    //gl_FragColor = texture2D(u_texture, 1.0 - v_tex_pos);
}
"#;

pub const LUM_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
varying vec2 v_tex_pos;
float getLum(vec4 rgb) {
	return (rgb.r + rgb.r + rgb.g + rgb.g + rgb.g + rgb.b) / 6.0;
}
void main() {
	vec4 rgb = texture2D(u_texture, 1.0 - v_tex_pos);
	float lum = getLum(rgb);
    gl_FragColor = vec4(lum);
}
"#;

pub const PUSH_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureTemp;
uniform float u_scale;
uniform float u_bold;
uniform vec2 u_pt;
varying vec2 v_tex_pos;
#define strength (min(u_scale / u_bold, 1.0))
vec4 HOOKED_tex(vec2 pos) {
    return texture2D(u_texture, pos);
}
vec4 POSTKERNEL_tex(vec2 pos) {
    return texture2D(u_textureTemp, pos);
}
vec4 getLargest(vec4 cc, vec4 lightestColor, vec4 a, vec4 b, vec4 c) {
	vec4 newColor = cc * (1.0 - strength) + ((a + b + c) / 3.0) * strength;
	if (newColor.a > lightestColor.a) {
		return newColor;
	}
	return lightestColor;
}
vec4 getRGBL(vec2 pos) {
    return vec4(HOOKED_tex(pos).rgb, POSTKERNEL_tex(pos).x);
}
float min3v(vec4 a, vec4 b, vec4 c) {
	return min(min(a.a, b.a), c.a);
}
float max3v(vec4 a, vec4 b, vec4 c) {
	return max(max(a.a, b.a), c.a);
}
void main() {
    vec2 HOOKED_pos = v_tex_pos;
	vec2 d = u_pt;

    vec4 cc = getRGBL(HOOKED_pos);
	vec4 t = getRGBL(HOOKED_pos + vec2(0.0, -d.y));
	vec4 tl = getRGBL(HOOKED_pos + vec2(-d.x, -d.y));
	vec4 tr = getRGBL(HOOKED_pos + vec2(d.x, -d.y));

	vec4 l = getRGBL(HOOKED_pos + vec2(-d.x, 0.0));
	vec4 r = getRGBL(HOOKED_pos + vec2(d.x, 0.0));

	vec4 b = getRGBL(HOOKED_pos + vec2(0.0, d.y));
	vec4 bl = getRGBL(HOOKED_pos + vec2(-d.x, d.y));
	vec4 br = getRGBL(HOOKED_pos + vec2(d.x, d.y));

	vec4 lightestColor = cc;
	//Kernel 0 and 4
	float maxDark = max3v(br, b, bl);
	float minLight = min3v(tl, t, tr);

	if (minLight > cc.a && minLight > maxDark) {
		lightestColor = getLargest(cc, lightestColor, tl, t, tr);
	} else {
		maxDark = max3v(tl, t, tr);
		minLight = min3v(br, b, bl);
		if (minLight > cc.a && minLight > maxDark) {
			lightestColor = getLargest(cc, lightestColor, br, b, bl);
		}
	}

	//Kernel 1 and 5
	maxDark = max3v(cc, l, b);
	minLight = min3v(r, t, tr);

	if (minLight > maxDark) {
		lightestColor = getLargest(cc, lightestColor, r, t, tr);
	} else {
		maxDark = max3v(cc, r, t);
		minLight = min3v(bl, l, b);
		if (minLight > maxDark) {
			lightestColor = getLargest(cc, lightestColor, bl, l, b);
		}
	}

	//Kernel 2 and 6
	maxDark = max3v(l, tl, bl);
	minLight = min3v(r, br, tr);

	if (minLight > cc.a && minLight > maxDark) {
		lightestColor = getLargest(cc, lightestColor, r, br, tr);
	} else {
		maxDark = max3v(r, br, tr);
		minLight = min3v(l, tl, bl);
		if (minLight > cc.a && minLight > maxDark) {
			lightestColor = getLargest(cc, lightestColor, l, tl, bl);
		}
	}

	//Kernel 3 and 7
	maxDark = max3v(cc, l, t);
	minLight = min3v(r, br, b);

	if (minLight > maxDark) {
		lightestColor = getLargest(cc, lightestColor, r, br, b);
	} else {
		maxDark = max3v(cc, r, b);
		minLight = min3v(t, l, tl);
		if (minLight > maxDark) {
			lightestColor = getLargest(cc, lightestColor, t, l, tl);
		}
    }

    gl_FragColor = lightestColor;
}
"#;

pub const GRAD_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureTemp;
uniform vec2 u_pt;
varying vec2 v_tex_pos;
vec4 HOOKED_tex(vec2 pos) {
    return texture2D(u_texture, 1.0 - pos);
}
vec4 POSTKERNEL_tex(vec2 pos) {
    return texture2D(u_textureTemp, 1.0 - pos);
}
vec4 getRGBL(vec2 pos) {
    return vec4(HOOKED_tex(pos).rgb, POSTKERNEL_tex(pos).x);
}
void main() {
    vec2 HOOKED_pos = v_tex_pos;

	vec2 d = u_pt;

	//[tl  t tr]
	//[ l cc  r]
	//[bl  b br]
    vec4 cc = getRGBL(HOOKED_pos);
	vec4 t = getRGBL(HOOKED_pos + vec2(0.0, -d.y));
	vec4 tl = getRGBL(HOOKED_pos + vec2(-d.x, -d.y));
	vec4 tr = getRGBL(HOOKED_pos + vec2(d.x, -d.y));

	vec4 l = getRGBL(HOOKED_pos + vec2(-d.x, 0.0));
	vec4 r = getRGBL(HOOKED_pos + vec2(d.x, 0.0));

	vec4 b = getRGBL(HOOKED_pos + vec2(0.0, d.y));
	vec4 bl = getRGBL(HOOKED_pos + vec2(-d.x, d.y));
	vec4 br = getRGBL(HOOKED_pos + vec2(d.x, d.y));

	//Horizontal Gradient
	//[-1  0  1]
	//[-2  0  2]
	//[-1  0  1]
	float xgrad = (-tl.a + tr.a - l.a - l.a + r.a + r.a - bl.a + br.a);

	//Vertical Gradient
	//[-1 -2 -1]
	//[ 0  0  0]
	//[ 1  2  1]
    float ygrad = (-tl.a - t.a - t.a - tr.a + bl.a + b.a + b.a + br.a);

    gl_FragColor = vec4(1.0 - clamp(sqrt(xgrad * xgrad + ygrad * ygrad), 0.0, 1.0));
}
"#;

pub const FINAL_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureTemp;
uniform vec2 u_pt;
uniform float u_scale;
uniform float u_blur;
varying vec2 v_tex_pos;
#define strength (min(u_scale / u_blur, 1.0))
vec4 HOOKED_tex(vec2 pos) {
    return texture2D(u_texture, vec2(pos.x, 1.0 - pos.y));
}
vec4 POSTKERNEL_tex(vec2 pos) {
    return texture2D(u_textureTemp, vec2(pos.x, 1.0 - pos.y));
}
vec4 getAverage(vec4 cc, vec4 a, vec4 b, vec4 c) {
	return cc * (1.0 - strength) + ((a + b + c) / 3.0) * strength;
}
vec4 getRGBL(vec2 pos) {
    return vec4(HOOKED_tex(pos).rgb, POSTKERNEL_tex(pos).x);
}
float min3v(vec4 a, vec4 b, vec4 c) {
	return min(min(a.a, b.a), c.a);
}
float max3v(vec4 a, vec4 b, vec4 c) {
	return max(max(a.a, b.a), c.a);
}
void main() {
    vec2 HOOKED_pos = v_tex_pos;

	vec2 d = u_pt;

    vec4 cc = getRGBL(HOOKED_pos);
	vec4 t = getRGBL(HOOKED_pos + vec2(0.0, -d.y));
	vec4 tl = getRGBL(HOOKED_pos + vec2(-d.x, -d.y));
	vec4 tr = getRGBL(HOOKED_pos + vec2(d.x, -d.y));

	vec4 l = getRGBL(HOOKED_pos + vec2(-d.x, 0.0));
	vec4 r = getRGBL(HOOKED_pos + vec2(d.x, 0.0));

	vec4 b = getRGBL(HOOKED_pos + vec2(0.0, d.y));
	vec4 bl = getRGBL(HOOKED_pos + vec2(-d.x, d.y));
	vec4 br = getRGBL(HOOKED_pos + vec2(d.x, d.y));

	//Kernel 0 and 4
	float maxDark = max3v(br, b, bl);
	float minLight = min3v(tl, t, tr);

	if (minLight > cc.a && minLight > maxDark) {
        gl_FragColor = getAverage(cc, tl, t, tr);
        return;
	} else {
		maxDark = max3v(tl, t, tr);
		minLight = min3v(br, b, bl);
		if (minLight > cc.a && minLight > maxDark) {
            gl_FragColor = getAverage(cc, br, b, bl);
            return;
		}
	}

	//Kernel 1 and 5
	maxDark = max3v(cc, l, b);
	minLight = min3v(r, t, tr);

	if (minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, t, tr);
        return;
	} else {
		maxDark = max3v(cc, r, t);
		minLight = min3v(bl, l, b);
		if (minLight > maxDark) {
            gl_FragColor = getAverage(cc, bl, l, b);
            return;
		}
	}

	//Kernel 2 and 6
	maxDark = max3v(l, tl, bl);
	minLight = min3v(r, br, tr);

	if (minLight > cc.a && minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, br, tr);
        return;
	} else {
		maxDark = max3v(r, br, tr);
		minLight = min3v(l, tl, bl);
		if (minLight > cc.a && minLight > maxDark) {
            gl_FragColor = getAverage(cc, l, tl, bl);
            return;
		}
	}

	//Kernel 3 and 7
	maxDark = max3v(cc, l, t);
	minLight = min3v(r, br, b);

	if (minLight > maxDark) {
        gl_FragColor = getAverage(cc, r, br, b);
        return;
	} else {
		maxDark = max3v(cc, r, b);
		minLight = min3v(t, l, tl);
		if (minLight > maxDark) {
            gl_FragColor = getAverage(cc, t, l, tl);
            return;
		}
	}

    gl_FragColor = cc;
}
"#;

pub const DRAW_FRAG: &'static str = r#"
precision mediump float;
uniform sampler2D u_texture;
uniform sampler2D u_textureOrig;
varying vec2 v_tex_pos;
void main() {
    vec4 color = texture2D(u_texture, 1.0 - v_tex_pos);
    vec4 colorOrig = texture2D(u_textureOrig, vec2(1.0 - v_tex_pos.x, v_tex_pos.y));
    gl_FragColor = vec4(color.rgb, colorOrig.a);
}
"#;
