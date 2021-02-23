extern crate web_sys;

/// Implements [Program] to read shader files.
pub mod program;
pub use program::Program;

/// Implements [ProgramWrapper] to load from a Program.
pub mod program_wrapper;
pub use program_wrapper::ProgramWrapper;
