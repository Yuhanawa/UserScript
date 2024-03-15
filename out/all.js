 

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


/* 
    bilibili v.0.1.28 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
    
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
} catch (e) {
    console.error(`bilibili: ${e.message}`);
    console.error(e);
}


/* 
    cnblogs v.0.1.12 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
    
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
} catch (e) {
    console.error(`cnblogs: ${e.message}`);
    console.error(e);
}


/* 
    csdn v.0.1.43 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
    
loadConfig('csdn', {".line_ts":{"widget":"line","title":"如果发现某条设置存在问题请反馈: https://greasyfork.org/zh-CN/scripts/471071/feedback/"},".line_bc":{"widget":"line","title":"❗❗❗修改完记得点保存(在最下面)❗❗❗"},"copy":{"title":"免登录复制","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"beautify":{"title":"细节优化","default":true,"widget":"switch","type":"boolean"},"width":{"title":"调整文章宽度","description":"该功能仅当左侧边栏隐藏时生效","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"width_value":{"title":"文章宽度","description":"(单位:%|百分比) 该功能仅当左侧边栏隐藏时生效","default":"82","props":{"addonAfter":"%"},"hidden":"{{ formData.width === 'off' }}"},"header":{"title":"顶部菜单栏","default":"remove","widget":"select","props":{"options":[{"label":"移除","value":"remove"},{"label":"半透明","value":"opacity"},{"label":"淡化不跟随","value":"opacity_static"},{"label":"不跟随","value":"static"},{"label":"显示","value":"off"}]}},"toolbox":{"title":"低部菜单工具栏","default":"remove","widget":"select","props":{"options":[{"label":"移除","value":"remove"},{"label":"不跟随","value":"relative"},{"label":"半透明","value":"opacity"},{"label":"淡化不跟随","value":"opacity_relative"},{"label":"显示","value":"off"}]}},"#line_fz":{"widget":"line","title":"调整字体大小"},"fontsize":{"title":"调整字体大小","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"font_size_title":{"title":"标题","default":"32px","hidden":"{{ formData.fontsize === 'off' }}"},"font-size-p":{"title":"正文","default":"18px","hidden":"{{ formData.fontsize === 'off' }}"},"font-size-h2":{"title":"子标题","default":"24px","hidden":"{{ formData.fontsize === 'off' }}"},"font_size_code":{"title":"代码块","default":"15px","hidden":"{{ formData.fontsize === 'off' }}"},"#line_bg":{"widget":"line","title":"自定义背景"},"background":{"title":"自定义背景(开关)","default":"off","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"background-value":{"title":"页面背景","description":"body的背景","default":"https://csdnimg.cn/release/blogv2/dist/pc/themesSkin/skin-code/images/bg.png?v20200831","hidden":"{{ formData.background === 'off' }}","widget":"imageInput","format":"image"},"blog-content-box-background-value":{"title":"文章背景","description":"用于放置文章的div颜色","default":"#f5f6f7E6","hidden":"{{ formData.background === 'off' }}","widget":"color"},"blog-content-box-opacity-value":{"title":"文章透明度","description":"文章整体透明度,包括文章内容","hidden":"{{ formData.background === 'off' }}","default":"0.98"},"header-box-background-value":{"title":"文章标题及部分卡片背景","description":"建议保持透明或使用高透明度颜色","hidden":"{{ formData.background === 'off' }}","default":"#00000000","widget":"color"},"#line_ui":{"widget":"line","title":"自定义UI","description":"自定义UI需将‘UI净化预设’设置为自定义模式"},"ui_opt":{"title":"UI净化预设","default":"lite","widget":"select","props":{"options":[{"label":"极简","value":"lite"},{"label":"简|作者+目录","value":"lite1"},{"label":"简|作者+目录+菜单","value":"lite2"},{"label":"简|以上信息+推荐","value":"lite3"},{"label":"常规","value":"normal"},{"label":"自定义","value":"custom"},{"label":"关闭","value":"off"}]}},"ui_opt_value":{"title":"自定义UI","description":"需要UI净化预设为自定义模式","default":["#asideArchive","#csdn-toolbar .toolbar-menus","#csdn-toolbar .toolbar-btn-vip","#footerRightAds","#asideProfile .item-rank","#asideProfile .aside-box-footer","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","main .article-bar-top","main .article-title-box .article-type-img","#recommendNps","#commentBox","#pcCommentBox","#treeSkill","#blogVoteBox",".insert-baidu-box.recommend-box-style",".blog-footer-bottom",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-container-left","#asideCategory",".first-recommend-box",".second-recommend-box",".recommend-box","#toolBarBox",".passport-login-container"],"widget":"CSDN_UI_editor","disabled":"{{ formData.ui_opt !== 'custom' }}"}})

let features_csdn_490476530={
	csdn_ui_opt:{name:"净化",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"极简$lite":self=>{self.hide(["#treeSkill","#blogVoteBox",".recommend-box",".first-recommend-box",".second-recommend-box",".insert-baidu-box.recommend-box-style","#recommendNps","#commentBox","#pcCommentBox","#toolBarBox",".blog-footer-bottom","#rightAside","#groupfile","#rightAside .kind_person",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#csdn-toolbar","#mainBox .blog_container_aside","#csdn-toolbar .toolbar-container-left","#csdn-toolbar .toolbar-container-right","#csdn-toolbar .toolbar-container-middle","#asideProfile","#footerRightAds","#asideWriteGuide","#asideSearchArticle","#asideHotArticle","#asideCategory","#asideNewComments","#asideNewNps","#asideArchive","#asidedirectory",".passport-container-mini-tip",".passport-login-container"])},"简|作者+目录$lite1":self=>{self.hide([".passport-container-mini-tip","#asideArchive","#csdn-toolbar .toolbar-menus","#csdn-toolbar .toolbar-btn-vip","#csdn-toolbar .toolbar-btn-msg","#csdn-toolbar .toolbar-btn-mp","#csdn-toolbar .toolbar-btn-writet","#footerRightAds","#asideProfile .item-rank","#asideProfile .aside-box-footer","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","main .article-bar-top","main .article-title-box .article-type-img","#recommendNps","#commentBox","#pcCommentBox","#treeSkill","#blogVoteBox",".recommend-box",".first-recommend-box",".second-recommend-box",".insert-baidu-box.recommend-box-style",".blog-footer-bottom","#toolBarBox",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-container-left","#asideProfile .data-info","#asideCategory",".passport-login-container"])},"简|作者+目录+菜单$lite2":self=>{self.hide([".passport-container-mini-tip","#asideArchive","#csdn-toolbar .toolbar-menus","#csdn-toolbar .toolbar-btn-vip","#footerRightAds","#asideProfile .item-rank","#asideProfile .aside-box-footer","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","main .article-bar-top","main .article-title-box .article-type-img","#recommendNps","#commentBox","#pcCommentBox","#treeSkill","#blogVoteBox",".insert-baidu-box.recommend-box-style",".blog-footer-bottom",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-container-left","#asideCategory",".first-recommend-box",".second-recommend-box",".recommend-box","#toolBarBox",".passport-login-container"])},"简|以上信息+推荐$lite3":self=>{self.hide([".passport-container-mini-tip","#asideArchive","#csdn-toolbar .toolbar-btn-vip","#footerRightAds","#asideProfile .item-rank","#asideProfile .aside-box-footer","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","main .article-bar-top","main .article-title-box .article-type-img","#recommendNps","#treeSkill","#blogVoteBox",".insert-baidu-box.recommend-box-style",".blog-footer-bottom",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox","#asideCategory","#toolBarBox","#csdn-toolbar .toolbar-menus","#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-container-left"])},"常规$normal":self=>{self.hide(["#csdn-toolbar .toolbar-logo","#csdn-toolbar .toolbar-btn-mp","#csdn-toolbar .toolbar-btn-write","#csdn-toolbar .toolbar-btn-msg","#csdn-toolbar .toolbar-btn-vip","#asideProfile .profile-intro-name-boxOpration","#asideProfile .aside-box-footer","#asideProfile .item-rank","#footerRightAds","#asideWriteGuide","#asideHotArticle","#asideNewComments","#asideNewNps","#asideArchive","#asideSearchArticle","main .article-title-box .article-type-img","#treeSkill","#blogVoteBox",".insert-baidu-box.recommend-box-style","#recommendNps","#commentBox",".blog-footer-bottom","#rightAside .kind_person",".sidetool-writeguide-box",".option-box[data-type=guide]",".option-box[data-type=cs]",".option-box[data-type=report]",".btn-side-chatdoc-contentbox",".passport-container-mini-tip",".passport-login-container"])},"自定义$custom":()=>{style($get("csdn_ui_opt_value")+" { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }")},"已关闭$off":()=>{}},
	hide:value=>{style(value.join(", ")+" { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }")}},
	csdn_toolbox:{name:"低部菜单工具栏",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"移除$remove":`.left-toolbox{
          display: none!important;
        }`,"不跟随$relative":`.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`,"半透明$opacity":`.left-toolbox{
          opacity: 0.55!important;
          transition: opacity 0.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,"淡化不跟随$opacity_relative":`.left-toolbox{
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
        }`,"显示$off":null}},
	csdn_setting_btn:{name:"设置按钮",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"已开启$on":()=>{timeoutOnLoad(()=>{var articleTitleBox=document.getElementsByClassName("article-title-box")[0],settingButton=document.createElement("a");settingButton.innerText="脚本设置",settingButton.href="https://yuhanawa.github.io/tools/userscriptconfig/",settingButton.target="_blank",settingButton.style="float: right;margin: 12px;font-size: 20px;text-decoration: underline !important;color: #4ea1db;",articleTitleBox.insertAdjacentElement("afterbegin",settingButton)},200)},"已关闭$off":null}},
	csdn_redirect:{name:"外链重定向自动跳转",match:["link.csdn.net/"],values:{"已开启$on":()=>{var url=new URLSearchParams(location.search).get("target");location.href=url,location.replace(url)},"已关闭$off":null}},
	csdn_header:{name:"顶部菜单",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"移除$remove":"#csdn-toolbar{ display: none!important; }","半透明$opacity":`#csdn-toolbar{
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
    } `,"淡化不跟随$opacity_static":"#csdn-toolbar{position: static !important; opacity: 0.5; transition: opacity 1.5s!important;} #csdn-toolbar:hover{opacity: 1;}","不跟随$static":"#csdn-toolbar{position: static !important;}","显示$off":null}},
	csdn_fontsize:{name:"调整字体大小",match:["csdn.net"],values:{"已开启$on":()=>(style(`body{--font-size-title: ${$get("csdn_font_size_title","32px")
};--font-size-p: ${$get("csdn_font_size_p","18px")
};--font-size-h2: ${$get("csdn_font_size_h2","24px")
};--font-size-code: ${$get("csdn_font_size_code","15px")
};}`),"html{--font-size-title:36px;--font-size-p:18px;--font-size-h2:24px;--font-size-code:15px}html body main div.blog-content-box .article-header-box .article-header div.article-title-box .title-article{font-size:var(--font-size-title)!important}html body main #content_views p{font-size:var(--font-size-p)!important}html body main #content_views h2{font-size:var(--font-size-h2)!important}html body main #content_views pre code{font-size:var(--font-size-code)!important}"),"已关闭$off":null}},
	csdn_copy:{name:"免登录复制",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"已开启$on":()=>(timeoutOnLoad(()=>{document.querySelectorAll(".hljs-button").forEach(e=>{e.setAttribute("data-title","点击复制"),e.classList.remove("signin"),e.removeAttribute("onclick"),e.addEventListener("click",()=>{e.setAttribute("data-title"," "),navigator.clipboard.writeText(e.parentNode.innerText),e.setAttribute("data-title","复制成功"),setTimeout(()=>e.setAttribute("data-title","点击复制"),1200)})},250),document.querySelector(".blog-content-box").addEventListener("copy",e=>{e.stopPropagation(),e.preventDefault(),navigator.clipboard.writeText(window.getSelection().toString())},!0),document.addEventListener("keydown",e=>{e.ctrlKey&&67==e.keyCode&&(e.stopPropagation(),e.preventDefault(),navigator.clipboard.writeText(window.getSelection().toString()))},!0),document.oncopy=null,window.oncopy=null},500),"#content_views pre code{-webkit-touch-callout:text!important;-webkit-user-select:text!important;-khtml-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;user-select:text!important}pre .hljs-button{background-color:#666;padding:2px;margin:10px;box-shadow:0 2px 4px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.05);width:fit-content!important;height:fit-content!important}"),"已关闭$off":null}},
	csdn_content_fullscreen:{name:"Ctrl + Enter开启专注模式",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"已关闭$off":null,"已开启$on":()=>{document.addEventListener("keydown",e=>{e.ctrlKey&&13==e.keyCode&&(document.fullscreenElement?document.exitFullscreen():document.querySelector(".blog-content-box").requestFullscreen())})}}},
	csdn_base:{name:"$",match:["csdn.net"],values:()=>($get("csdn_beautify",!0)&&timeoutOnLoad(()=>{var taghtml=document.getElementsByClassName("blog-tags-box")[0].outerHTML+"";document.getElementsByClassName("blog-tags-box")[0].remove(),document.getElementsByClassName("article-bar-top")[0].innerHTML=document.getElementsByClassName("article-bar-top")[0].innerHTML+taghtml,document.getElementsByClassName("time")[0].innerHTML=document.getElementsByClassName("time")[0].innerHTML.replace("于&nbsp;","").replace("&nbsp;发布",""),document.getElementsByClassName("left-toolbox")[0].style.left="auto",document.getElementsByClassName("blog-tags-box")[0].innerHTML=document.getElementsByClassName("blog-tags-box")[0].innerHTML.replaceAll("：","")},100),fn=()=>{var aside=document.getElementsByClassName("blog_container_aside")[0];null==aside?setTimeout(fn,150):"none"===getComputedStyle(aside).display&&(style("#mainBox { width: auto !important; }"),style("main { margin: 0px 6px 40px 6px }"),"on"===$get("csdn_width","on"))&&(style("#mainBox > main{ width: 100% !important; }"),style(`body #mainBox{ width: ${$get("csdn_width_value","82")}% !important; }`))},onload(fn),'@charset "UTF-8";:root>*,:root>*>*,:root>*>*>*,:root>*>*>*>*{transition:all .3s!important}.tag-link{margin:5px 0 0!important;overflow:hidden}main div.blog-content-box article{padding-top:10px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top span{margin-right:4px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .follow-nickName{margin-right:2px}main div.blog-content-box .article-header-box .article-header div.article-info-box div.article-bar-top .bar-conten{padding-left:0;margin-left:10px}code,main div.blog-content-box pre.set-code-hide,pre{height:auto!important}.hide-preCode-box{display:none}.set-code-hide,main div.blog-content-box pre{max-height:max-content!important;height:auto!important}.article-info-box{opacity:.92}.blog-content-box{overflow-y:auto}')},csdn_background:{name:"自定义背景",match:[/blog\.csdn\.net(\/.*)?\/article\/details./],values:{"已关闭$off":null,"已开启$on":()=>($get("csdn_background-value")&&style(`body{background:url("${$get("csdn_background-value")}")}`),style(`body{--blog-content-box-background:${$get("csdn_blog-content-box-background-value")}}`),style(`body{--blog-content-box-opacity:${$get("csdn_blog-content-box-opacity-value","0.98")}}`),style(`body{--blog-header-box-background:${$get("csdn_blog-header-box-background-value")}}`),":root body .blog-content-box{background:var(--blog-content-box-background)!important;opacity:var(--blog-content-box-opacity)!important}:root body #blogColumnPayAdvert,:root body #blogHuaweiyunAdvert,:root body .article-header-box{background-color:var(--blog-header-box-background)!important}")}},
	csdn_ad:{name:"去广告",match:["csdn.net"],values:{"已开启$on":()=>"#ad_iframe,#ad_unit,#mainBox>aside>div.box-shadow.mb8,.GoogleActiveViewElement,.GoogleActiveViewInnerContainer,.adsbygoogle{display:none!important;visibility:hidden!important;width:0!important;height:0!important}","已关闭$off":null}}
};
run(features_csdn_490476530);
} catch (e) {
    console.error(`csdn: ${e.message}`);
    console.error(e);
}


/* 
    example v.0.1.2 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
    
loadConfig('example', {"num":{"title":"复杂数字输入框","type":"number","defaultValue":250,"props":{"placeholder":"520","addonBefore":"前置","addonAfter":"后置"},"description":"描述","tooltip":{"title":"tooltip提示"},"extra":"补充","required":true,"message":{"required":"必须填哦~"},"widget":"inputNumber"},"color":{"title":"颜色选择","type":"string","widget":"color"}})

let features_example_1185076645={
	example_example:{name:"example示例",match:["example.com"],values:{"已关闭$off":null,"已开启$on":()=>"body{background:#eee}"}}
};
run(features_example_1185076645);
} catch (e) {
    console.error(`example: ${e.message}`);
    console.error(e);
}


/* 
    search v.0.5.7 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
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
} catch (e) {
    console.error(`search: ${e.message}`);
    console.error(e);
}


/* 
    twitter v.0.1.10 by Yuhanawa
    Source: https://github.com/Yuhanawa/UserScript
*/
try {
    String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    setTimeout(() => {
        toast.classList.add('toast-active');
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 3500)
        }, 3500)
    }, 500)

    document.body.appendChild(toast);
}


function getCookie(cname) {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; ++i) {
        const c = ca[i].trim()
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

function blockUserByScreenName(screen_name) {
    const xhr = new XMLHttpRequest();

    // Open request
    xhr.open('POST', 'https://api.twitter.com/1.1/blocks/create.json');
    xhr.withCredentials = true

    // Set request headers
    xhr.setRequestHeader('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
    xhr.setRequestHeader('X-Twitter-Auth-Type', 'OAuth2Session');
    xhr.setRequestHeader('X-Twitter-Active-User', 'yes');
    xhr.setRequestHeader('X-Csrf-Token', getCookie('ct0'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send request
    xhr.send(`screen_name=${screen_name}`);
    console.log(`已为您自动屏蔽用户 ${screen_name}`);
    showToast(`已为您自动屏蔽用户 ${screen_name}`);
}
async function blockUserById(id, display) {
    const xhr = new XMLHttpRequest();

    // Open request
    xhr.open('POST', 'https://api.twitter.com/1.1/blocks/create.json');
    xhr.withCredentials = true

    // Set request headers
    xhr.setRequestHeader('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
    xhr.setRequestHeader('X-Twitter-Auth-Type', 'OAuth2Session');
    xhr.setRequestHeader('X-Twitter-Active-User', 'yes');
    xhr.setRequestHeader('X-Csrf-Token', getCookie('ct0'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send request
    xhr.send(`user_id=${id}`);
    console.log(`已为您自动屏蔽用户id ${id}, 用户名:${display ?? "未知"}`);
    showToast(`已为您自动屏蔽用户id ${id} ${display ? `用户名:${display}` : '(通过id精准匹配)'}`);
}

function check(rule, screen_name, key, target, notShowNote) {
    if (!target) return false;

    if (rule[key]?.some(i => target?.includes(i))) {
        blackList.set(screen_name, {
            // id: id,
            screen_name: screen_name,
            rule: rule['rule-name'],
            type: key,
            notShowNote: notShowNote
        })
    } else if (rule[key + "-reg"]?.some(i => i.test(target ?? ''))) {
        blackList.set(screen_name, {
            // id: id,
            screen_name: screen_name,
            rule: rule['rule-name'],
            type: key + "-reg",
            notShowNote: notShowNote
        })
    } else return false

    return true

}

unsafeWindow.addEventListener('load', function () {
    if (!location.host.includes('x.com') && !location.host.includes('twitter.com')) return

    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {

        if (url.startsWith('https://twitter.com/i/api/2/notifications/all.json') && false) {
            this.addEventListener('load', function () {
                // console.log('拦截到请求:', method, url);
                // console.log('响应内容:', this.responseText);

                if (this.responseText?.globalObjects?.users) {
                    const users = this.responseText.globalObjects.users
                    for (var user of users) {
                        var id = user.id_str
                        var name = user.name
                        var screen_name = user.screen_name
                        var location = user.location
                        var description = user.description
                        var created_at = user.created_at
                        var followers_count = user.followers_count
                        var friends_count = user.friends_count
                        var following = user.following
                        var url = user.url

                        if (whiteList.has(screen_name) || blackList.has(screen_name)) return;

                        if (following) {
                            whiteList.add(screen_name)
                            continue
                        }

                        var auto_block = $get('twitter_auto_block', 'on') === 'on';
                        var auto_block_by_more = auto_block && $get('twitter_auto_block_by_more', 'off') === 'on';
                        if (check(internalRule, screen_name, 'name', name, auto_block) || check(internalRule, screen_name, 'bio', description, auto_block)
                            || check(internalRule, screen_name, 'location', location, auto_block) || check(internalRule, screen_name, 'url', url, auto_block)) {
                            if (auto_block) {
                                blockUserById(id, screen_name)
                                showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`)
                            }
                            continue;
                        }

                        for (const rule of rules) {
                            if (rule["id_num"]?.some(i => id === i)) {
                                blackList.set(screen_name, {
                                    id: id,
                                    screen_name: screen_name,
                                    rule: rule['rule-name'],
                                    type: 'id-num',
                                })
                            } else if (rule["id"]?.some(i => screen_name === i)) {
                                blackList.set(screen_name, {
                                    id: id,
                                    screen_name: screen_name,
                                    rule: rule['rule-name'],
                                    type: 'id',
                                })
                            } else if (rule["id-reg"]?.some(i => i.test(screen_name ?? ''))) {
                                blackList.set(screen_name, {
                                    id: id,
                                    screen_name: screen_name,
                                    rule: rule['rule-name'],
                                    type: 'id-reg',
                                })
                            } else if (check(rule, screen_name, 'name', name, auto_block_by_more) || check(rule, screen_name, 'bio', description, auto_block_by_more) || check(rule, screen_name, 'location', location, auto_block_by_more) || check(rule, screen_name, 'url', url, auto_block_by_more)) {
                                if (auto_block_by_more) blockUserById(id, screen_name)
                            } else continue
                            break
                        }
                    }
                }
            })
        } else if (url.startsWith('https://twitter.com/i/api/graphql')) {
            // console.log("拦截到请求:", method, url);

            this.addEventListener('load', function () {
                // console.log("响应内容:", this.responseText);

                // 处理 result
                const handledResult = (result) => {
                    // console.log(result);


                    let legacy = result.legacy

                    let id = result.rest_id
                    let name = legacy.name
                    let created_at = legacy.created_at
                    let description = legacy.description
                    let followers_count = legacy.followers_count
                    let location = legacy.location
                    let screen_name = legacy.screen_name
                    let following = legacy.following ?? false
                    let blocking = legacy.blocking ?? false
                    var url = legacy.entities?.url?.urls[0]?.display_url ?? ''

                    if (following) {
                        whiteList.add(screen_name)
                        return
                    }
                    if (blocking) {
                        blackList.set(screen_name, {
                            id: id,
                            screen_name: screen_name,
                            rule: 'blocking',
                            type: 'blocking',
                            notShowNote: true
                        })
                        return
                    }

                    var auto_block = $get('twitter_auto_block', 'on') === 'on';
                    var auto_block_by_more = auto_block && $get('twitter_auto_block_by_more', 'off') === 'on';
                    if (check(internalRule, screen_name, 'name', name, auto_block) || check(internalRule, screen_name, 'bio', description, auto_block) || check(internalRule, screen_name, 'location', location, auto_block) || check(internalRule, screen_name, 'url', url, auto_block)) {
                        if (auto_block) {
                            blockUserById(id, screen_name)
                            showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`)
                        }
                        return;
                    }

                    for (const rule of rules) {
                        if (rule["id_num"]?.some(i => id === i)) {
                            blackList.set(screen_name, {
                                id: id,
                                screen_name: screen_name,
                                rule: rule['rule-name'],
                                type: 'id-num',
                            })
                            if (auto_block) blockUserById(id, screen_name)
                        } else if (rule["id"]?.some(i => screen_name === i)) {
                            blackList.set(screen_name, {
                                id: id,
                                screen_name: screen_name,
                                rule: rule['rule-name'],
                                type: 'id',
                            })
                            if (auto_block) blockUserById(id, screen_name)
                        } else if (rule["id-reg"]?.some(i => i.test(screen_name ?? ''))) {
                            blackList.set(screen_name, {
                                id: id,
                                screen_name: screen_name,
                                rule: rule['rule-name'],
                                type: 'id-reg',
                            })
                        } else if (check(rule, screen_name, 'name', name, auto_block_by_more) || check(rule, screen_name, 'bio', description, auto_block_by_more) || check(rule, screen_name, 'location', location, auto_block_by_more) || check(rule, screen_name, 'url', url, auto_block_by_more)) {
                            if (auto_block_by_more) blockUserById(id, screen_name)
                        } else continue
                    }
                }


                if (this.responseText.startsWith('{"data":{"user":{"result"')) {
                    // 用户页 
                    handledResult(JSON.parse(this.responseText).data.user.result)
                } else if (this.responseText.includes('threaded_conversation_with_injections_v2')) {
                    // 推文页
                    let instructions = JSON.parse(this.responseText).data.threaded_conversation_with_injections_v2.instructions;

                    for (entry of instructions.filter(i => i.entries).map(i => i.entries)) {
                        for (content of entry.filter(i => i.content).map(i => i.content)) {
                            let items = [];
                            if (content.itemContent != undefined) {
                                items = [content?.itemContent?.tweet_results?.result?.tweet?.core ?? content?.itemContent?.tweet_results?.result?.core]
                            } else if (content.items != undefined) {
                                items = content.items.filter(i => i.item?.itemContent?.tweet_results?.result?.core).map(i => i.item.itemContent.tweet_results.result.core)
                            }

                            for (const core of items) {
                                if (core == null || core == undefined) {
                                    continue
                                }

                                handledResult(core.user_results.result)
                            }
                        }
                    }
                } else {
                    // console.log(`content:${this.responseText}`);
                }
            })
        }

        originalOpen.apply(this, arguments);
        // console.log(blackList);
    };
});

const urlListenCallbacks = []
function UrlListener(callback) {
    urlListenCallbacks.push(callback)
}
let old_url = "";
setInterval(() => {
    if (old_url != window.location.href) {
        urlListenCallbacks.forEach(callback => callback(
            {
                old_url: old_url,
                new_url: window.location.href
            }
        ))
        old_url = window.location.href
    }
}, 500)

let internalRuleStr = ""
if ($get("twitter_internal_blocker", true)) {
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
`
}
const internalRule = parseRule(internalRuleStr)

const rules = new Set();
const whiteList = new Set();
const blackList = new Map();

function parseRule(str) {
    if (!str || str.trim() === '') return;
    let key;
    const rule = {};
    for (line of str.split('\n')) {
        line = line.trim();
        if (!line || line.startsWith('//')) continue;

        if (line.startsWith('#')) {
            key = line.slice(1);
            if (line.startsWith('#rule-')) {
                rule[key] = '';
            } else {
                rule[key] = [];
                rule[key + "-reg"] = [];
            }
        } else {
            if (key.startsWith('rule-'))
                rule[key] += line
            else if (line.startsWith('/') && line.endsWith('/'))
                rule[key + "-reg"].push(new RegExp(line.slice(1, line.length - 1)))
            else
                rule[key].push(line);
        }
    };
    return rule;
}


function loadRule(str) {
    rules.add(parseRule(str));
}


loadConfig('twitter', {".line_bc":{"widget":"line","title":"❗❗❗修改完记得点保存(在最下面)❗❗❗"},"icon":{"title":"自定义图标开关","default":"off","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"icon_value":{"title":"自定义图标","default":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 335 276' fill='%233ba9ee'%3E%3Cpath d='m302 70a195 195 0 0 1 -299 175 142 142 0 0 0 97 -30 70 70 0 0 1 -58 -47 70 70 0 0 0 31 -2 70 70 0 0 1 -57 -66 70 70 0 0 0 28 5 70 70 0 0 1 -18 -90 195 195 0 0 0 141 72 67 67 0 0 1 116 -62 117 117 0 0 0 43 -17 65 65 0 0 1 -31 38 117 117 0 0 0 39 -11 65 65 0 0 1 -32 35'/%3E%3C/svg%3E","extra":"默认是小蓝鸟","hidden":"{{ formData.icon === 'off' }}"},"internal_blocker":{"title":"是否启用内置屏蔽规则(推荐)","default":true,"widget":"switch","type":"boolean"},"show_note":{"title":"是否显示屏蔽提示","default":true,"widget":"switch","type":"boolean"},"block_on_home":{"title":"是否在home页启用脚本","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"auto_block":{"title":"自动屏蔽被精准匹配的用户","default":"on","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]}},"auto_block_by_more":{"title":"自动屏蔽被用户名及BIO匹配的用户(少量误判但效果好)","default":"off","widget":"select","props":{"options":[{"label":"开启","value":"on"},{"label":"关闭","value":"off"}]},"hidden":"{{ formData.auto_block === 'off' }}"},"feed_rule":{"title":"规则订阅","default":"https://yuhan-script-config.netlify.app/sex.tr\nhttps://yuhan-script-config.netlify.app/htv2.txt\n","props":{"autoSize":true},"extra":"一行一条","widget":"textArea"},".feed_rule_recommend":{"title":"订阅推荐","default":"黄推屏蔽v2:https://yuhan-script-config.netlify.app/htv2.txt | 黄推屏蔽https://yuhan-script-config.netlify.app/sex.tr \n视频下载机器人屏蔽https://yuhan-script-config.netlify.app/shipinbot.tr\n反贼屏蔽https://yuhan-script-config.netlify.app/fz.tr\n粉红屏蔽https://yuhan-script-config.netlify.app/fh.tr","disabled":true,"props":{"autoSize":true},"extra":"把链接复制到规则订阅中即可","widget":"textArea"},"user_rule":{"title":"自定义规则","default":"// /支持正则/ \n\n#name\n// 用户名关键词\n\n#bio\n// 用户介绍关键词\n\n#text\n// 推文关键词 作用于正文","props":{"autoSize":true},"widget":"twitter_user_rule_editor"}})

let features_twitter_859990949={
	twitter_setting:{name:"设置按钮",match:[/./],values:{"已开启$on":f=>{timeoutOnLoad(()=>{UrlListener(i=>{f.add(f)})},200)},"已关闭$off":null},add:f=>{var a,footer=document.querySelector("nav.css-1dbjc4n.r-18u37iz.r-1w6e6rj.r-ymttw5");footer&&!footer.hasFilterSetting?((a=document.createElement("a")).href="https://yuhan-script-config.netlify.app/?menuKey=twitter",a.innerText="⚙️ Filter Setting",a.target="_blank",a.style="margin: 4px;font-size: 16px;color: #4ea1db;opacity: 0.75;",footer.append(a),footer.hasFilterSetting=!0):setTimeout(()=>{f.add(f)},100)}},
	twitter_refresh_hash:{name:"手动更新规则",match:[/./],values:{"点我更新$ready":()=>{},"以开始更新$running":()=>{$set("twitter_feed_rule_hash",0),$set("twitter_refresh_hash","ready")}}},
	twitter_icon:{name:"自定义推特图标",match:["twitter.com","x.com"],values:{"已关闭$off":null,"已开启$on":()=>(style(`body{--twitter-icon-value: url("${$get("twitter_icon_value")}")`),'@charset "UTF-8";header h1 a[href="/home"]{margin:6px 4px 2px}header h1 a[href="/home"] div{background-image:var(--twitter-icon-value);background-size:contain;background-position:center;background-repeat:no-repeat;margin:4px}header h1 a[href="/home"] div svg{display:none}header h1 a[href="/home"] :hover :after{content:"图标已被修改为自定义图标";font:message-box;position:absolute;left:48px}')}},
	twitter_filter:{name:"屏蔽器总开关",match:[/./],values:{"已开启$on":f=>{const filter=()=>{if("on"!==!$get("twitter_block_on_home","on")||!location.href.includes("twitter.com/home")&&!location.href.includes("x.com/home"))for(const article of document.querySelectorAll("article:not([data-filter-checked])"))try{article.setAttribute("data-filter-checked","true");const id=article.querySelector("div[data-testid='User-Name'] a > div > span")?.innerText.substring(1);if(!whiteList.has(id)){if(!blackList.has(id)){var articleText=article.innerText,retweet=article.querySelector("span[data-testid='socialContext'] > span >span")?.innerText,text=article.querySelector("div[lang]")?.innerText??"";if("这个帖子来自一个你已屏蔽的账号。\n查看"==articleText&&""===text){article.style.display="none",showToast("隐藏了一条来自已屏蔽的账号的推文");continue}for(const rule of rules)try{if(check(rule,id,"name",retweet)||check(rule,id,"text",text)||check(rule,id,"all",articleText))break}catch{}}if(blackList.has(id)&&(article.style.display="none",$get("twitter_show_note",!0))&&!0!==blackList.get(id).notShowNote&&"id"!==blackList.get(id).type&&"id_sum"!==blackList.get(id).type){const note=document.createElement("div");note.innerHTML=`<div class="note-tweet">推文已被<a href="" target="_blank">屏蔽器</a>通过⌊${blackList.get(id).rule}⌉(${blackList.get(id).type})规则屏蔽,点击显示推文(你可以通过设置不再显示该提示)</div>`,note.onclick=()=>{article.style.display="block",note.style.display="none";var blockbtn=document.createElement("a");blockbtn.className="block_btn",blockbtn.innerText="屏蔽用户",blockbtn.onclick=()=>{blockUserByScreenName(id),article.style.display="none"},article.querySelector("div[data-testid=caret]").parentElement.parentElement.parentElement.insertAdjacentElement("beforeBegin",blockbtn)},article.parentElement.appendChild(note)}}}catch(error){}},
	wait=()=>{document.querySelector("main")?new MutationObserver(filter).observe(document.querySelector("main"),{attributes:!1,childList:!0,subtree:!0}):setTimeout(wait,200)
};return wait(),".note-tweet{transition:opacity .5s ease-out 0s color .3s ease-out 0s;opacity:.9;padding:2px 16px;border:#eff3f4 1px;cursor:pointer;font-size:13px;color:#636366}.note-tweet a{color:#666680}.note-tweet:hover{opacity:1;background-color:rgba(247,247,247,.9333333333);color:#303023}.note-tweet:hover a{color:#55f}.block_btn,.note-update{color:#00f;text-decoration:underline;cursor:pointer}.note-update{position:fixed;right:20px;bottom:20px;background:#b0c4de;box-shadow:gray 2px 2px 10px 2.2px;font-size:16px;padding:12px;border-radius:8px;border:1px;z-index:114514;opacity:.4}.block_btn{margin:4px}.toast{position:fixed;right:28px;top:24px;background:rgba(49,255,83,.5333333333);color:#1d9bf0;box-shadow:#fff 2px 2px 10px 2.2px;font-size:16px;padding:8px;border-radius:4px;border:1px;z-index:114514;opacity:0;backdrop-filter:blur(4px);transform:translateX(100%);transition:opacity .3s ease-out 0s,transform .3s ease-out 0s}.toast-active,.toast:hover{opacity:1;transform:translateX(0);transition:opacity .4s ease-out 0s,transform .25s ease-out 0s}.toast-active{opacity:.8}.hide{opacity:0}"},"已关闭$off":null}},
	twitter_config:{name:"$",match:["yuhan-script-config.netlify.app","twitter.com","x.com"],values:()=>{timeoutOnLoad(async()=>{let callback_num=0;var getText=(url,callback)=>{callback_num+=1,GM_xmlhttpRequest({method:"GET",url:url,headers:{"Content-Type":"application/json"},onload:function(response){callback(response.responseText),--callback_num}})
};const onupdate=reload=>{var btn;0===callback_num?($set("twitter_feed_rule_cache_last_check",Date.now()),$set("twitter_feed_rule_cache",ruleObj),reload&&location.reload(),(btn=document.createElement("button")).onclick=()=>location.reload(),btn.className="note-update",btn.innerText="屏蔽器规则更新完成|刷新即可生效|点击刷新",document.body.insertAdjacentElement("beforeend",btn)):setTimeout(()=>onupdate(reload),1e3)
};var user_rule=parseRule($get("twitter_user_rule")),user_rule=(user_rule&&(user_rule["rule-name"]="自定义用户规则",rules.add(user_rule)),$get("twitter_feed_rule").trim()),feed_hash=user_rule.hashCode();let ruleObj=$get("twitter_feed_rule_cache",{});if(feed_hash!==$get("twitter_feed_rule_hash")){$set("twitter_feed_rule_hash",feed_hash),$set("twitter_feed_rule_cache",{}),ruleObj={
};feed_hash=document.createElement("button");feed_hash.onclick=()=>location.reload(),feed_hash.className="note-update",feed_hash.innerText="屏蔽器规则已清空|正在重新获取规则",feed_hash.style.zIndex="10086",document.body.insertAdjacentElement("beforeend",feed_hash);for(let url of user_rule.split("\n"))0!==(url=url.trim()).length&&getText(url,str=>{ruleObj[url]=str,$set("twitter_feed_rule_cache",ruleObj)});setTimeout(()=>onupdate(!0),1200),$set("twitter_feed_rule_cache_last_check",Date.now())}feed_hash=$get("twitter_feed_rule_cache_last_check",0);for(const key of Object.keys(ruleObj))loadRule(ruleObj[key]);if(864e5<Date.now()-feed_hash){for(const url of Object.keys(ruleObj))getText(url,str=>{ruleObj[url]=str,$set("twitter_feed_rule_cache",ruleObj)});setTimeout(()=>onupdate(),800)}},
	250)}},
	twitter_block_on_home:{name:"在关注和推荐页面",match:["/twitter.com/home","/x.com/home"],values:{"启用屏蔽功能$on":null,"关闭屏蔽功能$off":null}},
	twitter_auto_block:{name:"自动屏蔽被精准匹配的用户",match:["twitter.com","x.com"],values:{"已开启$on":null,"已关闭$off":null}}
};
run(features_twitter_859990949);
} catch (e) {
    console.error(`twitter: ${e.message}`);
    console.error(e);
}

