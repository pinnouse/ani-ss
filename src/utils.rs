extern crate wasm_bindgen;
extern crate web_sys;

use wasm_bindgen::prelude::*;
use web_sys::{WebGlBuffer,WebGlRenderingContext,WebGlShader,WebGlTexture,WebGlProgram,
              WebGlActiveInfo,WebGlFramebuffer,WebGlUniformLocation,HtmlVideoElement};
use std::collections::HashMap;

#[wasm_bindgen]
pub struct ProgramWrapper {
    pub program: WebGlProgram,
    #[wasm_bindgen(skip)]
    pub uniforms: HashMap<String, WebGlUniformLocation>,
    #[wasm_bindgen(skip)]
    pub attributes: HashMap<String, u32>,
}

pub fn create_shader(gl: &WebGlRenderingContext, shader_type: u32, source: &str)
                     -> Result<WebGlShader, String> {
    let shader: WebGlShader = gl.create_shader(shader_type).ok_or(String::from("Error creating shader"))?;
    gl.shader_source(&shader, source);
    gl.compile_shader(&shader);
    if gl.get_shader_parameter(&shader, WebGlRenderingContext::COMPILE_STATUS).is_falsy() {
        return Err(gl.get_shader_info_log(&shader).unwrap_or(String::from("Failed to get shader parameter")))
    }
    Ok(shader)
}

pub fn create_program(gl: &WebGlRenderingContext, vertex_source: &str, fragment_source: &str)
                      -> Result<ProgramWrapper, String> {
    let program: WebGlProgram = gl.create_program().ok_or(String::from("Error creating program"))?;
    let vertex_shader: WebGlShader = create_shader(gl, WebGlRenderingContext::VERTEX_SHADER, vertex_source)?;
    let fragment_shader: WebGlShader = create_shader(gl, WebGlRenderingContext::FRAGMENT_SHADER, fragment_source)?;
    gl.attach_shader(&program, &vertex_shader);
    gl.attach_shader(&program, &fragment_shader);
    gl.link_program(&program);
    if gl.get_program_parameter(&program, WebGlRenderingContext::LINK_STATUS).is_falsy() {
        return Err(gl.get_program_info_log(&program).unwrap_or(String::from("Failed to get program parameter")))
    }
    let wrapper: &mut ProgramWrapper = &mut ProgramWrapper{
        program,
        uniforms: HashMap::new(),
        attributes: HashMap::new(),
    };
    let num_attributes: i32 = gl
        .get_program_parameter(&program, WebGlRenderingContext::ACTIVE_ATTRIBUTES)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&program)
            .unwrap_or(String::from("Failed to get program parameter active attributes"))
        )? as i32;
    for i in 0..num_attributes {
        let attribute: WebGlActiveInfo = gl
            .get_active_attrib(&program, i as u32)
            .ok_or(gl.get_program_info_log(&program).unwrap_or(String::from("Failed to get attribute")))?;
        wrapper.attributes[&attribute.name()] = gl
            .get_attrib_location(
                &program,
                attribute.name().as_ref()
            ) as u32;
    }
    let num_uniforms: i32 = gl
        .get_program_parameter(&program, WebGlRenderingContext::ACTIVE_UNIFORMS)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&program)
            .unwrap_or(String::from("Failed to get program parameter active uniforms"))
        )? as i32;
    for i in 0..num_uniforms {
        let uniform: WebGlActiveInfo = gl
            .get_active_uniform(&program, i as u32)
            .ok_or(gl.get_program_info_log(&program).unwrap_or(String::from("Failed to get uniform")))?;
        wrapper.uniforms[&uniform.name()] = gl
            .get_uniform_location(
                &program,
                uniform.name().as_ref()
            ).unwrap();
    }
    Ok(ProgramWrapper{
        program,
        uniforms: wrapper.uniforms.clone(),
        attributes: wrapper.attributes.clone()
    })
}

pub fn create_texture(gl: &WebGlRenderingContext, filter: i32, data: Vec<u8>, width: u32, height: u32)
                      -> Result<WebGlTexture, String> {
    let texture: WebGlTexture = gl.create_texture().ok_or(String::from("Failed to create texture"))?;
    gl.bind_texture(WebGlRenderingContext::TEXTURE_2D, Some(&texture));
    gl.tex_parameteri(WebGlRenderingContext::TEXTURE_2D, WebGlRenderingContext::TEXTURE_WRAP_S, WebGlRenderingContext::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(WebGlRenderingContext::TEXTURE_2D, WebGlRenderingContext::TEXTURE_WRAP_T, WebGlRenderingContext::CLAMP_TO_EDGE as i32);
    gl.tex_parameteri(WebGlRenderingContext::TEXTURE_2D, WebGlRenderingContext::TEXTURE_MIN_FILTER, filter);
    gl.tex_parameteri(WebGlRenderingContext::TEXTURE_2D, WebGlRenderingContext::TEXTURE_MAG_FILTER, filter);
    gl.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array(
        WebGlRenderingContext::TEXTURE_2D,
        0,
        WebGlRenderingContext::RGBA as i32,
        width as i32,
        height as i32,
        0,
        WebGlRenderingContext::RGBA,
        WebGlRenderingContext::UNSIGNED_BYTE,
        Some(data.as_slice())
    );
    gl.bind_texture(WebGlRenderingContext::TEXTURE_2D, None);
    Ok(texture)
}

pub fn bind_texture(gl: &WebGlRenderingContext, texture: Option<&WebGlTexture>, unit: u32) {
    gl.active_texture(WebGlRenderingContext::TEXTURE0 + unit);
    gl.bind_texture(WebGlRenderingContext::TEXTURE_2D, texture);
}

pub fn update_texture(gl: &WebGlRenderingContext, texture: Option<&WebGlTexture>, src: &HtmlVideoElement) {
    gl.bind_texture(WebGlRenderingContext::TEXTURE_2D, texture);
    gl.tex_image_2d_with_u32_and_u32_and_video(
        WebGlRenderingContext::TEXTURE_2D,
        0,
        WebGlRenderingContext::RGBA as i32,
        WebGlRenderingContext::RGBA,
        WebGlRenderingContext::UNSIGNED_BYTE, src);
}

pub fn create_buffer(gl: &WebGlRenderingContext, data: Vec<u8>) -> Result<WebGlBuffer, String> {
    let buffer: WebGlBuffer = gl.create_buffer().ok_or(String::from("Failed to create buffer"))?;
    gl.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(&buffer));
    gl.buffer_data_with_u8_array(WebGlRenderingContext::ARRAY_BUFFER, data.as_slice(), WebGlRenderingContext::STATIC_DRAW);
    Ok(buffer)
}

pub fn bind_attribute(gl: &WebGlRenderingContext, buffer: &WebGlBuffer, attribute: u32, num_components: i32) {
    gl.bind_buffer(WebGlRenderingContext::ARRAY_BUFFER, Some(buffer));
    gl.enable_vertex_attrib_array(attribute);
    gl.vertex_attrib_pointer_with_i32(attribute, num_components, WebGlRenderingContext::FLOAT, false, 0, 0);
}

pub fn bind_fb(gl: &WebGlRenderingContext, framebuffer: Option<&WebGlFramebuffer>, texture: Option<&WebGlTexture>) {
    gl.bind_framebuffer(WebGlRenderingContext::FRAMEBUFFER, framebuffer);
    if texture.is_some() {
        gl.framebuffer_texture_2d(WebGlRenderingContext::FRAMEBUFFER, WebGlRenderingContext::COLOR_ATTACHMENT0, WebGlRenderingContext::TEXTURE_2D, texture, 0);
    }
}
