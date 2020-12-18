extern crate wasm_bindgen;
extern crate web_sys;

use wasm_bindgen::prelude::*;
use web_sys::{WebGlBuffer, WebGlRenderingContext, WebGlTexture, WebGlFramebuffer, HtmlVideoElement,
              HtmlCanvasElement};
use crate::utils::*;
use crate::shaders::*;
use wasm_bindgen::JsCast;

// TODO: Convert all the non-Copyable traits into JsValues/Objects
#[wasm_bindgen]
pub struct Scaler {
    pub gl: WebGlRenderingContext,
    #[wasm_bindgen(skip)]
    pub i_t: Option<WebGlTexture>,
    pub i_v: Option<HtmlVideoElement>,
    pub i_w: u32,
    pub i_h: u32,
    pub quad_buffer: WebGlBuffer,
    pub framebuffer: Option<WebGlFramebuffer>,
    pub scale_prog: ProgramWrapper,
    pub lum_prog: ProgramWrapper,
    pub push_prog: ProgramWrapper,
    pub grad_prog: ProgramWrapper,
    pub final_prog: ProgramWrapper,
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
    pub fn new(gl: &WebGlRenderingContext) -> Scaler {
        Scaler {
            gl: *gl,
            i_t: None,
            i_v: None,
            i_w: 0,
            i_h: 0,
            quad_buffer: create_buffer(gl, [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1].to_vec()).unwrap(),
            framebuffer: gl.create_framebuffer(),
            scale_prog: create_program(gl, QUAD_VERT, SCALE_FRAG).unwrap(),
            lum_prog: create_program(gl, QUAD_VERT, LUM_FRAG).unwrap(),
            push_prog: create_program(gl, QUAD_VERT, PUSH_FRAG).unwrap(),
            grad_prog: create_program(gl, QUAD_VERT, GRAD_FRAG).unwrap(),
            final_prog: create_program(gl, QUAD_VERT, FINAL_FRAG).unwrap(),
            draw_prog: create_program(gl, QUAD_VERT, DRAW_FRAG).unwrap(),
            scale_tex: None,
            temp_tex: vec![None, None, None],
            bold: 6.0,
            blur: 2.0
        }
    }

    pub fn input_video(&mut self, video: HtmlVideoElement) {
        self.i_w = video.width();
        self.i_h = video.height();
        let empty_pixels: Vec<u8> = vec![0; (video.width() * video.height() * 4) as usize];
        self.i_t = Some(create_texture(
            &self.gl,
            WebGlRenderingContext::LINEAR as i32,
            empty_pixels,
            video.width(),
            video.height()
        ).unwrap());
        self.i_v = Some(video);
    }

    pub fn resize(&mut self, scale: f32) {
        let width: u32 = (self.i_w as f32 * scale).round() as u32;
        let height: u32 = (self.i_h as f32 * scale).round() as u32;
        let canvas: &HtmlCanvasElement = &JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap();
        canvas.set_width(width);
        canvas.set_height(height);
        let empty_pixels: Vec<u8> = vec![0; (width * height * 4) as usize];
        self.scale_tex = Some(create_texture(
            &self.gl,
            WebGlRenderingContext::LINEAR as i32,
            empty_pixels.clone(),
            width,
            height
        ).unwrap());
        for i in 0..self.temp_tex.len() {
            self.temp_tex[i] = Some(create_texture(
                &self.gl,
                WebGlRenderingContext::LINEAR as i32,
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
        update_texture(gl, Some(&self.i_t.unwrap()), &self.i_v.unwrap());
        gl.disable(WebGlRenderingContext::DEPTH_TEST);
        gl.disable(WebGlRenderingContext::STENCIL_TEST);
        gl.viewport(
            0,
            0,
            (JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap()).width() as i32,
            (JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap()).height() as i32
        );
        // Bicubic interpolation upscale
        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.scale_tex.unwrap()));
        gl.use_program(Some(&self.scale_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.scale_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.i_t.unwrap()), 0);
        gl.uniform1i(Some(&self.scale_prog.uniforms["u_texture"]), 0);
        gl.uniform2f(Some(&self.scale_prog.uniforms["u_size"]), self.i_w as f32, self.i_h as f32);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: scaleTexture

        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.temp_tex[0].unwrap()));
        gl.use_program(Some(&self.lum_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.lum_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.scale_tex.unwrap()), 0);
        gl.uniform1i(Some(&self.lum_prog.uniforms["u_texture"]), 0);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: scaleTexture
        // PostKernel: tempTexture

        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.temp_tex[1].unwrap()));
        gl.use_program(Some(&self.push_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.push_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.scale_tex.unwrap()), 0);
        bind_texture(gl, Some(&self.temp_tex[0].unwrap()), 1);
        gl.uniform1i(Some(&self.push_prog.uniforms["u_texture"]), 0);
        gl.uniform1i(Some(&self.push_prog.uniforms["u_textureTemp"]), 1);
        gl.uniform1f(
            Some(&self.push_prog.uniforms["u_scale"]),
            JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().width() as f32
                / self.i_w as f32
        );
        gl.uniform2f(
            Some(&self.push_prog.uniforms["u_pt"]),
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().width() as f32,
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().height() as f32
        );
        gl.uniform1f(Some(&self.push_prog.uniforms["u_bold"]), self.bold);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture

        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.temp_tex[0].unwrap()));
        gl.use_program(Some(&self.lum_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.lum_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.temp_tex[1].unwrap()), 0);
        gl.uniform1i(Some(&self.lum_prog.uniforms["u_texture"]), 0);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture

        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.temp_tex[2].unwrap()));
        gl.use_program(Some(&self.grad_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.grad_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.temp_tex[1].unwrap()), 0);
        bind_texture(gl, Some(&self.temp_tex[0].unwrap()), 1);
        gl.uniform1i(Some(&self.grad_prog.uniforms["u_texture"]), 0);
        gl.uniform1i(Some(&self.grad_prog.uniforms["u_textureTemp"]), 1);
        gl.uniform2f(
            Some(&self.grad_prog.uniforms["u_pt"]),
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().width() as f32,
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().height() as f32
        );

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: tempTexture2
        // PostKernel: tempTexture3

        bind_fb(&gl, Some(&self.framebuffer.unwrap()), Some(&self.temp_tex[0].unwrap()));
        gl.use_program(Some(&self.final_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.final_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.temp_tex[1].unwrap()), 0);
        bind_texture(gl, Some(&self.temp_tex[2].unwrap()), 1);
        gl.uniform1i(Some(&self.final_prog.uniforms["u_texture"]), 0);
        gl.uniform1i(Some(&self.final_prog.uniforms["u_textureTemp"]), 1);
        gl.uniform1f(
            Some(&self.final_prog.uniforms["u_scale"]),
            JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().width() as f32
                / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().height() as f32
        );
        gl.uniform2f(
            Some(&self.final_prog.uniforms["u_pt"]),
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().width() as f32,
            1.0 / JsValue::from(self.gl.canvas().unwrap()).dyn_into::<HtmlCanvasElement>().unwrap().height() as f32
        );
        gl.uniform1f(Some(&self.final_prog.uniforms["u_blur"]), self.blur);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);

        // Scaled: tempTexture
        // PostKernel: tempTexture3

        bind_fb(&gl, None, None);
        gl.use_program(Some(&self.draw_prog.program));
        bind_attribute(gl, &self.quad_buffer, self.draw_prog.attributes["a_pos"], 2);
        bind_texture(gl, Some(&self.temp_tex[0].unwrap()), 0);
        bind_texture(gl, Some(&self.i_t.unwrap()), 1);
        gl.uniform1i(Some(&self.draw_prog.uniforms["u_texture"]), 0);
        gl.uniform1i(Some(&self.draw_prog.uniforms["u_textureOrig"]), 1);

        gl.draw_arrays(WebGlRenderingContext::TRIANGLES, 0, 6);
    }
}