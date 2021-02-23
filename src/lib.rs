mod utils;
// mod shaders;
// pub mod renderer;

/// This module contains all the information needed to load a GLSL shader file formatted
/// to work with MPV and parses them into portable packages.
pub mod shader_loader;

/// Main AniSS container
pub mod ani_ss;

pub use ani_ss::AniSS;
