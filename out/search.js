// ==UserScript==
// @name		搜索引擎 优化/美化/净化/增强 搜索引擎快速切换 百度必应谷歌/Baidu/Bing/Google
// @name:zh		搜索引擎 优化/美化/净化/增强 搜索引擎快速切换 百度必应谷歌/Baidu/Bing/Google 搜索引擎快速切换
// @namespace		http://github.com/yuhanawa/UserScript
// @description		搜索引擎 优化/美化/净化/增强 搜索引擎快速切换 百度必应谷歌/Baidu/Bing/Google 搜索引擎快速切换 开发中...
// @description:zh		搜索引擎 优化/美化/净化/增强 搜索引擎快速切换 百度必应谷歌/Baidu/Bing/Google 搜索引擎快速切换 开发中...
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		*://*/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.5.7
// @node		更新日志请见 https://github.com/yuhanawa/UserScript/blob/master/CHANGELOG.md
// @author		Yuhanawa
// @supportURL		https://greasyfork.org/zh-CN/scripts/449705/feedback
// @license		GPL-3.0
// @icon		none
// @run-at		document-start
// ==/UserScript==

/* 
    search v.0.5.7 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/

isLoaded=!1,onload(()=>isLoaded=!0);const __props__=new Map;
function $get(k,d){return GM_getValue(k,void 0===d?__props__.get(k):d)}
function $set(k,v){return GM_setValue(k,v)}
function getOptionKeyAndName(optionStr){var key=optionStr.match(/\$([^ ]+)/)?.[0];return key?{key:key.replace("$",""),name:optionStr.replace(key,"")}:{key:optionStr,name:optionStr}}
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
function loadConfig(name,properties){GM_registerMenuCommand("在新窗口打开设置中心",()=>{showConfigPage()}),GM_registerMenuCommand("在页面内镶嵌设置中心(BETA)",()=>{LoadConfigPage(name).then(()=>showConfigPage())}),anchors=[];for(const key of Object.keys(properties))__props__.set(name+"_"+key,properties[key].default),key.startsWith("#")&&anchors.push({key:key,href:properties[key].href||key,title:properties[key].title||properties[key].description||key});(location.href.match("yuhan-script-config.netlify.app")||location.href.match("user-script-config-form.vercel.app")||location.href.match("yuhanawa.github.io/tools/userscriptconfig")||location.href.match("localhost"))&&(void 0===unsafeWindow.userscript&&(unsafeWindow.userscript={}),unsafeWindow.userscript[name]={props:properties,anchors:anchors,get:$get,set:$set})}
function style(css){var node;"undefined"!=typeof GM_addStyle?GM_addStyle(css):((node=document.createElement("style")).appendChild(document.createTextNode(css)),document.body.appendChild(node))}
function option(name,key,options,current,index,onclick){return null!=current&&null!=index||(current=$set(key,getOptionKeyAndName(options[0]).key),index=options.indexOf(options.filter(x=>getOptionKeyAndName(x).key==current)[0])),-1!==index&&void 0!==index||($set(key,getOptionKeyAndName(options[0]).key),current=getOptionKeyAndName(options[index=0]).key),name+=`:${getOptionKeyAndName(options[index]).name}[${index+1}/${options.length}]<点击切换模式`,GM_registerMenuCommand(name,()=>{if(index+1>=options.length?$set(key,getOptionKeyAndName(options[0]).key):$set(key,getOptionKeyAndName(options[index+1]).key),onclick)try{onclick()}catch{}location.reload()}),index}
function onload(f){isLoaded?f():document.addEventListener("DOMContentLoaded",()=>f())}
function timeoutOnLoad(f,t){onload(()=>setTimeout(()=>f(),t))}
function intervalOnLoad(f,timeout){onload(()=>setInterval(f,timeout))}
function run(fts){void 0===fts&&(fts=features);for(const key of Object.keys(fts))try{const feature=fts[key];("boolean"==typeof feature.match&&1==feature.match||0!==feature.match.filter(m=>"string"==typeof m?null!==window.location.href.match(m):m.test(window.location.href)).length)&&addFeature(key,feature)}catch(error){console.error("发生了一个意料之外的错误, 这可能是因为非法的feature所造成的, 不过请放心, 脚本将继续运行而不会崩溃. ",feature,error)}}
function addFeature(key,feature){var{name,values}=feature;if(!feature.switchable||$get(key+"_switch",feature.default_switch_state??!0))if("$"===name||feature.directlyRun)try{"function"==typeof values?"string"==typeof(result=values(feature))&&style(result):"string"==typeof values&&style(values)}catch(e){console.error(e)}else{var result=Object.keys(values),key0=getOptionKeyAndName(result[0]).key;let current=$get(key,key0),index=result.findIndex(x=>getOptionKeyAndName(x).key===current);-1!==index&&void 0!==index||($set(key,key0),index=0,current=key0),feature.hideInMenu||option(name,key,result,current,index);try{var value=values[result[index]];if(null!=value)if("function"==typeof value){const result=value(feature);"string"==typeof result&&style(result)}else"string"==typeof value&&style(value)}catch(e){console.error(e)}}}

const engine_switch_tool_version = 5;

let css = "";
let isRunning = false;
let isLoaded = false;

let searchURLMatchList = `
    # 一行一个 井号开头的行将被忽略
    bing.com/search
    woc.cool/search
    www.baidu.com/s
    fsoufsou.com/search
    www.google.com/search?q
    duckduckgo.com/?q
    so.com/s
    sogou.com/web?query
    search.yahoo.com/search
    yandex.com/search
    searx.tiekoetter.com
    petalsearch.com
    xn--flw351e.ml/search
    search.aust.cf/search
    search.njau.cf/search
    wuzhuiso.com/s
    ecosia.org/search
    startpage.com/sp/search
    you.com/
    www.qwant.com
    www.startpage.com
    `
let defaultSearchList = `
    # 格式: “名称,链接”, 一行一个 井号开头的行将被忽略
    谷歌搜索,https://www.google.com/search?q=$
    百度搜索,https://www.baidu.com/s?wd=$
    Bing搜索,https://cn.bing.com/search?q=$
    鸭鸭搜索,https://duckduckgo.com/?q=$
    搜狗搜索,https://www.sogou.com/web?query=$
    360搜索,https://www.so.com/s?q=$
    # 雅虎,https://search.yahoo.com/search?p=$
    Yandex,https://yandex.com/search/?text=$
    维基百科,https://zh.wikipedia.org/wiki/$
    #无追搜索,https://www.wuzhuiso.com/s?q=$
    #ecosia,https://www.ecosia.org/search?method=index&q=$
    #startpage,https://www.startpage.com/sp/search
    #qwant,https://www.qwant.com/?q=$
    `;
let translateURLMatchList = `
    https://fanyi.baidu.com/
    https://translate.google.com/
    https://dict.youdao.com/
    https://cn.bing.com/dict/search
    https://www.vocabulary.com/dictionary/
    https://dictionary.cambridge.org/zhs
    https://www.learnersdictionary.com/definition/
    `
const DefaultFontFamily = `MiSans,-apple-system,Microsoft YaHei,Tahoma,Arial,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif `;
const get_search_font_family = () =>
    $get("search-font-family", DefaultFontFamily).trim() === "" ? DefaultFontFamily : $get("search-font-family", defaultSearchList).trim();


// noinspection JSUnresolvedFunction
const get = (key, d) => GM_getValue(key, d)
// noinspection JSUnresolvedFunction
const set = (key, v) => GM_setValue(key, v)



// ---------------------------------------------------------------------------- //


const menu = (name, key, defaultValue) => {
    const value = $get(key, defaultValue)
    name += value ? ':开启' : ':关闭';
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(name, () => {
        $set(key, !value);
        location.reload()
    });
    return value;
}
const options = (name, key, ValueList) => {
    const index = $get(key, 0)
    name += `:${ValueList[index]}[${index + 1}/${ValueList.length}]<点击切换模式`;
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(name, () => {
        if (index + 1 >= ValueList.length) $set(key, 0); else $set(key, index + 1);
        location.reload()
    });
    return index;
}
const match = (x) => {
    if (typeof x == "undefined") return false;
    if (typeof x == "string") {
        if (document.URL.indexOf(x) !== -1) {
            if (!isRunning) {
                isRunning = true;
                console.info("> 优化美化净化增强脚本 运行中... 求star https://github.com/yuhanawa/UserScript")
            }
            return true;
        }
    } else if (typeof x == "object") {
        if (x.test(document.URL)) {
            if (!isRunning) {
                isRunning = true;
                console.info("> 优化美化净化增强脚本 运行中... 求star https://github.com/yuhanawa/UserScript")
            }
            return true;
        }
    } else console.error(`? 意料之外的错误: x:${x} URL:${URL}`)


    return false;
}
const str2list = (s) =>
    s.split('\n').map((x) => {
        if (!x.trim().startsWith('#') && x.trim().length > 3) {
            return x.trim();
        }
    })

const matchList = (l) => {
    for (let i = 0; i < l.length; i++) {
        if (match(l[i])) return true;
    }
    return false;
}
const style = (css) => {
    css = css.replaceAll(/\s{2,}/g, " ")
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        const node = document.createElement("style");
        node.appendChild(document.createTextNode(css));
        document.body.appendChild(node);
    }
}
const onload = (f) => {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
const setTimeoutBeforeLoad = (f, t) => onload(() => setTimeout(() => f(), t));

const setIntervalBeforeLoad = (f, timeout) => onload(() => {
    f();
    setInterval(f, timeout);
})

onload(() => isLoaded = true);


/* search */
if (matchList(str2list(searchURLMatchList))) {
    menu("搜索引擎优化美化净化", 'search', true);
    menu("搜索引擎快速切换工具", 'search_engine_switch_tool', true);

    onload(() => {
        /*添加背景*/
        document.body.insertAdjacentHTML("afterbegin", "<div id='blur-awa'/>")
        /* 匹配搜索框 */
        if (match("sogou.com/web?query")) document.getElementById("bottom_form_querytext").className += " search-input-awa "; else if (match("bing.com")) {
            document.getElementById("sb_form_q").className += " search-input-awa ";
        } else if (match("duckduckgo.com/")) {
            document.getElementById("search_form_input").className += " search-input-awa ";
        } else {
            document.querySelectorAll("input").forEach(i => {
                if (i.type === 'text' || i.type === 'search') i.className += " search-input-awa ";
            });
            if (document.querySelectorAll(".search-input-awa").length === 0) {
                setTimeout(() => {
                    document.querySelectorAll("input").forEach(i => {
                        if (i.type === 'text' || i.type === 'search') i.className += " search-input-awa ";
                    });
                }, 2000)
            }
        }
    })
    if (menu("搜索界面默认使用MiSans字体", 'search_misans', true)) {
        /* 添加字体 */
        style(`
                @import url('https://unpkg.com/misans@3.1.1/lib/misans-400-regular.min.css');
                @import url('https://unpkg.com/misans@3.1.1/lib/misans-500-medium.min.css');
                `);
    }
    style(`* {font-family: ${get_search_font_family()}  !important;}`)

    /* search */
    if ($get("search", true)) {
        css += `
            
        a > em, a > strong{
            color: #f73131 !important;
            text-decoration: none !important;
        }    
        a:not(.trgr_icon) {
          position: relative;
          text-decoration: none !important;
          color: #2d65b3 !important;
        /* 3476d2   */
        }
        a:hover:after {
          left: 0 !important;
          width: 100% !important;
          transition: width 350ms !important;
        }
        a:hover {
          text-decoration: none !important;
        }
        a:after {
          content: ""!important;
          position: absolute!important;
          border-bottom: 2px solid #f16d7a !important;
          bottom: -2px!important;
          left: 100%!important;
          width: 0!important;
          transition: width 350ms, left 350ms!important;
        }
                  
        body, .body-awa {
              background: transparent !important
              animation-name: ani_topTobuttom;
              animation-duration: 1s;
              animation-timing-function: ease;
              position: absolute;
              width: 100%;
              {body-awa}
        }
        body:before{
            content: "";
            background-color: #f5f5f5 !important;
            background-image: url(${$get("search-background-img", "")});
            background-size: 100% auto;
            background-attachment: fixed;
            background-position-y: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-size: 100% auto;
            background-attachment: fixed;
            background-position-y: center;
            z-index: -24;
            filter: blur(12px);
        }        
        .head, #head, header, .header, #header, .header-awa
        {
            background-color: transparent !important;
            padding-top: 18px !important;
            position: static !important;
            {header-awa}
        }
        input, .inputbox-awa
        {
            background-color: rgba(255, 255, 255,0.3);
            {inputbox-awa}
        }
        .results > div, .results > li, .result, .container, .item-awa{
            word-wrap: break-word;
            word-break: break-word;
            color: #333;
            line-height: 1.65;
            background-color: rgba(255, 255, 255,1);
            backdrop-filter: blur(8px);
            box-sizing: border-box;
            border-radius: 6px;
            padding: 12px 20px;
            transition: all 450ms cubic-bezier(.23,1,.32,1) 0s;
            box-shadow: 0 2px 6px 0 rgb(0 0 0 / 14%);
            border-collapse: collapse;
            margin-bottom: 18px;
            margin-top: 0px;
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
            {item-awa}
        }
        .item-awa div{
            background: transparent;
            padding: revert !important;
            box-shadow: unset;
            margin-bottom: revert;
            border:unset
        }
        /* 鼠标悬浮添加内阴影 */
        .item-awa:hover {
          border: 1px solid rgba(0, 0, 0, 0.3);
          box-shadow: 0,0, 1px rgba(0,0,0,0.3);
        }
        span, p, .item-awa p, .item-awa span, .item-text-awa{
            line-height: 20px;
            color: #444;
            font-size: 13px;
        } 
        h2,h3,.item-awa h2, .item-awa a, .item-title-awa{
            /*color: #555;*/
            color: #3476dd;
            font-size: 18px;
            line-height: 24px;
            font-weight: 400;
        }
        
        .auto{
            margin:auto !important;
            padding:auto !important;
        }
        `.replaceAll(/\s*,/g, ",").replaceAll(/\s*{/g, "{");
        if ($get("search-background-img", "").trim() !== "") css += `
                    .results > div, .results > li, .result, .item-awa{
                        background-color: rgba(255, 255, 255,.65);
                    }`.replaceAll(/\s*,/g, ",").replaceAll(/\s*{/g, "{");
        /* engine_switch_tool */
        css += `
        #engine_switch_tool{
            all: initial;
            
            z-index: 1024 !important;
            position: fixed !important;
            top: 96px ;
            left: 5px !important;
            display: flex;
            flex-direction: column;
        }
        #engine_switch_tool a:visited {
            color: #333 !important;
        }
        #engine_switch_tool > div{
            opacity:.05;
            cursor: pointer;
        }
        #engine_switch_tool:hover > div{
            opacity:1;
        }
        .switch_tool_compact {
            all: initial;
            
            margin: 10px,2px;
            text-align: center;
            cursor: pointer;
            font-size: 20px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-weight: lighter;
            color: #333;
            background-color: rgba(2555,255,255,124);
            touch-action: manipulation;
            box-shadow: 0px 0px 1px #ccc;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-weight: normal;
        }
        .switch_tool_link {
            all: initial;
            
            margin: 10px,3px;
            text-align: center;
            cursor: pointer;
            font-size: 20px;
            font-weight: lighter;
            color: #333;
            touch-action: manipulation;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-weight: normal;
        }
        .switch_tool_button {
            all: initial;
            
            margin: 10px;
            text-align: center;
            cursor: pointer;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 5px;
            font-size: 20px;
            font-weight: lighter;
            color: #333;
            background-color: #fff;
            width: 120px;
            height: 28px;
            touch-action: manipulation;
            box-shadow: 0px 0px 1px #ccc;
            transition: all 0.2s ease-in-out;
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            -o-transition: all 0.2s ease-in-out;
            font-weight: normal;
        }
        
        .switch_tool_show {
            opacity:1 !important;
        }
        .switch_tool_invisible {
            opacity:0.2 !important;
        }        
        .switch_tool_auto {
            opacity:0.2 !important;
        }       
        .switch_tool_auto:hover {
            opacity:1 !important;
        }           
        
        `.replaceAll(/\s*,/g, ",").replaceAll(/\s*{/g, "{");
        const addClass = (y, add) => css = css.replaceAll(`${y},`, `${add},${y},`).replaceAll(`${y}{`, `${add},${y}{`);

        if (match("bing.com/search")) {
            css += `
                .sh_favicon{
                    margin-left: 16px;
                }
                #b_content{
                    padding-top: 25px;
                }
        
                .b_hPanel /* bing词典手机app广告 */
                {
                    display: none;
                }
                
                #id_sc,#id_h #id_l {   /* 设置按钮 */
                    margin-top: -46px;
                }
                body #b_header #est_switch {    /* 国际版切换按钮 */
                    position: relative;
                    right: 240px;
                    top: 5px;
                    display:block!important;
                }
                #est_switch { 
                    display:none;  /*防止页面闪烁 先隐藏等会显示*/
                }
                /* 首个搜索结果的遮罩和查看更多按钮 */
                .b_rc_gb_bottom_cover,
                .b_rc_gb_cover,
                .rc_gb_seemore { 
                    display:none !important;
                }
                /* 调整首个搜索结果的高度 */
                .b_Richcard, .b_RichCardAnswerV2,
                .b_rc_gb_sub{
                    max-height: none !important;
                    height: auto !important;
                }
                
                #mfa_root{      /* 重置右下搜索按钮样式 */
                    background: transparent!important;
                    box-shadow: unset!important;
                    margin-bottom: revert!important;
                    border:unset!important;
                    backdrop-filter:unset!important;
                }
                
                /* 国际版切换按钮 */
                #est_cn, 
                #est_en{
                    height: 12px;
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin: 8px;
                    border-radius: 4px;
                }
                #est_cn::after,
                #est_en::after{
                    border-radius: 2px;
                }
                
                /* 特殊横条 */
                #b_pole{
                    opacity:0.85;
                }
                
                /* rewards */
                #id_rh{
                    margin-top: -46px;
                }
                
                .b_scopebar{
                    top: auto!important;
                    bottom: auto!important;
                }
                
                #b_header {
                    height: unset!important;
                }
                
                #recentSearchLGContainer{
                    top: 5px !important;
                    right: 2px !important;
                    left:unset !important;
                }
                #recentSearchLGContainer > h2::after{
                    content:": 此处样式(配色,动画等)待适配:快懒死了,一点都不想干活"
                }                         
                `;
            addClass(".item-awa", "#b_results > li")

            onload(() => {
                /* 移动 切换按钮 位置 */
                const est_switch_html = `>${document.getElementById("est_switch").outerHTML}<a id="id_l"`;
                document.getElementById("est_switch").remove();
                document.getElementById("id_h").outerHTML = document.getElementById("id_h").outerHTML
                    .replace(`><a id="id_l"`, est_switch_html)
                document.getElementById("est_switch").style.display = "block";

                /* 移除空白的div */
                const bc = document.getElementById("b_context");
                if (bc.outerText.length < 20) {
                    bc.remove();
                }
                const ba = document.getElementsByClassName("b_ans");
                for (let i = 0; i < ba.length; i++) {
                    const b = ba[i];
                    if (b.innerHTML.length < 3) {
                        b.remove();
                    }
                }
            })

            if ($get("search-background-img", "").trim() !== "") {
                css += `
                        #b_header {
                            border-bottom: 0px !important;
                        }
                    `
            }

            if ($get("remove_favicon_icon", true)) {
                css += `.sh_favicon{ display:none !important; }`
            }
        }
        // --------------------------------------- //
        else if (match("baidu.com/s")) {
            addClass(".item-awa", ".result-op, .result-op")

            css += `
                #s_tab{
                    padding-top: 0px !important;
                }
                #result_logo img{display:none}
                #result_logo{background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMTAxIDMzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDEgMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojNDg3OUJEO30KCS5zdDF7ZmlsbDojREQ0NDM2O30KCS5zdDJ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTUwLjQsMTUuM2MtMy44LDAuMy00LDIuNi01LjcsNC43Yy0xLjgsMi4yLTUuNSw0LjEtNiw2LjdjLTAuNiwzLjMsMS4zLDUuMSwzLDUuN2MxLjksMC42LDYuMi0wLjUsOC40LTAuNWgwLjIKCWgwLjJjMi4yLDAsNi40LDEuMSw4LjQsMC41YzEuOC0wLjYsMy41LTMuMiwzLTUuN2MtMC40LTIuMS00LjQtNC41LTYuMi02LjdDNTQuMiwxOCw1NC4zLDE1LjYsNTAuNCwxNS4zeiBNMzcsMTQuOAoJYzAsMi40LDEuNiw0LjMsMy40LDQuM2MxLjksMCwzLjQtMS45LDMuNC00LjNjMC0yLjQtMS42LTQuMy0zLjQtNC4zUzM3LDEyLjUsMzcsMTQuOHogTTQzLjksOC42YzAsMi41LDEuNSw0LjUsMy4zLDQuNQoJYzEuOCwwLDMuMy0yLjEsMy4zLTQuNVM0OSw0LjEsNDcuMSw0LjFDNDUuMyw0LDQzLjksNiw0My45LDguNnogTTUyLjIsOC41YzAsMi4zLDEuNCw0LjMsMy4yLDQuM3MzLjItMS45LDMuMi00LjNzLTEuNC00LjMtMy4yLTQuMwoJUzUyLjIsNi4yLDUyLjIsOC41eiBNNTcuNSwxNS45YzAsMi4zLDEuNSw0LjMsMy4zLDQuM2MxLjgsMCwzLjMtMS45LDMuMy00LjNzLTEuNS00LjMtMy4zLTQuM0M1OC45LDExLjYsNTcuNSwxMy42LDU3LjUsMTUuOXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTQsMzAuNHYtNS4xaDYuNGMxLjYsMCwxLjYsMC4zLDEuNiwydjEuNGMwLDEuNi0yLjMsMS44LTMuOSwxLjhMNCwzMC40TDQsMzAuNHogTTQsMjN2LTQuOGg0LjEKCWMxLjYsMCwzLjksMCwzLjksMi4xdjAuMWMwLDEuNC0wLjUsMi42LTEuOCwyLjZDMTAuMywyMyw0LDIzLDQsMjN6IE0xLjcsMTZ2MTYuM2g2LjRjMywwLDYuMiwwLDYuMi0zLjZ2LTEuMWMwLTEuNi0wLjEtMi43LTEuMS0zLjUKCWMxLTAuOCwxLjEtMi4zLDEuMS0zLjZsMCwwYzAtNC41LTMuMi00LjUtNi4yLTQuNUwxLjcsMTZMMS43LDE2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjUsMjguOWMtMS4xLDEuMS0zLjMsMS4zLTMuNSwxLjNjLTEuMywwLTIuNy0wLjUtMi43LTIuMWMwLTEuNCwwLjUtMi4zLDIuMS0yLjNjMS4zLDAsMi44LDAuMSw0LjEsMC42VjI4Ljl6CgkgTTIxLjQsMzIuM2MwLjQsMCwyLjMtMC4xLDMuNy0wLjlsMC4yLDAuN2gyLjF2LTguOWMwLTMuNi0yLjMtNS01LjctNWMtMS44LDAtNC4zLDAuNy00LjcsMC45bDAuNCwyLjNjMS42LTAuNiwzLTAuNiw0LjItMC42CgljMS44LDAsMy4zLDAuNiwzLjMsMi42VjI0Yy0xLTAuNC0yLjQtMC42LTQuMS0wLjZjLTMsMC00LjUsMS42LTQuNSw0LjdDMTYuNCwzMS44LDE5LjYsMzIuMywyMS40LDMyLjN6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMC4yLDE2LjFjMCwwLjYsMC42LDEuMiwxLjMsMS4yYzAuOCwwLDEuMy0wLjYsMS4zLTEuMmMwLTAuNy0wLjYtMS4zLTEuMy0xLjNDMzAuOCwxNC44LDMwLjIsMTUuMywzMC4yLDE2LjF6CgkgTTMwLjMsMzIuMWgyLjRWMTguNWgtMi40VjMyLjF6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MS4yLDIyLjFoOC40YzAuNCwwLjEsMC42LDAuMywwLjYsMC43djIuNmgtOS43di0yLjZDNzAuNiwyMi40LDcwLjgsMjIuMiw3MS4yLDIyLjF6IE03MS4yLDMwLjUKCWMtMC40LDAtMC42LTAuMy0wLjctMC44di0yLjZoOS43djIuNmMwLDAuNC0wLjIsMC43LTAuNiwwLjdINzEuMnogTTczLjYsMThjLTAuMSwwLjQtMC4xLDAuOS0wLjQsMS43Yy0wLjEsMC4zLTAuMSwwLjUtMC4xLDAuNwoJaC0yLjZjLTEuMywwLjEtMS45LDAuOC0yLDJ2Ny45YzAuMSwxLjEsMC44LDEuOCwyLDEuOWgxMGMxLjItMC4xLDEuOC0wLjcsMS45LTEuOHYtNy45Yy0wLjEtMS4zLTAuNy0xLjktMS45LTIuMWgtNQoJYzAuMS0wLjMsMC4xLTAuOCwwLjMtMS40YzAuMS0wLjQsMC4xLTAuNywwLjEtMC45aDcuMnYtMS44SDY3LjRWMThMNzMuNiwxOEw3My42LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOTMuNywyMi43Yy0wLjQtMC4xLTAuNS0wLjItMC41LTAuNXYtMC42aDMuMnYwLjZjLTAuMSwwLjMtMC4yLDAuNC0wLjUsMC41SDkzLjd6IE05Ni42LDI0LjEKCWMxLjEtMC4xLDEuNi0wLjUsMS42LTEuNHYtMWgyLjN2LTEuNWgtMi4zdi0xLjFoLTEuOHYxLjFoLTMuMnYtMS4xaC0xLjh2MS4xaC0yLjN2MS41aDIuM3YxYzAuMSwwLjksMC42LDEuNCwxLjYsMS40SDk2LjZ6CgkgTTk0LjgsMzAuNGMxLjYsMC44LDMuNCwxLjMsNS40LDEuOGwwLjktMS43Yy0xLjQtMC4yLTIuOS0wLjYtNC40LTEuMWMxLjEtMC44LDItMS42LDIuNy0yLjVjMC4zLTAuNCwwLjQtMC45LDAuMi0xLjMKCWMtMC4zLTAuNi0wLjgtMC45LTEuNC0wLjloLTl2MS41aDcuN2MwLjIsMCwwLjQsMC4xLDAuNCwwLjFzMCwwLjEtMC4xLDAuM2MtMC42LDAuNi0xLjQsMS4zLTIuMywxLjhjLTEuMi0wLjctMi4xLTEuMy0yLjQtMS44aC0yLjIKCWMwLjksMSwxLjgsMS45LDIuOSwyLjdjLTEuNiwwLjYtMy4zLDEuMS00LjksMS4zbDAuOSwxLjZDOTEuMywzMS44LDkzLjIsMzEuMSw5NC44LDMwLjR6IE04OC4zLDI1LjJ2LTZjMC4xLTAuNiwwLjMtMC45LDAuOC0wLjkKCWgxMS44di0xLjZIOTVjLTAuMS0wLjEtMi4yLTAuMS0yLjIsMGgtNC43Yy0xLjEsMC4xLTEuNywwLjktMS44LDIuMlYyNWMwLjEsMi4xLTAuNCw0LjQtMS4xLDYuN2wxLjksMC42CglDODcuOSwyOS45LDg4LjMsMjcuNiw4OC4zLDI1LjJ6Ii8+CjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik00Ni4zLDI0LjJjMC42LDAsMS4yLDAuMSwxLjcsMC40djMuNGMwLDAuMy0wLjYsMS0xLjksMWMtMS41LDAtMS44LTAuNi0xLjgtMi4xdi0wLjYKCUM0NC4yLDI0LjgsNDQuNywyNC4yLDQ2LjMsMjQuMnogTTQ5LjIsMjAuN0g0OHYyLjVDNDcuNiwyMy4xLDQ3LDIzLDQ2LjMsMjNjLTIuNywwLTMuMywxLTMuMywzLjV2MC4zYzAsMi40LDAuOSwzLjMsMy4yLDMuMwoJYzAuOCwwLDEuMy0wLjEsMS44LTAuNWwwLjEsMC42aDEuMUw0OS4yLDIwLjdMNDkuMiwyMC43eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNTYuNywyM2gtMS4ydjUuMmMtMC42LDAuNC0xLjcsMC42LTIuNCwwLjZjLTAuOCwwLTEtMC40LTEtMS4zdi00LjZoLTEuMXY0LjhjMCwxLjYsMC41LDIuMywyLjEsMi4zCgljMSwwLDIuMS0wLjMsMi42LTAuNmwwLjEsMC42aDEuMVYyM3oiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTkyLjcsMTUuN2MwLTAuNywwLjYtMS4zLDEuMi0xLjNjMC42LDAsMS4yLDAuNiwxLjIsMS4zUzk0LjUsMTcsOTMuOSwxN0M5My4zLDE2LjksOTIuNywxNi4zLDkyLjcsMTUuN3oiLz4KPC9zdmc+Cg==");background-repeat:no-repeat;background-position:center;width:112px;height: 36px;margin:10px 0 0 0!important;}
                .wrapper_new #s_tab .cur-tab:before,
                .wrapper_new #s_tab .s-tab-news:before,
                .wrapper_new #s_tab .s-tab-video:before,
                .wrapper_new #s_tab .s-tab-pic:before,
                .wrapper_new #s_tab .s-tab-tieba:before,
                .wrapper_new #s_tab .s-tab-zhidao:before,
                .wrapper_new #s_tab .s-tab-wenku:before,
                .wrapper_new #s_tab .s-tab-map:before,
                .wrapper_new #s_tab .s-tab-b2b:before{
                    content: none;
                }
                .bdsug, /* 搜索预测 */
                .s-tab-more,    /* tags */
                .wrapper_new #s_tab .s-tab-news,
                .wrapper_new #s_tab .s-tab-zhidao,
                .wrapper_new #s_tab .s-tab-wenku,
                .wrapper_new #s_tab .s-tab-b2b{
                    display:none !important;
                }       
                .wrapper_new #u{
                    margin: 21px 9px 5px 0;
                }
                /* 调整位置 */
                #container{
                    margin-left: 160px !important;
                }
                #container.sam_newgrid #content_left{
                    padding-top: 8px;
                }
                
                /* 移除百度汉语等内容下的边框 */
                .c-border {
                    border: unset;
                    box-shadow: unset;
                    -webkit-box-shadow: unset;
                    -moz-box-shadow: unset;
                    -o-box-shadow: unset;
                }
                
                /* 搜索预测 */
                .c-group-wrapper{
                    margin: 0 !important;
                }
                
                #searchTag.tag-fixed{
                    position:unset !important;
                    box-shadow:unset !important;
                }
                .tag-container_ksKXH{
                    background: transparent !important;
                }
                .tags_2yHYj:hover{
                    background-color: ##cccc !important;
                }
                .tags_2yHYj span:hover{
                    color: #f16d7a !important;
                }        
                
                        
                .tags_2yHYj{
                    background-color: #fffc !important;
                    padding: 6px 10px 12px 10px !important;
                }
                
                #content_left .search-source-wrap {
                    position: relative !important;
                    margin-top: -12px !important;
                    margin-bottom: 18px !important;
                    margin-left: 8px !important;
                }
    
                .c-span9 {
                    width: 372px !important;
                }
                .c-row > .c-span4 {
                    width: 155px !important;
                }
                .image-one-line_2GgpZ{
                    height: 100px;
                    overflow: hidden;
                    align-items: center;
                    display: flex;
                }
                `;

            onload(() => {
                document.body.insertAdjacentHTML("afterend", `<style>${css}</style>`);
            })
        }
        // --------------------------------------- //
        else if (match("fsoufsou.com/search") || match("woc.cool/search")) {
            addClass(".header-awa", "._search-sticky-bar")
            addClass(".inputbox-awa", ".input-group-container")
            addClass(".item-awa", ".organic-results div")
            addClass(".item-awa div", ".organic-results div div")
            addClass(".item-title-awa", ".organic-results div a")
            addClass(".item-text-awa", ".organic-results div span")
            addClass(".auto", ".mobile-wiki-container")

            css += `
                    #app div .false {
                        padding-top: 0px !important;
                    } 
                    
                    .organic-results {
                        padding-top: 16px;
                    }
                    
                    #search-input{
                        background-color: transparent !important;
                    }
                    
                    .organic-results{
                        max-width: 618px !important;
                        margin-left: 48px !important;
                    }
                    
                    #code-block-container{
                        max-width: 480px;
                    }
                `
        }
        // -小众中国网站---------------------------- //
        else if (match("sogou.com") || match("so.com")) {
            addClass(".item-awa", ".result > li")

            css += `
                /* 矫正搜索栏下方tag */
                .searchnav {
                    position: absolute;
                    top: 55px;
                 }
                .result{
                    all: unset;
                }
                /* 去除头部白色 */
                #header .inner {
                    background:transparent;
                 }
                #tabs-wrap {
                    padding: 0 0 0 135px !important;
                }
                .biz_sponsor,#so-10th-anni-user-guider-dlg, /* AD */
                .right, /* 搜狗右侧 */
                #side,
                .menu,#promotion_adv_container,.top-hintBox,#rs-top,  /* 移除多余 */
                .double-eleven{
                    display:none !important;
                }
                /* 太胖了 */
                .res-comm-con{
                    width: 360px !important;
                }
                /* 调整位置 */
                .wrapper, #wrapper, #container{
                    padding-left: 160px !important;
                }
                `
        }
        // -小众外国网站---------------------------- //
        else if (match("ecosia.org/search")) {
            css += `
                    #search-filters{
                        margin-left: 24px;
                    }
                    main{
                        padding-left: 36px;
                        margin-top: -12px;
                    }
                `
        }
        // --------------------------------------- //
        else {
            addClass(".header-awa", ".CvDJxb")
            addClass(".item-awa", ".MjjYud")
            addClass(".item-awa div", ".MjjYud div")
            addClass(".item-title-awa", "h3.LC20lb")
            addClass(".item-text-awa", ".MjjYud span")

            css += `
                .yg51vc, /*头部白色区域*/
                .appbar /*获得约 * 条结果，以下是第 * 页*/
                {
                    background-color: transparent !important;
                }
                
                .sfbg, /*令人疑惑的留白*/
                .dodTBe/*同上*/
                {
                    display:none !important;
                    height:0px !important;
                    weight:0px !important;
                }
                
                /* 调整位置 */
                .s6JM6d{
                    margin-left:160px
                }
                
                .hlcw0c, .ULSxyf, .hlcw0c {
                    margin-bottom: auto !important;
                }
                
                .MXl0lf.tKtwEb {
                    background: #4285f4 !important;
                }
                .u7yw9 {
                    background: #ffffff !important;
                }
                `
        }
    }

    /* search tools */
    if ($get("search_engine_switch_tool", true)) {
        if ($get("engine_switch_tool_version", -1) + 3 < engine_switch_tool_version) {
            $set("engine_switch_tool_version", engine_switch_tool_version);
            if ($get("engine_switch_tool_version", -1) !== -1) {
                setTimeoutBeforeLoad(() => {
                    document.body.insertAdjacentHTML("afterend", `
                        <div id="removeafter3s" style="font-size: xx-large;position: fixed;margin: auto;top: 20vh;left: 0;right: 0;width: max-content;height:min-content;padding: 40px;background: lightgreen;opacity: 0.8;">
                            <h1 style="font-size: xx-large"> 此信息将会在3秒后自动消失 </h1>
                            <h1 style="font-size: xx-large"> !!! 您的搜索引擎快速切换工具列表配置文件因为过于老旧而被重置 !!! </h1>
                        </div>
                    `)
                    setTimeout(() => {
                        document.getElementById("removeafter3s").remove();
                    }, 3500)
                }, 600)
            }
        }
        if ($get("engine_switch_tool_list", "").trim() === "") $set("engine_switch_tool_list", defaultSearchList);
        let list = $get("engine_switch_tool_list").trim();

        onload(() => {
            try {
                document.getElementById("engine_switch_tool").remove()
            } catch {
            }

            let html = "";
            list.split("\n").forEach((s) => {
                s = s.replaceAll(/\s/g, "");
                if (s === "" || s.startsWith('#') || s.startsWith('-')) return;
                html += ` <!--suppress HtmlUnknownAttribute -->
<a class="${get("switch_tool_style", "switch_tool switch_tool_button switch_tool_auto")}" href = "${s.split(',')[1]}" key = "${s.split(',')[1]}"
                         onclick="this.href=this.getAttribute('key').replace('$',document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))">${s.split(',')[0]}</a>
                   `
            });

            document.body.insertAdjacentHTML("afterend", `<div id="engine_switch_tool" title="如何关闭该区域:  点击你的油猴插件，找的此脚本(Yuhan User Script), 在菜单中即可找到关闭按钮"> 
                <div id ="switch_tool_style" style="margin: auto;">
                    <div>
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_auto','switch_tool_invisible').replace('switch_tool_show','switch_tool_invisible')}); ">隐形</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_auto','switch_tool_show').replace('switch_tool_invisible','switch_tool_show')}); ">显示</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_invisible','switch_tool_auto').replace('switch_tool_show','switch_tool_auto')}); ">自动</a>
                    </div>
                    <div>
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_compact','switch_tool_link').replace('switch_tool_button','switch_tool_link')}); ">链接</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_button','switch_tool_compact').replace('switch_tool_link','switch_tool_compact')}); ">紧凑</a> /
                        <a onclick=" Array.from(document.getElementsByClassName('switch_tool')).forEach((x)=>{x.className=x.className.replace('switch_tool_compact','switch_tool_button').replace('switch_tool_link','switch_tool_button')}); ">按钮</a>
                    </div>
                </div>${html}</div>`);
        })
        setTimeoutBeforeLoad(() => {
            const tool = document.getElementById("engine_switch_tool");

            document.getElementById("switch_tool_style").addEventListener("click", () => {
                $set("switch_tool_style", document.getElementsByClassName('switch_tool')[0].className);
            });

            try {
                if (document.getElementsByClassName("switch_tool")[0].onclick === null) {
                    tool.addEventListener("click", () => {
                        Array.from(document.getElementsByClassName("switch_tool")).forEach((i) => {
                            i.href = i.getAttribute('key').replace('$', document.getElementsByClassName('search-input-awa')[0].getAttribute('value').replaceAll('%', '%25').replaceAll('#', '%23').replaceAll('&', '%26').replaceAll('+', '%2B').replaceAll(' ', '%20').replaceAll('?', '%3F').replaceAll('=', '%3D'))
                        })
                    });
                }
            } catch {
            }

            window.onscroll = () => {
                tool.style.top = (window.scrollY > 96 ? 0 : 96 - window.scrollY).toString() + "px";
            }

        }, 800)

    }

    const index = options("搜索引擎快速聚焦模式(Ctrl+[K|Q|S])", 'search_engine_quick_focus', ["清空", "关闭", "选中", "聚焦",])
    if (index !== 1) {
        document.onkeydown = (e) => {
            if (e.ctrlKey && (e.key === "q" || e.key === "s" || e.key === "k")) {
                if (index === 0) document.getElementsByClassName("search-input-awa")[0].value = ""; else if (index === 2) document.querySelector("input").select();
                document.getElementsByClassName("search-input-awa")[0].focus();
                e.preventDefault();
            }
        }
    }

    onload(() => {
        /* search setting */
        document.body.insertAdjacentHTML("afterend", `
    <style>
        #search-setting-btn-awa{
            z-index: 114514;
            position: fixed;
            left: 40px;
            bottom: 30px;
            background: transparent;
            border: 0 transparent !important;
            width: 50px;
            height: 50px;
            font-size: xx-large;
            opacity: 30%;
        }
        div:hover > #search-setting-btn-awa{
            opacity: 100%;
        }
        #search-setting-close-awa{
            z-index: 114514;
            position: absolute;
            right: 32px;
            top: 24px;
            background: transparent;
            border: 0 transparent !important;
            font-size: xxx-large;
        }        
        #search-setting-awa {
            z-index: 114514;
            position: fixed;
            margin: auto;
            width: 70vw;
            height: 70vh;
            top: 10vh;
            left: 10vw;
            background-color: rgba(33,33,33,0.8);
            background-image: url(${get("search-background-img")});
            background-size: cover;
            background-repeat: no-repeat;
            background-position-y: bottom;
            opacity: 0.88;
            border: 1px solid rgba(0,0,0,0.5);
            box-shadow: 6px 10px 24px 6px rgba(100,100,100,0.65);
            border-radius: 24px;
            padding: 5vh 5vw;
            overflow: hidden;
            overflow-y:auto
        }
        #search-setting-awa * {
            color: #ffffff;
            font-size: x-large;
            overflow: hidden;
        }

        #search-setting-awa pre{
            height: 60px;
            width: 60vw;
            background-color: black;
            opacity: 0.4;
            color: white;
            border: gray 1px;
            box-shadow: 2px 4px 8px 2px rgba(100,100,100,0.65);
        }
        #search-setting-awa > li > button{
                position: relative;
                right: 5px;
                top: 5px;
        }
        
    </style>
    <div>   
       <button id="search-setting-btn-awa" onclick='let e = document.getElementById("search-setting-awa");e.style.display=e.style.display==="block"?"none":"block"'>🎨</button>
       <div id="search-setting-awa" style="display: none">
            <button id="search-setting-close-awa" onclick="this.parentElement.style.display='none'">[X]</button>
            <p>该页面的修改会自动保存，刷新生效，留空使用默认值</p><br>
            <li title="留空使用脚本自带样式,需要系统安装此字体"> 
            font-family: <input id="search-font-family" value="${get_search_font_family()}"/>
            </li>
            
            <li title="请输入指向图片一个链接"> 
            background-img: <input id="search-background-img" value="${get("search-background-img", "")}"/>
            </li>
            
            <li title="#开头表示忽略"> 
            屏蔽网站(暂不支持 因需要手动适配各个网站 工作量巨大):<button contenteditable="false" onclick="this.nextElementSibling.style.height=this.nextElementSibling.style.height==='auto'?'60px':'auto'">展开/关闭</button>
               <pre id="search-block-website" contenteditable="true">${get("search-block-website", "")}</pre>
            </li>
               
            <li title="留空使用默认，#开头表示忽略"> 
            搜索引擎:<button contenteditable="false" onclick="this.nextElementSibling.style.height=this.nextElementSibling.style.height==='auto'?'60px':'auto'">展开/关闭</button>
               <pre id="engine_switch_tool_list" contenteditable="true">${get("engine_switch_tool_list", "")}</pre>
            </li>
       </div>
    </div>
        `);

        const addListener = (key) => {
            const e = document.getElementById(key);
            if (e.tagName === "INPUT") {
                e.addEventListener("change", () => {
                    $set(key, document.getElementById(key).value)
                })
            } else if (e.tagName === "PRE") {
                document.getElementById("search-setting-awa").addEventListener("keyup", () => {
                    $set(key, document.getElementById(key).innerText)
                }, true)
            }
        }
        addListener("search-font-family");
        addListener("search-background-img");
        addListener("search-block-website");
        addListener("engine_switch_tool_list");
    });
}

style(css);


loadConfig('search', {"config_test":{"title":"测试","default":"开发中..."}})

let features_search_0={
	
};
run(features_search_0);