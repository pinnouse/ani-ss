extern crate web_sys;

use web_sys::WebGlProgram;
use self::web_sys::WebGlUniformLocation;
use std::collections::HashMap;

pub mod read_shaders;
pub mod build_program;

#[wasm_bindgen]
pub struct Program {
    pub program: String,
    pub save: String,
    pub hook: String,
    pub desc: String,
    pub bind: Vec<String>,
    pub scale: Option<f32>,
}

#[wasm_bindgen]
pub struct ProgramWrapper {
    pub scale: Option<f32>,
    pub bind: Vec<String>,
    #[wasm_bindgen(skip)]
    pub program: WebGlProgram,
    #[wasm_bindgen(skip)]
    pub uniforms: HashMap<String, WebGlUniformLocation>,
    #[wasm_bindgen(skip)]
    pub attributes: HashMap<String, u32>,
}