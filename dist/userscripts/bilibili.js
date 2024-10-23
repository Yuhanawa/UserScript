// ==UserScript==
// @warning      脚本永久停止更新   2024-10-23
// @namespace    http://github.com/yuhanawa/UserScript
// @name         BILIBILI-Beautify
// @name:zh      哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @name:zh-CN   哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @name:zh-TW   哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @name:en      BILIBIL Beautify Ienhancement custom background
// @name:ja      BILIBILI 美化｜強化｜カスタム背景｜レビューフィルタリング
// @namespace    http://github.com/yuhanawa/UserScript
// @version      0.2.21
// @description         Bilibili beautification | enhancement | custom background | comment filtering, etc
// @description:zh      哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @description:zh-CN   哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @description:zh-TW   哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @description:en      Bilibili beautification | enhancement | custom background | comment filtering, etc
// @description:ja     BILIBILI 美化｜強化｜カスタム背景｜レビューフィルタリングなど
// @author       Yuhanawa
// @license      GPL-3.0
// @match        *://*.bilibili.com/*
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

/* 
	 source: https://github.com/Yuhanawa/UserScript/; 
	 version: 0.2.21; 
 */
(function() {

var config = {"version":"0.2.21","name":"bilibili","pages":{"home":["www.bilibili.com"],"video":["www.bilibili.com/video"],"read":["www.bilibili.com/read"]},"category":[{"key":"tips","display":"tips","icon":"📢"},{"key":"beautify","display":"美化","icon":"🎨"},{"key":"general","display":"通用","icon":"*"},{"key":"home","display":"主页","icon":"<svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"zhuzhan-icon\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z\" fill=\"currentColor\"></path></svg>"},{"key":"video","display":"视频页","icon":"<img src='https://i0.hdslb.com/bfs/static/jinkela/long/gif/loading-blue.gif' />"},{"key":"optimize","display":"优化","icon":"⚡"},{"key":"useful","display":"实用","icon":"🔧"},{"key":"filter","display":"过滤","icon":"😅"}],"props":{"tips":{"type":"note","category":"tips","display":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471069/feedback/"},"tips-refresh":{"type":"note","category":"tips","display":"修改完成后请刷新页面"},"tips-general":{"type":"note","category":"general","display":"-- 通用 --"},"header":{"display":"顶部菜单","type":"option","category":"general","defaultValue":"blur","options":[{"key":"blur","display":"毛玻璃效果"},{"key":"fixed","display":"固定(不跟随页面)"},{"key":"default","display":"默认(不做修改)"}]},"footer":{"display":"页脚信息","type":"option","category":"general","defaultValue":"hidden","options":[{"key":"hidden","display":"隐藏"},{"key":"default","display":"默认(不做修改)"}]},"tips-beautify":{"type":"note","category":"beautify","display":"-- 美化 --"},"beautify":{"display":"样式美化","type":"bool","category":"beautify","defaultValue":true,"description":"此功能是部分功能的前置功能"},"beautify_work_on_index":{"display":"是否在首页启用样式美化","category":"beautify","type":"bool","defaultValue":true,"description":"前置功能:样式美化","hidden":{"condition":"!get('beautify')","bind":["beautify"]}},"background":{"display":"自定义背景开关","category":"beautify","type":"bool","defaultValue":true},"background_value":{"display":"自定义背景","defaultValue":"https://s1.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg.png","category":"beautify","description":"前置功能:自定义背景开关","tooltip":"填图片链接或者上传图片","type":"image","hidden":{"condition":"!get('background')","bind":["background"]}},"video_radius":{"display":"视频小圆角","category":"beautify","type":"bool","defaultValue":true,"hidden":{"condition":"!get('beautify')","bind":["beautify"]}},"tips-video-beautify":{"type":"note","category":"video","display":"-- 视频页 --"},"video_beautify":{"display":"视频页美化","category":"video","type":"bool","defaultValue":true},"auto_wide":{"display":"自动进入宽屏模式","category":"video","type":"bool","defaultValue":false,"description":"此功能为自动进入视频播放器的宽屏模式"},"widescreen":{"display":"宽屏功能","category":"video","type":"bool","defaultValue":true,"description":"此功能为减少页面两侧空白,将页面放宽"},"widescreen-width-times":{"display":"宽屏倍数","type":"number","defaultValue":1.1,"required":true,"category":"video","tooltip":"单位: 倍","description":"前置功能:宽屏功能|推荐范围1.00~1.30倍","hidden":{"condition":"!get('widescreen')","bind":["widescreen"]}},"widescreen_hide_header_onWide":{"display":"剧场模式下隐藏网页顶部菜单","type":"bool","category":"video","defaultValue":false,"description":"前置功能:宽屏功能","hidden":{"condition":"!get('widescreen')","bind":["widescreen"]}},"tips-home":{"type":"note","category":"home","display":"-- 主页 --"},"remove_carousel_and_feed_card":{"display":"移除轮播图及周边区域","category":"home","type":"bool","defaultValue":false},"remove_special_card":{"display":"移除左上角带有特殊标识的卡片","category":"home","type":"bool","defaultValue":false},"header_channel":{"display":"将频道菜单移动到banner","type":"option","category":"home","defaultValue":"default","options":[{"key":"transparent","display":"半透明"},{"key":"hidden","display":"完全隐藏(透明)"},{"key":"default","display":"默认(不做修改)"}]},"banner_shadow":{"display":"Banner阴影","category":"home","type":"bool","defaultValue":true},"card_shadow":{"display":"卡片阴影开关","category":"home","type":"bool","defaultValue":true},"card_shadow_value":{"display":"卡片阴影","category":"home","type":"text","defaultValue":"1px 1px 8px 2px #fb729930","hidden":{"condition":"!get('card_shadow')","bind":["card_shadow"]}},"tips-optimize":{"type":"note","category":"optimize","display":"-- 优化 --"},"ad":{"display":"移除广告","category":"optimize","type":"bool","defaultValue":true},"remove_keyword_search":{"display":"移除关键词搜索标志(失效)","category":"optimize","type":"option","options":[{"key":"icon","display":"隐藏🔍图标"},{"key":"color","display":"隐藏图标和恢复颜色"},{"key":"link","display":"彻底移除"},{"key":"off","display":"已关闭"}],"defaultValue":"icon"},"video_live_recommand":{"display":"去除视频页直播推荐","category":"optimize","type":"bool","defaultValue":true},"tips-useful":{"type":"note","category":"useful","display":"-- 实用 --"},"quickly_copy":{"display":"标题快捷复制","type":"option","category":"useful","defaultValue":"all","options":[{"key":"all","display":"[标题]链接"},{"key":"BV","display":"BV"},{"key":"url","display":"链接"},{"key":"title","display":"标题"},{"key":"off","display":"已关闭"}]},"video_cover_download":{"display":"视频封面获取","type":"bool","category":"useful","defaultValue":true},"hotkey":{"display":"按ESC关闭评论区图片","category":"useful","defaultValue":true,"description":"","type":"bool"},"tips-filter":{"type":"note","category":"filter","display":"-- 过滤 --"},"filter":{"display":"评论过滤","category":"filter","type":"bool","description":"此功能为经测试,可能存在bug","defaultValue":false},"filter_rules":{"display":"正则过滤规则","type":"richtext","defaultValue":"/^.?6{1,12}.?$/ \n/^(@.{1,12}\\s?.{0,12}){1,24}$/ \n/压缩毛巾/ \n/答辩/ \n/爷/ \n/谁问你了/ \n/亡灵军团/ \n/死灵法师/ \n","category":"filter","props":{"placeholder":"","autoSize":true},"description":"此功能为经测试,可能存在bug","tooltip":{"title":"使用正则表达式,一行一个"},"hidden":{"condition":"!get('filter')","bind":["filter"]}}}};
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

// ad.js
addModule({
key: "ad", 
	// 广告屏蔽
	showInMenu: true,
	value: `@charset "UTF-8";.bili-video-card:has(svg.bili-video-card__info--ad),.feed-card:has(svg.bili-video-card__info--ad){display:none}#bannerAd,#slide_ad,.adblock-tips{display:none}`,
});

// auto_wide.js
addModule({
key: "auto_wide", 
	pages: ["video"],
	value: () => {
		const wide = () => {
			const e = document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-wide");
			if (!e) setTimeout(wide, 250);

			win?.PlayerAgent?.player_widewin();
			e?.click();
		};
		wide();
	},
});

// background.js
addModule({
key: "background", 
	// 自定义背景
	showInMenu: true,
	value: () => {
		if (get("background")) {
			style(`html,:root{--background:url(${get("background_value")})}`);
		}
		return `:root,html{background-attachment:fixed!important;background:var(--background);background-repeat:no-repeat repeat;background-size:100% 100%;bottom:0}:root body,html body{background-color:transparent}`;
	},
});

// beautify.js
addModule({
key: "beautify", 
	// (美化总开关)样式美化 & 自定义背景等
	showInMenu: true,
	value: () => {
		if (location.href === "https://www.bilibili.com/" && get("beautify_work_on_index") === false)
			return;

		if (get("video_radius")) {
			style(`:root body .bpx-player-video-area,:root body video,html body .bpx-player-video-area,html body video{border-radius:4px 4px 0 0}:root body #bilibili-player-placeholder,html body #bilibili-player-placeholder{box-shadow:0-2px 4px 1px rgba(255,255,255,.1);border-radius:4px 4px 12px 12px}:root body #bilibili-player-placeholder #bilibili-player-placeholder-top,html body #bilibili-player-placeholder #bilibili-player-placeholder-top{border-radius:4px 4px 0 0;background:0 0!important}:root body #bilibili-player-placeholder #bilibili-player-placeholder-bottom,html body #bilibili-player-placeholder #bilibili-player-placeholder-bottom{border-radius:0 0 12px 12px}`);
		}

		return `:root,html{background-attachment:fixed!important;background:var(--background);background-repeat:no-repeat repeat;background-size:100% 100%;bottom:0;--text3:var(--text2)}:root body,html body{background-color:transparent;height:auto}:root body .app-v1,:root body .fixed-reply-box,:root body .visitor,html body .app-v1,html body .fixed-reply-box,html body .visitor{background-color:rgba(255,255,255,.68)!important}:root body .bili-live-card__wrap,:root body .bili-video-card__wrap,:root body .floor-card-inner,html body .bili-live-card__wrap,html body .bili-video-card__wrap,html body .floor-card-inner{background-color:rgba(255,255,255,.6)!important;box-shadow:1px 1px 3px 0 rgba(245,245,245,.5);backdrop-filter:blur(10px)}:root body .bili-live-card__wrap:hover,:root body .bili-video-card__wrap:hover,:root body .floor-card-inner:hover,html body .bili-live-card__wrap:hover,html body .bili-video-card__wrap:hover,html body .floor-card-inner:hover{background-color:rgba(255,255,255,.8)!important;box-shadow:1px 1px 3px 0 rgba(245,245,245,.7);backdrop-filter:blur(12px)}:root body #i_cecream,html body #i_cecream{background-color:rgba(255,255,255,.24)!important}:root body .bili-header,:root body .bili-header__channel,html body .bili-header,html body .bili-header__channel{background-color:transparent}:root body #activity_vote .right ::after,:root body .act-end .right ::after,:root body .activity-m-v1 .right ::after,:root body .floor-single-card .layer,html body #activity_vote .right ::after,html body .act-end .right ::after,html body .activity-m-v1 .right ::after,html body .floor-single-card .layer{display:none}:root body .floor-card,html body .floor-card{background:0 0}:root body .bili-video-card__wrap,html body .bili-video-card__wrap{padding:2px 1px 4px 2px;border-radius:8px}:root body .bili-live-card__wrap,html body .bili-live-card__wrap{border-radius:8px}:root body .bili-live-card__wrap .bili-video-card__image .v-img.bili-video-card__cover,:root body .bili-video-card__wrap .bili-video-card__image .v-img.bili-video-card__cover,html body .bili-live-card__wrap .bili-video-card__image .v-img.bili-video-card__cover,html body .bili-video-card__wrap .bili-video-card__image .v-img.bili-video-card__cover{border-radius:6px 6px 1px 1px}:root body .bili-live-card__wrap .bili-live-card__info,:root body .bili-live-card__wrap .bili-video-card__info,:root body .bili-video-card__wrap .bili-live-card__info,:root body .bili-video-card__wrap .bili-video-card__info,html body .bili-live-card__wrap .bili-live-card__info,html body .bili-live-card__wrap .bili-video-card__info,html body .bili-video-card__wrap .bili-live-card__info,html body .bili-video-card__wrap .bili-video-card__info{padding:0 4px 4px}:root body .bili-live-card__wrap,html body .bili-live-card__wrap{padding:2px 2px 24px}:root body .fixed-reply-box,:root body .left-container-under-player,:root body .right-container,:root body .visitor,html body .fixed-reply-box,html body .left-container-under-player,html body .right-container,html body .visitor{opacity:.97}:root body #activity_vote,:root body .act-end,:root body .activity-m-v1,html body #activity_vote,html body .act-end,html body .activity-m-v1{border-radius:12px;background:rgba(255,255,255,.72);opacity:.97}:root body #activity_vote .right .b-img,:root body .act-end .right .b-img,:root body .activity-m-v1 .right .b-img,html body #activity_vote .right .b-img,html body .act-end .right .b-img,html body .activity-m-v1 .right .b-img{mask:linear-gradient(90deg,transparent,#fff)}:root body .bili-comment,:root body .browser-pc,html body .bili-comment,html body .browser-pc{background-color:rgba(255,255,255,.68)!important;border-radius:10px;padding:0;margin:0}:root body #comment,html body #comment{margin-top:2px;padding:0;border-radius:10px}:root body #comment .reply-list,html body #comment .reply-list{padding:0 18px 0 2px}:root body .left-container-under-player,html body .left-container-under-player{background-color:transparent!important}:root body #arc_toolbar_report,html body #arc_toolbar_report{margin-top:-5px;padding-top:20px;padding-left:12px;padding-right:12px;border:0;opacity:.85;background-color:rgba(255,255,255,.65)!important;border-radius:0 0 6px 6px;transition:opacity .1s ease-in 0s}:root body #arc_toolbar_report:focus,:root body #arc_toolbar_report:hover,:root body .video-desc-container:focus,:root body .video-desc-container:hover,html body #arc_toolbar_report:focus,html body #arc_toolbar_report:hover,html body .video-desc-container:focus,html body .video-desc-container:hover{opacity:1}:root body .video-desc-container,html body .video-desc-container{padding:10px 8px 14px;margin:0;opacity:.68;transition:opacity .1s ease-in 0s}:root body .video-tag-container,html body .video-tag-container{margin:0;padding:8px 2px 2px;border-style:dashed;border-width:1px 0;border-color:#e3e5e7;border-color:var(--text4)}:root body .tag-link .newchannel-link,:root body .video-tag-container .tag-panel a,html body .tag-link .newchannel-link,html body .video-tag-container .tag-panel a{background:#fff}:root body .bili-header__bar .mini-header,html body .bili-header__bar .mini-header{opacity:.96}:root body .reply-header,html body .reply-header{margin:0 0-4px 14px;padding:12px 0 0 2px}:root body .reply-box,html body .reply-box{padding-right:16px!important}:root body .danmaku-wrap>.bpx-docker,html body .danmaku-wrap>.bpx-docker{background:0 0}:root body #viewbox_report,html body #viewbox_report{margin-bottom:16px;padding:2px;height:fit-content;transition:all .35s}:root body #viewbox_report:focus,:root body #viewbox_report:hover,html body #viewbox_report:focus,html body #viewbox_report:hover{box-shadow:1px -1px 6px 4px #f5f5f5;background-color:#f5f5f5;padding:4px;font-size:13px;border-radius:12px}:root body .video-info-container,html body .video-info-container{padding-top:4px;margin-top:20px}:root body .video-info-container .show-more,html body .video-info-container .show-more{display:none}:root body #bilibili-player-placeholder,html body #bilibili-player-placeholder{box-shadow:0-2px 4px 1px rgba(255,255,255,.1)}:root body #bilibili-player-placeholder #bilibili-player-placeholder-top,html body #bilibili-player-placeholder #bilibili-player-placeholder-top{background:0 0!important}` + `.history-wrap .b-head-search{background:rgba(255,255,255,.5);border:1px rgba(204,208,215,.8);backdrop-filter:blur(4px);transition:all .25s}.history-wrap .b-head-search .b-head-search_input{background:0 0}.history-wrap #history_list{transition:all .25s}.history-wrap #history_list .history-record{margin:8px auto}.history-wrap #history_list .r-info.clearfix{background:rgba(255,255,255,.25);padding:10px 6px;border-radius:10px;backdrop-filter:blur(4px)}.history-wrap #history_list .r-info.clearfix .r-txt{width:auto}.history-wrap #history_list .r-info.clearfix .r-txt .history-delete{opacity:.4;right:16px}.history-wrap #history_list .r-info.clearfix:focus,.history-wrap #history_list .r-info.clearfix:hover{background:rgba(255,255,255,.45);backdrop-filter:blur(10px)}.history-wrap #history_list .r-info.clearfix:focus .r-txt .history-delete,.history-wrap #history_list .r-info.clearfix:hover .r-txt .history-delete{opacity:1}`;
	},
});

// filter.js
addModule({
key: "filter", 
	// 评论过滤
	pages: ["video", "read"],
	showInMenu: true,
	value: (f) => {
		const rules = f.rules();
		const check = (x) => {
			try {
				// 获取回复内容元素
				const ctx = x.getElementsByClassName("reply-content")[0];
				// 如果已处理或内容为空则跳过
				if (x.classList.contains("🎇checked") || ctx.innerHTML === "") return;
				// 标记元素x已处理
				x.classList.add("🎇checked");
				// 如果回复内容文字长度大于限制(25)则跳过
				if (Number(ctx.outerText) > get("filter_length_limit", 25)) return;
				if (ctx.innerHTML !== "" && ctx.innerText === "") return;

				for (const r of rules) {
					if (r.test(x.getElementsByClassName("reply-content")[0].outerText)) {
						x.classList.add("🎇filtered");
						console.log(
							`已屏蔽: ${
								x.getElementsByClassName("reply-content")[0].outerText
							} \n 规则: ${r.toString()}`,
						);
						break;
					}
				}
			} catch (e) {
				x.classList.add("🎇checked");
			}
		};

		delay(
			() => {
				for (const x of document.getElementsByClassName("reply-item")) check(x);
				for (const x of document.getElementsByClassName("sub-reply-item")) check(x);
			},
			2000,
			{ loop: true },
		);

		return ".🎇filtered{display:none;}";
	},
	rules: () => {
		try {
			return get("filter_rules")
				.split("\n")
				.filter((x) => x.trim() !== "")
				.map((x) => {
					if (x.startsWith("/") && x.endsWith("/")) {
						return x.substring(1, x.length - 1);
					}
					return x;
				})
				.filter((x) => x.trim() !== "")
				.map((x) => new RegExp(x));
		} catch (error) {
			console.error(error);
			return [];
		}
	},
});

// footer.js
addModule({
key: "footer", 
	value: {
		default: null,
		hidden: ".bili-footer{display:none !important}",
	},
});

// header.js
addModule({
key: "header", 
	value: {
		default: "",
		fixed: ".header-channel,.bili-header__bar.slide-down{display: none!important;}",
		blur: `:root body .bili-header .bili-header__bar.mini-header,html body .bili-header .bili-header__bar.mini-header{backdrop-filter:blur(8px);background:rgba(255,255,255,.75);opacity:.85}:root body .bili-header .bili-header__bar.mini-header:hover,html body .bili-header .bili-header__bar.mini-header:hover{backdrop-filter:blur(10px);opacity:1;background:rgba(255,255,255,.8)}:root body .bili-header .bili-header__bar.slide-down,html body .bili-header .bili-header__bar.slide-down{box-shadow:0 1px 4px rgba(0,0,0,.05)!important;background:rgba(255,255,255,.75);backdrop-filter:blur(10px)}:root body .header-channel,html body .header-channel{background:rgba(255,255,255,.55);backdrop-filter:blur(5px)}:root body .header-channel:has(.header-channel-fixed-down),html body .header-channel:has(.header-channel-fixed-down){background:rgba(255,255,255,.7);backdrop-filter:blur(8px)}`,
	},
});

// banner_shadow.js
addModule({
key: "banner_shadow", 
	value: `.bili-header__banner{box-shadow:0 1px 16px 1px rgba(57,98,153,.8588235294)}`,
});

// card_shadow.js
addModule({
key: "card_shadow", 
	value: `.bili-video-card bili-video-card__wrap{box-shadow: ${cfg("card_shadow_value")};}`,
});

// header_channel.js
addModule({
key: "header_channel", 
	value: {
		default: null,
		transparent: `#i_cecream>div.bili-feed4 .bili-header .bili-header__channel{position:absolute;top:60px;transition:all .45s ease;background:0 0;opacity:.15}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel:hover{opacity:1;background:rgba(255,255,255,.1);backdrop-filter:blur(5px)}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-icons__item,#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-link__right{color:var(--text4)}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-link__right svg{fill:var(--text4)}main.bili-feed4-layout{margin-top:16px!important}.inner-logo{display:none!important}`,
		hidden: `#i_cecream>div.bili-feed4 .bili-header .bili-header__channel{position:absolute;top:60px;transition:all .45s ease;background:0 0;opacity:0}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel:hover{opacity:1;background:rgba(255,255,255,.1);backdrop-filter:blur(5px)}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-icons__item,#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-link__right{color:var(--text4)}#i_cecream>div.bili-feed4 .bili-header .bili-header__channel .channel-link__right svg{fill:var(--text4)}main.bili-feed4-layout{margin-top:16px!important}.inner-logo{display:none!important}`,
	},
});

// remove_carousel_and_feed_card.js
addModule({
key: "remove_carousel_and_feed_card", 
	// 移除轮播图及周边区域
	pages: ["home"],
	value: `main div.container.is-version8 .feed-card,main div.container.is-version8 .feed-roll-btn,main div.container.is-version8 div.recommended-swipe.grid-anchor{display:none!important}`,
});

// remove_special_card.js
addModule({
key: "remove_special_card", 
	// 移除左上角带特殊标识的卡片
	pages: ["home"],
	value: `.floor-single-card{display:none}.bili-video-card,.feed-card{min-height:248px}`,
});

// hotkey.js
addModule({
key: "hotkey", 
	// 快捷键增强
	pages: ["video"],
	showInMenu: false,
	value: () => {
		// TODO 烂代码 需重构
		delay(
			() => {
				const img_view = document.querySelector(".reply-view-image");
				if (!img_view) return;

				img_view.addEventListener("keydown", (e) => {
					if (e.key === "Escape") img_view.getElementsByClassName("close-container")[0].click();
					if (e.key === "a" || e.key === "ArrowLeft")
						img_view.getElementsByClassName("last-image")[0].click();
					if (e.key === "d" || e.key === "ArrowRight")
						img_view.getElementsByClassName("next-image")[0].click();
				});
			},
			1200,
			{ loop: true },
		);
	},
});

// quickly_copy.js
addModule({
key: "quickly_copy", 
	// 标题快捷复制
	pages: ["video"],
	showInMenu: true,
	value: {
		all: (feature) => {
			feature.fn(
				"[标题]链接",
				() =>
					`【${document.querySelector("h1.video-title").innerText}】\t${location.origin}${
						location.pathname
					}`,
			);
		},
		BV: (feature) => {
			feature.fn("BV", () => location.pathname.split("/")[2]);
		},
		url: (feature) => {
			feature.fn("链接", () => `${location.origin}${location.pathname}`);
		},
		title: (feature) => {
			feature.fn("标题", () => `${document.querySelector("h1.video-title").innerText}`);
		},
		off: null,
	},
	fn: (title, getText) => {
		delay(
			() => {
				const h1 = document.querySelector("h1.video-title");
				if (!h1) return;
				if (document.querySelector("h1.video-title").innerHTML.indexOf("🏷️") !== -1) return;

				const text = getText();
				const copy_btn = document.createElement("span");
				copy_btn.title = `复制当前视频的${title}:${text}`;
				copy_btn.style.cursor = "pointer";
				copy_btn.style.fontSize = "22px";
				copy_btn.innerText = "🏷️";
				copy_btn.addEventListener("click", () => navigator.clipboard.writeText(text));

				document.querySelector("h1.video-title").append(copy_btn);
			},
			2500,
			{ loop: true },
		);
	},
});

// remove_keyword_search.js
addModule({
key: "remove_keyword_search", 
	// TODO 失效?
	// 移除评论关键字搜索跳转(失效)
	pages: ["video", "read"],
	showInMenu: true,
	value: {
		icon: () => ".icon.search-word:{display:none;}",
		color: () => ".icon.search-word:{display:none;} .search-word a{color: #222!important;}",
		link: () => {
			delay(
				() => {
					const as = document.getElementsByClassName("search-word");
					for (let i = 0; i < as.length; i++)
						as[i].parentElement.outerHTML = as[i].parentElement.outerHTML.replace(
							as[i].outerHTML,
							as[i].outerText,
						);
				},
				8000,
				{ loop: true },
			);
			return ".icon.search-word:{display:none;} .search-word a{color: #222!important;}";
		},
		off: null,
	},
});

// video_beautify.js
addModule({
key: "video_beautify", 
	// 视频样式美化
	showInMenu: true,
	value: `#app .video-container-v1 #viewbox_report h1{text-wrap:wrap}#app .video-container-v1 .left-container #playerWrap #bilibili-player .bpx-player-sending-area{margin-top:-1px}#app .video-container-v1 #live_recommand_report,#app .video-container-v1 .vcd{display:none!important}`,
});

// video_cover_download.js
addModule({
key: "video_cover_download", 
	// 视频封面获取按钮
	pages: ["video"],
	showInMenu: true,
	value: () => {
		old_pic = "";
		delay(() => {
			setInterval(() => {
				if (!unsafeWindow.__INITIAL_STATE__) return;
				pic = unsafeWindow.__INITIAL_STATE__.videoData.pic;
				if (old_pic === pic) return;
				old_pic = pic;
				setTimeout(() => {
					const toolbar = document.querySelector("#arc_toolbar_report .video-toolbar-right");
					if (!toolbar) return;
					if (!toolbar.querySelector(".video-tool-more")) {
						// 等待加载完全 否则会出bug
						old_pic = "";
						return;
					}

					toolbar.querySelectorAll(".video-tool-getpic").forEach((e) => e.remove());

					const btn = document.createElement("div");
					btn.className = "video-toolbar-right-item video-tool-getpic";
					btn.innerHTML = `<a class="video-toolbar-item-text" target="_blank" href="${pic}">获取封面</a>`;
					toolbar.insertBefore(btn, toolbar.firstChild);
				}, 300);
			}, 1800);
		}, 2500);
		return `.video-tool-getpic{margin-right:10px;color:var(--text3)}`;
	},
});

// video_live_recommand.js
addModule({
key: "video_live_recommand", 
	// 去除视频页直播推荐
	pages: ["video"],
	value: ".pop-live-small-mode{display:none;}",
});

// widescreen.js
addModule({
key: "widescreen", 
	// 视频页宽屏
	// 大部分代码来自B站网页, 使用AI反混淆
	pages: ["video"],
	showInMenu: true,
	value: () => {
		function setSize() {
			// 是否宽屏
			const isWide = win.isWide;
			if (get("widescreen_hide_header_onWide")) {
				setTimeout(() => {
					try {
						document.querySelector("#biliMainHeader .bili-header.fixed-header").style.display =
							isWide ? "none" : "block";
					} catch (error) {
						console.error(error);
					}
				}, 50);
			}

			// 获取窗口宽度和高度
			const windowHeight = win.innerHeight;
			const windowWidth = Math.max(document.body?.clientWidth || win.innerWidth, 1100);

			// 设置侧边栏宽度
			const sidebarWidth = 1680 < innerWidth ? 411 : 350;

			// 计算主内容区域的高度和宽度
			const contentHeight = parseInt((16 * (windowHeight - (1690 < innerWidth ? 318 : 308))) / 9);
			const contentWidth = windowWidth - 112 - sidebarWidth;
			let finalContentWidth = contentWidth < contentHeight ? contentWidth : contentHeight;

			// 页面宽屏功能
			finalContentWidth = Math.round(finalContentWidth * get("widescreen-width-times"));

			// 限制内容宽度的最小和最大值
			if (finalContentWidth < 668) finalContentWidth = 668;
			if (finalContentWidth > 1694) finalContentWidth = 1694;

			// 计算总宽度
			let totalWidth = finalContentWidth + sidebarWidth;

			// 根据宽屏模式调整宽度
			if (isWide) {
				totalWidth -= 125;
				finalContentWidth -= 100;
			}

			// 计算播放器高度
			let playerHeight;
			const hasBlackSide = win.hasBlackSide;
			// biome-ignore format: 不要格式化这一坨
			if (hasBlackSide && !isWide) playerHeight =Math.round((finalContentWidth - 14 + (isWide ? sidebarWidth : 0)) * (9 / 16) +(1680 < innerWidth ? 56 : 46),) + 96; else playerHeight =Math.round((finalContentWidth + (isWide ? sidebarWidth : 0)) * (9 / 16)) + (1680 < innerWidth ? 56 : 46);

			// 计算左侧容器宽度
			const leftContainerWidth = totalWidth - sidebarWidth;

			// 构造 CSS 样式字符串
			// biome-ignore format: 不要格式化这一坨
			const styleString = constructStyleString(".video-container-v1", {width: "auto",padding: "0 10px"}) 
			+ constructStyleString(".left-container", {width: `${leftContainerWidth}px`}) 
			+ constructStyleString("#bilibili-player", {width: `${totalWidth - (isWide ? -30 : sidebarWidth)}px`,height: `${playerHeight}px`,position: isWide ? "relative" : "static"}) 
			+ constructStyleString("#oldfanfollowEntry", {position: "relative",top: isWide ? `${playerHeight + 28 - 18}px` : "0"}) 
			+ constructStyleString("#danmukuBox", {"margin-top": isWide ? `${playerHeight + 28}px` : "0"}) 
			+ constructStyleString("#playerWrap", {height: `${playerHeight}px`}) 
			+ constructStyleString(".video-discover", {"margin-left": `${(leftContainerWidth) / 2}px`});

			// 应用样式
			setSizeStyle.innerHTML = styleString;
		}
		function constructStyleString(e, i) {
			// biome-ignore lint: 没人想知道他是个什么东西
			for (var t = e + " {", n = Object.keys(i), o = 0; o < n.length; o++)
				t += `${n[o]}: ${i[n[o]]};`;
			return `${t}}\n`;
		}

		const change = () => {
			if (!win.setSizeStyle) {
				setTimeout(change, 120);
				return;
			}

			win.setSize = setSize;

			setSize();
			setTimeout(setSize, 200);
			win.addEventListener("resize", setSize);
			win.PlayerAgent = {
				changed: true,
				player_widewin: () => {
					"new_video" === win.__INITIAL_STATE__.pageVersion && win.scrollTo(0, 60);
					win.isWide = true;
					setSize();
				},
				player_fullwin: (i) => {
					win.scrollTo(0, 0);
					win.isWide = false;
					setSize();
				},
				toggleBlackSide: (i) => {
					win.hasBlackSide = i;
					setSize();
				},
			};
		};
		change();
		// 解决有时不生效
		onload(change);
		delay(change, 200);
	},
});
})();