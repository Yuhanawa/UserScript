// ==UserScript==
// @name		CSDN-Optimize-Beautify-Simplify
// @name:zh		CSDN-美化增强-免登录复制-沉浸式阅读-去广告等[茧绡]
// @name:en		Streamline and Beautify CSDN Browsing Experience[Cocoon Silk]
// @name:ja		CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど[茧絲(けむりし)]
// @namespace		http://github.com/yuhanawa/UserScript
// @name:zh-CN		CSDN-美化增强-免登录复制-沉浸式阅读-去广告等[茧绡]
// @name:zh-TW		CSDN-美化增强-免登入複製-沉浸式閱讀-去廣告等[茧绡]
// @description		剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等
// @description:zh		剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等
// @description:en		Shedding the cocoon, CSDN emerges with a soft, silken radiance anew - Streamline and Beautify CSDN Browsing Experience -  Immersive Reading,Ad-free,etc.
// @description:ja		茧を脱ぎ捨て、CSDNは新たに絹のように柔らかな輝きを放-CSDNブラウジング体験の合理化と美化 - 沈浸的読書、広告なしなど.
// @description:zh-CN		剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 优化美化CSDN体验-个性化-免登录复制-沉浸式阅读-去广告等
// @description:zh-TW		剥茧化绸,使 CSDN 重现柔曼如丝的新颜; 優化和美化CSDN瀏覽體驗 - 沉浸式閱讀、免登录复制、去廣告等
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		*://*.csdn.net/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.1.51
// @author		Yuhanawa
// @supportURL		https://greasyfork.org/zh-CN/scripts/471071/feedback
// @license		GPL-3.0
// @icon		none
// @run-at		document-start
// ==/UserScript==

/* 
    csdn v.0.1.51 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/

isLoaded=!1,onload(()=>isLoaded=!0);const __props__=new Map;
function get(k,d){return GM_getValue(k,void 0===d?__props__.get(k):d)}
function set(k,v){return GM_setValue(k,v)}
function cfg(k,v){return void 0===v?get(k):set(k,v)}
function getOptionKeyAndName(optionStr){var key=optionStr.match(/\$([^ ]+)/)?.[0];return key?{key:key.replace("$",""),name:optionStr.replace(key,"")}:{key:optionStr,name:optionStr}}
function style(css){var node;"undefined"!=typeof GM_addStyle?GM_addStyle(css):((node=document.createElement("style")).appendChild(document.createTextNode(css)),document.body.appendChild(node))}
function addMenu(name,key,options,current,index,onclick){const getOptionKey=o=>getOptionKeyAndName(o).key;void 0!==current&&null!=index&&-1!==index||(current=set(key,getOptionKey(options[0])),index=0);var o=`${name}:${o=options[index],getOptionKeyAndName(o).name}[${index+1}/${options.length}]<点击切换`;return GM_registerMenuCommand(o,()=>{if(set(key,getOptionKey(options[index+1>=options.length?0:index+1])),onclick)try{onclick()}catch(e){console.log(`发生错误(${name}-${current}-onclick): `+e)}location.reload()}),index}
function onload(f){isLoaded?f():document.addEventListener("DOMContentLoaded",()=>f())}
function timeoutAfterLoad(f,t){onload(()=>setTimeout(()=>f(),t))}
function intervalAfterLoad(f,t,runOnFirst){onload(()=>{runOnFirst&&f(),setInterval(f,t)})}
function run(fts){void 0===fts&&(fts=features);for(const key of Object.keys(fts))try{const feature=fts[key];("boolean"==typeof feature.match&&1==feature.match||0!==feature.match.filter(m=>"string"==typeof m?null!==window.location.href.match(m):m.test(window.location.href)).length)&&addFeature(key,feature)}catch(error){console.error("发生了一个意料之外的错误, 这可能是因为非法的feature所造成的, 不过请放心, 脚本将继续运行而不会崩溃. ",feature,error)}}
function addFeature(key,feature){var{name,values}=feature;if(!feature.switchable||get(key+"_switch",feature.default_switch_state??!0))if("$"===name||feature.directlyRun)try{"function"==typeof values?"string"==typeof(result=values(feature))&&style(result):"string"==typeof values&&style(values)}catch(e){console.error(e)}else{var result=Object.keys(values),key0=getOptionKeyAndName(result[0]).key;let current=get(key,key0),index=result.findIndex(x=>getOptionKeyAndName(x).key===current);-1!==index&&void 0!==index||(set(key,key0),index=0,current=key0),feature.hideInMenu||addMenu(name,key,result,current,index);try{var value=values[result[index]];if(null!=value)if("function"==typeof value){const result=value(feature);"string"==typeof result&&style(result)}else"string"==typeof value&&style(value)}catch(e){console.error(e)}}}
function findFastestSite(sites){return new Promise((resolve,reject)=>{let fastestSite=null,fastestTime=1/0,completedRequests=0;sites.forEach(function(site){const xhr=new XMLHttpRequest,startTime=(new Date).getTime();xhr.onreadystatechange=()=>{var timeElapsed;fastestTime<100&&(xhr.abort(),resolve(fastestSite)),xhr.readyState===XMLHttpRequest.DONE&&(timeElapsed=(new Date).getTime()-startTime,console.log(`Ping ${site} took ${timeElapsed}ms`),console.log("Status: "+xhr.status),xhr.status<400&&timeElapsed<fastestTime&&(fastestTime=timeElapsed,fastestSite=site),++completedRequests===sites.length)&&resolve(fastestSite)},xhr.onprogress=()=>{fastestTime<100&&(xhr.abort(),resolve(fastestSite))},xhr.onload=()=>{console.log("Pinging "+site)},xhr.open("GET",site,!0),xhr.timeout=2e3,xhr.send()})})}
function getConfigPage(){return findFastestSite(["https://user-script-config-form.vercel.app","https://yuhan-script-config.netlify.app","https://yuhanawa.github.io/tools/userscriptconfig/"]).then(fastestSite=>fastestSite).catch(error=>(console.error("Error:",error),null))}
function showConfigPage(){document.querySelector("#config-page-awa")?document.querySelector("#config-page-awa").style.display="block":getConfigPage().then(fastestSite=>{void 0!==GM_openInTab?GM_openInTab(fastestSite,{active:!0}):location.href=fastestSite})}
function LoadConfigPage(name){if(!document.querySelector("#config-page-awa"))return style(`
    .config-page-awa {
        position: fixed;
        background-color: rgba(245, 200, 200, 0.2);
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: block;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: blur(20px);
      }
      .config-page-container {
        width: 60%;
        height: 60%;
        position: absolute;
        top: 15%;
        left: 15%;
        cursor: auto;
        border: 1px thin #cccccc10;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.65);
        background-color: rgba(255, 255, 255, 0.6);
        overflow: hidden;
        padding: 15px;
        box-sizing: border-box;
        overflow-y: hidden;
        min-width: 360px;
        min-height: 420px;
        resize: both;
      }
      .config-page-drag-area {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        cursor: move;
        background-color: transparent;
      }
      .config-page-iframe {
        border: 0;
        border-radius: 18px;
        overflow: hidden;
        box-sizing: border-box;
        overflow-y: auto;
        opacity: 0.95;
        width: 100%;
        height: 100%;
        box-shadow: 1px 1px 4px rgba(185, 185, 185, 0.2);
        background-color: rgba(255, 255, 255, 0.25);
        margin: -1px;
      }
      .config-page-close-btn {
        position: absolute;
        top: 4px;
        right: 5px;
        font-size: 20px;
        background-color: transparent;
        border: 0;
        color: #C00;
        cursor: pointer;
        outline: none;
        padding: 0;
        margin: 0;
      }
      .config-page-close-btn:hover {
        color: #A00;
      }
      .config-page-close-btn:active {
        color: #f00;
        transform: scale(0.8);
        transition: 0.15s;
      }
      
    `),getConfigPage().then(fastestSite=>{document.body.insertAdjacentHTML("afterend",`
        <div class="config-page-awa" id="config-page-awa" style="display: none;">
        <div class="config-page-container">
            <div class="config-page-drag-area"></div>
            <iframe class="config-page-iframe"
                src="${fastestSite}?menuKey=${name}&iniframe"></iframe>
            <button class="config-page-close-btn">⭕</button>
        </div>
    </div>`);const configPage=document.querySelector("#config-page-awa"),container=configPage.querySelector(".config-page-container"),iframe=configPage.querySelector(".config-page-iframe");var fastestSite=configPage.querySelector(".config-page-drag-area"),pos1=0,pos2=0,pos3=0,pos4=0;
function elementDrag(e){(e=e||window.event).preventDefault(),pos1=pos3-e.clientX,pos2=pos4-e.clientY,pos3=e.clientX,pos4=e.clientY,container.style.top=container.offsetTop-pos2+"px",container.style.left=container.offsetLeft-pos1+"px"}
function closeDragElement(){iframe.style.pointerEvents="auto",configPage.onmouseup=null,configPage.onmousemove=null}return fastestSite.onmousedown=function(e){(e=e||window.event).preventDefault(),pos3=e.clientX,pos4=e.clientY,iframe.style.pointerEvents="none",configPage.onmouseup=closeDragElement,configPage.onmousemove=elementDrag;e=window.getComputedStyle(event.target).cursor;console.log("当前鼠标样式："+e)},configPage.querySelector(".config-page-close-btn").onclick=function(){configPage.style.display="none"},Promise.resolve()});showConfigPage()}
function loadConfig(name,properties){GM_registerMenuCommand("在新窗口打开设置中心",()=>{showConfigPage()}),GM_registerMenuCommand("在页面内镶嵌设置中心(BETA)",()=>{LoadConfigPage(name).then(()=>showConfigPage())}),anchors=[];for(const key of Object.keys(properties))__props__.set(name+"_"+key,properties[key].default),key.startsWith("#")&&anchors.push({key:key,href:properties[key].href||key,title:properties[key].title||properties[key].description||key});(location.href.match("yuhan-script-config.netlify.app")||location.href.match("user-script-config-form.vercel.app")||location.href.match("yuhanawa.github.io/tools/userscriptconfig")||location.href.match("localhost"))&&(void 0===unsafeWindow.awa&&(unsafeWindow.awa={}),void 0===unsafeWindow.awa.userscript&&(unsafeWindow.awa.userscript={}),unsafeWindow.awa.userscript[name]={props:properties,anchors:anchors,get:get,set:set})}


loadConfig('csdn', {".line_ts":{"widget":"line","title":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471071/feedback/"},".line_bc":{"widget":"line","title":"❗❗❗修改完记得点保存(在最下面)❗❗❗"},"copy":{"title":"免登录复制","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"beautify":{"title":"细节优化","default":true,"widget":"switch","type":"boolean"},"width":{"title":"调整文章宽度","description":"该功能仅当左侧边栏隐藏时生效","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"width_value":{"title":"文章宽度","description":"(单位:%|百分比) 该功能仅当左侧边栏隐藏时生效","default":"82","props":{"addonAfter":"%"},"hidden":"{{ formData.width === 'off' }}"},"header":{"title":"顶部菜单栏","default":"remove","widget":"select","props":{"options":[{"label":"移除","value":"remove"},{"label":"半透明","value":"opacity"},{"label":"淡化不跟随","value":"opacity_static"},{"label":"不跟随","value":"static"},{"label":"显示","value":"off"}]}},"toolbox":{"title":"低部菜单工具栏","default":"remove","widget":"select","props":{"options":[{"label":"移除","value":"remove"},{"label":"不跟随","value":"relative"},{"label":"半透明","value":"opacity"},{"label":"淡化不跟随","value":"opacity_relative"},{"label":"显示","value":"off"}]}},"#line_fz":{"widget":"line","title":"调整字体大小"},"fontsize":{"title":"调整字体大小","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"font_size_title":{"title":"标题","default":"32px","hidden":"{{ formData.fontsize === 'off' }}"},"font-size-p":{"title":"正文","default":"18px","hidden":"{{ formData.fontsize === 'off' }}"},"font-size-h2":{"title":"子标题","default":"24px","hidden":"{{ formData.fontsize === 'off' }}"},"font_size_code":{"title":"代码块","default":"15px","hidden":"{{ formData.fontsize === 'off' }}"},"#line_bg":{"widget":"line","title":"自定义背景"},"background":{"title":"自定义背景(开关)","default":"off","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"background-value":{"title":"页面背景","description":"body的背景","default":"https://csdnimg.cn/release/blogv2/dist/pc/themesSkin/skin-code/images/bg.png?v20200831","hidden":"{{ formData.background === 'off' }}","widget":"imageInput","format":"image"},"blog-content-box-background-value":{"title":"文章背景","description":"用于放置文章的div颜色","default":"#f5f6f7E6","hidden":"{{ formData.background === 'off' }}","widget":"color"},"blog-content-box-opacity-value":{"title":"文章透明度","description":"文章整体透明度,包括文章内容","hidden":"{{ formData.background === 'off' }}","default":"0.98"},"header-box-background-value":{"title":"文章标题及部分卡片背景","description":"建议保持透明或使用高透明度颜色","hidden":"{{ formData.background === 'off' }}","default":"#00000000","widget":"color"},"#line_ui":{"widget":"line","title":"自定义UI","description":"自定义UI需将‘UI净化预设’设置为自定义模式"},"ui_opt":{"title":"UI净化预设","default":"lite","widget":"select","props":{"options":[{"label":"极简","value":"lite"},{"label":"简|作者+目录","value":"lite1"},{"label":"简|作者+目录+菜单","value":"lite2"},{"label":"简|以上信息+推荐","value":"lite3"},{"label":"常规","value":"normal"},{"label":"自定义","value":"custom"},{"label":"关闭","value":"off"}]}},"ui_opt_value":{"title":"自定义UI","description":"需要UI净化预设为自定义模式","default":["#asideArchive","#csdn-toolbar .toolbar-menus","#csdn-toolbar .toolbar-btn-vip","#footerRightAds","#asideProfile .item-rank","#asideProfile .aside-box-footer","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","main .article-bar-top","main .article-title-box .article-type-img","#recommendNps","#commentBox","#pcCommentBox","#treeSkill","#blogVoteBox",".insert-baidu-box.recommend-box-style",".blog-footer-bottom",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-container-left","#asideCategory",".first-recommend-box",".second-recommend-box",".recommend-box","#toolBarBox",".passport-login-container"],"widget":"CSDN_UI_editor","disabled":"{{ formData.ui_opt !== 'custom' }}"}})

let features_csdn_1114922075 = {
	
  csdn_ui_opt: {
    name: "净化",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      极简$lite: (self) => {
        var value = [
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
      "简|作者+目录$lite1": (self) => {
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
      "简|作者+目录+菜单$lite2": (self) => {
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
      "简|以上信息+推荐$lite3": (self) => {
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
      常规$normal: (self) => {
        var value = [
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
      自定义$custom: () => {
        style(
          `${get("csdn_ui_opt_value")} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
        );
      },
      已关闭$off: () => {},
    },
    hide: (value) => {
      style(
        `${value.join(", ")} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
      );
    },
  },
  csdn_toolbox: {
    name: "低部菜单工具栏",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      移除$remove: `.left-toolbox{
          display: none!important;
        }`,
      不跟随$relative: `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`,
      半透明$opacity: `.left-toolbox{
          opacity: 0.55!important;
          transition: opacity 0.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
      淡化不跟随$opacity_relative: `.left-toolbox{
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
      显示$off: null,
    },
  },
  csdn_setting_btn: {
    name: "设置按钮",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      已开启$on: () => {
        timeoutAfterLoad(() => {
          const articleTitleBox =
            document.getElementsByClassName("article-title-box")[0];
          const settingButton = document.createElement("a");
          settingButton.innerText = "脚本设置";
          settingButton.href =
            "https://yuhanawa.github.io/tools/userscriptconfig/";
          settingButton.target = "_blank";
          settingButton.style = `float: right;margin: 12px;font-size: 20px;text-decoration: underline !important;color: #4ea1db;`;
          articleTitleBox.insertAdjacentElement("afterbegin", settingButton);
        }, 200);
      },
      已关闭$off: null,
    },
  },
  csdn_redirect: {
    name: "外链重定向自动跳转",
    match: ["link.csdn.net/"],
    values: {
      已开启$on: () => {
        const url = new URLSearchParams(location.search).get("target");
        location.href = url;
        location.replace(url);
      },
      已关闭$off: null,
    },
  },
  csdn_header: {
    name: "顶部菜单",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      移除$remove: `#csdn-toolbar{ display: none!important; }`,
      半透明$opacity: `#csdn-toolbar{
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
      淡化不跟随$opacity_static: `#csdn-toolbar{position: static !important; opacity: 0.5; transition: opacity 1.5s!important;} #csdn-toolbar:hover{opacity: 1;}`,
      不跟随$static: `#csdn-toolbar{position: static !important;}`,
      显示$off: null,
    },
  },
  csdn_fontsize: {
    name: "调整字体大小",
    match: ["csdn.net"],
    values: {
      已开启$on: () => {
        style(
          `body{--font-size-title: ${get("csdn_font_size_title", "32px")
};--font-size-p: ${get("csdn_font_size_p", "18px")
};--font-size-h2: ${get("csdn_font_size_h2", "24px")
};--font-size-code: ${get("csdn_font_size_code", "15px")
};}`,
        );
        return "html{--font-size-title:36px;--font-size-p:18px;--font-size-h2:24px;--font-size-code:15px}html body main div.blog-content-box .article-header-box .article-header div.article-title-box .title-article{font-size:var(--font-size-title)!important}html body main #content_views p{font-size:var(--font-size-p)!important}html body main #content_views h2{font-size:var(--font-size-h2)!important}html body main #content_views pre code{font-size:var(--font-size-code)!important}";
      },
      已关闭$off: null,
    },
  },
  csdn_copy: {
    name: "免登录复制",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      已开启$on: () => {
        timeoutAfterLoad(() => {
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
              if (e.ctrlKey && e.keyCode == 67) {
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

        return "#content_views pre code{-webkit-touch-callout:text!important;-webkit-user-select:text!important;-khtml-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;user-select:text!important}pre .hljs-button{background-color:#666;padding:2px;margin:10px;box-shadow:0 2px 4px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.05);width:fit-content!important;height:fit-content!important}";
      },
      已关闭$off: null,
    },
  },
  csdn_content_fullscreen: {
    name: "Ctrl + Enter开启专注模式",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      已关闭$off: null,
      已开启$on: () => {
        document.addEventListener("keydown", (e) => {
          if (e.ctrlKey && e.keyCode == 13) {
            if (document.fullscreenElement) document.exitFullscreen();
            else
              document.querySelector(".blog-content-box").requestFullscreen();
          }
        });
      },
    },
  },
  csdn_base: {
    name: "$",
    match: ["csdn.net"],
    values: () => {
      if (get("csdn_beautify", true)) {
        if (false) {
          // 可能存在问题，临时删除
        }
      }

      fn = () => {
        const aside = document.getElementsByClassName(
          "blog_container_aside",
        )[0];
        if (aside == undefined || aside == null) {
          setTimeout(fn, 150);
          return;
        }

        if (getComputedStyle(aside).display === "none") {
          style(`#mainBox { width: auto !important; }`);
          style(`main { margin: 0px 6px 40px 6px }`);
          if (get("csdn_width", "on") === "on") {
            style(`#mainBox > main{ width: 100% !important; }`);
            style(
              `body #mainBox{ width: ${get("csdn_width_value", "82")}% !important; }`,
            );
          }
        }
      
};
      onload(fn);

      return '@charset "UTF-8";:root>*,:root>*>*,:root>*>*>*,:root>*>*>*>*{transition:all .3s!important}.tag-link{margin:5px 0 0!important;overflow:hidden}main div.blog-content-box article{padding-top:10px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top span{margin-right:4px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .follow-nickName{margin-right:2px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .bar-conten{padding-left:0;margin-left:10px}code,main div.blog-content-box pre.set-code-hide,pre{height:auto!important}.hide-preCode-box{display:none}.set-code-hide,main div.blog-content-box pre{max-height:max-content!important;height:auto!important}.article-info-box{opacity:.92}.blog-content-box{overflow-y:auto}';
    },
  },
  csdn_background: {
    name: "自定义背景",
    match: [/blog\.csdn\.net(\/.*)?\/article\/details./],
    values: {
      已关闭$off: null,
      已开启$on: () => {
        if (get("csdn_background-value")) {
          style(`body{background:url("${get("csdn_background-value")}")}`);
        }
        style(
          `body{--blog-content-box-background:${get("csdn_blog-content-box-background-value")}}`,
        );
        style(
          `body{--blog-content-box-opacity:${get("csdn_blog-content-box-opacity-value", "0.98")}}`,
        );
        style(
          `body{--blog-header-box-background:${get("csdn_blog-header-box-background-value")}}`,
        );
        return ":root body .blog-content-box{background:var(--blog-content-box-background)!important;opacity:var(--blog-content-box-opacity)!important}:root body #blogColumnPayAdvert,:root body #blogHuaweiyunAdvert,:root body .article-header-box{background-color:var(--blog-header-box-background)!important}";
      },
    },
  },
  csdn_ad: {
    name: "去广告",
    match: ["csdn.net"],
    values: {
      已开启$on: () =>
        "#ad_iframe,#ad_unit,#mainBox>aside>div.box-shadow.mb8,.GoogleActiveViewElement,.GoogleActiveViewInnerContainer,.adsbygoogle{display:none!important;visibility:hidden!important;width:0!important;height:0!important}",
      已关闭$off: null,
    },
  },

};

run(features_csdn_1114922075);