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
    getConfigPage().then(fastestSite => { // Handle the promise returned by getConfigPage
        if (GM_openInTab !== undefined) GM_openInTab(fastestSite, { active: true });
        else location.href = fastestSite;
    });
}
function LoadConfigPage(name) {
    console.log(`LoadConfigPage ${name}`);
}


function loadConfig(name, properties) {
    GM_registerMenuCommand("在新窗口打开设置中心", () => {
        showConfigPage()
    }); GM_registerMenuCommand("在页面内镶嵌设置中心(BETA)", () => {
        loadconfigComponent();
    });

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

    if (unsafeWindow.awa === undefined||unsafeWindow.awa.userscript === undefined) {
        unsafeWindow.awa = {};
        unsafeWindow.awa.userscript = {};
    }
    unsafeWindow.awa.current = name

    unsafeWindow.awa.userscript[name] = {
        props: properties,
        anchors: anchors,
        get: get,
        set: set,
    }

}


function loadconfigComponent() {

    unsafeWindow.useNewConfig = true;

    const prefix = 'https://cdn.jsdelivr.net/gh/Yuhanawa/UserScript@releases/config-component/dist/'
    // const pre = '/config-component/dist/'
    const indexModuleUrl = prefix + "/assets/js/index.js"
    const indexModulePreloadUrl = prefix + "/assets/js/index.js"
    const commonModulePreloadUrl = prefix + "/assets/js/common.js"
    const vendorModulePreloadUrl = prefix + "/assets/js/vendor.js"
    const commonStylesUrl = prefix + "/assets/css/common.css"
    const vendorStylesUrl = prefix + "/assets/css/vendor.css"
    const indexStylesUrl = prefix + "/assets/css/index.css"

    const head = unsafeWindow.document.head;
    // React 
    const reactScript = document.createElement('script');
    reactScript.src = 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
    head.appendChild(reactScript);

    const reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
    head.appendChild(reactDOMScript);

    // 样式表
    const commonStyles = document.createElement('link');
    commonStyles.rel = 'stylesheet';
    commonStyles.href = commonStylesUrl;
    head.appendChild(commonStyles);

    const vendorStyles = document.createElement('link');
    vendorStyles.rel = 'stylesheet';
    vendorStyles.href = vendorStylesUrl;
    head.appendChild(vendorStyles);

    const indexStyles = document.createElement('link');
    indexStyles.rel = 'stylesheet';
    indexStyles.href = indexStylesUrl;
    head.appendChild(indexStyles);



    const addscript = (head) => {

        // 应用脚本
        const indexModule = document.createElement('script');
        indexModule.type = 'module';
        indexModule.crossOrigin = true;
        indexModule.src = indexModuleUrl;
        head.appendChild(indexModule);

        const indexModulePreload = document.createElement('script');
        indexModulePreload.type = 'module';
        indexModulePreload.crossOrigin = true;
        indexModulePreload.src = indexModulePreloadUrl;
        head.appendChild(indexModulePreload);

        // 预加载模块
        const commonModulePreload = document.createElement('link');
        commonModulePreload.rel = 'modulepreload';
        commonModulePreload.crossOrigin = true;
        commonModulePreload.href = commonModulePreloadUrl;
        head.appendChild(commonModulePreload);

        const vendorModulePreload = document.createElement('link');
        vendorModulePreload.rel = 'modulepreload';
        vendorModulePreload.crossOrigin = true;
        vendorModulePreload.href = vendorModulePreloadUrl;
        head.appendChild(vendorModulePreload);

        document.getElementById('config-component-root')
            .appendChild(document.createElement('config-component'));

        //#region dragElement
        const configPage = document.querySelector("#config-component-shadow");
        const container = configPage.querySelector("#config-component-root");
        const iframe = configPage.querySelector(".config-component");
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        container.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            iframe.style.pointerEvents = "none";
            configPage.onmouseup = closeDragElement;
            configPage.onmousemove = elementDrag;
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
    }


    const shadow = document.createElement('div');
    shadow.id = 'config-component-shadow';
    document.body.appendChild(shadow);
    // shadow.attachShadow({ mode: "open" });

    const root = document.createElement('div');
    root.id = 'config-component-root';
    shadow.appendChild(root);

    reactScript.onload = () => reactDOMScript.onload = () => addscript(unsafeWindow.document.head);
}