use crate::shader_loader::{ProgramWrapper, Program};
use web_sys::{WebGlRenderingContext, HtmlElement, HtmlCanvasElement, HtmlImageElement, HtmlVideoElement, WebGlTexture, WebGlFramebuffer};
use js_sys::{ArrayBuffer, Float32Array};
use std::collections::HashMap;

static VERTICES: ArrayBuffer = Float32Array::from([
    0., 1., //TOP LEFT
    0., 0., //BOTTOM LEFT
    1., 1., //TOP RIGHT
    1., 1., //TOP RIGHT
    0., 0., //BOTTOM LEFT
    1., 0.  //BOTTOM RIGHT
]).buffer();

#[wasm_bindgen]
pub struct AniSS {
    pub gl: WebGlRenderingContext,
    pub programs: Vec<ProgramWrapper>,
    pub html_source: Option<HtmlElement>,
    pub texture: Option<WebGlTexture>,
    pub framebuffer: WebGlFramebuffer,
    pub updated: bool,
    pub custom_scale: Option<f32>,
}

impl AniSS {
    pub fn new(gl: WebGlRenderingContext) -> Self {
        AniSS {
            programs: vec![],
            html_source: None,
            texture: None,
            framebuffer: &gl.create_framebuffer().expect("Error: frame buffer could not be created"),
            updated: false,
            custom_scale: None,
            gl,
        }
    }

    pub fn create_new_texture(&mut self) {
        let gl = &self.gl;
        self.texture = Some(gl.create_texture().expect("Error: could not create a new texture"));
        gl.bind_texture(GL::TEXTURE_2D, self.texture.as_ref());
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_S, GL::CLAMP_TO_EDGE as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_WRAP_T, GL::CLAMP_TO_EDGE as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MIN_FILTER, GL::LINEAR as i32);
        gl.tex_parameteri(GL::TEXTURE_2D, GL::TEXTURE_MAG_FILTER, GL::LINEAR as i32);
        gl.bind_texture(GL::TEXTURE_2D, None);
    }

    pub fn set_scale(&mut self, scale: f32) {
        self.custom_scale = Some(scale);
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
        for p in Program::read_file(program) {
            match ProgramWrapper::new(self.gl, &p) {
                Ok(p) => self.programs.push(p),
                Err(e) => eprintln!("Error: failed to create program\n{:?}", e),
            }
        }
    }

    pub fn get_size(&self) -> (u32, u32) {
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
                self.create_new_texture();
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
        }
    }

    pub fn render(&mut self) {
        if self.texture.is_none() {
            return;
        }
        let gl = &self.gl;
        let saved: HashMap<String, ProgramWrapper> = HashMap::new();
        for program in self.programs {

        }
    }
}