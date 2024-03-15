// ==UserScript==
// @name		cnblogs garden
// @name:zh		博客花园(cnblogs 博客园美化)
// @namespace		http://github.com/yuhanawa/UserScript
// @name:zh-CN		博客花园(cnblogs 博客园美化)
// @description		better cnblogs
// @description:zh		cnblogs 博客园 美化 增强
// @description:zh-CN		cnblogs 博客园 美化 增强
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_xmlhttpRequest
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		*://*.cnblogs.com/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.1.12
// @author		Yuhanawa
// @license		GPL-3.0
// @icon		none
// @run-at		document-start
// ==/UserScript==

/* 
    cnblogs v.0.1.12 by Yuhanawa
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


function receiveMessage(event) {
    const data = event.data
    switch (data.type) {
        case "resizeIframe":
            console.log('receiveMessage', data)
            document.getElementById("ing_iframe").style.height = `${data.height}px`;
            break;

        default:
            break;
    }
}
unsafeWindow.addEventListener("message", receiveMessage, false);

function show_ing_iframe() {
    if (document.getElementById("ing_iframe")) return;
    timeoutOnLoad(() => {
        const iframe = document.createElement('iframe')
        iframe.id = "ing_iframe"
        iframe.src = "https://ing.cnblogs.com/"
        document.querySelector('#main_flow').replaceChild(iframe, document.querySelector('#main_flow>.card'))
    }, 50)
}

function getPage(url, obj) {
    GM_xmlhttpRequest({
        url: url,
        method: 'GET',
        overrideMimeType: `text/html; charset=${document.characterSet || document.charset || document.inputEncoding}`,
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'Referer': location.href,
            'User-Agent': navigator.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml'
        },
        timeout: 10000,
        onerror: (response) => {
            console.error(`ERR: URL:${url}`, response);
        },
        ontimeout: (response) => {
            console.warn(`TIMEOUT: URL:${url}`, response);
        },
        ...obj
    });
}

loadConfig('cnblogs', {".line_bc":{"widget":"line","title":"❗❗❗修改完记得点保存(在最下面)❗❗❗"},".line_sw":{"widget":"line","title":"❗❗❗开关还没做好❗❗❗"},"logo_switch":{"title":"LOGO替换","default":true,"widget":"switch","type":"boolean"},"menu_switch":{"title":"首页左侧菜单增强","default":true,"widget":"switch","type":"boolean"}})

let features_cnblogs_898251020={
	cnblogs_side_right:{name:"右侧吸底",match:[/www.cnblogs.com\/[^\/]*$/,/www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//],directlyRun:!0,switchable:!0,values:()=>{fn=()=>{var side=document.getElementById("side_right");side&&side.clientHeight>window.innerHeight?side.style.top=window.innerHeight-side.clientHeight+"px":setTimeout(fn,200)},timeoutOnLoad(fn,200)}},
	cnblogs_menu:{name:"sidenav",match:[/www.cnblogs.com\/[^\/]*$/,/www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//],directlyRun:!0,switchable:!0,values:()=>{onload(()=>{const sidenav=document.getElementsByClassName("sidenav")[0];function insertNavItem(pos,id,href,title,icon){var li=document.createElement("li");return li.id=id,li.className="sidenav-item",li.innerHTML=`<a href="${href}" title="${title}">
                        <img src="${icon}">
                        <span>${title}</span>
                    </a>`,sidenav.insertAdjacentElement(pos,li),li}var sidenav_ing=insertNavItem("afterBegin","sidenav_ing","#ing","闪存","/images/icons/message.svg?v=9K5-cNsbJbeitPFRa_xhJlz37hiIsm4mu7-MMPgi9LQ");sidenav_ing.addEventListener("click",()=>show_ing_iframe());const sidenav_home=insertNavItem("afterBegin","sidenav_home","/","主页",document.getElementById("user_icon").src);/www.cnblogs.com\/#ing*$/.test(location.href)?sidenav_ing.className+=" current-nav":/www.cnblogs.com\/[^\/]*$/.test(location.href)&&(sidenav_home.className+=" current-nav"),setTimeout(()=>{sidenav_home.querySelector("img").src=document.getElementById("user_icon").src},320)})}},
	cnblogs_logo:{name:"LOGO替换",match:[/www.cnblogs.com\/[^\/]*$/,/www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//],directlyRun:!0,switchable:!0,values:".navbar-branding>a{background:url(//common.cnblogs.com/images/logo/logo20170227.png);background-size:contain;background-repeat:no-repeat;width:auto;height:36px;display:block;margin-left:8px}.navbar-branding>a>img{display:none!important}"},cnblogs_ing_in_iframe:{name:"sidenav",match:[/ing.cnblogs.com/],directlyRun:!0,values:()=>{if(top!==self)return timeoutOnLoad(()=>{console.log(document.documentElement),unsafeWindow.parent.postMessage({type:"resizeIframe",height:document.body.clientHeight??document.body.scrollHeight},"*")},250),"#app_bar,#footer,#goTop,#header,#right_sidebar,#top{display:none!important}#container,#container_content,#main,#wrapper,:root,body,html{width:100%;height:100%;margin:0;padding:0}.ing-item{display:flex;flex-direction:row;justify-content:space-around;align-items:flex-end;flex-wrap:nowrap}#user_ing_block{margin:24px 16px}"}},
	cnblogs_ing:{name:"ing",match:[/www.cnblogs.com\/#ing*$/],directlyRun:!0,values:()=>{show_ing_iframe()}},
	cnblogs_better_skin:{name:"better_skin",match:!0,directlyRun:!0,switchable:!0,values:'.skin-lessismoreright #blogTitle{display:flex;flex-direction:row;flex-wrap:wrap;align-content:stretch;justify-content:center;align-items:baseline;padding:12px}.skin-lessismoreright #blogTitle .title:after{content:" | ";white-space:pre}.skin-lessismoreright #blogTitle .subtitle{font-size:15.5pt;color:#222}.skin-lessismoreright #blogTitle .subtitle::before{content:" ";white-space:pre}.skin-lessismoreright #main{padding:4px 20px}.skin-lessismoreright #main .post .postTitle{border-bottom:1px solid rgba(66,119,206,.5333333333);border-bottom-style:dashed;font-size:24px;font-weight:700;margin:20px 0 12px;width:fit-content}.skin-lessismoreright #main .post .postBody{color:rgba(0,0,0,.9882352941);font-size:15px;line-height:25px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif}.skin-lessismoreright #main .post #blog_post_info{height:fit-content;width:-webkit-fill-available;display:inline-flex;flex-direction:row;justify-content:space-between}.skin-lessismoreright #main .post #blog_post_info #author_profile{border:1px solid #ccc;background:#f0f8ff;padding:12px 14px 0;width:fit-content;height:88px;border-radius:6px}.skin-lessismoreright #main .post #blog_post_info #author_profile a{text-decoration:none;color:rgba(0,0,0,.9882352941);font-size:14px;margin:2px}.skin-lessismoreright #main .post #blog_post_info #author_profile #author_profile_follow{position:relative;float:right;top:-18px}.skin-lessismoreright #main .post #blog_post_info #author_profile #author_profile_follow a{color:#06c}.skin-lessismoreright #main .post #blog_post_info #author_profile .author_avatar{margin-right:16px;border:1px solid rgba(128,128,128,.5019607843);border-radius:6px;width:64px}.skin-lessismoreright #main #blog-comments-placeholder .feedback_area_title{font-size:18px}.skin-lessismoreright #main #blog-comments-placeholder .layer{color:gray}.skin-lessismoreright #main #blog-comments-placeholder .blog_comment_body{font-size:15px;color:rgba(0,0,0,.9882352941)}.skin-lessismoreright .commentbox_main.comment_textarea{width:100%}'},cnblogs_base:{name:"美化",match:[/www.cnblogs.com\/[^\/]*$/,/www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//],directlyRun:!0,values:'@charset "UTF-8";*{transition:all .1s}:root{--text-color-1:#202020;--text-color-2:#596172 // old: #555;--text-color-3:#555;--highlighted-color:#5e72e4;--theme-color:#5e72e4}#side_nav{position:sticky;top:8px}#side_nav .sidenav{width:fit-content;font-size:larger;padding-top:14px}#side_nav .sidenav .sidenav-item{margin:2px!important;padding:14px;border-radius:16px}#side_nav .sidenav .sidenav-item img{width:24px;height:24px}#side_nav .sidenav .sidenav-item:hover:not(.current-nav){background:rgba(204,204,204,.8)}#side_nav .sidenav .sidenav-item .dropdown-button>a{display:flex;align-items:center}#side_nav .sidenav .sidenav-category-active,#side_nav .sidenav .sidenav-item.current-nav{padding:14px!important;margin:2px 4px 2px 2px!important;font-weight:700}#side_nav .sidenav .sidenav-category-active img,#side_nav .sidenav .sidenav-item.current-nav img{width:26px;height:26px;box-shadow:inset 0 0 12px 32px rgba(205,255,255,.8509803922),-6px 3px 12px 6px rgba(0,255,255,.1215686275);border-radius:18px}#sidenav_more .dropdown-menu{left:6px;top:85%;font-size:large}#sidenav_more:hover .dropdown-menu{box-shadow:2px 5px 16px 4px #ccc}.post-list{border-top:1px dashed #dcdcdc;margin-top:20px}.post-list a{position:relative;color:#2d65b3!important}.post-list a,.post-list a:hover{text-decoration:none!important}.post-list a:hover:after{left:0!important;width:100%!important;transition:width 350ms!important}.post-list a:after{content:""!important;position:absolute!important;border-bottom:2px solid #f16d7a!important;bottom:-2px!important;left:100%!important;width:0!important;transition:width 350ms,left 350ms!important}.post-list a>em,.post-list a>strong{color:#f73131!important;text-decoration:none!important}.post-list .post-item .avatar{border-radius:4px;padding:0;border:1px solid rgba(34,34,34,.3333333333);margin-top:4px}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link{color:var(--title-color-2);text-decoration:none;font-weight:500;font-size:19px}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:focus,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:hover,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link:focus,.post-list>.post-item>.post-item-body>.post-item-text>.post-item-title:link:hover{color:var(--highlighted-color);text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:2px;text-decoration-color:var(--highlighted-color);transition:all .15s ease-in-out}.post-list>.post-item>.post-item-body>.post-item-text>.post-item-summary{color:var(--text-color-3);margin-top:8px;font-size:15px;font-family:-apple-system,MiSans,Microsoft YaHei,Tahoma,Arial,"Helvetica Neue",Helvetica,"Nimbus Sans L",Arial,"Liberation Sans","PingFang SC","Hiragino Sans GB","Source Han Sans CN","Source Han Sans SC","Microsoft YaHei","Wenquanyi Micro Hei","WenQuanYi Zen Hei","ST Heiti",SimHei,"WenQuanYi Zen Hei Sharp",sans-serif}.card.headline{background:rgba(240,248,255,.8705882353);border-radius:16px;box-shadow:2px 2px 14px 1px rgba(240,248,255,.8705882353)}.card.headline a{font-size:14px;color:#003aae}.card.headline a:hover{text-decoration:none}.card.headline a:hover #text{text-decoration:underline}.card.headline .headline-label{font-size:16px;color:#4242fb}#side_right{position:sticky;top:-2200px;height:fit-content}#side_right #sidebar_bh{background:#fff;padding:8px 16px;border-radius:16px}#side_right #sidebar_bh a{display:inline-grid;align-content:space-evenly;justify-content:start;align-items:stretch;justify-items:start;color:rgba(34,34,34,.8666666667);font-size:14px;grid-row-gap:6px}#side_right #sidebar_bh a:hover{color:#222;font-style:italic;text-decoration:none}#side_right #sidebar_bh a:before{content:"博客园 VIP 会员";font-size:18px;font-weight:700}#side_right #sidebar_bh a:after{content:" G O ! >>";color:#fff;font-weight:bolder;background:#4378ff;border-radius:14px;padding:6px 8px;margin:0 0 2px;font-style:italic;box-shadow:2px 1px 8px 0#4378ff}.sidebar .card .card-title{margin-bottom:12px;color:#444;font-size:15px;font-weight:700}.sidebar .item-list li{font-size:14px;margin:8px 0}.sidebar .item-list li:hover{font-size:15px;margin:10px -1px;color:#4378ff}#top_nav{border-bottom:1px solid rgba(0,0,0,.05);box-shadow:0 2px 4px 0 rgba(0,0,0,.05);font-family:-apple-system,BlinkMacSystemFont,PingFang SC,"Segoe UI",Hiragino Sans GB,Arial,Microsoft YaHei,Verdana,Roboto,Noto,Helvetica Neue,ui-sans-serif}#ing_iframe{width:100%;min-height:100%;scroll-behavior:hidden;border:0;overflow:hidden}'},cnblogs_auto_pager:{name:"AutoPager",match:[/www.cnblogs.com\/[^\/]*$/,/www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//],directlyRun:!0,switchable:!0,values:()=>{timeoutOnLoad(()=>{var timeout;function nextPage(){0<timeout||(timeout=3,getPage(document.querySelector(".pager > a:nth-last-child(1)").href,{onload:response=>{try{var doc=(new DOMParser).parseFromString(response.responseText,"text/html");for(const article of doc.querySelectorAll("#post_list>article"))document.querySelector("#post_list").insertAdjacentElement("beforeend",article);document.querySelector(".pager").parentNode.replaceChild(doc.querySelector(".pager"),document.querySelector(".pager"))}catch(e){console.error("ERR",e,response.responseText)}}}))}document.querySelector(".pager")&&!document.querySelector("#Autopage_number")&&(timeout=0,setInterval(()=>{0<timeout&&timeout--},1e3),unsafeWindow.nextPage=nextPage,setInterval(()=>{document.querySelector(".pager")&&document.body.offsetHeight-window.scrollY-window.innerHeight<2*window.innerHeight&&nextPage()},2e3))},400)}}
};
run(features_cnblogs_898251020);