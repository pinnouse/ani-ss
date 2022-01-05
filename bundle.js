/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./www/index.js":
/*!**********************!*\
  !*** ./www/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("Promise.all(/*! import() */[__webpack_require__.e(\"vendors-node_modules_text-encoding_index_js\"), __webpack_require__.e(\"www_js_init_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./js/init.js */ \"./www/js/init.js\"))\n\n//# sourceURL=webpack://ani-ss/./www/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/harmony module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.hmd = (module) => {
/******/ 			module = Object.create(module);
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'exports', {
/******/ 				enumerable: true,
/******/ 				set: () => {
/******/ 					throw new Error('ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: ' + module.id);
/******/ 				}
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "ani-ss:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkani_ss"] = self["webpackChunkani_ss"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm chunk loading */
/******/ 	(() => {
/******/ 		// object to store loaded and loading wasm modules
/******/ 		var installedWasmModules = {};
/******/ 		
/******/ 		function promiseResolve() { return Promise.resolve(); }
/******/ 		
/******/ 		var wasmImportedFuncCache0;
/******/ 		var wasmImportedFuncCache1;
/******/ 		var wasmImportedFuncCache2;
/******/ 		var wasmImportedFuncCache3;
/******/ 		var wasmImportedFuncCache4;
/******/ 		var wasmImportedFuncCache5;
/******/ 		var wasmImportedFuncCache6;
/******/ 		var wasmImportedFuncCache7;
/******/ 		var wasmImportedFuncCache8;
/******/ 		var wasmImportedFuncCache9;
/******/ 		var wasmImportedFuncCache10;
/******/ 		var wasmImportedFuncCache11;
/******/ 		var wasmImportedFuncCache12;
/******/ 		var wasmImportedFuncCache13;
/******/ 		var wasmImportedFuncCache14;
/******/ 		var wasmImportedFuncCache15;
/******/ 		var wasmImportedFuncCache16;
/******/ 		var wasmImportedFuncCache17;
/******/ 		var wasmImportedFuncCache18;
/******/ 		var wasmImportedFuncCache19;
/******/ 		var wasmImportedFuncCache20;
/******/ 		var wasmImportedFuncCache21;
/******/ 		var wasmImportedFuncCache22;
/******/ 		var wasmImportedFuncCache23;
/******/ 		var wasmImportedFuncCache24;
/******/ 		var wasmImportedFuncCache25;
/******/ 		var wasmImportedFuncCache26;
/******/ 		var wasmImportedFuncCache27;
/******/ 		var wasmImportedFuncCache28;
/******/ 		var wasmImportedFuncCache29;
/******/ 		var wasmImportedFuncCache30;
/******/ 		var wasmImportedFuncCache31;
/******/ 		var wasmImportedFuncCache32;
/******/ 		var wasmImportedFuncCache33;
/******/ 		var wasmImportedFuncCache34;
/******/ 		var wasmImportedFuncCache35;
/******/ 		var wasmImportedFuncCache36;
/******/ 		var wasmImportedFuncCache37;
/******/ 		var wasmImportedFuncCache38;
/******/ 		var wasmImportedFuncCache39;
/******/ 		var wasmImportedFuncCache40;
/******/ 		var wasmImportedFuncCache41;
/******/ 		var wasmImportedFuncCache42;
/******/ 		var wasmImportedFuncCache43;
/******/ 		var wasmImportedFuncCache44;
/******/ 		var wasmImportedFuncCache45;
/******/ 		var wasmImportedFuncCache46;
/******/ 		var wasmImportedFuncCache47;
/******/ 		var wasmImportedFuncCache48;
/******/ 		var wasmImportedFuncCache49;
/******/ 		var wasmImportedFuncCache50;
/******/ 		var wasmImportedFuncCache51;
/******/ 		var wasmImportedFuncCache52;
/******/ 		var wasmImportedFuncCache53;
/******/ 		var wasmImportedFuncCache54;
/******/ 		var wasmImportedFuncCache55;
/******/ 		var wasmImportedFuncCache56;
/******/ 		var wasmImportedFuncCache57;
/******/ 		var wasmImportedFuncCache58;
/******/ 		var wasmImportedFuncCache59;
/******/ 		var wasmImportedFuncCache60;
/******/ 		var wasmImportedFuncCache61;
/******/ 		var wasmImportedFuncCache62;
/******/ 		var wasmImportedFuncCache63;
/******/ 		var wasmImportedFuncCache64;
/******/ 		var wasmImportedFuncCache65;
/******/ 		var wasmImportedFuncCache66;
/******/ 		var wasmImportedFuncCache67;
/******/ 		var wasmImportedFuncCache68;
/******/ 		var wasmImportObjects = {
/******/ 			"./pkg/index_bg.wasm": function() {
/******/ 				return {
/******/ 					"./index_bg.js": {
/******/ 						"__wbindgen_number_get": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache0 === undefined) wasmImportedFuncCache0 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache0["__wbindgen_number_get"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbindgen_is_falsy": function(p0i32) {
/******/ 							if(wasmImportedFuncCache1 === undefined) wasmImportedFuncCache1 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache1["__wbindgen_is_falsy"](p0i32);
/******/ 						},
/******/ 						"__wbindgen_string_new": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache2 === undefined) wasmImportedFuncCache2 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache2["__wbindgen_string_new"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_error_09919627ac0992f5": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache3 === undefined) wasmImportedFuncCache3 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache3["__wbg_error_09919627ac0992f5"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_new_693216e109162396": function() {
/******/ 							if(wasmImportedFuncCache4 === undefined) wasmImportedFuncCache4 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache4["__wbg_new_693216e109162396"]();
/******/ 						},
/******/ 						"__wbg_stack_0ddaca5d1abfb52f": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache5 === undefined) wasmImportedFuncCache5 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache5["__wbg_stack_0ddaca5d1abfb52f"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 							if(wasmImportedFuncCache6 === undefined) wasmImportedFuncCache6 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache6["__wbindgen_object_drop_ref"](p0i32);
/******/ 						},
/******/ 						"__wbg_canvas_a1da8b652d0a56d1": function(p0i32) {
/******/ 							if(wasmImportedFuncCache7 === undefined) wasmImportedFuncCache7 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache7["__wbg_canvas_a1da8b652d0a56d1"](p0i32);
/******/ 						},
/******/ 						"__wbg_bufferData_e7321fdb994d2b3e": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache8 === undefined) wasmImportedFuncCache8 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache8["__wbg_bufferData_e7321fdb994d2b3e"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_texImage2D_29ea0a7f026e239b": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32,p7i32,p8i32,p9i32,p10i32) {
/******/ 							if(wasmImportedFuncCache9 === undefined) wasmImportedFuncCache9 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache9["__wbg_texImage2D_29ea0a7f026e239b"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32,p7i32,p8i32,p9i32,p10i32);
/******/ 						},
/******/ 						"__wbg_texImage2D_153b2a8f02fceedd": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32) {
/******/ 							if(wasmImportedFuncCache10 === undefined) wasmImportedFuncCache10 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache10["__wbg_texImage2D_153b2a8f02fceedd"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32);
/******/ 						},
/******/ 						"__wbg_texImage2D_f492dbd0c0b7bde8": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32) {
/******/ 							if(wasmImportedFuncCache11 === undefined) wasmImportedFuncCache11 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache11["__wbg_texImage2D_f492dbd0c0b7bde8"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32);
/******/ 						},
/******/ 						"__wbg_texImage2D_88e4c0c849d43a13": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32) {
/******/ 							if(wasmImportedFuncCache12 === undefined) wasmImportedFuncCache12 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache12["__wbg_texImage2D_88e4c0c849d43a13"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32);
/******/ 						},
/******/ 						"__wbg_activeTexture_0092956fa2eefd8c": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache13 === undefined) wasmImportedFuncCache13 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache13["__wbg_activeTexture_0092956fa2eefd8c"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_attachShader_7faccaa7b5ac28a6": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache14 === undefined) wasmImportedFuncCache14 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache14["__wbg_attachShader_7faccaa7b5ac28a6"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_bindBuffer_4ece833dd10cac2f": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache15 === undefined) wasmImportedFuncCache15 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache15["__wbg_bindBuffer_4ece833dd10cac2f"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_bindFramebuffer_48c4bf8ff82bf7e9": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache16 === undefined) wasmImportedFuncCache16 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache16["__wbg_bindFramebuffer_48c4bf8ff82bf7e9"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_bindTexture_9d8ed0fcd83eb0a9": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache17 === undefined) wasmImportedFuncCache17 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache17["__wbg_bindTexture_9d8ed0fcd83eb0a9"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_compileShader_dd66d66a5a6481f3": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache18 === undefined) wasmImportedFuncCache18 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache18["__wbg_compileShader_dd66d66a5a6481f3"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_createBuffer_5c5caa16032a81b7": function(p0i32) {
/******/ 							if(wasmImportedFuncCache19 === undefined) wasmImportedFuncCache19 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache19["__wbg_createBuffer_5c5caa16032a81b7"](p0i32);
/******/ 						},
/******/ 						"__wbg_createFramebuffer_9818fc04b4a38c18": function(p0i32) {
/******/ 							if(wasmImportedFuncCache20 === undefined) wasmImportedFuncCache20 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache20["__wbg_createFramebuffer_9818fc04b4a38c18"](p0i32);
/******/ 						},
/******/ 						"__wbg_createProgram_32d01a55e144b9fc": function(p0i32) {
/******/ 							if(wasmImportedFuncCache21 === undefined) wasmImportedFuncCache21 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache21["__wbg_createProgram_32d01a55e144b9fc"](p0i32);
/******/ 						},
/******/ 						"__wbg_createShader_6e8eed55567fe1a6": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache22 === undefined) wasmImportedFuncCache22 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache22["__wbg_createShader_6e8eed55567fe1a6"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_createTexture_8f31e7386e22fc37": function(p0i32) {
/******/ 							if(wasmImportedFuncCache23 === undefined) wasmImportedFuncCache23 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache23["__wbg_createTexture_8f31e7386e22fc37"](p0i32);
/******/ 						},
/******/ 						"__wbg_disable_b05e075ae54fa448": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache24 === undefined) wasmImportedFuncCache24 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache24["__wbg_disable_b05e075ae54fa448"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_drawArrays_5db2f4e6291f7fb2": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache25 === undefined) wasmImportedFuncCache25 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache25["__wbg_drawArrays_5db2f4e6291f7fb2"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_enableVertexAttribArray_91da8d3cbe0c2bbd": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache26 === undefined) wasmImportedFuncCache26 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache26["__wbg_enableVertexAttribArray_91da8d3cbe0c2bbd"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_framebufferTexture2D_3da41a7f38e2c523": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32) {
/******/ 							if(wasmImportedFuncCache27 === undefined) wasmImportedFuncCache27 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache27["__wbg_framebufferTexture2D_3da41a7f38e2c523"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32);
/******/ 						},
/******/ 						"__wbg_getActiveAttrib_62d2423be5f12389": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache28 === undefined) wasmImportedFuncCache28 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache28["__wbg_getActiveAttrib_62d2423be5f12389"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getActiveUniform_d2105fe949262ffa": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache29 === undefined) wasmImportedFuncCache29 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache29["__wbg_getActiveUniform_d2105fe949262ffa"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getAttribLocation_5d304d390c7273f5": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache30 === undefined) wasmImportedFuncCache30 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache30["__wbg_getAttribLocation_5d304d390c7273f5"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_getProgramInfoLog_18c849a5fa54e7b1": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache31 === undefined) wasmImportedFuncCache31 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache31["__wbg_getProgramInfoLog_18c849a5fa54e7b1"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getProgramParameter_80edd3cfbcf7cf1d": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache32 === undefined) wasmImportedFuncCache32 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache32["__wbg_getProgramParameter_80edd3cfbcf7cf1d"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getShaderInfoLog_ba1de20c14b6fb63": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache33 === undefined) wasmImportedFuncCache33 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache33["__wbg_getShaderInfoLog_ba1de20c14b6fb63"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getShaderParameter_264d9ab5c13ece4d": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache34 === undefined) wasmImportedFuncCache34 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache34["__wbg_getShaderParameter_264d9ab5c13ece4d"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_getUniformLocation_77b2d89291f84289": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache35 === undefined) wasmImportedFuncCache35 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache35["__wbg_getUniformLocation_77b2d89291f84289"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_linkProgram_b84796e37364e5c9": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache36 === undefined) wasmImportedFuncCache36 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache36["__wbg_linkProgram_b84796e37364e5c9"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_shaderSource_18f45f93c05a8311": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache37 === undefined) wasmImportedFuncCache37 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache37["__wbg_shaderSource_18f45f93c05a8311"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_texParameteri_c54aab65b2f8cf6d": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache38 === undefined) wasmImportedFuncCache38 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache38["__wbg_texParameteri_c54aab65b2f8cf6d"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_uniform1i_e287345af4468e22": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache39 === undefined) wasmImportedFuncCache39 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache39["__wbg_uniform1i_e287345af4468e22"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_uniform2f_f8d8e7662e0e0eb6": function(p0i32,p1i32,p2f32,p3f32) {
/******/ 							if(wasmImportedFuncCache40 === undefined) wasmImportedFuncCache40 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache40["__wbg_uniform2f_f8d8e7662e0e0eb6"](p0i32,p1i32,p2f32,p3f32);
/******/ 						},
/******/ 						"__wbg_useProgram_c2fdf4a953d1128a": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache41 === undefined) wasmImportedFuncCache41 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache41["__wbg_useProgram_c2fdf4a953d1128a"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_vertexAttribPointer_76d558694fe81cd7": function(p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32) {
/******/ 							if(wasmImportedFuncCache42 === undefined) wasmImportedFuncCache42 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache42["__wbg_vertexAttribPointer_76d558694fe81cd7"](p0i32,p1i32,p2i32,p3i32,p4i32,p5i32,p6i32);
/******/ 						},
/******/ 						"__wbg_viewport_da0901eee69b9909": function(p0i32,p1i32,p2i32,p3i32,p4i32) {
/******/ 							if(wasmImportedFuncCache43 === undefined) wasmImportedFuncCache43 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache43["__wbg_viewport_da0901eee69b9909"](p0i32,p1i32,p2i32,p3i32,p4i32);
/******/ 						},
/******/ 						"__wbg_instanceof_HtmlCanvasElement_25d964a0dde6717e": function(p0i32) {
/******/ 							if(wasmImportedFuncCache44 === undefined) wasmImportedFuncCache44 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache44["__wbg_instanceof_HtmlCanvasElement_25d964a0dde6717e"](p0i32);
/******/ 						},
/******/ 						"__wbg_width_555f63ab09ba7d3f": function(p0i32) {
/******/ 							if(wasmImportedFuncCache45 === undefined) wasmImportedFuncCache45 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache45["__wbg_width_555f63ab09ba7d3f"](p0i32);
/******/ 						},
/******/ 						"__wbg_setwidth_c1a7061891b71f25": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache46 === undefined) wasmImportedFuncCache46 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache46["__wbg_setwidth_c1a7061891b71f25"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_height_7153faec70fbaf7b": function(p0i32) {
/******/ 							if(wasmImportedFuncCache47 === undefined) wasmImportedFuncCache47 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache47["__wbg_height_7153faec70fbaf7b"](p0i32);
/******/ 						},
/******/ 						"__wbg_setheight_88894b05710ff752": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache48 === undefined) wasmImportedFuncCache48 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache48["__wbg_setheight_88894b05710ff752"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_instanceof_HtmlVideoElement_5b54025c26cac72d": function(p0i32) {
/******/ 							if(wasmImportedFuncCache49 === undefined) wasmImportedFuncCache49 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache49["__wbg_instanceof_HtmlVideoElement_5b54025c26cac72d"](p0i32);
/******/ 						},
/******/ 						"__wbg_videoWidth_bbce7f9cbb2224bd": function(p0i32) {
/******/ 							if(wasmImportedFuncCache50 === undefined) wasmImportedFuncCache50 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache50["__wbg_videoWidth_bbce7f9cbb2224bd"](p0i32);
/******/ 						},
/******/ 						"__wbg_videoHeight_1211f60ece658090": function(p0i32) {
/******/ 							if(wasmImportedFuncCache51 === undefined) wasmImportedFuncCache51 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache51["__wbg_videoHeight_1211f60ece658090"](p0i32);
/******/ 						},
/******/ 						"__wbg_name_cca16bd39fdf3617": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache52 === undefined) wasmImportedFuncCache52 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache52["__wbg_name_cca16bd39fdf3617"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_tagName_7282ea430f088fc1": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache53 === undefined) wasmImportedFuncCache53 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache53["__wbg_tagName_7282ea430f088fc1"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbg_debug_f6147a62af5fb117": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache54 === undefined) wasmImportedFuncCache54 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache54["__wbg_debug_f6147a62af5fb117"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_error_8b4a1487636c965d": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache55 === undefined) wasmImportedFuncCache55 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache55["__wbg_error_8b4a1487636c965d"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_info_74a03c22e1fa6688": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache56 === undefined) wasmImportedFuncCache56 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache56["__wbg_info_74a03c22e1fa6688"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_log_ad41dbc3d891c2dc": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache57 === undefined) wasmImportedFuncCache57 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache57["__wbg_log_ad41dbc3d891c2dc"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_warn_c1cc594c33944c11": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 							if(wasmImportedFuncCache58 === undefined) wasmImportedFuncCache58 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache58["__wbg_warn_c1cc594c33944c11"](p0i32,p1i32,p2i32,p3i32);
/******/ 						},
/******/ 						"__wbg_instanceof_HtmlImageElement_fbc502504b49055e": function(p0i32) {
/******/ 							if(wasmImportedFuncCache59 === undefined) wasmImportedFuncCache59 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache59["__wbg_instanceof_HtmlImageElement_fbc502504b49055e"](p0i32);
/******/ 						},
/******/ 						"__wbg_width_dd6eae8d0018c715": function(p0i32) {
/******/ 							if(wasmImportedFuncCache60 === undefined) wasmImportedFuncCache60 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache60["__wbg_width_dd6eae8d0018c715"](p0i32);
/******/ 						},
/******/ 						"__wbg_height_15afde5f8e06de94": function(p0i32) {
/******/ 							if(wasmImportedFuncCache61 === undefined) wasmImportedFuncCache61 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache61["__wbg_height_15afde5f8e06de94"](p0i32);
/******/ 						},
/******/ 						"__wbg_new_8b45a9becdb89691": function(p0i32) {
/******/ 							if(wasmImportedFuncCache62 === undefined) wasmImportedFuncCache62 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache62["__wbg_new_8b45a9becdb89691"](p0i32);
/******/ 						},
/******/ 						"__wbg_newwithbyteoffsetandlength_8bd669b4092b7244": function(p0i32,p1i32,p2i32) {
/******/ 							if(wasmImportedFuncCache63 === undefined) wasmImportedFuncCache63 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache63["__wbg_newwithbyteoffsetandlength_8bd669b4092b7244"](p0i32,p1i32,p2i32);
/******/ 						},
/******/ 						"__wbg_buffer_3a0628516bb9c4c2": function(p0i32) {
/******/ 							if(wasmImportedFuncCache64 === undefined) wasmImportedFuncCache64 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache64["__wbg_buffer_3a0628516bb9c4c2"](p0i32);
/******/ 						},
/******/ 						"__wbg_buffer_397eaa4d72ee94dd": function(p0i32) {
/******/ 							if(wasmImportedFuncCache65 === undefined) wasmImportedFuncCache65 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache65["__wbg_buffer_397eaa4d72ee94dd"](p0i32);
/******/ 						},
/******/ 						"__wbindgen_debug_string": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache66 === undefined) wasmImportedFuncCache66 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache66["__wbindgen_debug_string"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbindgen_throw": function(p0i32,p1i32) {
/******/ 							if(wasmImportedFuncCache67 === undefined) wasmImportedFuncCache67 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache67["__wbindgen_throw"](p0i32,p1i32);
/******/ 						},
/******/ 						"__wbindgen_memory": function() {
/******/ 							if(wasmImportedFuncCache68 === undefined) wasmImportedFuncCache68 = __webpack_require__.c["./pkg/index_bg.js"].exports;
/******/ 							return wasmImportedFuncCache68["__wbindgen_memory"]();
/******/ 						}
/******/ 					}
/******/ 				};
/******/ 			},
/******/ 		};
/******/ 		
/******/ 		var wasmModuleMap = {
/******/ 			"www_js_init_js": [
/******/ 				"./pkg/index_bg.wasm"
/******/ 			]
/******/ 		};
/******/ 		
/******/ 		// object with all WebAssembly.instance exports
/******/ 		__webpack_require__.w = {};
/******/ 		
/******/ 		// Fetch + compile chunk loading for webassembly
/******/ 		__webpack_require__.f.wasm = function(chunkId, promises) {
/******/ 		
/******/ 			var wasmModules = wasmModuleMap[chunkId] || [];
/******/ 		
/******/ 			wasmModules.forEach(function(wasmModuleId, idx) {
/******/ 				var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/ 		
/******/ 				// a Promise means "currently loading" or "already loaded".
/******/ 				if(installedWasmModuleData)
/******/ 					promises.push(installedWasmModuleData);
/******/ 				else {
/******/ 					var importObject = wasmImportObjects[wasmModuleId]();
/******/ 					var req = fetch(__webpack_require__.p + "" + {"www_js_init_js":{"./pkg/index_bg.wasm":"7aa2eec0fcdcef214d25"}}[chunkId][wasmModuleId] + ".module.wasm");
/******/ 					var promise;
/******/ 					if(importObject && typeof importObject.then === 'function' && typeof WebAssembly.compileStreaming === 'function') {
/******/ 						promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 							return WebAssembly.instantiate(items[0], items[1]);
/******/ 						});
/******/ 					} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 						promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 					} else {
/******/ 						var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 						promise = bytesPromise.then(function(bytes) {
/******/ 							return WebAssembly.instantiate(bytes, importObject);
/******/ 						});
/******/ 					}
/******/ 					promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 						return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 					}));
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./www/index.js");
/******/ 	
/******/ })()
;