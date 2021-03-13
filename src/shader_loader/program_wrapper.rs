extern crate wasm_bindgen;
extern crate web_sys;
extern crate js_sys;
extern crate log;

use wasm_bindgen::prelude::*;
use web_sys::{WebGl2RenderingContext as GL, WebGlShader, WebGlProgram, WebGl2RenderingContext, WebGlUniformLocation, WebGlActiveInfo};
use std::{error::Error, error, fmt};
use super::Program;
use std::collections::HashMap;
use log::error;

#[derive(Debug, Clone)]
enum WrapperError {
    CompileError,
    ShaderTypeError,
    ShaderCompileError,
    UniformAttributes,
}

impl error::Error for WrapperError {}

impl fmt::Display for WrapperError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            WrapperError::CompileError => write!(f, "Wrapper error encountered (compile)"),
            WrapperError::ShaderTypeError => write!(f, "Wrapper error encountered (shader type unrecognized)"),
            WrapperError::ShaderCompileError => write!(f, "Wrapper error encountered (shader compile)"),
            WrapperError::UniformAttributes => write!(f, "Wrapper error encountered (uniform and attributes)")
        }
    }
}

/// ProgramWrapper is a container for a native [WebGlProgram] that has been compiled with the
/// correct shaders built using the [Program] struct and [ProgramWrapper::new].
#[wasm_bindgen]
#[derive(Debug)]
pub struct ProgramWrapper {
    #[wasm_bindgen(skip)]
    pub scale: Option<(f32, f32)>,
    #[wasm_bindgen(skip)]
    pub bind: Vec<String>,
    #[wasm_bindgen(skip)]
    pub save: String,
    #[wasm_bindgen(skip)]
    pub hook: String,
    #[wasm_bindgen(skip)]
    pub desc: String,
    #[wasm_bindgen(skip)]
    pub program: WebGlProgram,
    #[wasm_bindgen(skip)]
    pub uniforms: HashMap<String, WebGlUniformLocation>,
    #[wasm_bindgen(skip)]
    pub attributes: HashMap<String, u32>,
}

pub fn get_uniforms_attributes(
    gl: &WebGl2RenderingContext,
    gl_program: &WebGlProgram)
    -> Result<(HashMap<String, WebGlUniformLocation>, HashMap<String, u32>), String> {
    let mut uniforms: HashMap<String, WebGlUniformLocation> = HashMap::new();
    let mut attributes: HashMap<String, u32> = HashMap::new();
    let num_attributes: i32 = gl
        .get_program_parameter(&gl_program, GL::ACTIVE_ATTRIBUTES)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&gl_program)
            .unwrap_or(String::from("Failed to get program parameter active attributes"))
        )? as i32;
    for i in 0..num_attributes {
        let attribute: WebGlActiveInfo = gl
            .get_active_attrib(&gl_program, i as u32)
            .ok_or(
                gl
                    .get_program_info_log(&gl_program)
                    .unwrap_or(format!("Failed to get attribute {}", i))
            )?;
        let loc = {
            let loc: i32 = gl.get_attrib_location(&gl_program, attribute.name().as_ref());
            if loc == -1 {
                return Err(format!("Could not get attribute location {}", i));
            }
            loc as u32
        };
        attributes.insert(attribute.name(), loc);
    }
    let num_uniforms: i32 = gl
        .get_program_parameter(&gl_program, GL::ACTIVE_UNIFORMS)
        .as_f64()
        .ok_or(gl
            .get_program_info_log(&gl_program)
            .unwrap_or(String::from("Failed to get number of uniforms"))
        )? as i32;
    for i in 0..num_uniforms {
        let uniform: WebGlActiveInfo = gl
            .get_active_uniform(&gl_program, i as u32)
            .ok_or(gl
                .get_program_info_log(&gl_program)
                .unwrap_or(format!("Failed to get uniform {}", i))
                .as_str()
            )?;
        uniforms.insert(
            uniform.name(),
            gl
                .get_uniform_location(&gl_program, uniform.name().as_ref())
                .ok_or(format!("Could not get uniform location {}", i))?
        );
    }
    Ok((uniforms, attributes))
}

/// Given a [WebGl2RenderingContext] and new shader with source, compiles the shader. Returns a
/// result, unit if successful, otherwise error.
///
/// # Arguments
/// * `gl` - A [WebGl2RenderingContext] reference to compile to
/// * `shader` - The actual shader being compiled
/// * `source` - The source to compile the shader with
pub fn compile_shader(gl: &WebGl2RenderingContext, shader: &WebGlShader, src: &str) -> Result<(), String> {
    gl.shader_source(&shader, src);
    gl.compile_shader(&shader);
    if gl.get_shader_parameter(&shader, GL::COMPILE_STATUS).is_falsy() {
        return Err(gl.get_shader_info_log(&shader).unwrap_or(String::from("Failed to compile shader")));
    }
    Ok(())
}

/// Implementation for the ProgramWrapper struct that holds all the information for a single hook
/// to pass in the rendering flow
impl ProgramWrapper {
    /// Given a [WebGl2RenderingContext] and parsed program shader, creates a new ProgramWrapper
    /// with associated vertex/fragment shaders and returns errors
    ///
    /// # Arguments
    /// * `gl` - A [WebGl2RenderingContext] usually from a canvas element
    /// * `program` - Parsed program read from string via [Program::read_str]
    pub fn new(gl: &WebGl2RenderingContext, program: &Program) -> Result<ProgramWrapper, Box<dyn Error>> {
        let gl_program: WebGlProgram = gl.create_program().ok_or(Box::new(WrapperError::CompileError))?;
        let vertex_shader: WebGlShader = Self::create_shader(gl, GL::VERTEX_SHADER, program)?;
        let fragment_shader: WebGlShader = Self::create_shader(gl, GL::FRAGMENT_SHADER, program)?;
        gl.attach_shader(&gl_program, &vertex_shader);
        gl.attach_shader(&gl_program, &fragment_shader);
        gl.link_program(&gl_program);
        if gl.get_program_parameter(&gl_program, GL::LINK_STATUS).is_falsy() {
            error!("Program Wrapper Link Error: {}", gl.get_program_info_log(&gl_program).unwrap_or(String::from("Failed to link program")));
            eprintln!("{}", gl.get_program_info_log(&gl_program).unwrap_or(String::from("Failed to link program")));
            return Err(Box::new(WrapperError::CompileError));
        }
        let (uniforms, attributes) = get_uniforms_attributes(gl, &gl_program)
            .map_err(|msg| {
                eprintln!("{}", msg);
                WrapperError::UniformAttributes
            })?;
        Ok(ProgramWrapper {
            scale: program.scale,
            bind: program.bind.clone(),
            save: program.save.clone(),
            hook: program.hook.clone(),
            desc: program.desc.clone().unwrap_or(String::new()).clone(),
            program: gl_program,
            uniforms,
            attributes
        })
    }

    /// Creates a WebGlShader given a shader type and program
    ///
    /// # Arguments
    /// * `gl` - The WebGl2RenderingContext
    /// * `shader_type` - The type of the shader (one of [GL::VERTEX_SHADER] or [GL::FRAGMENT_SHADER])
    /// * `program` - The program to build the shader from
    ///
    /// [GL]: WebGl2RenderingContext
    pub fn create_shader(
        gl: &WebGl2RenderingContext,
        shader_type: u32,
        program: &Program) -> Result<WebGlShader, Box<dyn Error>> {
        let shader = gl
            .create_shader(shader_type)
            .ok_or(format!("Shader of type {} could not be initialized", shader_type))?;
        match shader_type {
            GL::VERTEX_SHADER => Self::compile_vertex_shader(gl, &shader, program)?,
            GL::FRAGMENT_SHADER => Self::compile_fragment_shader(gl, &shader, program, program.program.as_str())?,
            _ => {
                eprintln!("Shader type {} is unrecognized", shader_type);
                return Err(Box::new(WrapperError::ShaderTypeError))
            },
        };
        Ok(shader)
    }

    fn compile_vertex_shader(
        gl: &WebGl2RenderingContext,
        shader: &WebGlShader,
        program: &Program) -> Result<(), Box<dyn Error>> {
        let mut src = String::from(include_str!("../shaders/vertex_template.glsl"));
        let mut bind_mount = String::new();
        let mut bind: String = String::new();
        for binding in &program.bind {
            if binding == "HOOKED" {
                continue;
            }
            bind_mount.push_str(format!("out vec2 {}_pos;\n", binding).as_str());
            bind.push_str(format!("{}_pos = vec2((aPos + 1.0) / 2.0);\n", binding).as_str());
        }
        src = src.replace("//!BINDMOUNT", bind_mount.as_str()).replace("//!BIND", bind.as_str());
        compile_shader(gl, shader, src.as_str())
            .map_err(|msg| {
                error!("Shader Compile Error: {}\nVertex Shader: {}", msg, src);
                Box::new(WrapperError::ShaderCompileError) as _
            })
    }

    fn compile_fragment_shader(
        gl: &WebGl2RenderingContext,
        shader: &WebGlShader,
        program: &Program,
        hook: &str) -> Result<(), Box<dyn Error>> {
        let mut src = String::from(include_str!("../shaders/fragment_template.glsl"));
        let mut hook_mount = String::new();
        let mut hook_macros = String::new();
        for binding in &program.bind {
            if binding == "HOOKED" {
                continue;
            }
            hook_mount.push_str(format!("uniform vec2 {b}_pt;\nuniform vec2 {b}_size;\nuniform sampler2D _{b}_tex;\nin vec2 {b}_pos;\n", b = binding).as_str());
            hook_macros.push_str(format!("vec4 {b}_tex(vec2 pos) {{ return texture(_{b}_tex, pos); }}\nvec4 {b}_texOff(vec2 pos) {{ return texture(_{b}_tex, pos * {b}_pt); }}\n", b = binding).as_str());
        }
        hook_mount.push_str(hook_macros.as_str());
        src = src.replace("//!HOOKMOUNT", hook_mount.as_str())
            .replace("//!HOOK", hook);
        compile_shader(gl, shader, src.as_str())
            .map_err(|msg| {
                error!("Shader Compile Error: {}\nFragment Shader: {}", msg, src);
                Box::new(WrapperError::ShaderCompileError) as _
            })
    }
}