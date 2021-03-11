/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkani_ss"] = self["webpackChunkani_ss"] || []).push([["js_init_js"],{

/***/ "./js/init.js":
/*!********************!*\
  !*** ./js/init.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pkg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../pkg */ \"./pkg/index_bg.js\");\n\n\nlet aniSS = null\n\nconst addSimpleProgram = function() {\n    if (!aniSS) return;\n    aniSS.addProgram(`\n//!DESC Linear-Upscale\n//!HOOK NATIVE\n//!BIND HOOKED\n//!WIDTH NATIVE.w 2 *\n//!HEIGHT NATIVE.h 2 *\n\nvec4 hook() {\n    return HOOKED_tex(HOOKED_pos);\n}\n    `)\n    alert('Added simple program')\n}\n\n/**\n * Links and adds a new hook/program to the ani-ss\n *\n * @param program {string} Program as string to add\n * @returns {boolean} whether or not the program added without errors\n */\nconst addCustomProgram = function(program) {\n    if (!aniSS) return true\n    return aniSS.addProgram(program)\n}\n\nconst startup = function() {\n    const vid = document.getElementById('vid')\n\n    const canvas = document.getElementById('canv')\n    const gl = canvas.getContext('webgl')\n\n    vid.addEventListener('canplaythrough', function() {\n        vid.play()\n    }, true)\n    vid.addEventListener('loadeddata', function() {\n        if (!aniSS) {\n            aniSS = new _pkg__WEBPACK_IMPORTED_MODULE_0__.AniSS(gl)\n        }\n        aniSS.setSource(vid)\n    }, true)\n    vid.addEventListener('error', function() {\n        alert(\"Can't load the video.\")\n    }, true)\n\n    aniSS = new _pkg__WEBPACK_IMPORTED_MODULE_0__.AniSS(gl)\n\n    function render() {\n        if (aniSS) {\n            aniSS.render()\n        }\n        requestAnimationFrame(render)\n    }\n    requestAnimationFrame(render)\n}\n\nstartup();\n\nfunction getSourceType(uri) {\n    const movTypes = ['mp4', 'webm', 'ogv', 'ogg']\n\n    let ext = uri.split('.').pop().split(/\\#|\\?/)[0]\n\n    for (let movType of movTypes) {\n        if (ext === movType) {\n            return 'mov'\n        }\n    }\n\n    return 'img'\n}\n\nfunction changeImage(src) {\n    const vid = document.getElementById('vid')\n    const gl = document.getElementById('canv').getContext('webgl')\n    if (!vid.paused)\n        vid.pause()\n\n    const inputImg = new Image()\n    inputImg.crossOrigin = \"Anonymous\"\n    inputImg.src = src\n    inputImg.onload = function() {\n        if (!aniSS) {\n            aniSS = new _pkg__WEBPACK_IMPORTED_MODULE_0__.AniSS(gl)\n        }\n        aniSS.setSource(inputImg)\n    }\n    inputImg.onerror = function() {\n        alert(\"Can't load the image.\")\n    }\n}\n\nfunction changeVideo(src) {\n    const vid = document.getElementById('vid');\n    vid.src = src;\n}\n\nfunction onSelectFile(input) {\n    if (input.files && input.files[0]) {\n        let reader = new FileReader()\n        reader.onload = e => {\n            let src = e.target.result\n            if (getSourceType(input.value) === 'img') {\n                changeImage(src)\n            } else {\n                changeVideo(src)\n            }\n        }\n        reader.readAsDataURL(input.files[0])\n    }\n}\n\nfunction onSelectShader(input) {\n    if (input.files && input.files[0]) {\n        let reader = new FileReader()\n        reader.onload = e => {\n            let src = e.target.result\n            if (!addCustomProgram(src))  {\n                alert('Custom program added with error, check log for details')\n            } else {\n                alert('Program was added successfully!')\n            }\n        }\n        reader.readAsText(input.files[0])\n    }\n}\n\nwindow.addSimpleProgram = addSimpleProgram;\nwindow.onSelectShader = onSelectShader;\nwindow.onSelectFile = onSelectFile\n\n//# sourceURL=webpack://ani-ss/./js/init.js?");

/***/ }),

/***/ "./pkg/index_bg.js":
/*!*************************!*\
  !*** ./pkg/index_bg.js ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AniSS\": () => /* binding */ AniSS,\n/* harmony export */   \"Program\": () => /* binding */ Program,\n/* harmony export */   \"ProgramWrapper\": () => /* binding */ ProgramWrapper,\n/* harmony export */   \"__wbindgen_is_falsy\": () => /* binding */ __wbindgen_is_falsy,\n/* harmony export */   \"__wbindgen_string_new\": () => /* binding */ __wbindgen_string_new,\n/* harmony export */   \"__wbg_error_4bb6c2a97407129a\": () => /* binding */ __wbg_error_4bb6c2a97407129a,\n/* harmony export */   \"__wbg_new_59cb74e423758ede\": () => /* binding */ __wbg_new_59cb74e423758ede,\n/* harmony export */   \"__wbg_stack_558ba5917b466edd\": () => /* binding */ __wbg_stack_558ba5917b466edd,\n/* harmony export */   \"__wbindgen_object_drop_ref\": () => /* binding */ __wbindgen_object_drop_ref,\n/* harmony export */   \"__wbg_tagName_1544173ec78f7f60\": () => /* binding */ __wbg_tagName_1544173ec78f7f60,\n/* harmony export */   \"__wbg_name_4f3b7294acbeabad\": () => /* binding */ __wbg_name_4f3b7294acbeabad,\n/* harmony export */   \"__wbg_instanceof_HtmlVideoElement_7e1a8ba0ea9320dd\": () => /* binding */ __wbg_instanceof_HtmlVideoElement_7e1a8ba0ea9320dd,\n/* harmony export */   \"__wbg_videoWidth_47b48ef97bd9fc25\": () => /* binding */ __wbg_videoWidth_47b48ef97bd9fc25,\n/* harmony export */   \"__wbg_videoHeight_748a914007339670\": () => /* binding */ __wbg_videoHeight_748a914007339670,\n/* harmony export */   \"__wbg_canvas_28d27dc41b9e5d3b\": () => /* binding */ __wbg_canvas_28d27dc41b9e5d3b,\n/* harmony export */   \"__wbg_bufferData_2c0b747dccfd4a27\": () => /* binding */ __wbg_bufferData_2c0b747dccfd4a27,\n/* harmony export */   \"__wbg_texImage2D_b1d95ccb3f8fd616\": () => /* binding */ __wbg_texImage2D_b1d95ccb3f8fd616,\n/* harmony export */   \"__wbg_texImage2D_b2996d0cc717b168\": () => /* binding */ __wbg_texImage2D_b2996d0cc717b168,\n/* harmony export */   \"__wbg_texImage2D_3456049636c02bbf\": () => /* binding */ __wbg_texImage2D_3456049636c02bbf,\n/* harmony export */   \"__wbg_texImage2D_ee384732571ead11\": () => /* binding */ __wbg_texImage2D_ee384732571ead11,\n/* harmony export */   \"__wbg_activeTexture_ccd864030355beba\": () => /* binding */ __wbg_activeTexture_ccd864030355beba,\n/* harmony export */   \"__wbg_attachShader_176dfde48c626eb8\": () => /* binding */ __wbg_attachShader_176dfde48c626eb8,\n/* harmony export */   \"__wbg_bindBuffer_aff83e0a72ebe9c6\": () => /* binding */ __wbg_bindBuffer_aff83e0a72ebe9c6,\n/* harmony export */   \"__wbg_bindFramebuffer_e7d909ebd485bd28\": () => /* binding */ __wbg_bindFramebuffer_e7d909ebd485bd28,\n/* harmony export */   \"__wbg_bindTexture_3c4cdd29edc870f9\": () => /* binding */ __wbg_bindTexture_3c4cdd29edc870f9,\n/* harmony export */   \"__wbg_compileShader_b154f866a37ef240\": () => /* binding */ __wbg_compileShader_b154f866a37ef240,\n/* harmony export */   \"__wbg_createBuffer_9cd00017c8012ded\": () => /* binding */ __wbg_createBuffer_9cd00017c8012ded,\n/* harmony export */   \"__wbg_createFramebuffer_56446e6cff5d595b\": () => /* binding */ __wbg_createFramebuffer_56446e6cff5d595b,\n/* harmony export */   \"__wbg_createProgram_1dc1d5b4f815c74e\": () => /* binding */ __wbg_createProgram_1dc1d5b4f815c74e,\n/* harmony export */   \"__wbg_createShader_a568ae9716cf79bd\": () => /* binding */ __wbg_createShader_a568ae9716cf79bd,\n/* harmony export */   \"__wbg_createTexture_9165d6614a3f8c26\": () => /* binding */ __wbg_createTexture_9165d6614a3f8c26,\n/* harmony export */   \"__wbg_disable_71a7779d266ab83f\": () => /* binding */ __wbg_disable_71a7779d266ab83f,\n/* harmony export */   \"__wbg_drawArrays_d02840b07073ba40\": () => /* binding */ __wbg_drawArrays_d02840b07073ba40,\n/* harmony export */   \"__wbg_enableVertexAttribArray_19841ca8c10ee785\": () => /* binding */ __wbg_enableVertexAttribArray_19841ca8c10ee785,\n/* harmony export */   \"__wbg_framebufferTexture2D_f7553c079702b253\": () => /* binding */ __wbg_framebufferTexture2D_f7553c079702b253,\n/* harmony export */   \"__wbg_getActiveAttrib_cf94e37771fa88b6\": () => /* binding */ __wbg_getActiveAttrib_cf94e37771fa88b6,\n/* harmony export */   \"__wbg_getActiveUniform_e78d9049f692a7e8\": () => /* binding */ __wbg_getActiveUniform_e78d9049f692a7e8,\n/* harmony export */   \"__wbg_getAttribLocation_3cbba362123e3451\": () => /* binding */ __wbg_getAttribLocation_3cbba362123e3451,\n/* harmony export */   \"__wbg_getProgramInfoLog_b3af1c1f2f050ac5\": () => /* binding */ __wbg_getProgramInfoLog_b3af1c1f2f050ac5,\n/* harmony export */   \"__wbg_getProgramParameter_15c77e6ded344978\": () => /* binding */ __wbg_getProgramParameter_15c77e6ded344978,\n/* harmony export */   \"__wbg_getShaderInfoLog_62bc93f21372bbdb\": () => /* binding */ __wbg_getShaderInfoLog_62bc93f21372bbdb,\n/* harmony export */   \"__wbg_getShaderParameter_b652420e47ea83c3\": () => /* binding */ __wbg_getShaderParameter_b652420e47ea83c3,\n/* harmony export */   \"__wbg_getUniformLocation_0e74513fa8e0fcef\": () => /* binding */ __wbg_getUniformLocation_0e74513fa8e0fcef,\n/* harmony export */   \"__wbg_linkProgram_0a51f6ca8e067ba7\": () => /* binding */ __wbg_linkProgram_0a51f6ca8e067ba7,\n/* harmony export */   \"__wbg_shaderSource_9f03812e74c7504e\": () => /* binding */ __wbg_shaderSource_9f03812e74c7504e,\n/* harmony export */   \"__wbg_texParameteri_26de60b40766928f\": () => /* binding */ __wbg_texParameteri_26de60b40766928f,\n/* harmony export */   \"__wbg_uniform1i_6a282c117216b6ef\": () => /* binding */ __wbg_uniform1i_6a282c117216b6ef,\n/* harmony export */   \"__wbg_uniform2f_2c62de1e5acc87da\": () => /* binding */ __wbg_uniform2f_2c62de1e5acc87da,\n/* harmony export */   \"__wbg_useProgram_9174cae30cc67e4d\": () => /* binding */ __wbg_useProgram_9174cae30cc67e4d,\n/* harmony export */   \"__wbg_vertexAttribPointer_f1d73baac9e3b6e9\": () => /* binding */ __wbg_vertexAttribPointer_f1d73baac9e3b6e9,\n/* harmony export */   \"__wbg_viewport_f89fe7da7b1e24e2\": () => /* binding */ __wbg_viewport_f89fe7da7b1e24e2,\n/* harmony export */   \"__wbg_debug_f29e6b5aa936ee44\": () => /* binding */ __wbg_debug_f29e6b5aa936ee44,\n/* harmony export */   \"__wbg_error_a919ae31d9492215\": () => /* binding */ __wbg_error_a919ae31d9492215,\n/* harmony export */   \"__wbg_info_ae43887f171c8905\": () => /* binding */ __wbg_info_ae43887f171c8905,\n/* harmony export */   \"__wbg_log_1cace83bbfaa2a29\": () => /* binding */ __wbg_log_1cace83bbfaa2a29,\n/* harmony export */   \"__wbg_warn_76079340afd5c3d0\": () => /* binding */ __wbg_warn_76079340afd5c3d0,\n/* harmony export */   \"__wbg_instanceof_HtmlImageElement_83931254ddeb1de9\": () => /* binding */ __wbg_instanceof_HtmlImageElement_83931254ddeb1de9,\n/* harmony export */   \"__wbg_width_d9e3643c351ff015\": () => /* binding */ __wbg_width_d9e3643c351ff015,\n/* harmony export */   \"__wbg_height_b92a879a29e66010\": () => /* binding */ __wbg_height_b92a879a29e66010,\n/* harmony export */   \"__wbg_instanceof_HtmlCanvasElement_c9f334afe4eed430\": () => /* binding */ __wbg_instanceof_HtmlCanvasElement_c9f334afe4eed430,\n/* harmony export */   \"__wbg_width_726d17d6876631b4\": () => /* binding */ __wbg_width_726d17d6876631b4,\n/* harmony export */   \"__wbg_setwidth_41b2497107faaff7\": () => /* binding */ __wbg_setwidth_41b2497107faaff7,\n/* harmony export */   \"__wbg_height_5fd8d13e879338d0\": () => /* binding */ __wbg_height_5fd8d13e879338d0,\n/* harmony export */   \"__wbg_setheight_e15cb9243262e701\": () => /* binding */ __wbg_setheight_e15cb9243262e701,\n/* harmony export */   \"__wbg_new_fe24eae01e10f223\": () => /* binding */ __wbg_new_fe24eae01e10f223,\n/* harmony export */   \"__wbg_newwithbyteoffsetandlength_7b9a415096aef9c1\": () => /* binding */ __wbg_newwithbyteoffsetandlength_7b9a415096aef9c1,\n/* harmony export */   \"__wbg_buffer_db2f541786cf70e5\": () => /* binding */ __wbg_buffer_db2f541786cf70e5,\n/* harmony export */   \"__wbg_buffer_e35e010c3ba9f945\": () => /* binding */ __wbg_buffer_e35e010c3ba9f945,\n/* harmony export */   \"__wbindgen_number_get\": () => /* binding */ __wbindgen_number_get,\n/* harmony export */   \"__wbindgen_debug_string\": () => /* binding */ __wbindgen_debug_string,\n/* harmony export */   \"__wbindgen_throw\": () => /* binding */ __wbindgen_throw,\n/* harmony export */   \"__wbindgen_memory\": () => /* binding */ __wbindgen_memory\n/* harmony export */ });\n/* harmony import */ var _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index_bg.wasm */ \"./pkg/index_bg.wasm\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n/* provided dependency */ var TextDecoder = __webpack_require__(/*! text-encoding */ \"./node_modules/text-encoding/index.js\")[\"TextDecoder\"];\n/* provided dependency */ var TextEncoder = __webpack_require__(/*! text-encoding */ \"./node_modules/text-encoding/index.js\")[\"TextEncoder\"];\n\n\nconst heap = new Array(32).fill(undefined);\n\nheap.push(undefined, null, true, false);\n\nfunction getObject(idx) { return heap[idx]; }\n\nfunction _assertBoolean(n) {\n    if (typeof(n) !== 'boolean') {\n        throw new Error('expected a boolean argument');\n    }\n}\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachegetUint8Memory0 = null;\nfunction getUint8Memory0() {\n    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {\n        cachegetUint8Memory0 = new Uint8Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);\n    }\n    return cachegetUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nlet heap_next = heap.length;\n\nfunction addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n\n    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');\n\n    heap[idx] = obj;\n    return idx;\n}\n\nfunction dropObject(idx) {\n    if (idx < 36) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n}\n\nfunction takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n}\n\nfunction isLikeNone(x) {\n    return x === undefined || x === null;\n}\n\nfunction _assertNum(n) {\n    if (typeof(n) !== 'number') throw new Error('expected a number argument');\n}\n\nlet cachegetFloat64Memory0 = null;\nfunction getFloat64Memory0() {\n    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {\n        cachegetFloat64Memory0 = new Float64Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);\n    }\n    return cachegetFloat64Memory0;\n}\n\nlet cachegetInt32Memory0 = null;\nfunction getInt32Memory0() {\n    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {\n        cachegetInt32Memory0 = new Int32Array(_index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);\n    }\n    return cachegetInt32Memory0;\n}\n\nfunction debugString(val) {\n    // primitive types\n    const type = typeof val;\n    if (type == 'number' || type == 'boolean' || val == null) {\n        return  `${val}`;\n    }\n    if (type == 'string') {\n        return `\"${val}\"`;\n    }\n    if (type == 'symbol') {\n        const description = val.description;\n        if (description == null) {\n            return 'Symbol';\n        } else {\n            return `Symbol(${description})`;\n        }\n    }\n    if (type == 'function') {\n        const name = val.name;\n        if (typeof name == 'string' && name.length > 0) {\n            return `Function(${name})`;\n        } else {\n            return 'Function';\n        }\n    }\n    // objects\n    if (Array.isArray(val)) {\n        const length = val.length;\n        let debug = '[';\n        if (length > 0) {\n            debug += debugString(val[0]);\n        }\n        for(let i = 1; i < length; i++) {\n            debug += ', ' + debugString(val[i]);\n        }\n        debug += ']';\n        return debug;\n    }\n    // Test for built-in\n    const builtInMatches = /\\[object ([^\\]]+)\\]/.exec(toString.call(val));\n    let className;\n    if (builtInMatches.length > 1) {\n        className = builtInMatches[1];\n    } else {\n        // Failed to match the standard '[object ClassName]'\n        return toString.call(val);\n    }\n    if (className == 'Object') {\n        // we're a user defined class or Object\n        // JSON.stringify avoids problems with cycles, and is generally much\n        // easier than looping through ownProperties of `val`.\n        try {\n            return 'Object(' + JSON.stringify(val) + ')';\n        } catch (_) {\n            return 'Object';\n        }\n    }\n    // errors\n    if (val instanceof Error) {\n        return `${val.name}: ${val.message}\\n${val.stack}`;\n    }\n    // TODO we could test for more things here, like `Set`s and `Map`s.\n    return className;\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;\n\nlet cachedTextEncoder = new lTextEncoder('utf-8');\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (typeof(arg) !== 'string') throw new Error('expected a string argument');\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length);\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len);\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3);\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n        if (ret.read !== arg.length) throw new Error('failed to pass whole string');\n        offset += ret.written;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n\nfunction logError(f) {\n    return function () {\n        try {\n            return f.apply(this, arguments);\n\n        } catch (e) {\n            let error = (function () {\n                try {\n                    return e instanceof Error ? `${e.message}\\n\\nStack:\\n${e.stack}` : e.toString();\n                } catch(_) {\n                    return \"<failed to stringify thrown value>\";\n                }\n            }());\n            console.error(\"wasm-bindgen: imported JS function that was not marked as `catch` threw an error:\", error);\n            throw e;\n        }\n    };\n}\n\nfunction getArrayU8FromWasm0(ptr, len) {\n    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);\n}\n\nfunction handleError(f) {\n    return function () {\n        try {\n            return f.apply(this, arguments);\n\n        } catch (e) {\n            _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_exn_store(addHeapObject(e));\n        }\n    };\n}\n/**\n*/\nclass AniSS {\n\n    static __wrap(ptr) {\n        const obj = Object.create(AniSS.prototype);\n        obj.ptr = ptr;\n\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.ptr;\n        this.ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_aniss_free(ptr);\n    }\n    /**\n    * @param {WebGLRenderingContext} gl\n    */\n    constructor(gl) {\n        var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_new(addHeapObject(gl));\n        return AniSS.__wrap(ret);\n    }\n    /**\n    */\n    resizeTextures() {\n        if (this.ptr == 0) throw new Error('Attempt to use a moved value');\n        _assertNum(this.ptr);\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_resizeTextures(this.ptr);\n    }\n    /**\n    * @param {number | undefined} scale\n    */\n    setScale(scale) {\n        if (this.ptr == 0) throw new Error('Attempt to use a moved value');\n        _assertNum(this.ptr);\n        if (!isLikeNone(scale)) {\n            _assertNum(scale);\n        }\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_setScale(this.ptr, !isLikeNone(scale), isLikeNone(scale) ? 0 : scale);\n    }\n    /**\n    * @param {HTMLElement} element\n    */\n    setSource(element) {\n        if (this.ptr == 0) throw new Error('Attempt to use a moved value');\n        _assertNum(this.ptr);\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_setSource(this.ptr, addHeapObject(element));\n    }\n    /**\n    * @param {string} program\n    * @returns {boolean}\n    */\n    addProgram(program) {\n        if (this.ptr == 0) throw new Error('Attempt to use a moved value');\n        _assertNum(this.ptr);\n        var ptr0 = passStringToWasm0(program, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n        var len0 = WASM_VECTOR_LEN;\n        var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_addProgram(this.ptr, ptr0, len0);\n        return ret !== 0;\n    }\n    /**\n    * @returns {boolean}\n    */\n    render() {\n        if (this.ptr == 0) throw new Error('Attempt to use a moved value');\n        _assertNum(this.ptr);\n        var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.aniss_render(this.ptr);\n        return ret !== 0;\n    }\n}\n/**\n* Program struct holds all the info of a single hook.\n*/\nclass Program {\n\n    constructor() {\n        throw new Error('cannot invoke `new` directly');\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.ptr;\n        this.ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_program_free(ptr);\n    }\n}\n/**\n* ProgramWrapper is a container for a native [WebGlProgram] that has been compiled with the\n* correct shaders built using the [Program] struct and [ProgramWrapper::new].\n*/\nclass ProgramWrapper {\n\n    constructor() {\n        throw new Error('cannot invoke `new` directly');\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.ptr;\n        this.ptr = 0;\n\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbg_programwrapper_free(ptr);\n    }\n}\n\nconst __wbindgen_is_falsy = function(arg0) {\n    var ret = !getObject(arg0);\n    _assertBoolean(ret);\n    return ret;\n};\n\nconst __wbindgen_string_new = function(arg0, arg1) {\n    var ret = getStringFromWasm0(arg0, arg1);\n    return addHeapObject(ret);\n};\n\nconst __wbg_error_4bb6c2a97407129a = logError(function(arg0, arg1) {\n    try {\n        console.error(getStringFromWasm0(arg0, arg1));\n    } finally {\n        _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_free(arg0, arg1);\n    }\n});\n\nconst __wbg_new_59cb74e423758ede = logError(function() {\n    var ret = new Error();\n    return addHeapObject(ret);\n});\n\nconst __wbg_stack_558ba5917b466edd = logError(function(arg0, arg1) {\n    var ret = getObject(arg1).stack;\n    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n});\n\nconst __wbindgen_object_drop_ref = function(arg0) {\n    takeObject(arg0);\n};\n\nconst __wbg_tagName_1544173ec78f7f60 = logError(function(arg0, arg1) {\n    var ret = getObject(arg1).tagName;\n    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n});\n\nconst __wbg_name_4f3b7294acbeabad = logError(function(arg0, arg1) {\n    var ret = getObject(arg1).name;\n    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n});\n\nconst __wbg_instanceof_HtmlVideoElement_7e1a8ba0ea9320dd = logError(function(arg0) {\n    var ret = getObject(arg0) instanceof HTMLVideoElement;\n    _assertBoolean(ret);\n    return ret;\n});\n\nconst __wbg_videoWidth_47b48ef97bd9fc25 = logError(function(arg0) {\n    var ret = getObject(arg0).videoWidth;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_videoHeight_748a914007339670 = logError(function(arg0) {\n    var ret = getObject(arg0).videoHeight;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_canvas_28d27dc41b9e5d3b = logError(function(arg0) {\n    var ret = getObject(arg0).canvas;\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_bufferData_2c0b747dccfd4a27 = logError(function(arg0, arg1, arg2, arg3) {\n    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);\n});\n\nconst __wbg_texImage2D_b1d95ccb3f8fd616 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {\n    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));\n});\n\nconst __wbg_texImage2D_b2996d0cc717b168 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {\n    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));\n});\n\nconst __wbg_texImage2D_3456049636c02bbf = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {\n    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));\n});\n\nconst __wbg_texImage2D_ee384732571ead11 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {\n    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));\n});\n\nconst __wbg_activeTexture_ccd864030355beba = logError(function(arg0, arg1) {\n    getObject(arg0).activeTexture(arg1 >>> 0);\n});\n\nconst __wbg_attachShader_176dfde48c626eb8 = logError(function(arg0, arg1, arg2) {\n    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));\n});\n\nconst __wbg_bindBuffer_aff83e0a72ebe9c6 = logError(function(arg0, arg1, arg2) {\n    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));\n});\n\nconst __wbg_bindFramebuffer_e7d909ebd485bd28 = logError(function(arg0, arg1, arg2) {\n    getObject(arg0).bindFramebuffer(arg1 >>> 0, getObject(arg2));\n});\n\nconst __wbg_bindTexture_3c4cdd29edc870f9 = logError(function(arg0, arg1, arg2) {\n    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));\n});\n\nconst __wbg_compileShader_b154f866a37ef240 = logError(function(arg0, arg1) {\n    getObject(arg0).compileShader(getObject(arg1));\n});\n\nconst __wbg_createBuffer_9cd00017c8012ded = logError(function(arg0) {\n    var ret = getObject(arg0).createBuffer();\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_createFramebuffer_56446e6cff5d595b = logError(function(arg0) {\n    var ret = getObject(arg0).createFramebuffer();\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_createProgram_1dc1d5b4f815c74e = logError(function(arg0) {\n    var ret = getObject(arg0).createProgram();\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_createShader_a568ae9716cf79bd = logError(function(arg0, arg1) {\n    var ret = getObject(arg0).createShader(arg1 >>> 0);\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_createTexture_9165d6614a3f8c26 = logError(function(arg0) {\n    var ret = getObject(arg0).createTexture();\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_disable_71a7779d266ab83f = logError(function(arg0, arg1) {\n    getObject(arg0).disable(arg1 >>> 0);\n});\n\nconst __wbg_drawArrays_d02840b07073ba40 = logError(function(arg0, arg1, arg2, arg3) {\n    getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);\n});\n\nconst __wbg_enableVertexAttribArray_19841ca8c10ee785 = logError(function(arg0, arg1) {\n    getObject(arg0).enableVertexAttribArray(arg1 >>> 0);\n});\n\nconst __wbg_framebufferTexture2D_f7553c079702b253 = logError(function(arg0, arg1, arg2, arg3, arg4, arg5) {\n    getObject(arg0).framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, getObject(arg4), arg5);\n});\n\nconst __wbg_getActiveAttrib_cf94e37771fa88b6 = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg0).getActiveAttrib(getObject(arg1), arg2 >>> 0);\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_getActiveUniform_e78d9049f692a7e8 = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg0).getActiveUniform(getObject(arg1), arg2 >>> 0);\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_getAttribLocation_3cbba362123e3451 = logError(function(arg0, arg1, arg2, arg3) {\n    var ret = getObject(arg0).getAttribLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_getProgramInfoLog_b3af1c1f2f050ac5 = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));\n    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n});\n\nconst __wbg_getProgramParameter_15c77e6ded344978 = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);\n    return addHeapObject(ret);\n});\n\nconst __wbg_getShaderInfoLog_62bc93f21372bbdb = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));\n    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n});\n\nconst __wbg_getShaderParameter_b652420e47ea83c3 = logError(function(arg0, arg1, arg2) {\n    var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);\n    return addHeapObject(ret);\n});\n\nconst __wbg_getUniformLocation_0e74513fa8e0fcef = logError(function(arg0, arg1, arg2, arg3) {\n    var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));\n    return isLikeNone(ret) ? 0 : addHeapObject(ret);\n});\n\nconst __wbg_linkProgram_0a51f6ca8e067ba7 = logError(function(arg0, arg1) {\n    getObject(arg0).linkProgram(getObject(arg1));\n});\n\nconst __wbg_shaderSource_9f03812e74c7504e = logError(function(arg0, arg1, arg2, arg3) {\n    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));\n});\n\nconst __wbg_texParameteri_26de60b40766928f = logError(function(arg0, arg1, arg2, arg3) {\n    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);\n});\n\nconst __wbg_uniform1i_6a282c117216b6ef = logError(function(arg0, arg1, arg2) {\n    getObject(arg0).uniform1i(getObject(arg1), arg2);\n});\n\nconst __wbg_uniform2f_2c62de1e5acc87da = logError(function(arg0, arg1, arg2, arg3) {\n    getObject(arg0).uniform2f(getObject(arg1), arg2, arg3);\n});\n\nconst __wbg_useProgram_9174cae30cc67e4d = logError(function(arg0, arg1) {\n    getObject(arg0).useProgram(getObject(arg1));\n});\n\nconst __wbg_vertexAttribPointer_f1d73baac9e3b6e9 = logError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {\n    getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);\n});\n\nconst __wbg_viewport_f89fe7da7b1e24e2 = logError(function(arg0, arg1, arg2, arg3, arg4) {\n    getObject(arg0).viewport(arg1, arg2, arg3, arg4);\n});\n\nconst __wbg_debug_f29e6b5aa936ee44 = logError(function(arg0, arg1, arg2, arg3) {\n    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));\n});\n\nconst __wbg_error_a919ae31d9492215 = logError(function(arg0, arg1, arg2, arg3) {\n    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));\n});\n\nconst __wbg_info_ae43887f171c8905 = logError(function(arg0, arg1, arg2, arg3) {\n    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));\n});\n\nconst __wbg_log_1cace83bbfaa2a29 = logError(function(arg0, arg1, arg2, arg3) {\n    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));\n});\n\nconst __wbg_warn_76079340afd5c3d0 = logError(function(arg0, arg1, arg2, arg3) {\n    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3));\n});\n\nconst __wbg_instanceof_HtmlImageElement_83931254ddeb1de9 = logError(function(arg0) {\n    var ret = getObject(arg0) instanceof HTMLImageElement;\n    _assertBoolean(ret);\n    return ret;\n});\n\nconst __wbg_width_d9e3643c351ff015 = logError(function(arg0) {\n    var ret = getObject(arg0).width;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_height_b92a879a29e66010 = logError(function(arg0) {\n    var ret = getObject(arg0).height;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_instanceof_HtmlCanvasElement_c9f334afe4eed430 = logError(function(arg0) {\n    var ret = getObject(arg0) instanceof HTMLCanvasElement;\n    _assertBoolean(ret);\n    return ret;\n});\n\nconst __wbg_width_726d17d6876631b4 = logError(function(arg0) {\n    var ret = getObject(arg0).width;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_setwidth_41b2497107faaff7 = logError(function(arg0, arg1) {\n    getObject(arg0).width = arg1 >>> 0;\n});\n\nconst __wbg_height_5fd8d13e879338d0 = logError(function(arg0) {\n    var ret = getObject(arg0).height;\n    _assertNum(ret);\n    return ret;\n});\n\nconst __wbg_setheight_e15cb9243262e701 = logError(function(arg0, arg1) {\n    getObject(arg0).height = arg1 >>> 0;\n});\n\nconst __wbg_new_fe24eae01e10f223 = logError(function(arg0) {\n    var ret = new Float32Array(getObject(arg0));\n    return addHeapObject(ret);\n});\n\nconst __wbg_newwithbyteoffsetandlength_7b9a415096aef9c1 = logError(function(arg0, arg1, arg2) {\n    var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);\n    return addHeapObject(ret);\n});\n\nconst __wbg_buffer_db2f541786cf70e5 = logError(function(arg0) {\n    var ret = getObject(arg0).buffer;\n    return addHeapObject(ret);\n});\n\nconst __wbg_buffer_e35e010c3ba9f945 = logError(function(arg0) {\n    var ret = getObject(arg0).buffer;\n    return addHeapObject(ret);\n});\n\nconst __wbindgen_number_get = function(arg0, arg1) {\n    const obj = getObject(arg1);\n    var ret = typeof(obj) === 'number' ? obj : undefined;\n    if (!isLikeNone(ret)) {\n        _assertNum(ret);\n    }\n    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;\n    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);\n};\n\nconst __wbindgen_debug_string = function(arg0, arg1) {\n    var ret = debugString(getObject(arg1));\n    var ptr0 = passStringToWasm0(ret, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_malloc, _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_realloc);\n    var len0 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len0;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr0;\n};\n\nconst __wbindgen_throw = function(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\nconst __wbindgen_memory = function() {\n    var ret = _index_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory;\n    return addHeapObject(ret);\n};\n\n\n\n//# sourceURL=webpack://ani-ss/./pkg/index_bg.js?");

/***/ }),

/***/ "./pkg/index_bg.wasm":
/*!***************************!*\
  !*** ./pkg/index_bg.wasm ***!
  \***************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.id];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name) exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./index_bg.js */ \"./pkg/index_bg.js\");\n\n\n// exec wasm module\nwasmExports[\"\"]()\n\n//# sourceURL=webpack://ani-ss/./pkg/index_bg.wasm?");

/***/ })

}]);