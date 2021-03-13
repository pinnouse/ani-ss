extern crate web_sys;
extern crate js_sys;

use web_sys::{WebGl2RenderingContext as GL, WebGl2RenderingContext, WebGlTexture, WebGlBuffer};
use js_sys::ArrayBuffer;

pub fn bind_tex(gl: &WebGl2RenderingContext, texture: Option<&WebGlTexture>, unit: u32) {
    gl.active_texture(GL::TEXTURE0 + unit);
    gl.bind_texture(GL::TEXTURE_2D, texture);
}

pub fn create_array_buffer(gl: &WebGl2RenderingContext, data: Option<&ArrayBuffer>) -> Result<WebGlBuffer, String> {
    let buffer: WebGlBuffer = gl.create_buffer().ok_or(String::from("Failed to create buffer"))?;
    gl.bind_buffer(GL::ARRAY_BUFFER, Some(&buffer));
    gl.buffer_data_with_opt_array_buffer(GL::ARRAY_BUFFER, data, GL::STATIC_DRAW);
    Ok(buffer)
}

pub fn bind_attribute(gl: &WebGl2RenderingContext, buffer: Option<&WebGlBuffer>, attribute: u32, num_components: i32) {
    gl.bind_buffer(GL::ARRAY_BUFFER, buffer);
    gl.enable_vertex_attrib_array(attribute);
    gl.vertex_attrib_pointer_with_i32(attribute, num_components, GL::FLOAT, false, 0, 0);
}
