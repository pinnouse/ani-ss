extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use std::str;
use std::iter;
use std::str::FromStr;
use std::error::Error;

/// Program struct holds all the info of a single hook.
#[wasm_bindgen]
pub struct Program {
    pub program: String,
    pub save: String,
    pub hook: String,
    pub desc: Option<String>,
    pub bind: Vec<String>,
    pub scale: Option<f32>,
}

/// Shader hook program implementations to parse a GLSL shader string
impl Program {
    fn parse_hook(block: &mut iter::Peekable<str::Lines>) -> Result<Program, Box<dyn Error>> {
        let mut metadata_context = true;
        let mut save = String::from("HOOK");
        let mut desc: Option<String> = None;
        let mut hook = String::new();
        let mut binded: Vec<String> = vec![];
        let mut prog = String::new();
        let mut scale = None;
        for line in block.peek() {
            if metadata_context {
                if line.starts_with("//!") {
                    if line.trim().len() <= 3 {
                        block.next();
                        continue
                    }
                    let md = String::from(&line[3..].trim());
                    if md.starts_with("SAVE") && md.len() > 4 {
                        save = String::from(&md[4..].trim());
                    } else if md.starts_with("DESC") && md.len() > 4 {
                        desc.get_or_insert_with(String::new).push_str(&md[4..].trim());
                    } else if md.starts_with("HOOK") && md.len() > 4 {
                        hook.push_str(&md[4..].trim());
                    } else if md.starts_with("BIND") && md.len() > 4 {
                        binded.push(String::from(&md[4..].trim()));
                    } else if md.starts_with("WIDTH") && md.len() > 5
                        || md.starts_with("HEIGHT") && md.len() > 6 {
                        if let Some(s) = md[5..]
                            .split(" ")
                            .find(|x| f32::from_str(x).is_ok()) {
                            scale = f32::from_str(s).ok();
                        }
                    }
                } else {
                    metadata_context = false;
                }
                block.next();
            } else if line.starts_with("//!") {
                break;
            } else {
                prog.push_str(format!("{}\n", line).as_str());
                block.next();
            }
        }
        if hook.len() == 0 {
            Err("HOOK is required for shader")
        } else if prog.trim().len() == 0 {
            Err("hook block body is empty, rejected")
        }
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
        let mut lines = shader.lines().peekable();
        let mut programs = vec![];
        for line in lines.peek() {
            if line.starts_with("//!") {
                match parse_hook(&mut lines) {
                    Ok(p) => programs.push(p),
                    Err(err) => {
                        eprintln!("Error: Failed to parse program starting on line: {}\n{:?}", line, err);
                    }
                }
            } else {
                lines.next();
            }
        }
        programs
    }
}
