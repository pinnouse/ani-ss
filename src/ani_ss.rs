extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;

use crate::shader_loader::{program_wrapper::ProgramWrapper, Program, program_wrapper};
use wasm_bindgen::{prelude::*, JsCast};
use web_sys::*;
use js_sys::{ArrayBuffer, Float32Array};
use std::collections::HashMap;
use std::cmp::min;
use crate::utils::{bind_tex, create_array_buffer, bind_attribute};
use std::fs;

static VERTICES: ArrayBuffer = Float32Array::from(vec![
    0., 1., //TOP LEFT
    0., 0., //BOTTOM LEFT
    1., 1., //TOP RIGHT
    1., 1., //TOP RIGHT
    0., 0., //BOTTOM LEFT
    1., 0.  //BOTTOM RIGHT
].as_slice()).buffer();

struct DrawProgram {
    program: WebGlProgram,
    uniforms: HashMap<String, WebGlUniformLocation>,
    attributes: HashMap<String, u32>,
}

#[wasm_bindgen]
pub struct AniSS {
    pub gl: WebGlRenderingContext,
    pub vbo: WebGlBuffer,
    pub programs: Vec<ProgramWrapper>,
    pub html_source: Option<HtmlElement>,
    pub texture: Option<WebGlTexture>,
    pub saved_textures: HashMap<String, WebGlTexture>,
    pub framebuffer: WebGlFramebuffer,
    pub updated: bool,
    pub custom_scale: Option<f32>,
    draw_prog: DrawProgram,
}

impl AniSS {
    pub fn new(gl: WebGlRenderingContext) -> Self {
        AniSS {
            programs: vec![],
            vbo: create_array_buffer(&gl, Some(&VERTICES)),
            html_source: None,
            texture: None,
            saved_textures: HashMap::new(),
            framebuffer: &gl.create_framebuffer().expect("Error: frame buffer could not be created"),
            updated: false,
            custom_scale: None,
            draw_prog: Self::create_draw_program(&gl),
            gl,
        }
    }

    fn create_draw_program(gl: &WebGlRenderingContext) -> DrawProgram {
        let program = gl.create_program().expect("Could not create draw program");
        let v_shader = gl.create_shader(GL::VERTEX_SHADER).expect("Failed to create a new vertex draw shader");
        program_wrapper::compile_shader(gl, v_shader, String::from_utf8(
            fs::read("draw_vertex.glsl").expect("Could not parse draw vertex shader")
        ).expect("Could not parse draw vertex shader as utf8").as_str());
        let f_shader = gl.create_shader(GL::FRAGMENT_SHADER).expect("Failed to create a new fragment draw shader");
        program_wrapper::compile_shader(gl, f_shader, String::from_utf8(
            fs::read("draw_frag.glsl").expect("Could not parse draw fragment shader")
        ).expect("Could not parse draw fragment shader as utf8").as_str());
        gl.attach_shader(&program, &v_shader);
        gl.attach_shader(&program, &f_shader);
        gl.link_program(&program);
        if gl.get_program_parameter(&gl_program, GL::LINK_STATUS).is_falsy() {
            panic!(gl.get_program_info_log(&gl_program).expect("Failed to link draw program"))
        }
        let (uniforms, attributes) = program_wrapper::get_uniforms_attributes(&program);
        DrawProgram {
            program,
            uniforms,
            attributes
        }
    }

    pub fn get_canvas(&self) -> HtmlCanvasElement {
        JsValue::from(self.gl.canvas().unwrap())
            .dyn_into::<HtmlCanvasElement>()
            .expect("Failed to get Canvas element from renderer")
    }

    fn create_new_texture(&mut self) -> WebGlTexture {
        let gl = &self.gl;
        let texture = gl.create_texture().expect("Error: could not create a new texture");
        gl.bind_texture(GL::TEXTURE_2D, self.texture.as_ref());
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_S, GL::CLAMP_TO_EDGE as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_T, GL::CLAMP_TO_EDGE as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MIN_FILTER, GL::LINEAR as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MAG_FILTER, GL::LINEAR as i32);
        gl.bind_texture(GL::TEXTURE_2D, None);
        texture
    }

    fn set_scale(&mut self, scale: Option<f32>) {
        self.custom_scale = scale;
    }

    pub fn set_source(&mut self, element: HtmlElement) {
        match element.tag_name().to_lowercase() {
            "img" | "video" | "canvas" => {
                self.html_source = element;
                self.updated = false;
            },
            _ => eprintln!("Not a valid source"),
        }
    }

    pub fn add_program(&mut self, program: &str) {
        for p in Program::read_str(program) {
            match ProgramWrapper::new(self.gl, &p) {
                Ok(p) => {
                    self.programs.push(p);
                    if !self.saved_textures.contains_key(&p.save) {
                        self.saved_textures.insert(p.save.clone(), self.create_new_texture());
                    }
                },
                Err(e) => eprintln!("Error: failed to create program\n{:?}", e),
            }
        }
    }

    pub fn get_source_size(&self) -> (u32, u32) {
        if let Some(source) = self.html_source {
            match source.tag_name().to_lowercase() {
                "img" => {
                    source = HtmlImageElement::from(source);
                    (source.width(), source.height())
                },
                "canvas" => {
                    source = HtmlCanvasElement::from(source);
                    (source.width(), source.height())
                },
                "video" => {
                    source = HtmlVideoElement::from(source);
                    (source.video_width(), source.video_height())
                }
            }
        }
        (0, 0)
    }

    pub fn update_texture(&mut self) {
        if let Some(source) = self.html_source {
            let gl = &self.gl;
            if self.texture.is_none() {
                self.texture = self.create_new_texture();
            }
            gl.bind_texture(GL::TEXTURE_2D, self.texture.as_ref());
            match source.tag_name().to_lowercase() {
                "img" => {
                    if self.updated {
                        return;
                    }
                    self.set_new = true;
                    source = HtmlImageElement::from(source);
                    gl.tex_image_2d_with_u32_and_u32_and_image(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        &source
                    );
                },
                "canvas" => {
                    source = HtmlCanvasElement::from(source);
                    gl.tex_image_2d_with_u32_and_u32_and_canvas(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        &source
                    );
                },
                "video" => {
                    source = HtmlVideoElement::from(source);
                    gl.tex_image_2d_with_u32_and_u32_and_video(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        &source
                    );
                },
                _ => eprintln!("Unsupported source type {}", source.tag_name()),
            }
            gl.bind_texture(GL::TEXTURE_2D, None);
        } else {
            eprintln!("No source set, nothing to render");
        }
    }

    pub fn render(&mut self) {
        self.updated_texture();
        if self.texture.is_none() {
            return;
        }
        let native_size = self.get_source_size();
        if min(native_size.0, native_size.1) <= 0 {
            return;
        }
        let gl = &self.gl;
        gl.disable(GL::DEPTH_TEST);
        gl.disable(GL::STENCIL_TEST);
        let canvas = self.get_canvas();
        gl.viewport(
            0, 0, canvas.width() as i32, canvas.height() as i32
        );
        gl.bind_framebuffer(GL::FRAMEBUFFER, Some(&self.framebuffer));
        let mut tex_sizes: HashMap<String, (u32, u32)> = HashMap::new();
        for program in self.programs {
            let tex: Option<&WebGlTexture> = match program.save {
                String::from("HOOK") => {
                    gl.bind_framebuffer(GL::FRAMEBUFFER, None);
                    self.texture.as_ref()
                },
                _ => self.saved_textures.get(&program.save),
            };
            gl.framebuffer_texture_2d(GL::FRAMEBUFFER, gl.COLOR_ATTACHMENT0, GL::TEXTURE_2D, tex, 0);
            gl.use_program(Some(&program.program));
            let hooked_tex: Option<&WebGlTexture> = match program.hook {
                String::from("NATIVE") => self.texture.as_ref(),
                _ => self.saved_textures.get(&program.hook),
            };
            let tex_size = {
                if let Some(s) = program.scale {
                    if self.custom_scale.is_some() {
                        native_size * self.custom_scale
                    }
                    s
                }
                native_size
            };
            bind_tex(gl, hooked_tex, 0);
            gl.uniform1i(program.uniforms.get("_HOOKED_tex"), 0);
            gl.uniform2f(program.uniforms.get("HOOKED_size"), tex_size.0 as f32, tex_size.1 as f32);
            gl.uniform2f(program.uniforms.get("HOOKED_pt"), 1.0 / tex_size.0 as f32, 1 / tex_size.1 as f32);
            tex_sizes.insert(program.save, tex_size);
            if !program.attributes.contains_key("aPos") {
                eprintln!("Render pass missing position attribute, skipping");
                continue;
            }
            bind_attribute(gl, Some(&self.vbo), program.attributes["aPos"], 2);
            for i in 0..program.bind.len() {
                let binding = program.bind.get(i).unwrap();
                let bind_size = match tex_sizes.get(binding) {
                    Some(s) => *s,
                    None => tex_size,
                };
                bind_tex(gl, self.saved_textures.get(&binding), i as u32 + 1);
                gl.uniform1i(program.uniforms.get(&format!("_{}_tex", binding)), i as i32 + 1);
                gl.uniform2f(program.uniforms.get(&format!("{}_size", binding)), bind_size.0 as f32, bind_size.1 as f32);
                gl.uniform2f(program.uniforms.get(&format!("{}_pt", binding)), 1.0 / bind_size.0 as f32, 1 / bind_size.1 as f32);
            }
            gl.draw_arrays(GL::TRIANGLES, 0, 6);
        }
        gl.bind_framebuffer(GL::FRAMEBUFFER, None);
        gl.use_program(Some(&self.draw_prog.program));
        bind_attribute(gl, Some(&self.vbo), self.draw_prog.attributes["aPos"], 2);
        bind_tex(gl, self.texture.as_ref(), 0);
        gl.uniform1i(self.draw_prog.uniforms.get("texture"), 0);
        gl.draw_arrays(GL::TRIANGLES, 0, 6);
    }
}