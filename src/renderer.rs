extern crate wasm_bindgen;
extern crate web_sys;

use wasm_bindgen::prelude::*;
use web_sys::WebGlRenderingContext as GL;
use web_sys::*;
use crate::utils::*;
use crate::shaders::*;
use wasm_bindgen::JsCast;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct Scaler {
    #[wasm_bindgen(skip)]
    pub gl: WebGlRenderingContext,
    #[wasm_bindgen(skip)]
    pub i_t: Option<WebGlTexture>,
    #[wasm_bindgen(skip)]
    pub i_v: Option<HtmlVideoElement>,
    pub i_w: u32,
    pub i_h: u32,
    #[wasm_bindgen(skip)]
    pub quad_buffer: Option<WebGlBuffer>,
    #[wasm_bindgen(skip)]
    pub framebuffer: Option<WebGlFramebuffer>,
    #[wasm_bindgen(skip)]
    pub scale_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub lum_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub push_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub grad_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub final_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub draw_prog: ProgramWrapper,
    #[wasm_bindgen(skip)]
    pub scale_tex: Option<WebGlTexture>,
    #[wasm_bindgen(skip)]
    pub temp_tex: Vec<Option<WebGlTexture>>,
    pub bold: f32,
    pub blur: f32,
}

#[wasm_bindgen]
impl Scaler {
    pub fn new(gl: WebGlRenderingContext) -> Self {
        Self {
            i_t: None,
            i_v: None,
            i_w: 0,
            i_h: 0,
            quad_buffer: create_buffer(&gl, &[0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0]).ok(),
            framebuffer: gl.create_framebuffer(),
            scale_prog: create_program(&gl, QUAD_VERT, SCALE_FRAG).unwrap(),
            lum_prog: create_program(&gl, QUAD_VERT, LUM_FRAG).unwrap(),
            push_prog: create_program(&gl, QUAD_VERT, PUSH_FRAG).unwrap(),
            grad_prog: create_program(&gl, QUAD_VERT, GRAD_FRAG).unwrap(),
            final_prog: create_program(&gl, QUAD_VERT, FINAL_FRAG).unwrap(),
            draw_prog: create_program(&gl, QUAD_VERT, DRAW_FRAG).unwrap(),
            scale_tex: None,
            temp_tex: vec![None, None, None],
            bold: 6.0,
            blur: 2.0,
            gl,
        }
    }
    
    pub fn get_canvas(&self) -> HtmlCanvasElement {
        JsValue::from(self.gl.canvas().unwrap())
            .dyn_into::<HtmlCanvasElement>()
            .expect("Failed to get Canvas element from renderer")
    }

    pub fn input_image(&mut self, img: HtmlImageElement) {
        self.i_w = img.width();
        self.i_h = img.height();
        self.i_t = Some(
            create_texture_with_image(
                &self.gl,
                GL::LINEAR as i32,
                &img
            ).expect("Could not create texture from image")
        );
        self.i_v = None;
    }

    pub fn input_video(&mut self, video: HtmlVideoElement) {
        self.i_w = video.width();
        self.i_h = video.height();
        let empty_pixels: Vec<u8> = vec![0; (video.width() * video.height() * 4) as usize];
        self.i_t = Some(
            create_tex(
                &self.gl,
                GL::LINEAR as i32,
                empty_pixels,
                video.width(),
                video.height()
            ).expect("Could not create texture from video")
        );
        self.i_v = Some(video);
    }

    pub fn resize(&mut self, scale: f32) {
        let gl = &self.gl;
        let width = (self.i_w as f32 * scale).round() as u32;
        let height = (self.i_h as f32 * scale).round() as u32;
        let canvas = self.get_canvas();
        canvas.set_width(width);
        canvas.set_height(height);
        let empty_pixels: Vec<u8> = vec![0; (width * height * 4) as usize];
        self.scale_tex = Some(create_tex(
            gl,
            GL::LINEAR as i32,
            empty_pixels.clone(),
            width,
            height
        ).unwrap());
        for i in 0..self.temp_tex.len() {
            self.temp_tex[i] = Some(create_tex(
                gl,
                GL::LINEAR as i32,
                empty_pixels.clone(),
                width,
                height
            ).unwrap());
        }
    }

    pub fn render(&self) {
        if self.i_t.is_none() {
            return
        }

        let gl: &WebGlRenderingContext = &self.gl;

        if self.i_v.is_some() {
            update_texture(gl, &self.i_t, self.i_v.as_ref().unwrap());
        }

        gl.disable(GL::DEPTH_TEST);
        gl.disable(GL::STENCIL_TEST);

        gl.viewport(
            0,
            0,
            self.get_canvas().width() as i32,
            self.get_canvas().height() as i32
        );

        // Bicubic interpolation upscale
        bind_fb(gl, &self.framebuffer, &self.scale_tex);

        gl.use_program(self.scale_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.scale_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.i_t, 0);
        gl.uniform1i(self.scale_prog.uniforms.get("u_texture"), 0);
        gl.uniform2f(self.scale_prog.uniforms.get("u_size"), self.i_w as f32, self.i_h as f32);
        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: scaleTexture

        bind_fb(gl, &self.framebuffer, &self.temp_tex[0]);
        gl.use_program(self.lum_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.lum_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.scale_tex, 0);
        gl.uniform1i(self.lum_prog.uniforms.get("u_texture"), 0);

        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: scaleTexture
        // PostKernel: tempTexture

        bind_fb(gl, &self.framebuffer, &self.temp_tex[1]);
        gl.use_program(self.push_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.push_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.scale_tex, 0);
        bind_tex(gl, &self.temp_tex[0], 1);
        gl.uniform1i(self.push_prog.uniforms.get("u_texture"), 0);
        gl.uniform1i(self.push_prog.uniforms.get("u_textureTemp"), 1);
        gl.uniform1f(
            self.push_prog.uniforms.get("u_scale"),
            self.get_canvas().width() as f32
                / self.i_w as f32
        );
        gl.uniform2f(
            self.push_prog.uniforms.get("u_pt"),
            1.0 / self.get_canvas().width() as f32,
            1.0 / self.get_canvas().height() as f32
        );
        gl.uniform1f(self.push_prog.uniforms.get("u_bold"), self.bold);

        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture

        bind_fb(gl, &self.framebuffer, &self.temp_tex[0]);
        gl.use_program(self.lum_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.lum_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.temp_tex[1], 0);
        gl.uniform1i(self.lum_prog.uniforms.get("u_texture"), 0);

        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture

        bind_fb(gl, &self.framebuffer, &self.temp_tex[2]);
        gl.use_program(self.grad_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.grad_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.temp_tex[1], 0);
        bind_tex(gl, &self.temp_tex[0], 1);
        gl.uniform1i(self.grad_prog.uniforms.get("u_texture"), 0);
        gl.uniform1i(self.grad_prog.uniforms.get("u_textureTemp"), 1);
        gl.uniform2f(
            self.grad_prog.uniforms.get("u_pt"),
            1.0 / self.get_canvas().width() as f32,
            1.0 / self.get_canvas().height() as f32
        );

        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture3

        bind_fb(gl, &self.framebuffer, &self.temp_tex[0]);
        gl.use_program(self.final_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.final_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.temp_tex[1], 0);
        bind_tex(gl, &self.temp_tex[2], 1);
        gl.uniform1i(self.final_prog.uniforms.get("u_texture"), 0);
        gl.uniform1i(self.final_prog.uniforms.get("u_textureTemp"), 1);
        gl.uniform1f(
            self.final_prog.uniforms.get("u_scale"),
            self.get_canvas().width() as f32 / self.get_canvas().height() as f32
        );
        gl.uniform2f(
            self.final_prog.uniforms.get("u_pt"),
            1.0 / self.get_canvas().width() as f32,
            1.0 / self.get_canvas().height() as f32
        );
        gl.uniform1f(self.final_prog.uniforms.get("u_blur"), self.blur);

        gl.draw_arrays(GL::TRIANGLES, 0, 6);

        // Scaled: tempTexture
        // PostKernel: tempTexture3

        bind_fb(gl, &None, &None);
        gl.use_program(self.draw_prog.program.as_ref());
        bind_attribute(gl, &self.quad_buffer, self.draw_prog.attributes["a_pos"], 2);
        bind_tex(gl, &self.temp_tex[0], 0);
        bind_tex(gl, &self.i_t, 1);
        gl.uniform1i(self.draw_prog.uniforms.get("u_texture"), 0);
        gl.uniform1i(self.draw_prog.uniforms.get("u_textureOrig"), 1);

        gl.draw_arrays(GL::TRIANGLES, 0, 6);
    }
}