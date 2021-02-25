extern crate wasm_bindgen;
extern crate js_sys;
extern crate itertools;
extern crate log;

use wasm_bindgen::prelude::*;
use std::{str, str::FromStr};
use itertools::put_back;
use log::error;

/// Program struct holds all the info of a single hook.
#[wasm_bindgen]
#[derive(Debug)]
pub struct Program {
    #[wasm_bindgen(skip)]
    pub program: String,
    #[wasm_bindgen(skip)]
    pub save: String,
    #[wasm_bindgen(skip)]
    pub hook: String,
    #[wasm_bindgen(skip)]
    pub desc: Option<String>,
    #[wasm_bindgen(skip)]
    pub bind: Vec<String>,
    #[wasm_bindgen(skip)]
    pub scale: Option<(f32, f32)>,
}

/// Shader hook program implementations to parse a GLSL shader string
impl Program {
    fn parse_hook(block: &mut itertools::PutBack<str::Lines>) -> Result<Program, String> {
        let mut metadata_context = true;
        let mut save = String::from("HOOK");
        let mut desc: Option<String> = None;
        let mut hook = String::new();
        let mut binded: Vec<String> = vec![];
        let mut prog = String::new();
        let mut scale_w: Option<f32> = None;
        let mut scale_h: Option<f32> = None;
        while let Some(line) = block.next() {
            if metadata_context {
                let line = line.trim();
                if line.starts_with("//!") {
                    if line.len() <= 3 {
                        continue
                    }
                    let md = String::from(line[3..].trim());
                    if md.starts_with("SAVE") && md.len() > 4 {
                        save = String::from(md[4..].trim());
                    } else if md.starts_with("DESC") && md.len() > 4 {
                        desc.get_or_insert_with(String::new).push_str(&md[4..].trim());
                    } else if md.starts_with("HOOK") && md.len() > 4 {
                        hook.push_str(md[4..].trim());
                    } else if md.starts_with("BIND") && md.len() > 4 {
                        binded.push(String::from(md[4..].trim()));
                    } else if md.starts_with("WIDTH") && md.len() > 5 {
                        if let Some(s) = md[5..]
                            .split(" ")
                            .find(|x| f32::from_str(x).is_ok()) {
                            scale_w = f32::from_str(s).ok();
                        }
                    } else if md.starts_with("HEIGHT") && md.len() > 6 {
                        if let Some(s) = md[6..]
                            .split(" ")
                            .find(|x| f32::from_str(x).is_ok()) {
                            scale_h = f32::from_str(s).ok();
                        }
                    }
                } else {
                    metadata_context = false;
                }
            }
            if !metadata_context {
                if line.starts_with("//!") {
                    block.put_back(line);
                    break;
                }
                prog.push_str(format!("{}\n", line).as_str());
            }
        }
        if hook.len() == 0 {
            return Err(String::from("HOOK is required for shader"));
        } else if prog.trim().len() == 0 {
            return Err(String::from("hook block body is empty, rejected"));
        }
        if scale_w.is_some() && scale_h.is_none() {
            scale_h = Some(1.0);
        } else if scale_w.is_none() && scale_h.is_some() {
            scale_w = Some(1.0);
        }
        let scale: Option<(f32, f32)> = match (scale_w, scale_h) {
            (Some(w), Some(h)) => Some((w, h)),
            _ => None,
        };
        Ok(Program {
            program: prog,
            bind: binded,
            save, hook, desc, scale,
        })
    }

    /// Reads a string in the form of an MPV GLSL shader file with hooks only and returns a vector
    /// of programs that it parses
    ///
    /// # Arguments
    /// * `read_str` - The raw GLSL shader file
    ///
    /// # Examples
    /// ```
    /// let shader = r#"
    /// //!DESC Identity Shader
    /// //!HOOK NATIVE
    /// vec4 hook {
    ///     return HOOKED_tex(HOOKED_pos);
    /// }
    /// "#;
    /// let programs = Program::read_str(&shader);
    /// ```
    pub fn read_str(shader: &str) -> Vec<Program> {
        let mut lines = put_back(shader.lines());
        let mut programs = vec![];
        while let Some(line) = lines.next() {
            if line.trim().starts_with("//!") {
                lines.put_back(line);
                match Self::parse_hook(&mut lines) {
                    Ok(p) => programs.push(p),
                    Err(err) => {
                        error!("Error: Failed to parse program starting on line: {}\n{:?}", line, err);
                    }
                };
            }
        }
        programs
    }
}
