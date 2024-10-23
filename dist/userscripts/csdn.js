// ==UserScript==
// @warning      脚本永久停止更新   2024-10-23
// @namespace    http://github.com/yuhanawa/UserScript
// @name         CSDN-Optimize-Beautify-Simplify
// @name:zh      CSDN-美化增强-免登录复制-沉浸式阅读-去广告等[茧绡]
// @name:zh-CN   CSDN-美化增强-免登录复制-沉浸式阅读-去广告等[茧绡]
// @name:zh-TW   CSDN-美化增强-免登入複製-沉浸式閱讀-去廣告等[茧绡]
// @name:en      Streamline and Beautify CSDN Browsing Experience[Cocoon Silk]
// @name:ja      CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど[茧絲(けむりし)]
// @description         剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等 
// @description:zh      剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等 
// @description:zh-CN   剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等 
// @description:zh-TW   剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 優化和美化CSDN瀏覽體驗 - 沉浸式閱讀、免登录复制、去廣告等
// @description:en      Shedding the cocoon, CSDN emerges with a soft, silken radiance anew - Streamline and Beautify CSDN Browsing Experience -  Immersive Reading,Ad-free,etc.  
// @description:ja      茧を脱ぎ捨て、CSDNは新たに絹のように柔らかな輝きを放-CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど.
// @version      0.2.20
// @author       Yuhanawa
// @supportURL   https://greasyfork.org/zh-CN/scripts/471071/feedback
// @license      GPL-3.0
// @match        *://*.csdn.net/*
// @icon         none
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==
/* 
	 source: https://github.com/Yuhanawa/UserScript/; 
	 version: 0.2.20; 
 */
(function() {

var config = {"name":"csdn","version":"0.2.20","pages":{"article":["/blog\\.csdn\\.net(/.*)?/article/details./"],"link":["link.csdn.net/"]},"category":[{"key":"tips","display":"tips","icon":"📢"},{"key":"beautify","display":"美化","icon":"🎨"},{"key":"ui","display":"UI相关","icon":"UI"},{"key":"useful","display":"实用","icon":"🔧"}],"props":{"tips":{"type":"note","category":"tips","display":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471069/feedback/"},"tips-refresh":{"type":"note","category":"tips","display":"修改完成后请刷新页面"},"tips-beautify":{"type":"note","category":"beautify","display":"-- 美化 --"},"copy":{"display":"免登录复制","type":"bool","category":"useful","defaultValue":true,"description":""},"content_fullscreen":{"display":"专注模式快捷键","type":"bool","category":"useful","defaultValue":false,"description":""},"setting_btn":{"display":"设置按钮","type":"option","category":"useful","defaultValue":"icon","options":[{"display":"图标","key":"icon"},{"display":"文字","key":"text"},{"display":"关闭","key":"off"}],"description":""},"ad":{"display":"移除广告","type":"bool","category":"beautify","defaultValue":true,"description":""},"darkmode":{"display":"暗色模式","type":"bool","category":"beautify","defaultValue":false,"description":""},"beautify":{"display":"细节优化","type":"bool","category":"beautify","defaultValue":true,"description":""},"width":{"display":"调整文章宽度","type":"bool","category":"beautify","defaultValue":true,"description":"该功能仅当左侧边栏隐藏时生效"},"width_value":{"display":"文章宽度","type":"number","category":"beautify","defaultValue":82,"description":"(单位:%|百分比) 该功能仅当左侧边栏隐藏时生效"},"header":{"display":"顶部菜单栏","category":"beautify","defaultValue":"remove","type":"option","options":[{"display":"移除","key":"remove"},{"display":"半透明","key":"opacity"},{"display":"淡化不跟随","key":"opacity_static"},{"display":"不跟随","key":"static"},{"display":"显示","key":"off"}]},"toolbox":{"display":"低部菜单工具栏","category":"beautify","defaultValue":"remove","type":"option","options":[{"display":"移除","key":"remove"},{"display":"不跟随","key":"relative"},{"display":"半透明","key":"opacity"},{"display":"淡化不跟随","key":"opacity_relative"},{"display":"显示","key":"off"}]},"trips-font":{"display":"调整字体大小","type":"note","category":"beautify"},"fontsize":{"display":"调整字体大小","category":"beautify","defaultValue":true,"type":"bool"},"font_size_display":{"display":"标题","category":"beautify","type":"text","defaultValue":"32px","hidden":{"condition":"!get('fontsize')","bind":["fontsize"]}},"font-size-p":{"display":"正文","type":"text","category":"beautify","defaultValue":"18px","hidden":{"condition":"!get('fontsize')","bind":["fontsize"]}},"font-size-h2":{"display":"子标题","type":"text","category":"beautify","defaultValue":"24px","hidden":{"condition":"!get('fontsize')","bind":["fontsize"]}},"font_size_code":{"display":"代码块","type":"text","category":"beautify","defaultValue":"15px","hidden":{"condition":"!get('fontsize')","bind":["fontsize"]}},"tips-bg":{"type":"note","category":"beautify","display":"自定义背景"},"background":{"display":"自定义背景(开关)","category":"beautify","defaultValue":true,"type":"bool"},"background-value":{"display":"页面背景","category":"beautify","description":"body的背景","defaultValue":"https://csdnimg.cn/release/blogv2/dist/pc/themesSkin/skin-ai/images/bg.png?v20200831","type":"image","hidden":{"condition":"!get('background')","bind":["background"]}},"blog-content-box-background-value":{"display":"文章背景","category":"beautify","description":"用于放置文章的div颜色(与暗色模式冲突,暗色模式优先)","defaultValue":"#f5f6f7E6","type":"color","hidden":{"condition":"!get('background')","bind":["background"]}},"blog-content-box-opacity-value":{"display":"文章透明度","category":"beautify","description":"文章整体透明度,包括文章内容","type":"number","defaultValue":0.98,"hidden":{"condition":"!get('background')","bind":["background"]}},"header-box-background-value":{"display":"文章标题及部分卡片背景","category":"beautify","description":"建议保持透明或使用高透明度颜色(与暗色模式冲突,暗色模式优先)","defaultValue":"#00000000","type":"color","hidden":{"condition":"!get('background')","bind":["background"]}},"tips-UI":{"type":"note","category":"ui","display":"自定义UI需将‘UI净化预设’设置为自定义模式"},"ui_opt":{"display":"UI净化预设","category":"ui","defaultValue":"lite","type":"option","options":[{"display":"极简","key":"lite"},{"display":"简|作者+目录","key":"lite1"},{"display":"简|作者+目录+菜单","key":"lite2"},{"display":"简|以上信息+推荐","key":"lite3"},{"display":"常规","key":"normal"},{"display":"自定义","key":"custom"},{"display":"关闭","key":"off"}]},"ui_opt_value":{"display":"自定义UI","category":"ui","description":"!勾选要隐藏的部分!!勾选要隐藏的部分!!勾选要隐藏的部分!","children":[{"key":"#csdn-toolbar","title":"头部工具栏toolbar","children":[{"key":"#csdn-toolbar .toolbar-container-left","title":"左边部分","children":[{"key":"#csdn-toolbar .toolbar-logo","title":"CSDN LOGO"},{"key":"#csdn-toolbar .toolbar-menus","title":"菜单"}]},{"key":"#csdn-toolbar .toolbar-container-middle","title":"中间部分","children":[{"key":"#csdn-toolbar .toolbar-search","title":"搜索","children":[{"key":"#toolbar-search-button","title":"搜索按钮"}]}]},{"key":"#csdn-toolbar .toolbar-container-right","title":"右边部分","children":[{"key":"#csdn-toolbar .toolbar-btn-login","title":"登录"},{"key":"#csdn-toolbar .toolbar-btn-vip","title":"会员中心"},{"key":"#csdn-toolbar .toolbar-btn-msg","title":"消息"},{"key":"#csdn-toolbar .toolbar-btn-collect","title":"历史"},{"key":"#csdn-toolbar .toolbar-btn-mp","title":"创作中心"},{"key":"#csdn-toolbar .toolbar-btn-write","title":"发布"}]}]},{"key":"#mainBox","title":"主内容","children":[{"key":"#mainBox .blog_container_aside","title":"左侧边栏","children":[{"key":"#asideProfile","title":"用户档案","children":[{"key":"#asideProfile .profile-intro","title":"头像及名称"},{"key":"#asideProfile .data-info","title":"数据信息"},{"key":"#asideProfile .item-rank","title":"item-rank"},{"key":"#asideProfile .aside-box-footer","title":"徽章"},{"key":"#asideProfile .profile-intro-name-boxOpration","title":"私信及关注按钮"}]},{"key":"#footerRightAds","title":"广告"},{"key":"#asideWriteGuide","title":"创作推广"},{"key":"#asideSearchArticle","title":"搜索博主文章"},{"key":"#asideHotArticle","title":"热门文章"},{"key":"#asideCategory","title":"分类专栏"},{"key":"#asideNewComments","title":"最新评论"},{"key":"#asideNewNps","title":"您愿意向朋友推荐'博客详情页'吗？"},{"key":"#asideArchive","title":"最新文章"},{"key":"#asidedirectory","title":"目录"}]},{"key":"main .blog-content-box","title":"文章主体","children":[{"key":"main .article-header-box","title":"头部","children":[{"key":"main .article-title-box","title":"标题"},{"key":"main .article-info-box","title":"信息","children":[{"key":"main .article-bar-top","title":"bar top","children":[{"key":"main .article-title-box .article-type-img","title":"图标"}]},{"key":"main .blog-tags-box","title":"标签"}]}]},{"key":"main .baidu_pl","title":"文章","children":[{"key":"#blogColumnPayAdvert","title":"专栏收录","children":[{"key":"#blogColumnPayAdvert .column-group0","title":"第一项专栏"},{"key":"#blogColumnPayAdvert .column-group1","title":"第二项专栏(仅适用于多专栏收录的情况)"},{"key":"#blogColumnPayAdvert .column-group2","title":"第三项专栏(仅适用于多专栏收录的情况)"}]},{"key":"#article_content","title":"文章内容"},{"key":"#treeSkill","title":"文章知识点与官方知识档案匹配，可进一步学习相关知识"},{"key":"#blogVoteBox","title":"投票"},{"key":"#blogExtensionBox","title":"blogExtensionBox","children":[{"key":"#blogExtensionBox .extension_official","title":"微信名片"}]}]},{"key":".recommend-box","title":"推荐","children":[{"key":".first-recommend-box","title":"第一条推荐"},{"key":".second-recommend-box","title":"第二条推荐"},{"key":".insert-baidu-box.recommend-box-style","title":"其他推荐"}]},{"key":"#recommendNps","title":"'相关推荐'对你有帮助么？"},{"key":"#commentBox","title":"评论Box"},{"key":"#pcCommentBox","title":"pc评论Box"}]},{"key":"#toolBarBox","title":"底部工具栏"},{"key":".blog-footer-bottom","title":"页脚(版权/备案)"}]},{"key":"#rightAside","title":"右侧边栏(登录后才有)","children":[{"key":"#groupfile","title":"目录"},{"key":"#rightAside .kind_person","title":"分类"}]},{"key":".csdn-side-toolbar","title":"侧边工具栏","children":[{"key":".sidetool-writeguide-box","title":"创作话题"},{"key":".option-box[data-type=guide]","title":"新手引导"},{"key":".option-box[data-type=cs]","title":"客服"},{"key":".option-box[data-type=report]","title":"举报"},{"key":".option-box[data-type=gotop]","title":"返回顶部"},{"key":".btn-side-chatdoc-contentbox","title":"C知道AI机器人"}]},{"key":".passport-container-mini-tip","title":"右下角登录提示"},{"key":".passport-login-container","title":"登录弹窗"}],"defaultValue":[],"type":"tree","hidden":{"condition":"get('ui_opt')!=='custom'","bind":["ui_opt"]}}}};
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
	value: `#ad_iframe,#ad_unit,#asideWriteGuide,#mainBox>aside>div.box-shadow.mb8,#remuneration,.GoogleActiveViewElement,.GoogleActiveViewInnerContainer,.adsbygoogle{display:none!important;visibility:hidden!important;width:0!important;height:0!important}`,
});

// background.js
addModule({
key: "background", 
	pages: ["article"],
	value: () => {
		if (get("background-value")) {
			style(`body{background:url("${get("background-value")}")}`);
		}
		style(`body{--blog-content-box-background:${get("blog-content-box-background-value")}}`);
		style(`body{--blog-content-box-opacity:${get("blog-content-box-opacity-value")}}`);
		style(`body{--blog-header-box-background:${get("blog-header-box-background-value")}}`);
		return `:root body .blog-content-box{background:var(--blog-content-box-background)!important;opacity:var(--blog-content-box-opacity)!important}:root body #blogColumnPayAdvert,:root body #blogHuaweiyunAdvert,:root body .article-header-box{background-color:var(--blog-header-box-background)!important}`;
	},
});

// base.js
addModule({
key: "base", 
	runAlways: true,
	value: () => {
		onload(() => {
			const aside = document.getElementsByClassName("blog_container_aside")[0];
			if (aside === undefined || aside == null) {
				setTimeout(fn, 150);
				return;
			}

			if (getComputedStyle(aside).display === "none") {
				style("#mainBox { width: auto !important; }");
				style("main { margin: 0px 6px 40px 6px }");
				if (get("width")) {
					style("#mainBox > main{ width: 100% !important; }");
					style(`body #mainBox{ width: ${get("width_value", "82")}% !important; }`);
				}
			}
		});

		return `@charset "UTF-8";:root>*,:root>*>*,:root>*>*>*,:root>*>*>*>*{transition:all .3s!important}.tag-link{margin:5px 0 0!important;overflow:hidden}main div.blog-content-box article{padding-top:10px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top span{margin-right:4px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .follow-nickName{margin-right:2px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .bar-conten{padding-left:0;margin-left:10px}code,main div.blog-content-box pre.set-code-hide,pre{height:auto!important}.hide-preCode-box{display:none}.set-code-hide,main div.blog-content-box pre{max-height:max-content!important;height:auto!important}.article-info-box{opacity:.92}.blog-content-box{overflow-y:auto}#mainBox{margin:auto}#rightAside{margin:0 120px 0-120px}`;
	},
});

// content_fullscreen.js
addModule({
key: "content_fullscreen", 
	pages: ["article"],
	value: () => {
		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey && e.keyCode === 13) {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.querySelector(".blog-content-box").requestFullscreen();
			}
		});
	},
});

// copy.js
addModule({
key: "copy", 
	pages: ["article"],
	value: () => {
		delay(() => {
			// 修改复制按钮
			document.querySelectorAll(".hljs-button").forEach((e) => {
				e.setAttribute("data-title", "点击复制");
				e.classList.remove("signin");
				e.removeAttribute("onclick");
				e.addEventListener("click", () => {
					e.setAttribute("data-title", " ");
					navigator.clipboard.writeText(e.parentNode.innerText);
					e.setAttribute("data-title", "复制成功");
					setTimeout(() => e.setAttribute("data-title", "点击复制"), 1200);
				});
			}, 250);

			// 复制功能
			document.querySelector(".blog-content-box").addEventListener(
				"copy",
				(e) => {
					e.stopPropagation();
					e.preventDefault();

					navigator.clipboard.writeText(window.getSelection().toString());
				},
				true,
			);
			document.addEventListener(
				"keydown",
				(e) => {
					if (e.ctrlKey && e.keyCode === 67) {
						e.stopPropagation();
						e.preventDefault();

						navigator.clipboard.writeText(window.getSelection().toString());
					}
				},
				true,
			);

			document.oncopy = null;
			window.oncopy = null;
		}, 500);

		return `#content_views pre code{-webkit-touch-callout:text!important;-webkit-user-select:text!important;-khtml-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;user-select:text!important}pre .hljs-button{background-color:#666;padding:2px;margin:10px;box-shadow:0 2px 4px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.05);width:fit-content!important;height:fit-content!important}`;
	},
});

// darkmode.js
addModule({
key: "darkmode", 
	value: `html body{--blog-content-box-background:#121213!important;--blog-header-box-background:transparent!important;background-color:var(--blog-content-box-background)!important}html body #mainBox .blog_container_aside>div,html body #mainBox aside div.aside-box,html body .ellipsis:after,html body .ellipsis:before,html body .recommend-box,html body .recommend-box .recommend-item-box .title-box .tit,html body .recommend-item-box,html body .second-recommend-box,html body aside.recommend-right_aside div,html body aside.recommend-right_aside li,html body aside.recommend-right_aside ul,html body div#toolbarBox div{background-color:var(--blog-content-box-background)!important;color:#afafb0!important}html body #mainBox .blog-content-box{background-color:var(--blog-content-box-background);color:#afafb0}html body #mainBox .blog-content-box .article-header-box{background-color:var(--blog-header-box-background)}html body #mainBox .blog-content-box .article-header-box .article-title-box{color:#fff}html body #mainBox .blog-content-box .article-info-box{background-color:#1d1d1e!important}html body h1{color:#fff!important}html body,html body p{color:#afafb0!important}html body .gradient{display:none!important}`,
});

// fontsize.js
addModule({
key: "fontsize", 
	value: () => {
		style(
			`body{--font-size-title: ${get("font_size_title", "32px")};--font-size-p: ${get(
				"font_size_p",
				"18px",
			)};--font-size-h2: ${get("font_size_h2", "24px")};--font-size-code: ${get(
				"font_size_code",
				"15px",
			)};}`,
		);
		return `html{--font-size-title:36px;--font-size-p:18px;--font-size-h2:24px;--font-size-code:15px}html body main div.blog-content-box .article-header-box .article-header div.article-title-box .title-article{font-size:var(--font-size-title)!important}html body main #content_views p{font-size:var(--font-size-p)!important}html body main #content_views h2{font-size:var(--font-size-h2)!important}html body main #content_views pre code{font-size:var(--font-size-code)!important}`;
	},
});

// header.js
addModule({
key: "header", 
	pages: ["article"],
	values: {
		remove: "#csdn-toolbar{ display: none!important; }",
		opacity: `#csdn-toolbar{
      transition: opacity 0.5s!important;
      opacity: 0.75;
      backdrop-filter: blur(8px);
      filter: blur(2px);
    } 
    #csdn-toolbar:hover,
    #csdn-toolbar:focus,
    #csdn-toolbar:focus-within,
    #csdn-toolbar:active {
      opacity: 1;
      backdrop-filter: none;
      filter: none;
    } `,
		opacity_static:
			"#csdn-toolbar{position: static !important; opacity: 0.5; transition: opacity 1.5s!important;} #csdn-toolbar:hover{opacity: 1;}",
		static: "#csdn-toolbar{position: static !important;}",
		off: null,
	},
});

// redirect.js
addModule({
key: "redirect", 
	pages: ["link"],
	value: () => {
		const url = new URLSearchParams(location.search).get("target");
		location.href = url;
		location.replace(url);
	},
});

// setting_btn.js
addModule({
key: "setting_btn", 
	pages: ["article"],
	value: {
		text: () => {
			delay(() => {
				const articleTitleBox = document.getElementsByClassName("article-title-box")[0];
				const settingButton = document.createElement("a");
				settingButton.innerText = "脚本设置";
				settingButton.onclick = () => {
					openConfigPanel();
				};
				settingButton.style =
					"float: right;margin: 12px;font-size: 20px;text-decoration: underline !important;color: #4ea1db;";
				articleTitleBox.insertAdjacentElement("afterbegin", settingButton);
			}, 200);
		},
		icon: () => {
			delay(() => {
				const articleTitleBox = document.getElementsByClassName("article-title-box")[0];
				const settingButton = document.createElement("a");
				settingButton.innerText = "⚙️";
				settingButton.onclick = () => {
					openConfigPanel();
				};
				settingButton.style =
					"float: right;margin: 12px;font-size: 20px;text-decoration: none !important;color: #4ea1db;";
				articleTitleBox.insertAdjacentElement("afterbegin", settingButton);
			}, 200);
		},
		off: null,
	},
});

// toolbox.js
addModule({
key: "toolbox", 
	pages: ["article"],
	value: {
		remove: `.left-toolbox{
          display: none!important;
        }`,
		relative: `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`,
		opacity: `.left-toolbox{
          opacity: 0.55!important;
          transition: opacity 0.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
		opacity_relative: `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
          opacity: 0.55!important;
          transition: opacity 1.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
		off: null,
	},
});

// ui_opt.js
addModule({
key: "ui_opt", 
	pages: ["article"],
	value: {
		lite: (self) => {
			const value = [
				"#treeSkill",
				"#blogVoteBox",
				".recommend-box",
				".first-recommend-box",
				".second-recommend-box",
				".insert-baidu-box.recommend-box-style",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#toolBarBox",
				".blog-footer-bottom",
				"#rightAside",
				"#groupfile",
				"#rightAside .kind_person",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar",
				"#mainBox .blog_container_aside",
				"#csdn-toolbar .toolbar-container-left",
				"#csdn-toolbar .toolbar-container-right",
				"#csdn-toolbar .toolbar-container-middle",
				"#blogExtensionBox .extension_official",
				"#asideProfile",
				"#footerRightAds",
				"#asideWriteGuide",
				"#asideSearchArticle",
				"#asideHotArticle",
				"#asideCategory",
				"#asideNewComments",
				"#asideNewNps",
				"#asideArchive",
				"#asidedirectory",
				".passport-container-mini-tip",
				".passport-login-container",
			];

			self.hide(value);
		},
		lite1: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-btn-vip",
				"#csdn-toolbar .toolbar-btn-msg",
				"#csdn-toolbar .toolbar-btn-mp",
				"#csdn-toolbar .toolbar-btn-writet",
				"#blogExtensionBox .extension_official",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#treeSkill",
				"#blogVoteBox",
				".recommend-box",
				".first-recommend-box",
				".second-recommend-box",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				"#toolBarBox",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
				"#asideProfile .data-info",
				"#asideCategory",
				".passport-login-container",
			]);
		},
		lite2: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-btn-vip",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
				"#asideCategory",
				".first-recommend-box",
				".second-recommend-box",
				".recommend-box",
				"#toolBarBox",
				".passport-login-container",
			]);
		},
		lite3: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-btn-vip",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#asideCategory",
				"#toolBarBox",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
			]);
		},
		normal: (self) => {
			const value = [
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-btn-mp",
				"#csdn-toolbar .toolbar-btn-write",
				"#csdn-toolbar .toolbar-btn-msg",
				"#csdn-toolbar .toolbar-btn-vip",
				"#asideProfile .profile-intro-name-boxOpration",
				"#asideProfile .aside-box-footer",
				"#asideProfile .item-rank",
				"#footerRightAds",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"#asideArchive",
				"#asideSearchArticle",
				"main .article-title-box .article-type-img",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				"#recommendNps",
				"#commentBox",
				".blog-footer-bottom",
				"#rightAside .kind_person",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				".passport-container-mini-tip",
				".passport-login-container",
			];

			self.hide(value);
		},
		custom: () => {
			style(
				`${get(
					"ui_opt_value",
				)} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
			);
		},
		off: null,
	},
	hide: (value) => {
		style(
			`${value.join(
				", ",
			)} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
		);
	},
});
})();