use std::str;
use std::iter;
use std::str::FromStr;
use super::Program;

impl Program {
    fn parse_hook(block: &mut iter::Peekable<str::Lines>) -> Result<Program, &str> {
        let mut metadata_context = true;
        let mut save = String::new();
        let mut desc = String::new();
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
                        save.push_str(&md[4..].trim());
                    } else if md.starts_with("DESC") && md.len() > 4 {
                        desc.push_str(&md[4..].trim());
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

    pub fn read_file(shader: &str) -> Vec<Program> {
        let mut lines = shader.lines().peekable();
        let mut programs = vec![];
        for line in lines.peek() {
            if line.starts_with("//!") {
                match parse_hook(&mut lines) {
                    Ok(p) => programs.push(p),
                    Err(err) => {
                        eprintln!("Error: Failed to parse program starting on line: {}\n{}", line, err);
                    }
                }
            } else {
                lines.next();
            }
        }
        programs
    }
}
