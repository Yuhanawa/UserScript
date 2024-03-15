// ==UserScript==
// @name		Twitter Tweets(X Posts) Blocker & Filter
// @name:en		Twitter Tweets(X Posts) Blocker & Filter
// @name:zh		Twitter 推特推文(X帖子) 屏蔽器&过滤器
// @name:ja		Twitter ツイッターのツイート(Xの投稿)ブロック&フィルター
// @namespace		http://github.com/yuhanawa/UserScript
// @name:zh-CN		Twitter 推特推文(X帖子) 屏蔽器&过滤器
// @name:zh-TW		Twitter 推特推文(X帖子) 屏蔽器&过滤器
// @description		Customize filters to block or hide unwanted tweets (adult content, political discussions, or specific groups, etc). Support custom blockers and importing third-party rules.
// @description:en		Customize filters to block or hide unwanted tweets (adult content, political discussions, or specific groups, etc). Support custom blockers and importing third-party rules.
// @description:zh		自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等),支持自定义屏蔽器,导入第三方规则等
// @description:ja		迷惑なツイート(アダルト、政治、特定グループなど)をブロックまたは非表示にするために、フィルターをカスタマイズ可能。カスタムブロッカーに対応、サードパーティのルールもインポート可。
// @description:zh-CN		自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等),支持自定义屏蔽器,导入第三方规则等
// @description:zh-TW		自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等),支持自定义屏蔽器,导入第三方规则等
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @grant		GM_registerMenuCommand
// @grant		GM_xmlhttpRequest
// @grant		GM_openInTab
// @grant		unsafeWindow
// @match		*://twitter.com/*
// @match		*://x.com/*
// @match		*://yuhan-script-config.netlify.app/*
// @match		*://user-script-config-form.vercel.app/*
// @match		*://yuhanawa.github.io/tools/userscriptconfig/*
// @version		0.1.10
// @author		Yuhanawa
// @license		GPL-3.0
// @icon		none
// @run-at		document-start
// @connect		yuhan-script-config.netlify.app
// @connect		*
// ==/UserScript==

/* 
    twitter v.0.1.10 by Yuhanawa
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