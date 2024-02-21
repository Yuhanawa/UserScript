isLoaded = false
// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
onload(() => isLoaded = true);
const __props__ = new Map()

//#region config get&set
function $get(k, d) { return GM_getValue(k, d === undefined ? __props__.get(k) : d) }
function $set(k, v) { return GM_setValue(k, v) }
//#endregion


//#region misc utils

function getOptionKeyAndName(optionStr) {
    const key = optionStr.match(/\$([^ ]+)/)?.[0];

    if (key) return { key: key.replace("$", ""), name: optionStr.replace(key, '') };
    return { key: optionStr, name: optionStr };
};
function findFastestSite(sites) {
    return new Promise((resolve, reject) => {
        let fastestSite = null;
        let fastestTime = Infinity;
        let completedRequests = 0; // Track completed requests

        function pingSite(site) {
            const xhr = new XMLHttpRequest();
            const startTime = new Date().getTime();
            xhr.onreadystatechange = () => {
                if (fastestTime < 100) {
                    xhr.abort();
                    resolve(fastestSite);
                };
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const endTime = new Date().getTime();
                    const timeElapsed = endTime - startTime;
                    console.log(`Ping ${site} took ${timeElapsed}ms`);
                    console.log(`Status: ${xhr.status}`);
                    // status != 400~600
                    if (xhr.status < 400) {
                        if (timeElapsed < fastestTime) {
                            fastestTime = timeElapsed;
                            fastestSite = site;
                        }
                    }
                    completedRequests++; // Increment completed requests
                    if (completedRequests === sites.length) { // Check if all requests are completed
                        resolve(fastestSite);
                    }
                }
            };
            xhr.onprogress = () => {
                if (fastestTime < 100) {
                    xhr.abort();
                    resolve(fastestSite);
                };
            }
            xhr.onload = () => {
                console.log(`Pinging ${site}`);
            };

            xhr.open('GET', site, true);
            xhr.timeout = 2000;
            xhr.send();
        }

        sites.forEach(pingSite);
    });
}

function getConfigPage() {
    const websites = [
        'https://user-script-config-form.vercel.app',
        'https://yuhan-script-config.netlify.app',
        'https://yuhanawa.github.io/tools/userscriptconfig/',
    ];

    return findFastestSite(websites) // Return the promise from findFastestSite
        .then(fastestSite => fastestSite)
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

function showConfigPage() {
    if (document.querySelector("#config-page-awa")) {
        document.querySelector("#config-page-awa").style.display = "block";
        return;
    }

    getConfigPage().then(fastestSite => { // Handle the promise returned by getConfigPage
        if (GM_openInTab !== undefined) GM_openInTab(fastestSite, { active: true });
        else location.href = fastestSite;
    });
}
function LoadConfigPage(name) {
    if (document.querySelector("#config-page-awa")) { showConfigPage(); return; }

    style(`
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
      
    `)

    return getConfigPage().then(fastestSite => {
        document.body.insertAdjacentHTML("afterend", `
        <div class="config-page-awa" id="config-page-awa" style="display: none;">
        <div class="config-page-container">
            <div class="config-page-drag-area"></div>
            <iframe class="config-page-iframe"
                src="${fastestSite}?menuKey=${name}&iniframe"></iframe>

            <button class="config-page-close-btn">⭕</button>
        </div>
    </div>`);

        //#region dragElement
        const configPage = document.querySelector("#config-page-awa");
        const container = configPage.querySelector(".config-page-container");
        const iframe = configPage.querySelector(".config-page-iframe");
        const dragArea = configPage.querySelector(".config-page-drag-area");
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        dragArea.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            iframe.style.pointerEvents = "none";
            configPage.onmouseup = closeDragElement;
            configPage.onmousemove = elementDrag;
            var cursorStyle = window.getComputedStyle(event.target).cursor;
            console.log("当前鼠标样式：" + cursorStyle);
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            iframe.style.pointerEvents = "auto";
            configPage.onmouseup = null;
            configPage.onmousemove = null;
        }
        //#endregion

        configPage.querySelector(".config-page-close-btn").onclick = function () {
            configPage.style.display = "none";
        }

        return Promise.resolve();
    });
}
//#endregion

function loadConfig(name, properties) {
    GM_registerMenuCommand("在新窗口打开配置界面", () => {
        showConfigPage()
    }); GM_registerMenuCommand("在页面内镶嵌配置界面(BETA)", () => {
        LoadConfigPage(name).then(() => showConfigPage())
    });
    //#region websites
    // GM_registerMenuCommand("打开设置中心(github|如果打不开点下面的)", () => {
    //     if (GM_openInTab !== undefined) GM_openInTab('https://yuhanawa.github.io/tools/userscriptconfig/', { active: true });
    //     else location.href = 'https://yuhanawa.github.io/tools/userscriptconfig/'
    // });
    // GM_registerMenuCommand("打开设置中心(vercel|被墙)", () => {
    //     if (GM_openInTab !== undefined) GM_openInTab('https://user-script-config-form.vercel.app', { active: true });
    //     else location.href = 'https://user-script-config-form.vercel.app'
    // });
    // GM_registerMenuCommand("打开设置中心(netlify)", () => {
    //     if (GM_openInTab !== undefined) GM_openInTab('https://yuhan-script-config.netlify.app', { active: true });
    //     else location.href = 'https://yuhan-script-config.netlify.app'
    // });
    //#endregion

    anchors = [];
    for (const key of Object.keys(properties)) {
        __props__.set(`${name}_${key}`, properties[key].default);
        if (key.startsWith('#')) {
            anchors.push({
                key: key,
                href: properties[key].href || key,
                title: properties[key].title || properties[key].description || key,
            });
        }
    }

    if (location.href.match('yuhan-script-config.netlify.app')
        || location.href.match('user-script-config-form.vercel.app')
        || location.href.match('yuhanawa.github.io/tools/userscriptconfig')
        || location.href.match('localhost')) {
        if (unsafeWindow.userscript === undefined) unsafeWindow.userscript = {};

        unsafeWindow.userscript[name] = {
            props: properties,
            anchors: anchors,
            get: $get,
            set: $set,
        }
    }
}

//#region style
function style(css) {
    if (typeof GM_addStyle !== "undefined") GM_addStyle(css);
    else {
        const node = document.createElement("style");
        node.appendChild(document.createTextNode(css));
        document.body.appendChild(node);
    }
}
//#endregion

function option(name, key, options, current, index, onclick) {
    if (current === undefined || current === null || index == undefined) {
        current = $set(key, getOptionKeyAndName(options[0]).key);
        index = options.indexOf(options.filter(x => getOptionKeyAndName(x).key == current)[0])
    }
    if (index === -1 || index === undefined) {
        $set(key, getOptionKeyAndName(options[0]).key);
        index = 0;
        current = getOptionKeyAndName(options[0]).key;
    }

    name += `:${getOptionKeyAndName(options[index]).name}[${index + 1}/${options.length}]<点击切换模式`;
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(name, () => {
        if (index + 1 >= options.length) $set(key, getOptionKeyAndName(options[0]).key);
        else $set(key, getOptionKeyAndName(options[index + 1]).key);
        if (onclick) try { onclick() } catch { }
        location.reload();
    });
    return index;
}

//#region utils: onload timeoutOnLoad intervalOnLoad delay
function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function timeoutOnLoad(f, t) { onload(() => setTimeout(() => f(), t)) }
function intervalOnLoad(f, timeout) { onload(() => setInterval(f, timeout)) }
//#endregion

function run(fts) {
    if (fts === undefined) {
        fts = features
    }

    for (const key of Object.keys(fts)) {
        try {
            const feature = fts[key];

            if ((typeof feature.match == 'boolean' && feature.match == true)
                || feature.match.filter(
                    (m) => typeof m === "string"
                        ? window.location.href.match(m) !== null
                        : m.test(window.location.href)
                ).length !== 0) addFeature(key, feature);
        } catch (error) {
            console.error('发生了一个意料之外的错误, 这可能是因为非法的feature所造成的, 不过请放心, 脚本将继续运行而不会崩溃. ', feature, error);
        }
    }
}

function addFeature(key, feature) {
    const { name, values } = feature;

    if (feature.switchable && !$get(`${key}_switch`, feature.default_switch_state ?? true)) return;

    if (name === '$' || feature.directlyRun) {
        try {
            if (typeof values === "function") {
                const result = values(feature);
                if (typeof result === "string") style(result)
            }
            else if (typeof values === "string") style(values);
        } catch (e) {
            console.error(e)
        }
        return;
    }

    const options = Object.keys(values)
    const key0 = getOptionKeyAndName(options[0]).key
    let current = $get(key, key0);
    let index = options.findIndex(x => getOptionKeyAndName(x).key === current)

    if (index === -1 || index === undefined) {
        $set(key, key0);
        index = 0;
        current = key0;
    }

    if (!feature.hideInMenu)
        option(name, key, options, current, index)

    // 功能实现
    try {
        const value = values[options[index]];

        if (value === null || value === undefined) return;
        if (typeof value === "function") {
            const result = value(feature);
            if (typeof result === "string") style(result)
        }
        else if (typeof value === "string") style(value);
    } catch (e) {
        console.error(e)
    }
}


