// ==UserScript==
// @name		example
// @name:zh		
// @namespace		
// @description		
// @description:zh		
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		example.com
// @match		127.0.0.1:5500
// @match		*://*/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.1.3
// @author		
// @license		
// @icon		none
// @run-at		document-start
// ==/UserScript==

/* 
    config_test v.0.1.3 by Yuhanawa
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



loadConfig('config_test', {"num":{"title":"复杂数字输入框","type":"number","defaultValue":250,"props":{"placeholder":"520","addonBefore":"前置","addonAfter":"后置"},"description":"描述","tooltip":{"title":"tooltip提示"},"extra":"补充","required":true,"message":{"required":"必须填哦~"},"widget":"inputNumber"},"color":{"title":"颜色选择","type":"string","widget":"color"}})

let features_config_test_545080235 = {
	
  config_test_example: {
    name: "本地测试",
    match: true,
    values: {
      已关闭$off: null,
      已开启$on: () => {
        unsafeWindow.useNewConfig = true;
        window.ConfigWeb = false;

        unsafeWindow.run = () => {
          // React
          const reactScript = document.createElement("script");
          reactScript.src =
            "https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js";
          unsafeWindow.document.head.appendChild(reactScript);

          const reactDOMScript = document.createElement("script");
          reactDOMScript.src =
            "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js";
          unsafeWindow.document.head.appendChild(reactDOMScript);

          // const pre = 'https://cdn.jsdelivr.net/gh/Yuhanawa/UserScript@releases/config-component/dist'
          const pre = "/config-component/dist";
          const indexModuleUrl = pre + "/assets/js/index.js";
          const indexModulePreloadUrl = pre + "/assets/js/index.js";
          const commonModulePreloadUrl = pre + "/assets/js/common.js";
          const vendorModulePreloadUrl = pre + "/assets/js/vendor.js";
          const commonStylesUrl = pre + "/assets/css/common.css";
          const vendorStylesUrl = pre + "/assets/css/vendor.css";
          const indexStylesUrl = pre + "/assets/css/index.css";

          const addscript = (root) => {
            // 应用脚本
            const indexModule = document.createElement("script");
            indexModule.type = "module";
            indexModule.crossOrigin = true;
            indexModule.src = indexModuleUrl;
            root.appendChild(indexModule);

            const indexModulePreload = document.createElement("script");
            indexModulePreload.type = "module";
            indexModulePreload.crossOrigin = true;
            indexModulePreload.src = indexModulePreloadUrl;
            root.appendChild(indexModulePreload);

            // 预加载模块
            const commonModulePreload = document.createElement("link");
            commonModulePreload.rel = "modulepreload";
            commonModulePreload.crossOrigin = true;
            commonModulePreload.href = commonModulePreloadUrl;
            root.appendChild(commonModulePreload);

            const vendorModulePreload = document.createElement("link");
            vendorModulePreload.rel = "modulepreload";
            vendorModulePreload.crossOrigin = true;
            vendorModulePreload.href = vendorModulePreloadUrl;
            root.appendChild(vendorModulePreload);

            // 样式表
            const commonStyles = document.createElement("link");
            commonStyles.rel = "stylesheet";
            commonStyles.href = commonStylesUrl;
            root.appendChild(commonStyles);

            const vendorStyles = document.createElement("link");
            vendorStyles.rel = "stylesheet";
            vendorStyles.href = vendorStylesUrl;
            root.appendChild(vendorStyles);

            const indexStyles = document.createElement("link");
            indexStyles.rel = "stylesheet";
            indexStyles.href = indexStylesUrl;
            root.appendChild(indexStyles);

            const roote = document.getElementById("config-component-root");
            const configComponent = document.createElement("config-component");
            roote.appendChild(configComponent);
          
};

          const shadow = document.createElement("div");
          shadow.id = "config-component-shadow";
          document.body.appendChild(shadow);
          // shadow.attachShadow({ mode: "open" });

          const root = document.createElement("div");
          root.id = "config-component-root";
          shadow.appendChild(root);

          reactScript.onload = () =>
            (reactDOMScript.onload = () =>
              addscript(unsafeWindow.document.head));
        
};
      },
    },
  },

};

run(features_config_test_545080235);