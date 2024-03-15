// ==UserScript==
// @name		BILIBILI-Beautify
// @name:zh		哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @name:en		BILIBIL Beautify Ienhancement custom background
// @name:ja		BILIBILI 美化｜強化｜カスタム背景｜レビューフィルタリング
// @namespace		http://github.com/yuhanawa/UserScript
// @name:zh-CN		哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @name:zh-TW		哔哩哔哩BILIBILI 美化|增强|自定义背景|评论过滤等
// @description		Bilibili beautification | enhancement | custom background | comment filtering, etc
// @description:zh		哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @description:en		Bilibili beautification | enhancement | custom background | comment filtering, etc
// @description:ja		BILIBILI 美化｜強化｜カスタム背景｜レビューフィルタリングなど
// @description:zh-CN		哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @description:zh-TW		哔哩哔哩BILIBILI 美化|增强|自定义背景|宽屏|标题快速复制|评论过滤等
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		*://*.bilibili.com/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.1.28
// @author		Yuhanawa
// @supportURL		http://github.com/yuhanawa/UserScript
// @license		GPL-3.0
// @icon		none
// @run-at		document-start
// ==/UserScript==

/* 
    bilibili v.0.1.28 by Yuhanawa
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


loadConfig('bilibili', {".line_ts":{"widget":"line","title":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471069/feedback/"},".line_bc":{"widget":"line","title":"❗❗❗修改完记得点保存(在最下面)❗❗❗"},"#line_mh":{"widget":"line","title":"美化","description":"美化设置"},"beautify":{"title":"样式美化","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"beautify_work_on_index":{"title":"美化首页(前置功能:样式美化)","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]},"hidden":"{{ formData.beautify === 'off' }}"},"background_value":{"title":"自定义背景 填url(图片链接)(前置功能:样式美化)","default":"https://s1.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg.png","hidden":"{{ formData.beautify === 'off' }}","widget":"imageInput","format":"image"},"widescreen":{"title":"宽屏功能","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"widescreen-width-times":{"title":"宽屏倍数","type":"number","defaultValue":1.2,"default":1.2,"required":true,"hidden":"{{ formData.widescreen === 'off' }}","props":{"addonAfter":"倍"},"description":"推荐范围1.00~1.30倍"},"#line_mb":{"widget":"line","title":"护眼蒙版(前置功能:样式美化)","description":"会在屏幕上添加一个半透明的蒙版","hidden":"{{ formData.beautify === 'off' }}"},"eye_protection_cover":{"title":"护眼蒙版(前置功能:样式美化)","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]},"hidden":"{{ formData.beautify === 'off' }}"},"eye_protection_cover_dark":{"title":"暗色模式护眼蒙版(前置功能:护眼蒙版)","default":"#0000003B","hidden":"{{ formData.eye_protection_cover === 'off' }}","widget":"color"},"eye_protection_cover_light":{"title":"亮色模式护眼蒙版(前置功能:护眼蒙版)","default":"#66ccff3B","hidden":"{{ formData.eye_protection_cover === 'off' }}","widget":"color"},"#line_gn":{"widget":"line","title":"功能","description":"实用功能"},"quickly_copy":{"title":"标题快速复制","default":"all","widget":"select","props":{"options":[{"label":"[标题]链接","value":"all"},{"label":"BV","value":"BV"},{"label":"链接","value":"url"},{"label":"标题","value":"title"},{"label":"关闭","value":"off"}]}},"quickly_copy_hotkey":{"title":"Ctrl+Shirt+C快速复制标题(前置功能:标题快速复制)","default":"off","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"hotkey":{"title":"按ESC关闭评论区图片","default":"on","description":"","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"remove_keyword_search":{"title":"移除评论关键字搜索跳转","description":"就是那个旁边带个放大镜的蓝字","default":"icon","widget":"select","props":{"options":[{"label":"移除图标","value":"icon"},{"label":"移除图标和链接颜色(仍可点击)","value":"color"},{"label":"彻底移除","value":"link"},{"label":"关闭","value":"off"}]}}})

let features_bilibili_1403505367={
	bilibili_widescreen:{name:"视频页宽屏",match:["www.bilibili.com/video"],values:{"已开启$on":()=>{function setSize(){var isWide=unsafeWindow.isWide,innerHeight=(document.querySelector("#biliMainHeader .bili-header.fixed-header").style.display=isWide?"none":"block",unsafeWindow.innerHeight),innerWidth=Math.max(document.body&&document.body.clientWidth||unsafeWindow.innerWidth,1100),rightWidth=1680<innerWidth?411:350,innerHeight=parseInt(16*(innerHeight-(1690<innerWidth?318:308))/9),mainWidth=(mainWidth=innerWidth-112-rightWidth)<innerHeight?mainWidth:innerHeight;(mainWidth=Math.round(mainWidth*$get("bilibili_widescreen-width-times",1.2)))<668&&(mainWidth=668),innerHeight=(mainWidth=1694<mainWidth?1694:mainWidth)+rightWidth,isWide&&(innerHeight-=125,mainWidth-=100),mainWidth=unsafeWindow.hasBlackSide&&!isWide?Math.round(9/16*(mainWidth-14+(isWide?rightWidth:0))+(1680<innerWidth?56:46))+96:Math.round((mainWidth+(isWide?rightWidth:0))*(9/16))+(1680<innerWidth?56:46),innerWidth=innerHeight-rightWidth,innerWidth=constructStyleString(".video-container-v1",{width:"auto",padding:"0 10px"})+constructStyleString(".left-container",{width:innerWidth+"px"})+constructStyleString("#bilibili-player",{width:innerHeight-(isWide?-30:rightWidth)+"px",height:mainWidth+"px",position:isWide?"relative":"static"})+constructStyleString("#oldfanfollowEntry",{position:"relative",top:isWide?mainWidth+28-18+"px":"0"})+constructStyleString("#danmukuBox",{"margin-top":isWide?mainWidth+28+"px":"0"})+constructStyleString("#playerWrap",{height:mainWidth+"px"})+constructStyleString(".video-discover",{"margin-left":(innerHeight-rightWidth)/2+"px"}),setSizeStyle.innerHTML=innerWidth}function constructStyleString(i,e){for(var t=i+" {",n=Object.keys(e),o=0;o<n.length;o++)t+=n[o]+": "+e[n[o]]+";";return t+"}\n"}const set=()=>{unsafeWindow.setSizeStyle?((unsafeWindow.setSize=setSize)(),unsafeWindow.addEventListener("resize",function(){setSize()}),unsafeWindow.PlayerAgent={changed:!0,player_widewin:function(){"new_video"===unsafeWindow.__INITIAL_STATE__.pageVersion&&unsafeWindow.scrollTo(0,60),unsafeWindow.isWide=!0,setSize()},player_fullwin:function(i){unsafeWindow.scrollTo(0,0),unsafeWindow.isWide=!1,setSize()},toggleBlackSide:function(i){unsafeWindow.hasBlackSide=i,setSize()}}):setTimeout(()=>set(),120)
};set()},"已关闭$off":null}},
	bilibili_video_live_recommand:{name:"去除视频页直播推荐",match:["www.bilibili.com/video"],values:{"已开启$on":()=>".pop-live-small-mode{display:none;}","已关闭$off":null}},
	bilibili_video_beautify:{name:"视频页样式微调",match:["www.bilibili.com/video"],values:{"已开启$on":()=>"#app .video-container-v1 #viewbox_report h1{text-wrap:wrap}#app .video-container-v1 .left-container #playerWrap #bilibili-player .bpx-player-sending-area{margin-top:-1px}#app .video-container-v1 #live_recommand_report,#app .video-container-v1 .vcd{display:none!important}","已关闭$off":null}},
	bilibili_remove_keyword_search:{name:"移除评论关键字搜索跳转",match:["www.bilibili.com/video","www.bilibili.com/read"],values:{"移除图标$icon":()=>".icon.search-word:{display:none;}","移除图标和链接颜色$color":()=>".icon.search-word:{display:none;} .search-word a{color: #222!important;}","彻底移除$link":()=>(intervalOnLoad(()=>{var as=document.getElementsByClassName("search-word");for(let i=0;i<as.length;i++)as[i].parentElement.outerHTML=as[i].parentElement.outerHTML.replace(as[i].outerHTML,as[i].outerText)},8e3),".icon.search-word:{display:none;} .search-word a{color: #222!important;}"),"已关闭$off":null}},
	bilibili_remove_floor_single_card:{name:"移除首页右侧特殊卡片",match:["www.bilibili.com"],values:{"已关闭$off":null,"已开启$on":".floor-single-card{display:none;}"}},
	bilibili_remove_carousel:{name:"移除首页轮播图",match:["www.bilibili.com"],values:{"已关闭$off":null,"已开启$on":".recommended-swipe{display:none;}"}},
	bilibili_quickly_copy:{name:"视频快捷分享复制模式",match:["www.bilibili.com/video"],values:{"[标题]链接$all":feature=>{intervalOnLoad(()=>{feature.fn("[标题]链接",`【${document.querySelector("h1.video-title").innerText}】	`+location.origin+location.pathname)},1200)},BV$BV:feature=>{intervalOnLoad(()=>{feature.fn("BV",location.pathname.split("/")[2])},1200)},"链接$url":feature=>{intervalOnLoad(()=>{feature.fn("链接",""+location.origin+location.pathname)},1200)},"标题$title":feature=>{intervalOnLoad(()=>{feature.fn("标题",""+document.querySelector("h1.video-title").innerText)},1200)},"关闭$off":null},fn:(title,text)=>{var copy_btn;-1===document.querySelector("h1.video-title").innerHTML.indexOf("🏷️")&&((copy_btn=document.createElement("span")).title="复制当前视频的"+title,copy_btn.style.cursor="pointer",copy_btn.innerText="🏷️",copy_btn.addEventListener("click",()=>navigator.clipboard.writeText(text)),document.querySelector("h1.video-title").append(copy_btn),"on"===$get("quickly_copy_hotkey","off"))&&document.addEventListener("keydown",e=>{e.ctrlKey&&e.shiftKey&&"c"===e.key&&navigator.clipboard.writeText(text)})}},
	bilibili_hotkey:{name:"快捷键增强",match:["bilibili.com"],values:{"已开启$on":()=>{location.href.match("www.bilibili.com/video")&&intervalOnLoad(()=>{const img_view=document.querySelector(".reply-view-image");null!=img_view&&img_view.addEventListener("keydown",e=>{"Escape"==e.key&&img_view.getElementsByClassName("close-container")[0].click(),"a"!=e.key&&"ArrowLeft"!=e.key||img_view.getElementsByClassName("last-image")[0].click(),"d"!=e.key&&"ArrowRight"!=e.key||img_view.getElementsByClassName("next-image")[0].click()})},400)},"已关闭$off":null}},
	bilibili_filter:{name:"bilibili评论过滤[BETA]",match:["www.bilibili.com/video","www.bilibili.com/read"],values:{"测试中$beta":null,"已开启_测试_$on":f=>{const check=x=>{try{var ctx=x.getElementsByClassName("reply-content")[0];if(!x.classList.contains("🎇checked")&&""!==ctx.innerHTML&&(x.classList.add("🎇checked"),!(Number(ctx.outerText)>$get("bilibili_filter_length_limit",25)||""!==ctx.innerHTML&&""===ctx.innerText)))for(const r of f.rules)if(r.test(x.getElementsByClassName("reply-content")[0].outerText)){x.classList.add("🎇filtered"),console.log(`已屏蔽: ${x.getElementsByClassName("reply-content")[0].outerText} 
 规则: `+r.toString());break}}catch(e){x.classList.add("🎇checked")}
};return intervalOnLoad(()=>{for(const x of document.getElementsByClassName("reply-item"))check(x);for(const x of document.getElementsByClassName("sub-reply-item"))check(x)},2e3),".🎇filtered{display:none;}"},"已关闭$off":null},rules:[/^.?6{1,12}.?$/,/考古/,/^.{0,8}小号.{0,8}$/,/^(@.{1,12}\s?.{0,12}){1,24}$/,/压缩毛巾/,/你说得对/,/答辩/,/爷/,/谁问你了/,/亡灵军团/,/死灵法师/]},bilibili_beautify:{name:"样式美化 | 自定义背景 | 大幅度修改",match:["www.bilibili.com"],values:{"已开启$on":()=>{if("https://www.bilibili.com/"!==location.href||"off"!==$get("bilibili_beautify_work_on_index","on"))return"on"===$get("bilibili_eye_protection_cover","on")?style("html,:root{--bodybackground: "+(window.matchMedia("(prefers-color-scheme: dark)").matches?$get("bilibili_eye_protection_cover_dark","rgb(0 0 0 / 23%)"):$get("bilibili_eye_protection_cover_light","rgb(102 204 255 / 23%)"))+"}"):style("html,:root{--bodybackground:transparent}"),style(`html,:root{--background:url(${$get("bilibili_background_value")})}`),":root,html{background-attachment:fixed!important;background:var(--background);background-repeat:no-repeat repeat;background-size:100% 100%;bottom:0;--text3:var(--text2)}:root body,html body{background-color:transparent;background:var(--bodybackground);height:auto}:root body .app-v1,:root body .fixed-reply-box,:root body .visitor,html body .app-v1,html body .fixed-reply-box,html body .visitor{background-color:rgba(255,255,255,.68)!important}:root body .bili-live-card__wrap,:root body .bili-video-card__wrap,:root body .floor-card-inner,html body .bili-live-card__wrap,html body .bili-video-card__wrap,html body .floor-card-inner{background-color:rgba(255,255,255,.72)!important}:root body #i_cecream,html body #i_cecream{background-color:rgba(255,255,255,.24)!important}:root body .bili-header,:root body .bili-header__channel,html body .bili-header,html body .bili-header__channel{background-color:transparent}:root body #activity_vote .right ::after,:root body .act-end .right ::after,:root body .activity-m-v1 .right ::after,:root body .floor-single-card .layer,html body #activity_vote .right ::after,html body .act-end .right ::after,html body .activity-m-v1 .right ::after,html body .floor-single-card .layer{display:none}:root body .floor-card,html body .floor-card{background:0 0}:root body .bili-video-card__wrap,html body .bili-video-card__wrap{padding:2px 2px 4px;border-radius:8px}:root body .bili-live-card__wrap,html body .bili-live-card__wrap{border-radius:8px}:root body .bili-live-card__wrap .bili-live-card__info,:root body .bili-live-card__wrap .bili-video-card__info,:root body .bili-video-card__wrap .bili-live-card__info,:root body .bili-video-card__wrap .bili-video-card__info,html body .bili-live-card__wrap .bili-live-card__info,html body .bili-live-card__wrap .bili-video-card__info,html body .bili-video-card__wrap .bili-live-card__info,html body .bili-video-card__wrap .bili-video-card__info{padding:0 4px 4px}:root body .bili-live-card__wrap,html body .bili-live-card__wrap{padding:2px 2px 24px}:root body .fixed-reply-box,:root body .left-container-under-player,:root body .right-container,:root body .visitor,html body .fixed-reply-box,html body .left-container-under-player,html body .right-container,html body .visitor{opacity:.97}:root body #activity_vote,:root body .act-end,:root body .activity-m-v1,html body #activity_vote,html body .act-end,html body .activity-m-v1{border-radius:12px;background:rgba(255,255,255,.72);opacity:.97}:root body #activity_vote .right .b-img,:root body .act-end .right .b-img,:root body .activity-m-v1 .right .b-img,html body #activity_vote .right .b-img,html body .act-end .right .b-img,html body .activity-m-v1 .right .b-img{mask:linear-gradient(90deg,transparent,#fff)}:root body .bili-comment,:root body .browser-pc,html body .bili-comment,html body .browser-pc{background-color:rgba(255,255,255,.68)!important;border-radius:10px;padding:0;margin:0}:root body #comment,html body #comment{box-shadow:0 0 4px #f5f5f5;margin-top:2px;padding:0;border-radius:10px}:root body #comment .reply-list,html body #comment .reply-list{padding:0 18px 0 2px}:root body .left-container-under-player,html body .left-container-under-player{background-color:transparent!important}:root body #arc_toolbar_report,html body #arc_toolbar_report{margin-top:-5px;padding-top:20px;padding-left:12px;padding-right:12px;border:0;opacity:.8;background-color:rgba(255,255,255,.65)!important;border-radius:0 0 6px 6px}:root body .video-desc-container,html body .video-desc-container{padding:10px 8px 14px;margin:0;opacity:.68}:root body .video-tag-container,html body .video-tag-container{margin:0;padding:8px 2px 2px;border-style:dashed;border-width:1px 0;border-color:#e3e5e7;border-color:var(--text4)}:root body .tag-link .newchannel-link,:root body .video-tag-container .tag-panel a,html body .tag-link .newchannel-link,html body .video-tag-container .tag-panel a{background:#fff}:root body .bili-header__bar .mini-header,html body .bili-header__bar .mini-header{opacity:.96}:root body .bpx-player-video-area,:root body video,html body .bpx-player-video-area,html body video{border-radius:4px 4px 0 0}:root body .reply-header,html body .reply-header{margin:0 0-4px 14px;padding:12px 0 0 2px}:root body .reply-box,html body .reply-box{padding-right:16px!important}:root body .danmaku-wrap>.bpx-docker,html body .danmaku-wrap>.bpx-docker{background:0 0}:root body #bilibili-player-placeholder,html body #bilibili-player-placeholder{box-shadow:0-2px 4px 1px rgba(255,255,255,.1);border-radius:4px 4px 12px 12px}:root body #bilibili-player-placeholder #bilibili-player-placeholder-top,html body #bilibili-player-placeholder #bilibili-player-placeholder-top{border-radius:4px 4px 0 0;background:0 0!important}:root body #bilibili-player-placeholder #bilibili-player-placeholder-bottom,html body #bilibili-player-placeholder #bilibili-player-placeholder-bottom{border-radius:0 0 12px 12px}"},"已关闭$off":null}},
	bilibili_ad:{name:"首页广告屏蔽(会导致排版错乱影响美观)(不建议开启)",match:["www.bilibili.com"],values:{"已关闭$off":null,"已开启$on":".bili-video-card:has(svg.bili-video-card__info--ad),.feed-card:has(svg.bili-video-card__info--ad){display:none}"}}
};
run(features_bilibili_1403505367);