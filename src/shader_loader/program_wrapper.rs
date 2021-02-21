extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;

use wasm_bindgen::prelude::*;
use web_sys::{WebGlRenderingContext as GL, WebGlShader, WebGlProgram, WebGlRenderingContext, WebGlUniformLocation, WebGlActiveInfo};
use std::error::Error;
use std::fs;
use super::Program;
use std::collections::HashMap;

/// ProgramWrapper is a container for a native [WebGlProgram] that has been compiled with the
/// correct shaders built using the [Program] struct and [ProgramWrapper::new].
#[wasm_bindgen]
pub struct ProgramWrapper {
    pub scale: Option<f32>,
    pub bind: Vec<String>,
    pub save: String,
    pub hook: String,
    #[wasm_bindgen(skip)]
    pub program: WebGlProgram,
    #[wasm_bindgen(skip)]
    pub uniforms: HashMap<String, WebGlUniformLocation>,
    #[wasm_bindgen(skip)]
    pub attributes: HashMap<String, u32>,
}

pub fn get_uniforms_attributes(gl_program: &WebGlProgram) -> (HashMap<String, WebGlUniformLocation>, HashMap<String, u32>) {
    let mut uniforms: HashMap<String, WebGlUniformLocation> = HashMap::new();
    let mut attributes: HashMap<String, u32> = HashMap::new();
    let num_attributes: i32 = gl
        .get_program_parameter(&gl_program, GL::ACTIVE_ATTRIBUTES)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&gl_program)
            .unwrap_or("Failed to get program parameter active attributes")
        )? as i32;
    for i in 0..num_attributes {
        let attribute: WebGlActiveInfo = gl
            .get_active_attrib(&gl_program, i as u32)
            .ok_or(gl.get_program_info_log(&gl_program).unwrap_or(format!("Failed to get attribute {}", i)))?;
        let loc = {
            let loc: i32 = gl.get_attrib_location(&gl_program, attribute.name().as_ref());
            if loc == -1 {
                Err(format!("Could not get attribute location {}", i))
            }
            Ok(loc as u32)
        }?;
        attributes.insert(attribute.name(), loc);
    }
    let num_uniforms: i32 = gl
        .get_program_parameter(&gl_program, GL::ACTIVE_UNIFORMS)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&gl_program)
            .unwrap_or("Failed to get number of uniforms")
        )? as i32;
    for i in 0..num_uniforms {
        let uniform: WebGlActiveInfo = gl
            .get_active_uniform(&gl_program, i as u32)
            .ok_or(gl.get_program_info_log(&gl_program).unwrap_or(format!("Failed to get uniform {}", i)))?;
        uniforms.insert(
            uniform.name(),
            gl.get_uniform_location(&gl_program, uniform.name().as_ref()).ok_or(format!("Could not get uniform location {}", i))?
        );
    }
    (uniforms, attributes)
}

/// Given a [WebGlRenderingContext] and new shader with source, compiles the shader. Returns a
/// result, unit if successful, otherwise error.
///
/// # Arguments
/// * `gl` - A [WebGlRenderingContext] reference to compile to
/// * `shader` - The actual shader being compiled
/// * `source` - The source to compile the shader with
pub fn compile_shader(gl: &WebGlRenderingContext, shader: &WebGlShader, src: &str) -> Result<(), Box<dyn Error>> {
    gl.shader_source(&shader, src);
    gl.compile_shader(&shader);
    if gl.get_shader_parameter(&shader, GL::COMPILE_STATUS).is_falsy() {
        Err(gl.get_shader_info_log(&shader).unwrap_or_else("Failed to compile shader")?)
    }
    Ok(())
}

/// Implementation for the ProgramWrapper struct that holds all the information for a single hook
/// to pass in the rendering flow
impl ProgramWrapper {
    /// Given a [WebGlRenderingContext] and parsed program shader, creates a new ProgramWrapper
    /// with associated vertex/fragment shaders and returns errors
    ///
    /// # Arguments
    /// * `gl` - A [WebGlRenderingContext] usually from a canvas element
    /// * `program` - Parsed program read from string via [Program::read_str]
    pub fn new(gl: &WebGlRenderingContext, program: &Program) -> Result<Self, Box<dyn Error>> {
        let gl_program: WebGlprogram = gl.create_program().ok_or("Error creating program")?;
        let vertex_shader: WebGlShader = Self::create_shader(gl, GL::VERTEX_SHADER, program)?;
        let fragment_shader: WebGlShader = Self::create_shader(gl, GL::FRAGMENT_SHADER, program)?;
        gl.attach_shader(&gl_program, &vertex_shader);
        gl.attach_shader(&gl_program, &fragment_shader);
        gl.link_program(&gl_program);
        if gl.get_program_parameter(&gl_program, GL::LINK_STATUS).is_falsy() {
            Err(gl.get_program_info_log(&gl_program).unwrap_or_else("Failed to link program")?)
        }
        let (uniforms, attributes) = get_uniforms_attributes(&gl_program);
        Ok(ProgramWrapper {
            scale: program.scale,
            bind: program.bind.clone(),
            save: program.save.clone(),
            hook: program.hook.clone(),
            program: gl_program,
            uniforms,
            attributes
        })
    }

    /// Creates a WebGlShader given a shader type and program
    ///
    /// # Arguments
    /// * `gl` - The WebGlRenderingContext
    /// * `shader_type` - The type of the shader (one of [GL::VERTEX_SHADER] or [GL::FRAGMENT_SHADER])
    /// * `program` - The program to build the shader from
    ///
    /// [GL]: WebGlRenderingContext
    pub fn create_shader(
        gl: &WebGlRenderingContext,
        shader_type: u32,
        program: &Program) -> Result<WebGlShader, Box<dyn Error>> {
        let shader = gl
            .create_shader(shader_type)
            .ok_or(format!("Shader of type {} could not be initialized", shader_type))?;
        match shader_type {
            GL::VERTEX_SHADER => Self::compile_vertex_shader(gl, shader, program),
            GL::FRAGMENT_SHADER => Self::compile_fragment_shader(gl, shader, program, program.program.as_str()),
            _ => Err(format!("Shader type {} is unrecognized", shader_type))
        }
        shader
    }

    fn compile_vertex_shader(
        gl: &WebGlRenderingContext,
        shader: &WebGlShader,
        program: &Program) -> Result<(), Box<dyn Error>> {
        let mut src = String::from_utf8(
            fs::read("vertex_template.glsl")?
        )?;
        let mut bind_mount = String::new();
        let mut bind: String = String::new();
        for binding in program.bind {
            bind_mount.push_str(format!("varying vec2 {}_pos;\n", binding).as_str());
            bind.push_str(format!("{}_pos = aPos;\n", binding).as_str());
        }
        src.replace("//!BINDMOUNT", bind_mount.as_str());
        src.replace("//!BIND", bind.as_str());
        compile_shader(gl, shader, src.as_str())
    }

    fn compile_fragment_shader(
        gl: &WebGlRenderingContext,
        shader: &WebGlShader,
        program: &Program,
        hook: &str) -> Result<(), Box<dyn Error>> {
        let mut src = String::from_utf8(
            fs::read("vertex_template.glsl")?
        )?;
        let mut hook_mount = String::new();
        let mut hook_macros = String::new();
        for binding in program.bind {
            hook_mount.push_str(format!("uniform vec2 {b}_pt;\nuniform vec2 {b}_size;\nuniform sampler2D _{b}_tex;\nvarying vec2 {b}_pos;\n", b = binding).as_str());
            hook_macros.push_str(format!("vec4 {b}_tex(vec2 pos) {{ return texture2D(_{b}_tex, pos); }}\n", b = binding).as_str());
        }
        hook_mount.push_str(hook_macros.as_str()).as_str();
        src.replace("//!HOOKMOUNT", hook_mount.as_str());
        src.replace("//!HOOK", hook);
        compile_shader(gl, shader, src.as_str())
    }
}