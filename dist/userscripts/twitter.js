// ==UserScript==
// @name         Twitter Tweets(X Posts) Blocker & Filter
// @name:en      Twitter Tweets(X Posts) Blocker & Filter[Moonstream]
// @name:zh      Twitter 推特推文(X帖子) 屏蔽器&过滤器[月潆]
// @name:zh-CN      Twitter 推特推文(X帖子) 屏蔽器&过滤器[月潆]
// @name:zh-TW      Twitter 推特推文(X帖子) 屏蔽器&过滤器[月潆]
// @name:ja      Twitter ツイッターのツイート(Xの投稿)ブロック&フィルター[月潆(つきろう)]
// @description The elegant moonlight bathes the stream of information, cleansing it: Customize filters  unwanted tweets (adult content etc). Support custom and importing rules.
// @description:en  The elegant moonlight bathes the stream of information, cleansing it: Customize filters  unwanted tweets (adult content etc). Support custom and importing rules.
// @description:zh  以皎洁高雅的月光洗礼信息溪流: 自定义屏蔽不想看到推文(黄推等),支持自定义;自定义推特图标等
// @description:zh-CN  以皎洁高雅的月光洗礼信息溪流: 自定义屏蔽不想看到推文(黄推等),支持自定义;自定义推特图标等
// @description:zh-TW  以皎洁高雅的月光洗礼信息溪流: 自定义屏蔽不想看到推文(黄推等),支持自定义;自定义推特图标等
// @description:ja  月光が情報の流れに洗礼を与え、浄化する: 迷惑なツイート(アダルト)をブロックまたは非表示にするために、フィルターをカスタマイズ可能
// @namespace    http://github.com/yuhanawa/UserScript
// @version      0.2.15
// @author       Yuhanawa
// @license      GPL-3.0
// @icon         none
// @run-at       document-start
// @connect      yuhan-script-config.netlify.app
// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @match        *://twitter.com/*
// @match        *://x.com/*
// ==/UserScript==

/* 
	 source: https://github.com/Yuhanawa/UserScript/; 
	 version: 0.2.15; 
 */
(function() {

var config = {"version":"0.2.15","category":[{"key":"tips","display":"tips","icon":"note-icon"},{"key":"core","display":"核心","icon":"core-icon"},{"key":"useful","display":"实用","icon":"useful-icon"}],"props":{"tips":{"type":"note","category":"tips","display":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471069/feedback/"},"tips-refresh":{"type":"note","category":"tips","display":"修改完成后请刷新页面"},"icon":{"display":"自定义图标开关","category":"useful","defaultValue":true,"type":"bool"},"icon_value":{"display":"自定义图标","category":"useful","defaultValue":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 335 276' fill='%233ba9ee'%3E%3Cpath d='m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35'/%3E%3C/svg%3E","description":"默认是小蓝鸟","hidden":"{{ formData.icon === 'off' }}"},"internal_blocker":{"display":"是否启用内置屏蔽规则(推荐)","category":"core","defaultValue":true,"type":"bool"},"show_note":{"display":"是否显示屏蔽提示","category":"core","defaultValue":true,"type":"bool"},"block_on_home":{"display":"是否在home页启用脚本","category":"core","defaultValue":true,"type":"bool"},"auto_block":{"display":"自动屏蔽被精准匹配的用户","category":"core","defaultValue":true,"type":"bool"},"auto_block_by_more":{"display":"自动屏蔽被用户名及BIO匹配的用户","category":"core","defaultValue":true,"type":"bool","hidden":"{{ formData.auto_block === 'off' }}"},"feed_rule":{"display":"规则订阅","category":"core","defaultValue":"","extra":"一行一条","type":"richText"},"feed_rule_cache":{"display":"规则查看","category":"core","defaultValue":"","extra":"目前支持预览功能,未来将支持快速添加与删除","type":"rules_viewer"},"user_rule":{"display":"自定义规则","category":"core","defaultValue":"// /支持正则/ \n\n#name\n// 用户名关键词\n\n#bio\n// 用户介绍关键词\n\n#text\n// 推文关键词 作用于正文","type":"user_rule_editor"}}};
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
String.prototype.hashCode = function () {
	let hash = 0;
	let i;
	let chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

function showToast(message) {
	const toast = document.createElement("div");
	toast.classList.add("toast");
	toast.textContent = message;

	setTimeout(() => {
		toast.classList.add("toast-active");
		setTimeout(() => {
			toast.classList.add("hide");
			setTimeout(() => {
				toast.remove();
			}, 3500);
		}, 3500);
	}, 500);

	document.body.appendChild(toast);
}

function getCookie(cname) {
	const name = `${cname}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; ++i) {
		const c = ca[i].trim();
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function blockUserByScreenName(screen_name) {
	const xhr = new XMLHttpRequest();

	// Open request
	xhr.open("POST", "https://api.twitter.com/1.1/blocks/create.json");
	xhr.withCredentials = true;

	// Set request headers
	xhr.setRequestHeader(
		"Authorization",
		"Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
	);
	xhr.setRequestHeader("X-Twitter-Auth-Type", "OAuth2Session");
	xhr.setRequestHeader("X-Twitter-Active-User", "yes");
	xhr.setRequestHeader("X-Csrf-Token", getCookie("ct0"));
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Send request
	xhr.send(`screen_name=${screen_name}`);
	console.log(`已为您自动屏蔽用户 ${screen_name}`);
	showToast(`已为您自动屏蔽用户 ${screen_name}`);
}
async function blockUserById(id, display) {
	const xhr = new XMLHttpRequest();

	// Open request
	xhr.open("POST", "https://api.twitter.com/1.1/blocks/create.json");
	xhr.withCredentials = true;

	// Set request headers
	xhr.setRequestHeader(
		"Authorization",
		"Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
	);
	xhr.setRequestHeader("X-Twitter-Auth-Type", "OAuth2Session");
	xhr.setRequestHeader("X-Twitter-Active-User", "yes");
	xhr.setRequestHeader("X-Csrf-Token", getCookie("ct0"));
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Send request
	xhr.send(`user_id=${id}`);
	console.log(`已为您自动屏蔽用户id ${id}, 用户名:${display ?? "未知"}`);
	showToast(`已为您自动屏蔽用户id ${id} ${display ? `用户名:${display}` : "(通过id精准匹配)"}`);
}

function check(rule, screen_name, key, target, notShowNote) {
	if (!target) return false;

	if (rule[key]?.some((i) => target?.includes(i))) {
		blackList.set(screen_name, {
			// id: id,
			screen_name: screen_name,
			rule: rule["rule-name"],
			type: key,
			notShowNote: notShowNote,
		});
	} else if (rule[`${key}-reg`]?.some((i) => i.test(target ?? ""))) {
		blackList.set(screen_name, {
			// id: id,
			screen_name: screen_name,
			rule: rule["rule-name"],
			type: `${key}-reg`,
			notShowNote: notShowNote,
		});
	} else return false;

	return true;
}

unsafeWindow.addEventListener("load", () => {
	if (!location.host.includes("x.com") && !location.host.includes("twitter.com")) return;

	const originalOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url) {
		if (
			// biome-ignore lint/correctness/noConstantCondition: TODO
			url.startsWith("https://twitter.com/i/api/2/notifications/all.json") &&
			false
		) {
			this.addEventListener("load", function () {
				// console.log('拦截到请求:', method, url);
				// console.log('响应内容:', this.responseText);

				if (this.responseText?.globalObjects?.users) {
					const users = this.responseText.globalObjects.users;
					for (const user of users) {
						const id = user.id_str;
						const name = user.name;
						const screen_name = user.screen_name;
						const location = user.location;
						const description = user.description;
						const created_at = user.created_at;
						const followers_count = user.followers_count;
						const friends_count = user.friends_count;
						const following = user.following;
						const url = user.url;

						if (whiteList.has(screen_name) || blackList.has(screen_name)) return;

						if (following) {
							whiteList.add(screen_name);
							continue;
						}

						const auto_block = get("auto_block");
						const auto_block_by_more = auto_block && get("auto_block_by_more");
						if (
							check(internalRule, screen_name, "name", name, auto_block) ||
							check(internalRule, screen_name, "bio", description, auto_block) ||
							check(internalRule, screen_name, "location", location, auto_block) ||
							check(internalRule, screen_name, "url", url, auto_block)
						) {
							if (auto_block) {
								blockUserById(id, screen_name);
								showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`);
							}
							continue;
						}

						for (const rule of rules) {
							if (rule.id_num?.some((i) => id === i)) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id-num",
								});
							} else if (rule.id?.some((i) => screen_name === i)) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id",
								});
							} else if (rule["id-reg"]?.some((i) => i.test(screen_name ?? ""))) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id-reg",
								});
							} else if (
								check(rule, screen_name, "name", name, auto_block_by_more) ||
								check(rule, screen_name, "bio", description, auto_block_by_more) ||
								check(rule, screen_name, "location", location, auto_block_by_more) ||
								check(rule, screen_name, "url", url, auto_block_by_more)
							) {
								if (auto_block_by_more) blockUserById(id, screen_name);
							} else continue;
							break;
						}
					}
				}
			});
		} else if (url.startsWith("https://twitter.com/i/api/graphql")) {
			// console.log("拦截到请求:", method, url);

			this.addEventListener("load", function () {
				// console.log("响应内容:", this.responseText);

				// 处理 result
				const handledResult = (result) => {
					// console.log(result);

					const legacy = result.legacy;

					const id = result.rest_id;
					const name = legacy.name;
					const created_at = legacy.created_at;
					const description = legacy.description;
					const followers_count = legacy.followers_count;
					const location = legacy.location;
					const screen_name = legacy.screen_name;
					const following = legacy.following ?? false;
					const blocking = legacy.blocking ?? false;
					const url = legacy.entities?.url?.urls[0]?.display_url ?? "";

					if (following) {
						whiteList.add(screen_name);
						return;
					}
					if (blocking) {
						blackList.set(screen_name, {
							id: id,
							screen_name: screen_name,
							rule: "blocking",
							type: "blocking",
							notShowNote: true,
						});
						return;
					}

					const auto_block = get("auto_block");
					const auto_block_by_more = auto_block && get("auto_block_by_more");
					if (
						check(internalRule, screen_name, "name", name, auto_block) ||
						check(internalRule, screen_name, "bio", description, auto_block) ||
						check(internalRule, screen_name, "location", location, auto_block) ||
						check(internalRule, screen_name, "url", url, auto_block)
					) {
						if (auto_block) {
							blockUserById(id, screen_name);
							showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`);
						}
						return;
					}

					for (const rule of rules) {
						if (rule.id_num?.some((i) => id === i)) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id-num",
							});
							if (auto_block) blockUserById(id, screen_name);
						} else if (rule.id?.some((i) => screen_name === i)) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id",
							});
							if (auto_block) blockUserById(id, screen_name);
						} else if (rule["id-reg"]?.some((i) => i.test(screen_name ?? ""))) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id-reg",
							});
						} else if (
							check(rule, screen_name, "name", name, auto_block_by_more) ||
							check(rule, screen_name, "bio", description, auto_block_by_more) ||
							check(rule, screen_name, "location", location, auto_block_by_more) ||
							check(rule, screen_name, "url", url, auto_block_by_more)
						) {
							if (auto_block_by_more) blockUserById(id, screen_name);
						} else continue;
					}
				};

				if (this.responseText.startsWith('{"data":{"user":{"result"')) {
					// 用户页
					handledResult(JSON.parse(this.responseText).data.user.result);
				} else if (this.responseText.includes("threaded_conversation_with_injections_v2")) {
					// 推文页
					const instructions = JSON.parse(this.responseText).data
						.threaded_conversation_with_injections_v2.instructions;

					for (entry of instructions.filter((i) => i.entries).map((i) => i.entries)) {
						for (content of entry.filter((i) => i.content).map((i) => i.content)) {
							let items = [];
							if (content.itemContent !== undefined) {
								items = [
									content?.itemContent?.tweet_results?.result?.tweet?.core ??
										content?.itemContent?.tweet_results?.result?.core,
								];
							} else if (content.items !== undefined) {
								items = content.items
									.filter((i) => i.item?.itemContent?.tweet_results?.result?.core)
									.map((i) => i.item.itemContent.tweet_results.result.core);
							}

							for (const core of items) {
								if (core == null || core === undefined) {
									continue;
								}

								handledResult(core.user_results.result);
							}
						}
					}
				} else {
					// console.log(`content:${this.responseText}`);
				}
			});
		}

		// biome-ignore lint/style/noArguments: TODO
		originalOpen.apply(this, arguments);
		// console.log(blackList);
	};
});

const urlListenCallbacks = [];
function UrlListener(callback) {
	urlListenCallbacks.push(callback);
}
let old_url = "";
setInterval(() => {
	if (old_url !== window.location.href) {
		urlListenCallbacks.forEach((callback) =>
			callback({
				old_url: old_url,
				new_url: window.location.href,
			}),
		);
		old_url = window.location.href;
	}
}, 500);

let internalRuleStr = "";
if (get("internal_blocker")) {
	internalRuleStr = `
#rule-name
内置屏蔽规则
#rule-description
最高优先级
#rule-lastupdate
2077-02-31
#rule-more
null

#name
🔞
反差
私信领福利
同城
可约

#bio
/(?=.*(私))(?=.*(福利))/
/(?=.*(同城))(?=.*(约))/
/(?=.*(寂寞|孤独|刺激|激情|情趣))(?=.*(性|骚扰))/
/(?=.*(年轻|未成年|青少年|\d{2}以下)|未满\d{2})(?=.*(勿扰))/
/(.*(男[Mm]|女[Ss]|反差|调教|人妻|勿扰|(探索|玩法)|(线下|同城|私信|电报|联系)|(sm|SM))){4}/
/(.*(另一面|渴望|冲动|脱|放肆|人妻|宣泄|寂寞|孤独|刺激|激情|情趣|性|骚扰|(电报|私信|联系)|(线下|同城))){5}/
t.me/dwaydgfuya
t.me/OgdenDelia14
t.me/RefMonster3
t.me/cdyu168

#url
t.me/dwaydgfuya
t.me/OgdenDelia14
t.me/RefMonster3
t.me/Anzzmingyue
t.me/Kau587
t.me/MegNaLiSha520
t.me/nDxyS520
t.me/SegWKeC520

#text
/^想上课的私信主人/
/^太阳射不进来的地方/
/^挂空就是舒服，接点地气/
/^总说我下面水太多/
/^在这个炮火连天的夜晚/
/^只进入身体不进入生活/
/^生活太多伪装，只能在推上面卸下伪装/
/^生活枯燥无味，一个人的夜晚总想找个/
/^我每天都有好好的穿衣服.*俘获/
/^人不可能每一步都正确，我不想回头看，也不想批判当时的自己/
/^如果你连试着的胆量也没有，你也就配不上拥有性福/
/^我希望以后可以不用再送我回家，而是我们一起回我们的家/
/^勇敢一点我们在.*就有故事/
/^只要你主动一点点我们就会有机会.*线下/
`;
}
const internalRule = parseRule(internalRuleStr);

const rules = new Set();
const whiteList = new Set();
const blackList = new Map();

function parseRule(str) {
	if (!str || str.trim() === "") return;
	let key;
	const rule = {};
	for (line of str.split("\n")) {
		line = line.trim();
		if (!line || line.startsWith("//")) continue;

		if (line.startsWith("#")) {
			key = line.slice(1);
			if (line.startsWith("#rule-")) {
				rule[key] = "";
			} else {
				rule[key] = [];
				rule[`${key}-reg`] = [];
			}
		} else {
			if (key.startsWith("rule-")) rule[key] += line;
			else if (line.startsWith("/") && line.endsWith("/"))
				rule[`${key}-reg`].push(new RegExp(line.slice(1, line.length - 1)));
			else rule[key].push(line);
		}
	}
	return rule;
}

function loadRule(str) {
	rules.add(parseRule(str));
}

// auto_block.js
addModule({
key: "auto_block", 
	// 自动屏蔽被精准匹配的用户
	value: null,
});

// block_on_home.js
addModule({
key: "block_on_home", 
	// 在关注和推荐页面是否启用屏蔽功能
	value: null,
});

// config.js
addModule({
key: "config", 
	runAlways: true,
	value: () => {
		delay(async () => {
			let callback_num = 0;

			const getText = (url, callback) => {
				callback_num += 1;
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					headers: {
						"Content-Type": "application/json",
					},
					onload: (response) => {
						callback(response.responseText);
						callback_num -= 1;
					},
				});
			};
			const onupdate = (reload) => {
				if (callback_num === 0) {
					set("feed_rule_cache_last_check", Date.now());
					set("feed_rule_cache", ruleObj);

					if (reload) location.reload();

					const btn = document.createElement("button");
					btn.onclick = () => location.reload();
					btn.className = "note-update";
					btn.innerText = "屏蔽器规则更新完成|刷新即可生效|点击刷新";
					document.body.insertAdjacentElement("beforeend", btn);
				} else {
					setTimeout(() => onupdate(reload), 1000);
				}
			};

			const user_rule = parseRule(get("user_rule"));
			if (user_rule) {
				user_rule["rule-name"] = "自定义用户规则";
				rules.add(user_rule);
			}

			const feed = get("feed_rule").trim();
			const feed_hash = feed.hashCode();

			let ruleObj = get("feed_rule_cache", {});
			if (feed_hash !== get("feed_rule_hash")) {
				set("feed_rule_hash", feed_hash);
				set("feed_rule_cache", {});
				ruleObj = {};

				const btn = document.createElement("button");
				btn.onclick = () => location.reload();
				btn.className = "note-update";
				btn.innerText = "屏蔽器规则已清空|正在重新获取规则";
				btn.style.zIndex = "10086";
				document.body.insertAdjacentElement("beforeend", btn);

				for (let url of feed.split("\n")) {
					url = url.trim();
					if (url.length === 0) continue;

					getText(url, (str) => {
						ruleObj[url] = str;
						set("feed_rule_cache", ruleObj);
					});
				}

				setTimeout(() => onupdate(true), 1200);
				set("feed_rule_cache_last_check", Date.now());
			}
			const lastCheckTime = get("feed_rule_cache_last_check", 0);

			for (const key of Object.keys(ruleObj)) {
				loadRule(ruleObj[key]);
			}
			// 一天检查一次
			if (Date.now() - lastCheckTime > 24 * 60 * 60 * 1000) {
				for (const url of Object.keys(ruleObj)) {
					getText(url, (str) => {
						ruleObj[url] = str;
						set("feed_rule_cache", ruleObj);
					});
				}
				setTimeout(() => onupdate(), 800);
			}
		}, 250);
	},
});

// filter.js
addModule({
key: "filter", 
	//屏蔽器总开关
	value: () => {
		const filter = () => {
			if (
				!get("block_on_home") &&
				(location.href.includes("twitter.com/home") || location.href.includes("x.com/home"))
			)
				return;

			const articles = document.querySelectorAll("article:not([data-filter-checked])");
			for (const article of articles) {
				try {
					article.setAttribute("data-filter-checked", "true");

					const id = article
						.querySelector("div[data-testid='User-Name'] a > div > span")
						?.innerText.substring(1);

					// console.log(whiteList);
					if (whiteList.has(id)) continue;

					if (!blackList.has(id)) {
						const articleText = article.innerText;
						const retweet = article.querySelector(
							"span[data-testid='socialContext'] > span >span",
						)?.innerText;
						const text = article.querySelector("div[lang]")?.innerText ?? "";

						if (articleText === "这个帖子来自一个你已屏蔽的账号。\n查看" && text === "") {
							article.style.display = "none";
							showToast("隐藏了一条来自已屏蔽的账号的推文");
							continue;
						}

						for (const rule of rules) {
							try {
								if (
									check(rule, id, "name", retweet) ||
									check(rule, id, "text", text) ||
									check(rule, id, "all", articleText)
								) {
									break;
								}
							} catch {}
						}
					}

					// console.log(whiteList);
					// console.log(blackList);
					if (blackList.has(id)) {
						article.style.display = "none";
						if (
							get("show_note") &&
							blackList.get(id).notShowNote !== true &&
							blackList.get(id).type !== "id" &&
							blackList.get(id).type !== "id_sum"
						) {
							const note = document.createElement("div");
							note.innerHTML = `<div class="note-tweet">推文已被<a href="" target="_blank">屏蔽器</a>通过⌊${
								blackList.get(id).rule
							}⌉(${
								blackList.get(id).type
							})规则屏蔽,点击显示推文(你可以通过设置不再显示该提示)</div>`;
							note.onclick = () => {
								article.style.display = "block";
								note.style.display = "none";

								const blockbtn = document.createElement("a");
								blockbtn.className = "block_btn";
								blockbtn.innerText = "屏蔽用户";
								blockbtn.onclick = () => {
									blockUserByScreenName(id);
									article.style.display = "none";
								};
								article
									.querySelector("div[data-testid=caret]")
									.parentElement.parentElement.parentElement.insertAdjacentElement(
										"beforeBegin",
										blockbtn,
									);
							};
							article.parentElement.appendChild(note);
						}
					}
				} catch (error) {
					// 忽略错误
					// console.error(error);
				}
			}
		};
		const wait = () => {
			if (!document.querySelector("main")) {
				setTimeout(wait, 200);
				return;
			}

			new MutationObserver(filter).observe(document.querySelector("main"), {
				attributes: false,
				childList: true,
				subtree: true,
			});
		};
		wait();

		return `.note-tweet{transition:opacity .5s ease-out 0s color .3s ease-out 0s;opacity:.9;padding:2px 16px;border:#eff3f4 1px;cursor:pointer;font-size:13px;color:#636366}.note-tweet a{color:#666680}.note-tweet:hover{opacity:1;background-color:rgba(247,247,247,.9333333333);color:#303023}.note-tweet:hover a{color:#55f}.block_btn,.note-update{color:#00f;text-decoration:underline;cursor:pointer}.note-update{position:fixed;right:20px;bottom:20px;background:#b0c4de;box-shadow:gray 2px 2px 10px 2.2px;font-size:16px;padding:12px;border-radius:8px;border:1px;z-index:114514;opacity:.4}.block_btn{margin:4px}.toast{position:fixed;right:28px;top:24px;background:rgba(49,255,83,.5333333333);color:#1d9bf0;box-shadow:#fff 2px 2px 10px 2.2px;font-size:16px;padding:8px;border-radius:4px;border:1px;z-index:114514;opacity:0;backdrop-filter:blur(4px);transform:translateX(100%);transition:opacity .3s ease-out 0s,transform .3s ease-out 0s}.toast-active,.toast:hover{opacity:1;transform:translateX(0);transition:opacity .4s ease-out 0s,transform .25s ease-out 0s}.toast-active{opacity:.8}.hide{opacity:0}`;
	},
});

// icon.js
addModule({
key: "icon", 
	// 自定义推特图标
	value: () => {
		return `body{--twitter-icon-value: url("${get("icon_value")}") ${`@charset "UTF-8";header h1 a[href="/home"]{margin:6px 4px 2px}header h1 a[href="/home"] div{background-image:var(--twitter-icon-value);background-size:contain;background-position:center;background-repeat:no-repeat;margin:4px}header h1 a[href="/home"] div svg{display:none}header h1 a[href="/home"] :hover :after{content:"图标已被修改为自定义图标";font:message-box;position:absolute;left:48px}`}`;
	},
});

// setting.js
addModule({
key: "setting", 
	// 添加设置按钮
	value: () => {
		const fn = () => {
			const footer = document.querySelector("nav.css-1dbjc4n.r-18u37iz.r-1w6e6rj.r-ymttw5");
			if (footer && !footer.hasFilterSetting) {
				const a = document.createElement("a");
				a.href = "https://yuhan-script-config.netlify.app/?menuKey=twitter";
				a.innerText = "⚙️ Filter Setting";
				a.target = "_blank";
				a.style = "margin: 4px;font-size: 16px;color: #4ea1db;opacity: 0.75;";
				footer.append(a);
				footer.hasFilterSetting = true;
			} else {
				setTimeout(() => {
					fn();
				}, 100);
			}
		};
		delay(() => {
			UrlListener((i) => {
				fn();
			});
		}, 200);
	},
});
})();