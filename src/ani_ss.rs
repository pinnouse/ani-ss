extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;
extern crate console_error_panic_hook;
extern crate log;
extern crate console_log;

use crate::shader_loader::{program_wrapper::ProgramWrapper, Program, program_wrapper};
use wasm_bindgen::{prelude::*, JsCast};
use web_sys::{WebGl2RenderingContext as GL, *};
use js_sys::Float32Array;
use std::collections::HashMap;
use crate::utils::{bind_tex, create_array_buffer, bind_attribute};
use log::{info, error};

static VERTICES: [f32; 12] = [
    -1.,  1.,    //TOP LEFT
    -1., -1.,   //BOTTOM LEFT
     1.,  1.,     //TOP RIGHT
     1.,  1.,     //TOP RIGHT
    -1., -1.,   //BOTTOM LEFT
     1., -1.     //BOTTOM RIGHT
];

struct DrawProgram {
    program: WebGlProgram,
    uniforms: HashMap<String, WebGlUniformLocation>,
    attributes: HashMap<String, u32>,
}

enum AniSSSource {
    ImageSource(HtmlImageElement),
    VideoSource(HtmlVideoElement),
    CanvasSource(HtmlCanvasElement),
}

#[wasm_bindgen]
pub struct AniSS {
    gl: WebGl2RenderingContext,
    vbo: WebGlBuffer,
    programs: Vec<ProgramWrapper>,
    texture: Option<WebGlTexture>,
    saved_textures: HashMap<String, WebGlTexture>,
    framebuffer: WebGlFramebuffer,
    updated: bool,
    custom_scale: Option<(f32, f32)>,
    html_source: Option<AniSSSource>,
    draw_prog: DrawProgram,
}

fn create_new_texture(gl: &WebGl2RenderingContext) -> WebGlTexture {
    let texture = gl.create_texture().expect("Error: could not create a new texture");
    gl.bind_texture(GL::TEXTURE_2D, Some(&texture));
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_S, GL::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_T, GL::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MIN_FILTER, GL::LINEAR as i32);
    gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MAG_FILTER, GL::LINEAR as i32);
    gl.bind_texture(GL::TEXTURE_2D, None);
    texture
}

#[wasm_bindgen]
impl AniSS {
    #[wasm_bindgen(constructor)]
    pub fn new(gl: WebGl2RenderingContext) -> AniSS {
        console_error_panic_hook::set_once();
        if let Err(e) = console_log::init() {
            error!("Console Log Error {}", e);
        }
        let vertex_buffer = Float32Array::from(&VERTICES[..]).buffer();
        AniSS {
            programs: vec![],
            vbo: create_array_buffer(&gl, Some(&vertex_buffer)).expect("Error: vertex array buffer could not be created"),
            html_source: None,
            texture: Some(create_new_texture(&gl)),
            saved_textures: HashMap::new(),
            framebuffer: gl.create_framebuffer().expect("Error: frame buffer could not be created"),
            updated: false,
            custom_scale: None,
            draw_prog: Self::create_draw_program(&gl),
            gl,
        }
    }

    fn create_draw_program(gl: &WebGl2RenderingContext) -> DrawProgram {
        let program = gl.create_program().expect("Could not create draw program");
        let v_shader = gl.create_shader(GL::VERTEX_SHADER).expect("Failed to create a new vertex draw shader");
        program_wrapper::compile_shader(gl, &v_shader, include_str!("shaders/draw_vertex.glsl")).expect("Draw Vertex Compile");
        let f_shader = gl.create_shader(GL::FRAGMENT_SHADER).expect("Failed to create a new fragment draw shader");
        program_wrapper::compile_shader(gl, &f_shader, include_str!("shaders/draw_frag.glsl")).expect("Draw Frag Compile");
        gl.attach_shader(&program, &v_shader);
        gl.attach_shader(&program, &f_shader);
        gl.link_program(&program);
        if gl.get_program_parameter(&program, GL::LINK_STATUS).is_falsy() {
            panic!("{}", gl.get_program_info_log(&program).expect("Failed to link draw program"))
        }
        let (uniforms, attributes) = program_wrapper::get_uniforms_attributes(gl, &program)
            .expect("Failed to get uniforms and attributes from draw program");
        DrawProgram {
            program,
            uniforms,
            attributes
        }
    }

    fn get_canvas(&self) -> HtmlCanvasElement {
        JsValue::from(self.gl.canvas().unwrap())
            .dyn_into::<HtmlCanvasElement>()
            .expect("WebGl2RenderingContext was expected to come from canvas")
    }

    fn bind_tex_data(&self, texture: Option<&WebGlTexture>, width: i32, height: i32, texture_data: &[u8]) -> Result<(), JsValue> {
        let gl = &self.gl;
        gl.bind_texture(GL::TEXTURE_2D, texture);
        gl.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array(
            GL::TEXTURE_2D,
            0,
            GL::RGBA as i32,
            width,
            height,
            0,
            GL::RGBA,
            GL::UNSIGNED_BYTE,
            Some(texture_data)
        )?;
        gl.bind_texture(GL::TEXTURE_2D, None);
        Ok(())
    }

    fn set_empty_texture(&self, texture: Option<&WebGlTexture>, width: i32, height: i32) -> Result<(), JsValue> {
        let empty_pixels = vec![0 as u8; (width * height * 4) as usize];
        self.bind_tex_data(texture, width, height, empty_pixels.as_slice())
    }

    #[wasm_bindgen(js_name = resizeTextures)]
    pub fn resize_textures(&self) {
        if self.html_source.is_none() {
            return;
        }
        let native_size = {
            let s = self.get_source_size();
            (s.0 as f32, s.1 as f32)
        };
        self.set_empty_texture(self.texture.as_ref(), native_size.0 as i32, native_size.1 as i32).expect("Failed to create texture 2D");
        let mut tex_sizes: HashMap<String, (f32, f32)> = HashMap::new();
        tex_sizes.insert(String::from("NATIVE"), native_size);
        let mut final_size: (f32, f32) = native_size;
        for wrapper in &self.programs {
            let hooked_size = tex_sizes.get(&wrapper.hook).unwrap_or(&native_size);
            let scale = wrapper.scale.unwrap_or((1.0, 1.0));
            let new_size = (hooked_size.0 * scale.0, hooked_size.1 * scale.1);
            tex_sizes.insert(wrapper.save.clone(), new_size);
            if wrapper.save.as_str() == "HOOK" {
                tex_sizes.insert(String::from("NATIVE"), new_size);
                final_size = new_size;
            }
            self.set_empty_texture(self.saved_textures.get(&wrapper.save), new_size.0 as i32, new_size.1 as i32).expect("Failed to create texture 2D");
        }
        let canvas = self.get_canvas();
        canvas.set_width(final_size.0 as u32);
        canvas.set_height(final_size.1 as u32);
        info!("Resized textures");
    }

    #[wasm_bindgen(js_name = setScale)]
    pub fn set_scale(&mut self, scale: Option<f32>) {
        self.custom_scale = scale.and_then(|s| Some((s, s)) );
    }

    #[wasm_bindgen(js_name = setSource)]
    pub fn set_source(&mut self, element: HtmlElement) {
        info!("Setting source");
        match element.tag_name().to_lowercase().as_str() {
            "img" => {
                self.html_source = Some(AniSSSource::ImageSource(element.dyn_into::<HtmlImageElement>().expect("Error: expected img element for source could not convert to HtmlImageElement")));
                self.updated = false;
                self.resize_textures();
            },
            "canvas" => {
                self.html_source = Some(AniSSSource::CanvasSource(element.dyn_into::<HtmlCanvasElement>().expect("Error: expected canvas element for source could not convert to HtmlCanvasElement")));
                self.resize_textures();
            },
            "video" => {
                self.html_source = Some(AniSSSource::VideoSource(element.dyn_into::<HtmlVideoElement>().expect("Error: expected video element for source could not convert to HtmlVideoElement")));
                self.resize_textures();
            },
            _ => eprintln!("Not a valid source"),
        };
    }

    #[wasm_bindgen(js_name = addProgram)]
    pub fn add_program(&mut self, program: &str) -> bool {
        let mut all_success = true;
        for p in Program::read_str(program) {
            match ProgramWrapper::new(&self.gl, &p) {
                Ok(p) => {
                    if !self.saved_textures.contains_key(&p.save) {
                        let new_tex = create_new_texture(&self.gl);
                        self.saved_textures.insert(p.save.clone(), new_tex);
                    }
                    info!("Added new hook {} ({})", p.save, p.desc);
                    self.programs.push(p);
                },
                Err(e) => {
                    error!("Error: failed to create program\n{:?}", e);
                    all_success = false;
                },
            };
        }
        self.resize_textures();
        all_success
    }

    fn get_source_size(&self) -> (u32, u32) {
        if let Some(source) = &self.html_source {
            return match source {
                AniSSSource::ImageSource(src) => (src.width(), src.height()),
                AniSSSource::CanvasSource(src) => (src.width(), src.height()),
                AniSSSource::VideoSource(src) => (src.video_width(), src.video_height()),
            };
        }
        (0, 0)
    }

    fn update_texture(&mut self) {
        if let Some(source) = &self.html_source {
            let gl = &self.gl;
            if self.texture.is_none() {
                let new_tex = create_new_texture(&self.gl);
                self.texture = Some(new_tex);
            }
            gl.bind_texture(GL::TEXTURE_2D, self.texture.as_ref());
            match source {
                AniSSSource::ImageSource(src) => {
                    if self.updated {
                        return;
                    }
                    self.updated = true;
                    gl.tex_image_2d_with_u32_and_u32_and_html_image_element(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        src
                    ).unwrap();
                },
                AniSSSource::CanvasSource(src) => {
                    gl.tex_image_2d_with_u32_and_u32_and_html_canvas_element(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        src
                    ).unwrap();
                },
                AniSSSource::VideoSource(src) => {
                    gl.tex_image_2d_with_u32_and_u32_and_html_video_element(
                        GL::TEXTURE_2D,
                        0,
                        GL::RGBA as i32,
                        GL::RGBA,
                        GL::UNSIGNED_BYTE,
                        src
                    ).unwrap();
                },
            }
            gl.bind_texture(GL::TEXTURE_2D, None);
        } else {
            eprintln!("No source set, nothing to render");
        }
    }

    pub fn render(&mut self) -> bool {
        match self.html_source {
            Some(AniSSSource::ImageSource(_)) if self.updated => { return false; },
            _ => {},
        };
        self.update_texture();
        if self.texture.is_none() {
            return false;
        }
        let mut native_size = {
            let s = self.get_source_size();
            (s.0 as f32, s.1 as f32)
        };
        if native_size.0 <= 0.0 || native_size.1 <= 0.0 {
            return false;
        }
        let gl = &self.gl;
        gl.disable(GL::DEPTH_TEST);
        gl.disable(GL::STENCIL_TEST);
        gl.viewport(
            0, 0, native_size.0 as i32, native_size.1 as i32
        );
        gl.bind_framebuffer(GL::FRAMEBUFFER, Some(&self.framebuffer));
        let mut tex_sizes: HashMap<String, (f32, f32)> = HashMap::new();
        let mut wrote_hook = false;
        for program in &self.programs {
            let scale = program.scale
                .and_then(|s| Some(self.custom_scale.unwrap_or(s)) )
                .unwrap_or((1.0, 1.0));
            let (hooked_tex, tex_size): (Option<&WebGlTexture>, (f32, f32)) = match program.hook.as_str() {
                "NATIVE" if wrote_hook => (self.saved_textures.get("HOOK"), *tex_sizes.get("HOOK").unwrap_or(&native_size)),
                "NATIVE" if !wrote_hook => (self.texture.as_ref(), native_size),
                _ => (self.saved_textures.get(&program.hook), *tex_sizes.get(&program.hook).unwrap_or(&native_size)),
            };
            let tex_size = (tex_size.0 * scale.0, tex_size.1 * scale.1);
            gl.viewport(
                0, 0, tex_size.0 as i32, tex_size.1 as i32
            );
            let save_tex: Option<&WebGlTexture> = self.saved_textures.get(&program.save);
            if program.save.as_str() == "HOOK" {
                native_size = tex_size;
                wrote_hook = true;
            }
            gl.framebuffer_texture_2d(GL::FRAMEBUFFER, GL::COLOR_ATTACHMENT0, GL::TEXTURE_2D, save_tex, 0);
            gl.use_program(Some(&program.program));
            if !program.attributes.contains_key("aPos") {
                eprintln!("Render pass missing position attribute, skipping");
                continue;
            }
            bind_attribute(gl, Some(&self.vbo), program.attributes["aPos"], 2);
            bind_tex(gl, hooked_tex, 0);
            gl.uniform1i(program.uniforms.get("_HOOKED_tex"), 0);
            gl.uniform2f(program.uniforms.get("HOOKED_size"), tex_size.0, tex_size.1);
            gl.uniform2f(program.uniforms.get("HOOKED_pt"), 1.0 / tex_size.0, 1.0 / tex_size.1);
            tex_sizes.insert(program.save.clone(), tex_size);
            let mut i = 1;
            for binding in &program.bind {
                if binding == "HOOKED" {
                    continue;
                }
                let bind_size = match tex_sizes.get(binding) {
                    Some(s) => *s,
                    None => tex_size,
                };
                bind_tex(gl, self.saved_textures.get(binding), i as u32 + 1);
                gl.uniform1i(program.uniforms.get(&format!("_{}_tex", binding)), i as i32 + 1);
                gl.uniform2f(program.uniforms.get(&format!("{}_size", binding)), bind_size.0, bind_size.1);
                gl.uniform2f(program.uniforms.get(&format!("{}_pt", binding)), 1.0 / bind_size.0, 1.0 / bind_size.1);
                i += 1;
            }
            gl.draw_arrays(GL::TRIANGLES, 0, 6);
        }
        let render_texture: Option<&WebGlTexture> = if self.saved_textures.contains_key("HOOK") && wrote_hook {
            self.saved_textures.get("HOOK")
        } else {
            self.texture.as_ref()
        };
        gl.bind_framebuffer(GL::FRAMEBUFFER, None);
        gl.use_program(Some(&self.draw_prog.program));
        bind_attribute(gl, Some(&self.vbo), self.draw_prog.attributes["aPos"], 2);
        bind_tex(gl, render_texture, 0);
        gl.uniform1i(self.draw_prog.uniforms.get("drawTexture"), 0);
        gl.draw_arrays(GL::TRIANGLES, 0, 6);
        true
    }
}
