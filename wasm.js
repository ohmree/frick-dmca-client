let e;const n=new Array(32).fill(void 0);function _(e){return n[e]}n.push(void 0,null,!0,!1);let t=n.length;function b(e){const b=_(e);return function(e){e<36||(n[e]=t,t=e)}(e),b}function c(e){t===n.length&&n.push(n.length+1);const _=t;return t=n[_],n[_]=e,_}let r=new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0});r.decode();let a=null;function o(){return null!==a&&a.buffer===e.memory.buffer||(a=new Uint8Array(e.memory.buffer)),a}function i(e,n){return r.decode(o().subarray(e,e+n))}let f=0,u=new TextEncoder("utf-8");const g="function"==typeof u.encodeInto?function(e,n){return u.encodeInto(e,n)}:function(e,n){const _=u.encode(e);return n.set(_),{read:e.length,written:_.length}};function w(e,n,_){if(void 0===_){const _=u.encode(e),t=n(_.length);return o().subarray(t,t+_.length).set(_),f=_.length,t}let t=e.length,b=n(t);const c=o();let r=0;for(;r<t;r++){const n=e.charCodeAt(r);if(n>127)break;c[b+r]=n}if(r!==t){0!==r&&(e=e.slice(r)),b=_(b,t,t=r+3*e.length);const n=o().subarray(b+r,b+t);r+=g(e,n).written}return f=r,b}function l(e){return null==e}let d=null;function s(){return null!==d&&d.buffer===e.memory.buffer||(d=new Int32Array(e.memory.buffer)),d}function m(e){const n=typeof e;if("number"==n||"boolean"==n||null==e)return`${e}`;if("string"==n)return`"${e}"`;if("symbol"==n){const n=e.description;return null==n?"Symbol":`Symbol(${n})`}if("function"==n){const n=e.name;return"string"==typeof n&&n.length>0?`Function(${n})`:"Function"}if(Array.isArray(e)){const n=e.length;let _="[";n>0&&(_+=m(e[0]));for(let t=1;t<n;t++)_+=", "+m(e[t]);return _+="]",_}const _=/\[object ([^\]]+)\]/.exec(toString.call(e));let t;if(!(_.length>1))return toString.call(e);if(t=_[1],"Object"==t)try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?`${e.name}: ${e.message}\n${e.stack}`:t}function v(n,_,t,b){const c={a:n,b:_,cnt:1,dtor:t},r=(...n)=>{c.cnt++;const _=c.a;c.a=0;try{return b(_,c.b,...n)}finally{0==--c.cnt?e.__wbindgen_export_2.get(c.dtor)(_,c.b):c.a=_}};return r.original=c,r}function p(n,_,t){e._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h469135eff5a3aafb(n,_,c(t))}function h(n,_,t){e._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha8208dc5bc183202(n,_,t)}function y(n,_){e._dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3ce3ea28e298ceb8(n,_)}function E(n,_,t){e._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7278b87e4447527c(n,_,c(t))}function T(n){return function(){try{return n.apply(this,arguments)}catch(n){e.__wbindgen_exn_store(c(n))}}}function S(e,n){return o().subarray(e/1,e/1+n)}(async function n(t){void 0===t&&(t=import.meta.url.replace(/\.js$/,"_bg.wasm"));const r={wbg:{}};r.wbg.__wbindgen_object_drop_ref=function(e){b(e)},r.wbg.__wbindgen_object_clone_ref=function(e){return c(_(e))},r.wbg.__wbindgen_string_new=function(e,n){return c(i(e,n))},r.wbg.__wbindgen_cb_drop=function(e){const n=b(e).original;if(1==n.cnt--)return n.a=0,!0;return!1},r.wbg.__wbg_new_d0245d62212142d9=function(){return c(new Hls)},r.wbg.__wbg_isSupported_13dbdf2ab5a589a7=function(){return Hls.isSupported()},r.wbg.__wbg_loadSource_0e424890c665dcd0=function(n,t,b){try{_(n).loadSource(i(t,b))}finally{e.__wbindgen_free(t,b)}},r.wbg.__wbg_attachMedia_c14f377e3e5ff8b2=function(e,n){_(e).attachMedia(b(n))},r.wbg.__wbg_self_1c83eb4471d9eb9b=T((function(){return c(self.self)})),r.wbg.__wbg_static_accessor_MODULE_abf5ae284bffdf45=function(){return c(o)},r.wbg.__wbg_require_5b2b5b594d809d9f=function(e,n,t){return c(_(e).require(i(n,t)))},r.wbg.__wbg_crypto_c12f14e810edcaa2=function(e){return c(_(e).crypto)},r.wbg.__wbg_msCrypto_679be765111ba775=function(e){return c(_(e).msCrypto)},r.wbg.__wbindgen_is_undefined=function(e){return void 0===_(e)},r.wbg.__wbg_getRandomValues_05a60bf171bfc2be=function(e){return c(_(e).getRandomValues)},r.wbg.__wbg_getRandomValues_3ac1b33c90b52596=function(e,n,t){_(e).getRandomValues(S(n,t))},r.wbg.__wbg_randomFillSync_6f956029658662ec=function(e,n,t){_(e).randomFillSync(S(n,t))},r.wbg.__wbg_Window_f826a1dec163bacb=function(e){return c(_(e).Window)},r.wbg.__wbg_WorkerGlobalScope_967d186155183d38=function(e){return c(_(e).WorkerGlobalScope)},r.wbg.__wbg_instanceof_Window_49f532f06a9786ee=function(e){return _(e)instanceof Window},r.wbg.__wbg_document_c0366b39e4f4c89a=function(e){var n=_(e).document;return l(n)?0:c(n)},r.wbg.__wbg_location_c1e50a6e4c53d45c=function(e){return c(_(e).location)},r.wbg.__wbg_history_eba22183a08cc7a7=T((function(e){return c(_(e).history)})),r.wbg.__wbg_performance_87e4f3b6f966469f=function(e){var n=_(e).performance;return l(n)?0:c(n)},r.wbg.__wbg_localStorage_a6fd83fc300473fc=T((function(e){var n=_(e).localStorage;return l(n)?0:c(n)})),r.wbg.__wbg_cancelAnimationFrame_60f9cf59ec1c0125=T((function(e,n){_(e).cancelAnimationFrame(n)})),r.wbg.__wbg_requestAnimationFrame_ef0e2294dc8b1088=T((function(e,n){return _(e).requestAnimationFrame(_(n))})),r.wbg.__wbg_clearTimeout_cf42c747400433ba=function(e,n){_(e).clearTimeout(n)},r.wbg.__wbg_fetch_f532e04b8fe49aa0=function(e,n){return c(_(e).fetch(_(n)))},r.wbg.__wbg_setTimeout_7df13099c62f73a7=T((function(e,n,t){return _(e).setTimeout(_(n),t)})),r.wbg.__wbg_activeElement_ed428fc704d4bda2=function(e){var n=_(e).activeElement;return l(n)?0:c(n)},r.wbg.__wbg_createElement_99351c8bf0efac6e=T((function(e,n,t){return c(_(e).createElement(i(n,t)))})),r.wbg.__wbg_createElementNS_a7ef126eff5022c2=T((function(e,n,t,b,r){return c(_(e).createElementNS(0===n?void 0:i(n,t),i(b,r)))})),r.wbg.__wbg_createTextNode_cfdcc8da0d55d336=function(e,n,t){return c(_(e).createTextNode(i(n,t)))},r.wbg.__wbg_getElementById_15aef17a620252b4=function(e,n,t){var b=_(e).getElementById(i(n,t));return l(b)?0:c(b)},r.wbg.__wbg_querySelector_f7730f338b4d3d21=T((function(e,n,t){var b=_(e).querySelector(i(n,t));return l(b)?0:c(b)})),r.wbg.__wbg_target_4bc4eb28204bcc44=function(e){var n=_(e).target;return l(n)?0:c(n)},r.wbg.__wbg_preventDefault_9aab6c264e5df3ee=function(e){_(e).preventDefault()},r.wbg.__wbg_addEventListener_6a37bc32387cb66d=T((function(e,n,t,b){_(e).addEventListener(i(n,t),_(b))})),r.wbg.__wbg_removeEventListener_70dfb387da1982ac=T((function(e,n,t,b){_(e).removeEventListener(i(n,t),_(b))})),r.wbg.__wbg_instanceof_HtmlAudioElement_f88b558e9a879a9b=function(e){return _(e)instanceof HTMLAudioElement},r.wbg.__wbg_length_626127530db910e8=function(e){return _(e).length},r.wbg.__wbg_get_20fb2ed3ba07d2ee=function(e,n){var t=_(e)[n>>>0];return l(t)?0:c(t)},r.wbg.__wbg_instanceof_HtmlParamElement_37d27f708bf3c90d=function(e){return _(e)instanceof HTMLParamElement},r.wbg.__wbg_value_8ffacd789edb5d94=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_25c727b38c609e63=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_instanceof_HtmlSelectElement_9c2391595418b732=function(e){return _(e)instanceof HTMLSelectElement},r.wbg.__wbg_setselectedIndex_464aafe480658450=function(e,n){_(e).selectedIndex=n},r.wbg.__wbg_value_48468fc865fd9e27=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_baa05f6bfafb660f=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_instanceof_PopStateEvent_ccf8dd863df8b165=function(e){return _(e)instanceof PopStateEvent},r.wbg.__wbg_state_a679aaa697451b27=function(e){return c(_(e).state)},r.wbg.__wbg_pushState_7bfc468a9d1367a3=T((function(e,n,t,b,c,r){_(e).pushState(_(n),i(t,b),0===c?void 0:i(c,r))})),r.wbg.__wbg_instanceof_HtmlDataElement_88cb3d3644d57e2f=function(e){return _(e)instanceof HTMLDataElement},r.wbg.__wbg_value_c68265906450ca3b=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_cb0c51f13dcb7e18=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_href_334d59175e10cf4f=T((function(n,t){var b=w(_(t).href,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b})),r.wbg.__wbg_instanceof_Node_6034b719e66260cb=function(e){return _(e)instanceof Node},r.wbg.__wbg_nodeType_e4f29b6a49d90fab=function(e){return _(e).nodeType},r.wbg.__wbg_childNodes_2cd7a37358c0a66a=function(e){return c(_(e).childNodes)},r.wbg.__wbg_firstChild_fb9920c2328a718a=function(e){var n=_(e).firstChild;return l(n)?0:c(n)},r.wbg.__wbg_textContent_4b271fdd94a16dbe=function(n,t){var b=_(t).textContent,c=l(b)?0:w(b,e.__wbindgen_malloc,e.__wbindgen_realloc),r=f;s()[n/4+1]=r,s()[n/4+0]=c},r.wbg.__wbg_settextContent_075f464e1f9a4ac7=function(e,n,t){_(e).textContent=0===n?void 0:i(n,t)},r.wbg.__wbg_appendChild_7c45aeccd496f2a5=T((function(e,n){return c(_(e).appendChild(_(n)))})),r.wbg.__wbg_contains_26397ec5206189fe=function(e,n){return _(e).contains(_(n))},r.wbg.__wbg_insertBefore_6e8e209ea019870f=T((function(e,n,t){return c(_(e).insertBefore(_(n),_(t)))})),r.wbg.__wbg_removeChild_1e1942a296b255c1=T((function(e,n){return c(_(e).removeChild(_(n)))})),r.wbg.__wbg_replaceChild_a3d4a6fb76155a55=T((function(e,n,t){return c(_(e).replaceChild(_(n),_(t)))})),r.wbg.__wbg_getItem_400dba7536e6a1d8=T((function(n,t,b,c){var r=_(t).getItem(i(b,c)),a=l(r)?0:w(r,e.__wbindgen_malloc,e.__wbindgen_realloc),o=f;s()[n/4+1]=o,s()[n/4+0]=a})),r.wbg.__wbg_setItem_57767b71f09c3545=T((function(e,n,t,b,c){_(e).setItem(i(n,t),i(b,c))})),r.wbg.__wbg_instanceof_HtmlMenuItemElement_a36b51a0a1e5636d=function(e){return _(e)instanceof HTMLMenuItemElement},r.wbg.__wbg_setchecked_df26cc7ae0140cde=function(e,n){_(e).checked=0!==n},r.wbg.__wbg_instanceof_HtmlProgressElement_b6297985bf8a0edf=function(e){return _(e)instanceof HTMLProgressElement},r.wbg.__wbg_value_fd1d88ef7a4e0a64=function(e){return _(e).value},r.wbg.__wbg_setvalue_c26c797f2b815252=function(e,n){_(e).value=n},r.wbg.__wbg_new_83a0b608494484fd=T((function(){return c(new Headers)})),r.wbg.__wbg_append_6363bf15ad177fce=T((function(e,n,t,b,c){_(e).append(i(n,t),i(b,c))})),r.wbg.__wbg_instanceof_HtmlMeterElement_ebdf14da9036210f=function(e){return _(e)instanceof HTMLMeterElement},r.wbg.__wbg_value_410c8f72681c68e1=function(e){return _(e).value},r.wbg.__wbg_setvalue_f6dd8718a7e8b7b3=function(e,n){_(e).value=n},r.wbg.__wbg_instanceof_HtmlOutputElement_e577fc47d1867fc6=function(e){return _(e)instanceof HTMLOutputElement},r.wbg.__wbg_value_c99269b54469a278=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_484a6b7af559de2a=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_status_f3cb2b4d20a23f59=function(e){return _(e).status},r.wbg.__wbg_statusText_76ce672b84096caf=function(n,t){var b=w(_(t).statusText,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_text_afdc7a1dc7edda52=T((function(e){return c(_(e).text())})),r.wbg.__wbg_new_162ead432d434629=T((function(){return c(new URLSearchParams)})),r.wbg.__wbg_append_19769483a7e66f02=function(e,n,t,b,c){_(e).append(i(n,t),i(b,c))},r.wbg.__wbg_instanceof_Element_170fdb81b4b466c7=function(e){return _(e)instanceof Element},r.wbg.__wbg_namespaceURI_f4a25184afe07685=function(n,t){var b=_(t).namespaceURI,c=l(b)?0:w(b,e.__wbindgen_malloc,e.__wbindgen_realloc),r=f;s()[n/4+1]=r,s()[n/4+0]=c},r.wbg.__wbg_tagName_81b80a1c8e62f081=function(n,t){var b=w(_(t).tagName,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_closest_092d959de629c784=T((function(e,n,t){var b=_(e).closest(i(n,t));return l(b)?0:c(b)})),r.wbg.__wbg_getAttribute_b60b1fa07c65e091=function(n,t,b,c){var r=_(t).getAttribute(i(b,c)),a=l(r)?0:w(r,e.__wbindgen_malloc,e.__wbindgen_realloc),o=f;s()[n/4+1]=o,s()[n/4+0]=a},r.wbg.__wbg_getAttributeNames_57b99456b53b56b5=function(e){return c(_(e).getAttributeNames())},r.wbg.__wbg_removeAttribute_8440a1b6ce044d52=T((function(e,n,t){_(e).removeAttribute(i(n,t))})),r.wbg.__wbg_setAttribute_e71b9086539f06a1=T((function(e,n,t,b,c){_(e).setAttribute(i(n,t),i(b,c))})),r.wbg.__wbg_instanceof_HtmlTextAreaElement_aa81cb6ef637ad1f=function(e){return _(e)instanceof HTMLTextAreaElement},r.wbg.__wbg_value_0938d95709a8299e=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_d48345fc605b6438=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_newwithstrandinit_11debb554792e043=T((function(e,n,t){return c(new Request(i(e,n),_(t)))})),r.wbg.__wbg_href_31be99e3e6921c55=function(n,t){var b=w(_(t).href,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_pathname_6dba04f80add031d=function(n,t){var b=w(_(t).pathname,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setsearch_bcdadd2e9c73655d=function(e,n,t){_(e).search=i(n,t)},r.wbg.__wbg_searchParams_1173a471421f8202=function(e){return c(_(e).searchParams)},r.wbg.__wbg_hash_43b2bf44e856f329=function(n,t){var b=w(_(t).hash,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_sethash_312ab1f6124eb911=function(e,n,t){_(e).hash=i(n,t)},r.wbg.__wbg_newwithbase_91a99ec3bef1d0bc=T((function(e,n,_,t){return c(new URL(i(e,n),i(_,t)))})),r.wbg.__wbg_debug_9f067aefe2ceaadd=function(e,n,t,b){console.debug(_(e),_(n),_(t),_(b))},r.wbg.__wbg_error_e325755affc8634b=function(e){console.error(_(e))},r.wbg.__wbg_error_7bb15b842d5b0ddb=function(e,n,t,b){console.error(_(e),_(n),_(t),_(b))},r.wbg.__wbg_info_1b9fdabaafc8f4cb=function(e,n,t,b){console.info(_(e),_(n),_(t),_(b))},r.wbg.__wbg_log_37120b26fb738792=function(e,n,t,b){console.log(_(e),_(n),_(t),_(b))},r.wbg.__wbg_warn_6add4f04160cdbba=function(e,n,t,b){console.warn(_(e),_(n),_(t),_(b))},r.wbg.__wbg_instanceof_HtmlButtonElement_917edcddce3c8237=function(e){return _(e)instanceof HTMLButtonElement},r.wbg.__wbg_value_92cf727ce870ff97=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_1e2b1a75fc6e2e61=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_instanceof_HtmlLiElement_f37b144692aedec8=function(e){return _(e)instanceof HTMLLIElement},r.wbg.__wbg_value_9894cc72d92fa933=function(e){return _(e).value},r.wbg.__wbg_setvalue_c247db681cdd9a03=function(e,n){_(e).value=n},r.wbg.__wbg_instanceof_HtmlOptionElement_f411df72b6c65ff8=function(e){return _(e)instanceof HTMLOptionElement},r.wbg.__wbg_value_38cd41b26c4f72b5=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_24c4bca1047a4e7a=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_now_7628760b7b640632=function(e){return _(e).now()},r.wbg.__wbg_instanceof_HtmlElement_ed44c8f443dbd619=function(e){return _(e)instanceof HTMLElement},r.wbg.__wbg_focus_537b5fc3e87a7c39=T((function(e){_(e).focus()})),r.wbg.__wbg_clearTimeout_5c22b115a64dae03=function(e,n){_(e).clearTimeout(n)},r.wbg.__wbg_setTimeout_f900be593e8e3f5e=T((function(e,n,t){return _(e).setTimeout(_(n),t)})),r.wbg.__wbg_instanceof_HtmlInputElement_ad83b145c236a35b=function(e){return _(e)instanceof HTMLInputElement},r.wbg.__wbg_setchecked_8bb84df8eed13498=function(e,n){_(e).checked=0!==n},r.wbg.__wbg_type_a221eb70933ab026=function(n,t){var b=w(_(t).type,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_value_97fba2fa96f7251f=function(n,t){var b=w(_(t).value,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_setvalue_6934781158d5bf65=function(e,n,t){_(e).value=i(n,t)},r.wbg.__wbg_selectionStart_a08cfad3bc454018=T((function(e,n){var t=_(n).selectionStart;s()[e/4+1]=l(t)?0:t,s()[e/4+0]=!l(t)})),r.wbg.__wbg_setselectionStart_30b6889f5f8627f2=T((function(e,n,t){_(e).selectionStart=0===n?void 0:t>>>0})),r.wbg.__wbg_selectionEnd_db2cef9465054e77=T((function(e,n){var t=_(n).selectionEnd;s()[e/4+1]=l(t)?0:t,s()[e/4+0]=!l(t)})),r.wbg.__wbg_setselectionEnd_b703c82522f95d30=T((function(e,n,t){_(e).selectionEnd=0===n?void 0:t>>>0})),r.wbg.__wbg_signal_6b86d7193b7cc2e7=function(e){return c(_(e).signal)},r.wbg.__wbg_new_1d85e2912cd38601=T((function(){return c(new AbortController)})),r.wbg.__wbg_abort_6ce91c3adf58a4cd=function(e){_(e).abort()},r.wbg.__wbg_instanceof_KeyboardEvent_6ede7b5da44a9d65=function(e){return _(e)instanceof KeyboardEvent},r.wbg.__wbg_keyCode_47f9e9228bc483bf=function(e){return _(e).keyCode},r.wbg.__wbg_get_5fa3f454aa041e6e=function(e,n){return c(_(e)[n>>>0])},r.wbg.__wbg_length_d2491466819b6271=function(e){return _(e).length},r.wbg.__wbg_call_951bd0c6d815d6f1=T((function(e,n){return c(_(e).call(_(n)))})),r.wbg.__wbg_decodeURIComponent_16c57793f2b2238d=T((function(e,n){return c(decodeURIComponent(i(e,n)))})),r.wbg.__wbg_encodeURIComponent_5fa08291cdaa68ea=function(e,n){return c(encodeURIComponent(i(e,n)))},r.wbg.__wbg_from_aee16bee83bf975b=function(e){return c(Array.from(_(e)))},r.wbg.__wbg_forEach_f9a7ff415048383d=function(n,t,b){try{var r={a:t,b:b};_(n).forEach(((n,_,t)=>{const b=r.a;r.a=0;try{return function(n,_,t,b,r){e.wasm_bindgen__convert__closures__invoke3_mut__h1fdef4f674c8f18f(n,_,c(t),b,c(r))}(b,r.b,n,_,t)}finally{r.a=b}}))}finally{r.a=r.b=0}},r.wbg.__wbg_newnoargs_7c6bd521992b4022=function(e,n){return c(new Function(i(e,n)))},r.wbg.__wbg_is_049b1aece40b5301=function(e,n){return Object.is(_(e),_(n))},r.wbg.__wbg_new_ba07d0daa0e4677e=function(){return c(new Object)},r.wbg.__wbg_toString_05515dae4330f785=function(e){return c(_(e).toString())},r.wbg.__wbg_resolve_6e61e640925a0db9=function(e){return c(Promise.resolve(_(e)))},r.wbg.__wbg_then_dd3785597974798a=function(e,n){return c(_(e).then(_(n)))},r.wbg.__wbg_then_0f957e0f4c3e537a=function(e,n,t){return c(_(e).then(_(n),_(t)))},r.wbg.__wbg_self_6baf3a3aa7b63415=T((function(){return c(self.self)})),r.wbg.__wbg_window_63fc4027b66c265b=T((function(){return c(window.window)})),r.wbg.__wbg_globalThis_513fb247e8e4e6d2=T((function(){return c(globalThis.globalThis)})),r.wbg.__wbg_global_b87245cd886d7113=T((function(){return c(global.global)})),r.wbg.__wbg_set_9bdd413385146137=T((function(e,n,t){return Reflect.set(_(e),_(n),_(t))})),r.wbg.__wbg_new_59cb74e423758ede=function(){return c(new Error)},r.wbg.__wbg_stack_558ba5917b466edd=function(n,t){var b=w(_(t).stack,e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbg_error_4bb6c2a97407129a=function(n,_){try{console.error(i(n,_))}finally{e.__wbindgen_free(n,_)}},r.wbg.__wbindgen_string_get=function(n,t){const b=_(t);var c="string"==typeof b?b:void 0,r=l(c)?0:w(c,e.__wbindgen_malloc,e.__wbindgen_realloc),a=f;s()[n/4+1]=a,s()[n/4+0]=r},r.wbg.__wbindgen_debug_string=function(n,t){var b=w(m(_(t)),e.__wbindgen_malloc,e.__wbindgen_realloc),c=f;s()[n/4+1]=c,s()[n/4+0]=b},r.wbg.__wbindgen_throw=function(e,n){throw new Error(i(e,n))},r.wbg.__wbindgen_rethrow=function(e){throw b(e)},r.wbg.__wbindgen_closure_wrapper305=function(e,n,_){return c(v(e,n,58,p))},r.wbg.__wbindgen_closure_wrapper306=function(e,n,_){return c(v(e,n,58,h))},r.wbg.__wbindgen_closure_wrapper1385=function(e,n,_){return c(v(e,n,482,y))},r.wbg.__wbindgen_closure_wrapper2530=function(e,n,_){return c(v(e,n,544,E))},("string"==typeof t||"function"==typeof Request&&t instanceof Request||"function"==typeof URL&&t instanceof URL)&&(t=fetch(t));const{instance:a,module:o}=await async function(e,n){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,n)}catch(n){if("application/wasm"==e.headers.get("Content-Type"))throw n;console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",n)}const _=await e.arrayBuffer();return await WebAssembly.instantiate(_,n)}{const _=await WebAssembly.instantiate(e,n);return _ instanceof WebAssembly.Instance?{instance:_,module:e}:_}}(await t,r);return e=a.exports,n.__wbindgen_wasm_module=o,e.__wbindgen_start(),e})("assets/wasm-d63e9c44.wasm").catch(console.error);