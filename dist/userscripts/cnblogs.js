// ==UserScript==
// @warning      脚本永久停止更新   2024-10-23
// @namespace    http://github.com/yuhanawa/UserScript
// @name         cnblogs garden
// @name:zh      博客花园-博客园(cnblogs)美化增强
// @name:zh-CN   博客花园-博客园(cnblogs)美化增强
// @description        better cnblogs
// @description:zh     博客园 首页及文章美化/自动翻页字体放大/样式调整等
// @description:zh-CN  博客园 首页及文章美化/自动翻页/字体放大/样式调整等
// @version      0.2.17
// @author       Yuhanawa
// @license      GPL-3.0
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @match        *://*.cnblogs.com/*
// ==/UserScript==

/* 
	 source: https://github.com/Yuhanawa/UserScript/; 
	 version: 0.2.17; 
 */
(function() {

var config = {"name":"cnblogs_garden","version":"0.2.17","pages":{"home":["/www.cnblogs.com/[^/]*$/","/www.cnblogs.com/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)//"],"www_ing":["/www.cnblogs.com/#ing*$/"],"ing":["ing.cnblogs.com"]},"category":[{"key":"tips","display":"tips","icon":"📢"},{"key":"beautify","display":"美化","icon":"🎨"},{"key":"other","display":"其他","icon":"🔧"}],"props":{"tips":{"type":"note","category":"tips","display":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471069/feedback/"},"tips-refresh":{"type":"note","category":"tips","display":"修改完成后请刷新页面"},"tips-beautify":{"type":"note","category":"beautify","display":"-- 美化 --"},"base":{"display":"美化","type":"bool","category":"beautify","defaultValue":true},"better_skin":{"display":"文章页美化","type":"bool","category":"beautify","defaultValue":true},"logo":{"display":"LOGO替换","type":"bool","category":"other","defaultValue":true},"auto_pager_home":{"display":"首页自动无缝翻页","type":"bool","category":"other","defaultValue":true},"auto_pager_ing":{"display":"闪存自动无缝翻页","type":"bool","category":"other","defaultValue":true},"ing":{"display":"ing(hidden)","type":"bool","category":"beautify","defaultValue":true,"hidden":true},"ing_in_iframe":{"display":"ing_in_iframe(hidden)","type":"bool","category":"beautify","defaultValue":true,"hidden":true},"menu":{"display":"菜单栏增强","type":"bool","category":"other","defaultValue":true},"side_right":{"display":"右侧吸底","type":"bool","category":"other","defaultValue":true}}};
const win = unsafeWindow;
isLoaded = false;

//#region utils: onload delay loop
function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function delay(f, t, delayConfig) {
    const afterLoad = delayConfig?.afterLoad ?? true
    const loop = delayConfig?.loop ?? false
    const runOnFirst = delayConfig?.runOnFirst ?? false

    const run = afterLoad ? onload : (f) => f()
    if (loop) {
        if (runOnFirst) run(f)
        run(() => setInterval(f, t))
    }
    else run(() => setTimeout(f, t))
}
function loop(f, t, loopConfig) {
    delay(f, t, { ...loopConfig, loop: true })
}
//#endregion

onload(() => { isLoaded = true });

//#region config: get set cfg
function get(k, d) { return GM_getValue(k, d === undefined ? config.props[k]?.defaultValue ?? console.error(`Can't found key (${k}) in config.`) : d) }
function set(k, v) { return GM_setValue(k, v) }
function cfg(k, v) { return v === undefined ? get(k) : set(k, v) }
//#endregion

//#region settingCustomWidgets
const settingCustomWidgets = []
function addSettingWidget(type, creatorFunction) { settingCustomWidgets.push({ type, creatorFunction }) }
//#endregion

//#region style
function style(css, id) {
    if (id || typeof GM_addStyle === "undefined") {
        const node = document.createElement("style");
        if (id) node.setAttribute("id", id);
        node.appendChild(document.createTextNode(css));
        if (document.body) document.body.appendChild(node);
        else document.head.appendChild(node);
        return node;
    }
    // else direct add
    GM_addStyle(css);
}
//#endregion

//#region Menu: addOptionOnMenu addButtonOnMenu
function addOptionOnMenu(key, reload = true) {
    const configProps = config.props;
    if (!configProps || !configProps[key]) {
        console.error(`addOptionOnMenu: Can't find config key "${key}"`);
        return;
    }

    try {
        const { category, display, defaultValue, type, options } = configProps[key]
        const current = cfg(key);

        if (type === "bool") {
            const menuDisplay = `${configProps[key]?.display}:${current ? "已启用" : "已禁用"}`;
            // noinspection JSUnresolvedFunction
            GM_registerMenuCommand(menuDisplay, () => {
                cfg(key, !current);
                if (reload) location.reload();

            });
        } else if (type === "option") {
            let index = options.findIndex(o => o.key === current);
            if (index === -1) { cfg(key, options[0].key); index = 0 }

            const menuDisplay = `${configProps[key]?.display}:${current} [${index + 1}/${options.length}]`;
            // noinspection JSUnresolvedFunction
            GM_registerMenuCommand(menuDisplay, () => {
                const nextIndex = (index + 1) % options.length;
                cfg(key, options[nextIndex].key);
                if (reload) location.reload();

            });

        } else {
            console.error(`addOptionOnMenu: Unsupported type "${type}" for key "${key}"`);
            return;
        }
    } catch (error) {
        console.error(`addOptionOnMenu: An error occurred when add "${key}", ${error}`);
    }
}
function addButtonOnMenu(display, onclick, reload = true) {
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(display, () => {
        if (onclick) {
            try {
                onclick()
            } catch (e) {
                console.error(`addButtonOnMenu: An error occurred when add "${display}", ${e}`);
            }
        }
        if (reload) location.reload();
    });
}
//#endregion

//#region Module: addModule
function addModule(module) {
    const condition = module.condition
    if (condition !== undefined && (
        (typeof condition === "boolean" && !condition)
        || (typeof condition === "function" && !condition()))) return;

    const pages = module.pages
    let isMatchedPage = undefined;
    if (pages !== undefined && !(isMatchedPage = pages.some(page => config.isMatchedPages[page]))) return;
    if ((pages === undefined && module.matchUrls !== undefined) || isMatchedPage === false) {
        const urls = module.matchUrls
        if (urls !== undefined && !urls.some(testUrlMatched)) return;
    }

    if (module.showInMenu) {
        if (module.runAlways) addButtonOnMenu(`${module.key}: runAlways`, () => { }, false);
        else addOptionOnMenu(module.key);
    }

    let cfgValue = null;
    if (module.runAlways || (cfgValue = cfg(module.key)) === true || typeof module.value === "object") {
        let moduleValue = module.value;
        if (typeof module.value === "object")
            moduleValue = module.value[cfgValue];

        if (typeof moduleValue === "string") style(moduleValue);
        else if (typeof moduleValue === "function") {
            try {
                const result = moduleValue(module);
                if (typeof result === "string") style(result);
            } catch (e) {
                console.error("An error occurred when addModeModule", e);
            }
        } else if (typeof moduleValue === "undefined" || moduleValue === null) {
            // do nothing
        }
        else console.error("异常的module.value在addModeModule中", module.value);
    }
}
//#endregion

//#region MatchUtils: testUrlMatched initIsMatchedPages
function testUrlMatched(url) {
    return url.startsWith("/") && url.endsWith("/") ?
        new RegExp(url.substring(1, url.length - 1)).test(location.href)
        : location.href.includes(url)
}
function initIsMatchedPages() {
    if (!config.pages) return;
    config.isMatchedPages = {}

    for (const key of Object.keys(config.pages)) {
        config.isMatchedPages[key] = config.pages[key].some(testUrlMatched);
    }

}
//#endregion

//#region init
function init() {
    addButtonOnMenu("⚙️", () => {
        openConfigPanel();
    }, false);
    initIsMatchedPages();
}

init();
//#endregion

let _openConfigPanel = null;
function openConfigPanel() {
    if (_openConfigPanel) { _openConfigPanel(); return; }

    const container = document.createElement('div');
    container.id = "userscript-setting-shadow-container";
    container.style = "all: initial;";
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const root = document.createElement('div');

    root.innerHTML = `<style>*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.container{width:100%}@media (min-width: 640px){.container{max-width:640px}}@media (min-width: 768px){.container{max-width:768px}}@media (min-width: 1024px){.container{max-width:1024px}}@media (min-width: 1280px){.container{max-width:1280px}}@media (min-width: 1536px){.container{max-width:1536px}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}.visible{visibility:visible}.invisible{visibility:hidden}.absolute{position:absolute}.relative{position:relative}.-bottom-1{bottom:-.25rem}.left-1{left:.25rem}.left-1\/2{left:50%}.top-1{top:.25rem}.z-10{z-index:10}.m-1{margin:.25rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.ml-2{margin-left:.5rem}.mr-3{margin-right:.75rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.block{display:block}.flex{display:flex}.inline-flex{display:inline-flex}.hidden{display:none}.h-10{height:2.5rem}.h-24{height:6rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-8{height:2rem}.h-full{height:100%}.max-h-48{max-height:12rem}.w-10{width:2.5rem}.w-14{width:3.5rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-full{width:100%}.max-w-xs{max-width:20rem}.flex-shrink-0{flex-shrink:0}.-translate-x-1\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-6{--tw-translate-x: 1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-help{cursor:help}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border{border-width:1px}.border-0{border-width:0px}.border-l-4{border-left-width:4px}.border-blue-500{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity))}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}.bg-blue-50{--tw-bg-opacity: 1;background-color:rgb(239 246 255 / var(--tw-bg-opacity))}.bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity))}.bg-blue-700{--tw-bg-opacity: 1;background-color:rgb(29 78 216 / var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity))}.bg-gray-50{--tw-bg-opacity: 1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}.bg-gray-600{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity))}.bg-gray-800{--tw-bg-opacity: 1;background-color:rgb(31 41 55 / var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.object-contain{-o-object-fit:contain;object-fit:contain}.p-2{padding:.5rem}.p-2\.5{padding:.625rem}.p-4{padding:1rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-relaxed{line-height:1.625}.text-blue-700{--tw-text-opacity: 1;color:rgb(29 78 216 / var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}.text-gray-700{--tw-text-opacity: 1;color:rgb(55 65 81 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.opacity-0{opacity:0}.opacity-100{opacity:1}.shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}.topmost{display:flex!important;position:fixed!important;z-index:5201314!important;width:100%!important;height:100%!important;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}.main-container{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)}.floating-ball{display:flex;position:fixed;z-index:5201314;top:72vh;left:0;width:32px;height:32px;padding:6px;opacity:.5;transition:.2s;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;flex-direction:column;align-items:center;justify-content:center;box-sizing:content-box;-webkit-tap-highlight-color:transparent;transform-origin:center;transform:translate(-8px);transition:transform .3s ease;background:#e3fdf5aa;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);box-shadow:0 4px 6px #42275a1a,0 1px 3px #b682ae14;border-radius:0 45% 45% 0;color:#bfe2d1;font-size:large}.floating-ball:hover{opacity:.8;background:#ffd5f7;border-radius:40%;transition:all .3s ease-out;font-size:x-large;box-shadow:0 7px 14px #42275a26,0 3px 6px #b682ae1a;transform:translate(8px) scale(1.1)}.toolbar{display:flex;flex-wrap:nowrap;flex-direction:row;justify-content:space-between;cursor:move}.panel{animation-fill-mode:forwards;transition:opacity .3s ease,visibility .3s ease;height:65vh;width:-moz-fit-content;width:fit-content;position:static;padding:4px;overflow:hidden;color:#fff;justify-content:center;align-items:center;gap:20px;border-radius:10px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background-color:#171717bf;box-shadow:#0000004d 2px 8px 8px;border:1px rgba(255,255,255,.4) solid;border-bottom:1px rgba(40,40,40,.35) solid;border-right:1px rgba(40,40,40,.35) solid}.panel,.panel *{text-shadow:0 0 1px rgba(0,0,0,.3)}.panel:not(.hidden){animation:slideIn .45s cubic-bezier(.25,.8,.25,1) forwards}@keyframes slideIn{0%{transform:translate(-100%) scale(.85);opacity:0}to{transform:translate(0) scale(1);opacity:1}}.panel.hidden{animation:slideOut .25s cubic-bezier(.25,.45,.75,.25) forwards}@keyframes slideOut{0%{transform:translate(0) scale(1);display:block;opacity:1}to{transform:translate(-150%) scale(.8);display:none;opacity:0}}.panel-main{transition:.3s cubic-bezier(.25,.8,.25,1);animation-fill-mode:forwards;padding:4px;width:100%;height:calc(100% - 30px);display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:space-between;gap:.5rem}.category-container{max-width:200px;overflow-x:hidden;overflow-y:auto}.content-container{overflow-y:auto;width:640px;height:100%;padding:0 4px;border-radius:4px;scrollbar-width:thin;scrollbar-color:rgba(155,155,155,.5) transparent}.category-container li{transition:all .2s ease}.category-container li:hover{transform:translateY(-2px);box-shadow:0 4px 6px #0000001a}.content-container::-webkit-scrollbar{width:6px}.content-container::-webkit-scrollbar-track{background:transparent}.content-container::-webkit-scrollbar-thumb{background-color:#9b9b9b80;border-radius:4px;border:2px solid transparent}input[type=text],input[type=number],select,textarea{transition:all .2s ease}input[type=text]:focus,input[type=number]:focus,select:focus,textarea:focus{box-shadow:0 0 0 3px #3b82f680}.tooltip{transition:all .3s ease}.hover\:bg-gray-100:hover{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity))}.hover\:text-gray-600:hover{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity))}.hover\:opacity-80:hover{opacity:.8}.hover\:shadow-lg:hover{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.focus\:border-blue-500:focus{--tw-border-opacity: 1;border-color:rgb(59 130 246 / var(--tw-border-opacity))}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\:ring-blue-500:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity))}@media (min-width: 640px){.sm\:text-sm{font-size:.875rem;line-height:1.25rem}}@media (min-width: 768px){.md\:mb-0{margin-bottom:0}.md\:me-4{margin-inline-end:1rem}}@media (prefers-color-scheme: dark){.dark\:bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity))}.dark\:text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity))}}</style> 
 <div class="topmost">
  <div class="floating-ball">⚙️</div>

  <div class="main-container">

    <div class="panel hidden">
      <div class="toolbar">
        <span> ⚙️ </span>
        <button class="closeBtn">X</button>
      </div>
      <div class="panel-main h-full  ">

        <ul
          class="category-container flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
        </ul>
        <div class="content-container"></div>
      </div>
    </div>

  </div>
</div>`;
    
    shadowRoot.appendChild(root);
    document.body.appendChild(container);

    ((_root,_config,_cfg)=>{ try{(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function n(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(e){if(e.ep)return;e.ep=!0;const o=n(e);fetch(e.href,o)}})();let root,config,cfg;const BindMap=new Map,tryEval=x=>{try{return eval(x)??!1}catch{return!1}};if(location.href.startsWith("http://localhost")){root=document;const r=Object.keys(win.scriptsdata)[0];config=win.scriptsdata[r].config,cfg=(t,n)=>{n!==void 0&&console.log(`${t}: Set to ${n}`);const l=win.scriptsdata[r].cfg(t,n);if(n!==void 0&&BindMap.has(t))for(const{hiddenCondition:e,element:o}of BindMap.get(t))root.querySelector(o).style.display=tryEval(e)?"none":"block";return l}}else root=_root,config=_config,cfg=(r,t)=>{const n=_cfg(r,t);if(t!==void 0&&BindMap.has(r))for(const{hiddenCondition:l,element:e}of BindMap.get(r))root.querySelector(e).style.display=tryEval(l)?"none":"block";return n};const{props,category}=config,elements={mainContainer:root.querySelector(".main-container"),floatingBall:root.querySelector(".floating-ball"),panel:root.querySelector(".panel"),panelMain:root.querySelector(".panel-main"),toolbar:root.querySelector(".toolbar"),closeBtn:root.querySelector(".closeBtn"),categoryContainer:root.querySelector(".category-container"),contentContainer:root.querySelector(".content-container")},contentDivs=new Map,toggleElementDisplay=(r,t)=>r?r.style.display=t:null;let panelIsOpening=!1;async function animatePanel(r){const{floatingBall:t,ballToPanel:n,panel:l,panelMain:e}=elements;panelIsOpening=r,r?l.classList.remove("hidden"):l.classList.add("hidden")}elements.floatingBall.onclick=()=>animatePanel(!panelIsOpening);elements.closeBtn.onclick=()=>animatePanel(!1);let isDragging=!1,startX,startY,initialLeft,initialTop;elements.toolbar.addEventListener("mousedown",r=>{isDragging=!0,startX=r.clientX,startY=r.clientY,initialLeft=elements.mainContainer.offsetLeft,initialTop=elements.mainContainer.offsetTop,r.preventDefault()});root.addEventListener("mousemove",r=>{if(!isDragging)return;const t=r.clientX-startX,n=r.clientY-startY;elements.mainContainer.style.left=`${initialLeft+t}px`,elements.mainContainer.style.top=`${initialTop+n}px`});elements.toolbar.addEventListener("mouseup",()=>{isDragging=!1});function generateCategoryTabs(){let r=null;for(const t of category){const n=document.createElement("li");n.className="cursor-pointer inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600",n.id=`category-${t.key}-tab`,n.innerHTML=`<div class="w-5 h-5 m-1 overflow-hidden">${t.icon}</div> <span>${t.display}</span>`;const l=document.createElement("div");l.className="content-container-item hidden",l.id=`content-${t.key}-container`,contentDivs.set(t.key,l),n.onclick=()=>{toggleElementDisplay(r,"none"),toggleElementDisplay(contentDivs.get(t.key),"block"),r=contentDivs.get(t.key)},elements.contentContainer.append(l),elements.categoryContainer.append(n)}}function createTooltip(r){const t=document.createElement("div");t.className="tooltip opacity-0 invisible absolute bg-gray-800 text-white text-xs rounded py-2 px-3 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 z-10 whitespace-nowrap",t.style.bottom="calc(100% + 10px)",t.textContent=r;const n=document.createElement("div");return n.className="absolute left-1/2 transform -translate-x-1/2 -bottom-1",n.style.borderLeft="6px solid transparent",n.style.borderRight="6px solid transparent",n.style.borderTop="6px solid #1f2937",t.appendChild(n),t}function createDescription(r){const t=document.createElement("p");return t.className="text-sm text-gray-600 mt-2 leading-relaxed",t.textContent=r,t}function createBaseElement(r,t,n,l,e){const{display:o,description:a,tooltip:c}=l,s=document.createElement("div");s.id=`setting-${n}-outer-div`,s.className="bg-white p-4 rounded-lg shadow-md relative mb-6";const d=document.createElement("div");d.className="flex items-center justify-between mb-2";const h=document.createElement("label");h.className="text-sm font-medium text-gray-700 flex items-center";const i=document.createElement("span");if(i.textContent=o,h.appendChild(i),c){const p=document.createElement("span");p.className="ml-2 text-gray-400 hover:text-gray-600 cursor-help",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';const u=createTooltip(c);p.appendChild(u),p.onmouseenter=()=>{u.classList.remove("opacity-0","invisible"),u.classList.add("opacity-100","visible")},p.onmouseleave=()=>{u.classList.add("opacity-0","invisible"),u.classList.remove("opacity-100","visible")},h.appendChild(p)}d.appendChild(h),d.appendChild(e),s.appendChild(d),a&&s.appendChild(createDescription(a)),r.appendChild(s)}const settingWidgetCreators={note:(r,t,n,l)=>{const e=document.createElement("div");e.className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg";const o=document.createElement("div");o.className="flex items-start";const a=document.createElement("div");a.className="flex-shrink-0 mr-3",a.innerHTML='<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';const c=document.createElement("div"),s=document.createElement("p");if(s.className="font-medium",s.textContent=l.display||"",c.appendChild(s),l.description){const d=document.createElement("p");d.className="text-sm mt-1",d.textContent=l.description,c.appendChild(d)}o.appendChild(a),o.appendChild(c),e.appendChild(o),r.appendChild(e)},bool:(r,t,n,l)=>{const e=document.createElement("div");e.className="flex items-center justify-between";const o=document.createElement("label");o.className="flex items-center cursor-pointer";const a=document.createElement("div");a.className="relative";const c=document.createElement("input");c.type="checkbox",c.className="sr-only",c.checked=t(n);const s=document.createElement("div");s.className=`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${c.checked?"bg-blue-600":"bg-gray-600"}`;const d=document.createElement("div");d.className=`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${c.checked?"translate-x-6":""}`,a.appendChild(c),a.appendChild(s),a.appendChild(d),o.appendChild(a),c.onchange=h=>{const i=h.target.checked;t(n,i),s.className=`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${i?"bg-blue-600":"bg-gray-600"}`,d.className=`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${i?"translate-x-6":""}`},e.appendChild(o),createBaseElement(r,t,n,l,e)},option:(r,t,n,l)=>{const e=document.createElement("select");e.className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all duration-300 ease-in-out hover:bg-gray-100",e.innerHTML=l.options.map(o=>`<option value="${o.key}">${o.display}</option>`).join(""),e.value=t(n),e.onchange=o=>t(n,o.target.value),createBaseElement(r,t,n,l,e)},text:(r,t,n,l)=>{const e=document.createElement("input");e.type="text",e.className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all duration-300 ease-in-out hover:bg-gray-100",e.value=t(n),e.onchange=o=>t(n,o.target.value),createBaseElement(r,t,n,l,e)},richtext:(r,t,n,l)=>{const e=document.createElement("textarea");e.className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24 transition-all duration-300 ease-in-out hover:bg-gray-100",e.value=t(n),e.onchange=o=>t(n,o.target.value),createBaseElement(r,t,n,l,e)},image:(r,t,n,l)=>{const e=document.createElement("div");e.className="flex flex-col space-y-2";const o=document.createElement("input");o.type="text",o.className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out hover:bg-gray-100",o.placeholder="Enter image link or choose file",o.value=t(n)||"";const a=document.createElement("input");a.type="file",a.accept="image/*",a.className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none transition-all duration-300 ease-in-out hover:bg-gray-100";const c=document.createElement("img");c.className="max-w-xs max-h-48 object-contain rounded-lg shadow-md",c.src=t(n)||"",c.style.display=t(n)?"block":"none";const s=d=>{c.src=d,c.style.display=d?"block":"none",t(n,d)};o.onchange=d=>s(d.target.value),a.onchange=d=>{const h=d.target.files[0];if(h){const i=new FileReader;i.onload=p=>{s(p.target.result),o.value=p.target.result},i.readAsDataURL(h)}},e.append(o,a,c),createBaseElement(r,t,n,l,e)},color:(r,t,n,l)=>{const e=document.createElement("div");e.className="flex space-x-2";const o=document.createElement("input");o.type="text",o.className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out hover:bg-gray-100",o.placeholder="#000000",o.value=t(n)||"";const a=document.createElement("input");a.type="color",a.className="h-10 w-10 border-0 rounded cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80",a.value=t(n)||"#000000";const c=s=>{o.value=s,a.value=s,t(n,s)};o.onchange=s=>{const d=s.target.value;/^#[0-9A-F]{6}$/i.test(d)&&c(d)},a.onchange=s=>c(s.target.value),e.append(o,a),createBaseElement(r,t,n,l,e)},number:(r,t,n,l)=>{const e=document.createElement("input");e.type="number",e.className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all duration-300 ease-in-out hover:bg-gray-100",e.value=t(n),e.onchange=o=>t(n,parseFloat(o.target.value)),createBaseElement(r,t,n,l,e)},tree:(r,t,n,l)=>{const e=document.createElement("div");e.className="flex flex-col space-y-2 p-2.5 w-full";const o=new Map,a={content:t(n)||[],get:i=>a.content.includes(i),add:i=>{a.content.includes(i)||(a.content.push(i),t(n,a.content))},remove:i=>{const p=a.content.indexOf(i);p!==-1&&(a.content.splice(p,1),t(n,a.content))}},c=(i,p=[],u=0)=>{const m=document.createElement("div"),f=u%2===1;m.className=`tree-node-container tree-node-${u}-container text-gray-900  ${f?"bg-gray-50":"bg-gray-200"}`;const b=document.createElement("span");let v="| ";for(let g=0;g<u;g++)v+=" --- ";b.textContent=v,m.appendChild(b);const y=document.createElement("input");y.type="checkbox",y.id=`tree-checkbox-${u}-${i.key}`;const w=document.createElement("label");w.htmlFor=y.id,w.textContent=i.title;const C=document.createElement("span");C.className="tree-toggle-icon cursor-pointer inline-flex items-center ml-2 w-4 h-4",C.textContent=i.children?"v":"⁕",C.addEventListener("click",()=>{const g=m.querySelector(".tree-children");if(g){g.classList.toggle("hidden");const E=g.classList.contains("hidden");C.textContent=E?"v":">"}}),m.appendChild(C),m.appendChild(b),m.appendChild(y),m.appendChild(w);const N=[...p,i.key],L=N.join(" > ");if(o.set(L,{nodeContainer:m,checkbox:y}),y.checked=a.get(L),y.addEventListener("change",g=>{const E=g.target.checked;a[E?"add":"remove"](L),i.children&&s(i.children,N,E),d(p)}),i.children&&!a.get(L)){const g=document.createElement("div");g.classList.add("tree-children","hidden"),i.children.forEach(E=>{g.appendChild(c(E,N,u+1))}),m.appendChild(g)}else if(i.children){const g=document.createElement("div");g.classList.add("tree-children"),i.children.forEach(E=>{g.appendChild(c(E,N,u+1))}),m.appendChild(g)}return m},s=(i,p,u)=>{i.forEach(m=>{var y;const f=[...p,m.key],b=f.join(" > "),v=(y=o.get(b))==null?void 0:y.checkbox;v&&(v.checked=u,a[u?"add":"remove"](b)),m.children&&s(m.children,f,u)})},d=i=>{for(let p=i.length-1;p>=0;p--){const u=i.slice(0,p+1),m=u.join(" > "),f=o.get(m);if(f!=null&&f.checkbox){const b=h(l.children,u);if(b!=null&&b.children){const v=b.children.every(w=>{const C=[...u,w.key];return a.get(C.join(" > "))}),y=b.children.some(w=>{const C=[...u,w.key];return a.get(C.join(" > "))});f.checkbox.checked=v,f.checkbox.indeterminate=y&&!v,a[v?"add":"remove"](m)}}}},h=(i,p)=>{let u={children:i};for(const m of p)if(u=u.children.find(f=>f.key===m),!u)return null;return u};l.children.forEach(i=>{e.appendChild(c(i))}),createBaseElement(r,t,n,l,e)}};function initCustomWidget(){try{if(settingCustomWidgets===void 0)return;for(const{type:r,creatorFunction:t}of settingCustomWidgets)Object.prototype.hasOwnProperty.call(settingWidgetCreators)&&console.warn(`Widget type '${r}' already exists. It will be overwritten.`),settingWidgetCreators[r]=(n,l,e,o)=>{createBaseElement(n,l,e,o,t(n,l,e,o))}}catch(r){console.error(`initCustomWidget: ${r}`),console.error("NOTE: CustomWidget only be applied in userscript.")}}function generateSettingsUI(r,t,n){Object.entries(t).forEach(([l,e])=>{const o=r.querySelector(`#content-${e.category}-container`);if(o&&settingWidgetCreators[e.type])try{const a=typeof e.hidden;if(a==="boolean"&&e.hidden)return;if(a==="object"){const c=e.hidden.condition,s=e.hidden.bind,d=`#setting-${l}-outer-div`;for(const h of s)BindMap.has(h)?BindMap.get(h).push({hiddenCondition:c,element:d}):BindMap.set(h,[{hiddenCondition:c,element:d}]);settingWidgetCreators[e.type](o,n,l,e),r.querySelector(d).style.display=tryEval(c)?"none":"block"}else settingWidgetCreators[e.type](o,n,l,e)}catch(a){console.error(`generateSettingsUI: ${l}:${e}`,a)}else console.error(`generateSettingsUI: Can't find category ${e.category} or widget type ${e.type}`)})}initCustomWidget();generateCategoryTabs();generateSettingsUI(root,props,cfg);elements.floatingBall.click();_openConfigPanel=()=>elements.floatingBall.click(); } catch(e){ console.error(e) }})(root,config,cfg);
}

// main.js
function receiveMessage(event) {
	const data = event.data;
	switch (data.type) {
		case "resizeIframe":
			document.getElementById("ing_iframe").style.height = `${data.height}px`;
			break;

		default:
			break;
	}
}
unsafeWindow.addEventListener("message", receiveMessage, false);

function show_ing_iframe() {
	if (document.getElementById("ing_iframe")) return;
	delay(() => {
		const iframe = document.createElement("iframe");
		iframe.id = "ing_iframe";
		iframe.src = "https://ing.cnblogs.com/";
		document
			.querySelector("#main_flow")
			.replaceChild(iframe, document.querySelector("#main_flow>.card"));
	}, 50);
}

function getPage(url, obj) {
	GM_xmlhttpRequest({
		url: url,
		method: "GET",
		overrideMimeType: `text/html; charset=${
			document.characterSet || document.charset || document.inputEncoding
		}`,
		headers: {
			"x-requested-with": "XMLHttpRequest",
			Referer: location.href,
			"User-Agent": navigator.userAgent,
			Accept: "text/html,application/xhtml+xml,application/xml",
		},
		timeout: 10000,
		onerror: (response) => {
			console.error(`ERR: URL:${url}`, response);
		},
		ontimeout: (response) => {
			console.warn(`TIMEOUT: URL:${url}`, response);
		},
		...obj,
	});
}

// auto_pager_home.js
addModule({
key: "auto_pager_home", 
	// AutoPager
	pages: ["home"],
	showInMenu: true,
	value: () => {
		delay(() => {
			if (!document.querySelector(".pager") || document.querySelector("#Autopage_number")) return;

			let timeout = 0;
			setInterval(() => {
				if (timeout > 0) timeout--;
			}, 1000);
			unsafeWindow.nextPage = nextPage;

			setInterval(() => {
				if (!document.querySelector(".pager")) return;

				if (
					document.body.offsetHeight - window.scrollY - window.innerHeight <
					window.innerHeight * 2
				) {
					nextPage();
				}
			}, 2000);

			function nextPage() {
				if (timeout > 0) return;
				timeout = 3;

				getPage(document.querySelector(".pager > a:nth-last-child(1)").href, {
					onload: (response) => {
						try {
							const doc = new DOMParser().parseFromString(response.responseText, "text/html"); //"text/html"
							const articles = doc.querySelectorAll("#post_list>article");
							for (const article of articles) {
								document.querySelector("#post_list").insertAdjacentElement("beforeend", article);
							}
							document
								.querySelector(".pager")
								.parentNode.replaceChild(
									doc.querySelector(".pager"),
									document.querySelector(".pager"),
								);
						} catch (e) {
							console.error("ERR", e, response.responseText);
						}
					},
				});

				// GM_xmlhttpRequest({
				//     url: document.querySelector(".pager > a:nth-last-child(1)").href,
				//     method: 'GET',
				//     overrideMimeType: `text/html; charset=${document.characterSet || document.charset || document.inputEncoding}`,
				//     headers: {
				//         'x-requested-with': 'XMLHttpRequest',
				//         'Referer': location.href,
				//         'User-Agent': navigator.userAgent,
				//         'Accept': 'text/html,application/xhtml+xml,application/xml'
				//     },
				//     timeout: 10000,
				//     onload: (response) => {
				//         try {
				//             const doc = (new DOMParser()).parseFromString(response.responseText, "text/html");//"text/html"
				//             const articles = doc.querySelectorAll('#post_list>article')
				//             for (const article of articles) {
				//                 document.querySelector('#post_list').insertAdjacentElement('beforeend', article)
				//             }
				//             document.querySelector('.pager').parentNode.replaceChild(doc.querySelector('.pager'), document.querySelector('.pager'))

				//         } catch (e) {
				//             console.error('ERR', e, response.responseText);
				//         }
				//     },
				//     onerror: (response) => {
				//         console.error(`ERR: URL:${url}`, response);
				//     },
				//     ontimeout: (response) => {
				//         console.warn(`TIMEOUT: URL:${url}`, response);
				//     }
				// });
			}
		}, 400);
	},
});

// auto_pager_ing.js
addModule({
key: "auto_pager_ing", 
	// AutoPager
	pages: ["www_ing"],
	showInMenu: true,
	value: () => {
		// 功能实现在ing_in_iframe中
	},
});

// base.js
addModule({
key: "base", 
	// 美化
	pages: ["home"],
	showInMenu: true,
	value: `@charset "UTF-8";*{transition:all .1s}:root{--text-color-1:#202020;--text-color-2:#596172 // old: #555;--text-color-3:#555;--highlighted-color:#5e72e4;--theme-color:#5e72e4}#side_nav{position:sticky;top:8px}#side_nav .sidenav{width:fit-content;font-size:larger;padding-top:14px}#side_nav .sidenav .sidenav-item{margin:2px!important;padding:14px;border-radius:16px}#side_nav .sidenav .sidenav-item img{width:24px;height:24px}#side_nav .sidenav .sidenav-item:hover:not(.current-nav){background:rgba(204,204,204,.8)}#side_nav .sidenav .sidenav-item .dropdown-button>a{display:flex;align-items:center}#side_nav .sidenav .sidenav-category-active,#side_nav .sidenav .sidenav-item.current-nav{padding:14px!important;margin:2px 4px 2px 2px!important;font-weight:700}#side_nav .sidenav .sidenav-category-active img,#side_nav .sidenav .sidenav-item.current-nav img{width:26px;height:26px;box-shadow:inset 0 0 12px 32px rgba(205,255,255,.8509803922),-6px 3px 12px 6px rgba(0,255,255,.1215686275);border-radius:18px}#sidenav_more .dropdown-menu{left:6px;top:85%;font-size:large}#sidenav_more:hover .dropdown-menu{box-shadow:2px 5px 16px 4px #ccc}.post-list{border-top:1px dashed #dcdcdc;margin-top:20px}.post-list a{position:relative;color:#2d65b3!important}.post-list a,.post-list a:hover{text-decoration:none!important}.post-list a:hover:after{left:0!important;width:100%!important;transition:width 350ms!important}.post-list a:after{content:""!important;position:absolute!important;border-bottom:2px solid #f16d7a!important;bottom:-2px!important;left:100%!important;width:0!important;transition:width 350ms,left 350ms!important}.post-list a>em,.post-list a>strong{color:#f73131!important;text-decoration:none!important}.post-list .post-item .avatar{border-radius:4px;padding:0;border:1px solid rgba(34,34,34,.3333333333);margin-top:4px}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link{color:var(--title-color-2);text-decoration:none;font-weight:500;font-size:19px}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:focus,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:hover,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link:focus,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link:hover{color:var(--highlighted-color);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:2px;text-decoration-color:var(--highlighted-color);transition:all .15s ease-in-out}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-summary{color:var(--text-color-3);margin-top:8px;font-size:15px;font-family:-apple-system,MiSans,Microsoft YaHei,Tahoma,Arial,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif}.card.headline{background:rgba(240,248,255,.8705882353);border-radius:16px;box-shadow:2px 2px 14px 1px rgba(240,248,255,.8705882353)}.card.headline a{font-size:14px;color:#003aae}.card.headline a:hover{text-decoration:none}.card.headline a:hover #text{text-decoration:underline}.card.headline .headline-label{font-size:16px;color:#4242fb}#side_right{position:sticky;top:-2200px;height:fit-content}#side_right #sidebar_bh{background:#fff;padding:8px 16px;border-radius:16px}#side_right #sidebar_bh a{display:inline-grid;align-content:space-evenly;justify-content:start;align-items:stretch;justify-items:start;color:rgba(34,34,34,.8666666667);font-size:14px;grid-row-gap:6px}#side_right #sidebar_bh a:hover{color:#222;font-style:italic;text-decoration:none}#side_right #sidebar_bh a:before{content:"博客园 VIP 会员";font-size:18px;font-weight:700}#side_right #sidebar_bh a:after{content:" G O ! >>";color:#fff;font-weight:bolder;background:#4378ff;border-radius:14px;padding:6px 8px;margin:0 0 2px;font-style:italic;box-shadow:2px 1px 8px 0#4378ff}.sidebar .card .card-title{margin-bottom:12px;color:#444;font-size:15px;font-weight:700}.sidebar .item-list li{font-size:14px;margin:8px 0}.sidebar .item-list li:hover{font-size:15px;margin:10px -1px;color:#4378ff}#top_nav{border-bottom:1px solid rgba(0,0,0,.05);box-shadow:0 2px 4px 0 rgba(0,0,0,.05);font-family:-apple-system,BlinkMacSystemFont,PingFang SC,"Segoe UI",Hiragino Sans GB,Arial,Microsoft YaHei,Verdana,Roboto,Noto,Helvetica Neue,ui-sans-serif}#ing_iframe{width:100%;min-height:100%;scroll-behavior:hidden;border:0;overflow:hidden}`,
});

// better_skin.js
addModule({
key: "better_skin", 
	// better_skin
	showInMenu: false,
	value: `.skin-lessismoreright #blogTitle{display:flex;flex-direction:row;flex-wrap:wrap;align-content:stretch;justify-content:center;align-items:baseline;padding:12px}.skin-lessismoreright #blogTitle .title:after{content:" | ";white-space:pre}.skin-lessismoreright #blogTitle .subtitle{font-size:15.5pt;color:#222}.skin-lessismoreright #blogTitle .subtitle::before{content:" ";white-space:pre}.skin-lessismoreright #main{padding:4px 20px}.skin-lessismoreright #main .post .postTitle{border-bottom:1px solid rgba(66,119,206,.5333333333);border-bottom-style:dashed;font-size:24px;font-weight:700;margin:20px 0 12px;width:fit-content}.skin-lessismoreright #main .post .postBody{color:rgba(0,0,0,.9882352941);font-size:15px;line-height:25px;font-family:-apple-system,PingFangSC-Regular,Pingfang SC,Hiragino Sans GB,Noto Sans,system-ui,BlinkMacSystemFont,Microsoft YaHei,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans",simsun,arial,helvetica,"Helvetica Neue",sans-serif}.skin-lessismoreright #main .post #blog_post_info{height:fit-content;width:-webkit-fill-available;display:inline-flex;flex-direction:row;justify-content:space-between}.skin-lessismoreright #main .post #blog_post_info #author_profile{border:1px solid #ccc;background:#f0f8ff;padding:12px 14px 0;width:fit-content;height:88px;border-radius:6px}.skin-lessismoreright #main .post #blog_post_info #author_profile a{text-decoration:none;color:rgba(0,0,0,.9882352941);font-size:14px;margin:2px}.skin-lessismoreright #main .post #blog_post_info #author_profile #author_profile_follow{position:relative;float:right;top:-18px}.skin-lessismoreright #main .post #blog_post_info #author_profile #author_profile_follow a{color:#06c}.skin-lessismoreright #main .post #blog_post_info #author_profile .author_avatar{margin-right:16px;border:1px solid rgba(128,128,128,.5019607843);border-radius:6px;width:64px}.skin-lessismoreright #main #blog-comments-placeholder .feedback_area_title{font-size:18px}.skin-lessismoreright #main #blog-comments-placeholder .layer{color:gray}.skin-lessismoreright #main #blog-comments-placeholder .blog_comment_body{font-size:15px;color:rgba(0,0,0,.9882352941)}.skin-lessismoreright .commentbox_main.comment_textarea{width:100%}#green_channel{padding:5px 0 15px;margin-bottom:10px;margin-top:10px;border:0;border-top:#eee 1px dashed;border-bottom:#eee 1px dashed;font-size:12px;width:100%!important;text-align:center;display:inline-block;vertical-align:middle}#green_channel_digg,#green_channel_favorite,#green_channel_follow{width:80px}#btn_comment_submit,#green_channel_digg,#green_channel_favorite,#green_channel_follow,#green_channel_wechat,#green_channel_weibo{text-decoration:none;color:#fff;margin:10px auto auto;height:30px;display:inline-block;line-height:30px;font-size:12px;font-weight:500;letter-spacing:2px;border-radius:3px;text-transform:uppercase;transition:all .4s;-webkit-transition:all .4s;-moz-transition:all .4s;-ms-transition:all .4s;-o-transition:all .4s;position:relative;background-image:none}#btn_comment_submit{width:80px}#green_channel_digg:hover,#green_channel_favorite:hover,#green_channel_follow:hover,#green_channel_wechat:hover,#green_channel_weibo:hover{transform:scale(1.02,1.02)}#green_channel_digg:active,#green_channel_favorite:active,#green_channel_follow:active,#green_channel_wechat:active,#green_channel_weibo:active{transform:scale(.95,.95);transition:all .4s -125ms}#green_channel_digg{background-color:#5c8ec6;box-shadow:0 15px 18px -6px rgba(95,193,206,.65)}#green_channel_follow{background-color:#e33100!important;box-shadow:0 15px 18px -6px rgba(227,49,0,.65);margin-left:10px}#green_channel_favorite{background-color:#ffb515;box-shadow:0 15px 18px -6px rgba(255,198,75,.65);margin-left:10px}#green_channel_wechat,#green_channel_weibo{background-color:#ff464b!important;box-shadow:0 15px 18px -6px rgba(255,70,75,.65)!important;margin-left:10px;width:45px}#green_channel_wechat{background-color:#3cb034!important;box-shadow:0 15px 18px -6px rgba(60,176,52,.65)!important}div#green_channel img{height:20px;width:20px}`,
});

// ing.js
addModule({
key: "ing", 
	// ing
	pages: ["www_ing"],
	value: () => {
		show_ing_iframe();
		if (get("auto_pager_ing")) {
			setInterval(() => {
				if (
					document.body.offsetHeight - window.scrollY - window.innerHeight <
					window.innerHeight * 2
				) {
					document
						.getElementById("ing_iframe")
						.contentWindow.postMessage({ type: "nextPage" }, "*");
				}
			}, 2000);
		}
	},
});

// ing_in_iframe.js
addModule({
key: "ing_in_iframe", 
	// ing_in_iframe
	pages: ["ing"],
	showInMenu: true,

	value: () => {
		let style = `:root,:root #container,:root #container_content,:root #main,:root #wrapper,body,body #container,body #container_content,body #main,body #wrapper,html,html #container,html #container_content,html #main,html #wrapper{height:fit-content!important;scrollbar-width:0}`;

		if (top === self) return style;

		style = style + `#app_bar,#footer,#goTop,#header,#right_sidebar,#top{display:none!important}#container,#container_content,#main,#wrapper,:root,body,html{width:100%;height:fit-content;margin:0;padding:0}#user_ing_block,.ing-item{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;flex-wrap:nowrap}.ing-item a.ing_reply{transition:all .3s ease-in-out;text-decoration:none;font-size:12px}.ing-item a.ing_reply:hover{background:0 0;color:#f60}.ing-item .feed_avatar{margin:16px}.ing-item .feed_avatar img{border-radius:6px;padding:0}.ing-item .feed_body{width:auto;font-size:15px}.ing-item .feed_body .ing_body{font-size:15px}.ing-item .feed_body .ing-author{text-decoration:none;font-size:15px}.ing-item .feed_body .ing_comments{font-size:14px}.ing-item .feed_body .ing_comments a{font-size:15px;text-decoration:none}.ing-item .feed_body .ing_comments a.ing_comment_time,.ing-item .feed_body .ing_comments a.ing_reply{font-size:12px}#user_ing_block{justify-content:space-around;align-items:stretch;background:#f0f8ff;padding:12px 16px;margin:12px;border-radius:12px}#user_ing_block #avatar_block .ar_l_b,#user_ing_block #avatar_block .ar_l_t,#user_ing_block #avatar_block .ar_r_b,#user_ing_block #avatar_block .ar_r_t{background:0 0}#user_ing_block #avatar_block #ing_current_avatar .img_avatar{border:1px solid #ccc;padding:0;border-radius:9px}#user_ing_block #ing_block{float:none;width:-webkit-fill-available}#user_ing_block #ing_block #my_name #ing_current_username #lnk_current_user,#user_ing_block #ing_block #my_name .floatright a{text-decoration:none}#user_ing_block #ing_block #ing_publish_wrapper #ing_current{margin-bottom:10px}#user_ing_block #ing_block #ing_publish_wrapper #ing_publish_content{margin:0}#user_ing_block #ing_block #ing_publish_wrapper #ing_publish_content textarea{width:-webkit-fill-available;background:rgba(255,255,255,.5333333333);border-color:rgba(234,76,137,.3803921569);border-style:dotted;border-width:1px 0;padding:4px 6px;margin:4px;font-size:15px}#user_ing_block #ing_block #ing_publish_wrapper .ing_publish_block{margin:6px 0 0}#user_ing_block #ing_block #ing_publish_wrapper .ing_publish_block #btn_ing_publish{color:#fff;font-weight:bolder;background:#4378ff;border-radius:14px;margin:-8px 4px 0 0;font-style:normal;box-shadow:2px 1px 4px 0#4378ff;width:64px;height:36px;font-size:medium;padding:0;border:0}#user_ing_block #ing_block #ing_publish_wrapper .ing_publish_block .ing_type{opacity:.5;transition:all .1s cubic-bezier(.4,0,1,1)}#user_ing_block #ing_block #ing_publish_wrapper .ing_publish_block .ing_type:focus,#user_ing_block #ing_block #ing_publish_wrapper .ing_publish_block .ing_type:hover{opacity:1}.topic_nav_block_wrapper{display:flex}.topic_nav_block_wrapper .topic_nav_block{width:-webkit-fill-available;display:inline-flex;flex-wrap:nowrap;justify-content:space-around}.topic_nav_block_wrapper .topic_nav_block li a{background-color:transparent;border:0;font-size:medium}.topic_nav_block_wrapper .topic_nav_block li a.current_nav{border-radius:10px 10px 0 0}.topic_nav_block_wrapper .refresh_list{margin:3px 6px;width:40px}`;
		const refreshHeight = () => {
			unsafeWindow.parent.postMessage(
				{
					type: "resizeIframe",
					height: document.body.scrollHeight ?? document.body.clientHeight + 220,
				},
				"*",
			);
		};
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// 遍历所有变化
				if (mutation.type === "childList") {
					refreshHeight();
				} else if (mutation.type === "attributes") {
					// 属性变化
				}
			});
		});
		onload(() => {
			refreshHeight();

			// 观察 #main 元素
			observer.observe(document.getElementById("main"), {
				childList: true,
				attributes: false,
				subtree: true,
			});
		});

		delay(() => {
			// if (!document.querySelector(".pager")) return

			let timeout = 0;
			setInterval(() => {
				if (timeout > 0) timeout--;
			}, 1000);
			unsafeWindow.nextPage = nextPage;
			document.querySelectorAll(".pager").forEach((e) => e.remove());

			function receiveMessage(event) {
				const data = event.data;
				switch (data.type) {
					case "nextPage":
						nextPage();
						break;

					default:
						break;
				}
			}
			if (get("auto_pager_ing")) {
				unsafeWindow.addEventListener("message", receiveMessage, false);
			}

			function nextPage() {
				if (timeout > 0) return;
				timeout = 3;

				IngListType = "All";
				PageIndex = 2;
				getPage(
					`/ajax/ing/GetIngList?IngListType=${IngListType}&PageIndex=${PageIndex}&PageSize=30&Tag=&_=${Date.now()}`,
					{
						onload: (response) => {
							try {
								const doc = response.responseText;
								document.querySelector("#feed_list").insertAdjacentHTML("beforeend", doc);

								document.querySelectorAll(".feed_loading").forEach((e) => e.remove());
								document
									.querySelector("#feed_list")
									.insertAdjacentHTML(
										"beforeend",
										`<div class="feed_loading"><img align="absmiddle" src="//assets.cnblogs.com/images/loading.gif" alt=""> 正在加载数据...</div>`,
									);
								PageIndex++;
							} catch (e) {
								console.error("ERR", e, response.responseText);
							}
						},
						onerror: (response) => {
							console.error(`ERR: URL:${url}`, response);
						},
					},
				);
			}
		}, 400);

		return style;
	},
});

// logo.js
addModule({
key: "logo", 
	// LOGO替换
	pages: ["home"],
	showInMenu: true,
	value: `.navbar-branding>a{background:url(//common.cnblogs.com/images/logo/logo20170227.png);background-size:contain;background-repeat:no-repeat;width:auto;height:36px;display:block;margin-left:8px}.navbar-branding>a>img{display:none!important}`,
});

// menu.js
addModule({
key: "menu", 
	// sidenav
	pages: ["home"],
	showInMenu: true,
	value: () => {
		onload(() => {
			const sidenav = document.getElementsByClassName("sidenav")[0];
			function insertNavItem(pos, id, href, title, icon) {
				const li = document.createElement("li");
				li.id = id;
				li.className = "sidenav-item";
				li.innerHTML = `<a href="${href}" title="${title}">
                        <img src="${icon}">
                        <span>${title}</span>
                    </a>`;
				sidenav.insertAdjacentElement(pos, li);
				return li;
			}
			const sidenav_ing = insertNavItem(
				"afterBegin",
				"sidenav_ing",
				"#ing",
				"闪存",
				"https://assets.cnblogs.com/images/ing/lucky-star-3-1.png",
			);
			sidenav_ing.addEventListener("click", () => show_ing_iframe());

			const sidenav_home = insertNavItem(
				"afterBegin",
				"sidenav_home",
				"/",
				"主页",
				document.getElementById("user_icon").src,
			);
			if (/www.cnblogs.com\/#ing*$/.test(location.href)) {
				sidenav_ing.className += " current-nav";
			} else if (/www.cnblogs.com\/[^\/]*$/.test(location.href)) {
				sidenav_home.className += " current-nav";
			}

			setTimeout(() => {
				sidenav_home.querySelector("img").src = document.getElementById("user_icon").src;
			}, 320);
		});
	},
});

// side_right.js
addModule({
key: "side_right", 
	// 右侧吸底
	pages: ["home"],
	showInMenu: true,
	value: () => {
		fn = () => {
			const side = document.getElementById("side_right");
			if (side && side.clientHeight > window.innerHeight)
				side.style.top = `${window.innerHeight - side.clientHeight}px`;
			else setTimeout(fn, 200);
		};
		delay(fn, 200);
	},
});
})();