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

        function pingSite(site) {
            const xhr = new XMLHttpRequest();
            const startTime = new Date().getTime();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const endTime = new Date().getTime();
                    const timeElapsed = endTime - startTime;
                    console.log(`Ping ${site} took ${timeElapsed}ms`);
                    if (xhr.status === 200) {
                        if (timeElapsed < fastestTime) {
                            fastestTime = timeElapsed;
                            fastestSite = site;
                        }
                    }
                    resolve(fastestSite);
                }
            };
            xhr.open('GET', site, true);
            xhr.send();
        }

        sites.forEach(pingSite);
    });
}

function getConfigPage() {
    const websites = [
        'https://yuhanawa.github.io/tools/userscriptconfig/',
        'https://user-script-config-form.vercel.app',
        'https://yuhan-script-config.netlify.app'
    ];

    findFastestSite(websites)
        .then(fastestSite => fastestSite)
        .catch(error => {
            console.error('Error:', error);
            return null
        });
}
function showConfigPage() {
    if (GM_openInTab !== undefined) GM_openInTab(getConfigPage(), { active: true });
    else location.href = getConfigPage();
}
//#endregion

function loadConfig(name, properties) {
    GM_registerMenuCommand("打开配置界面", () => {
        showConfigPage()
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

    for (const key of Object.keys(properties))
        __props__.set(`${name}_${key}`, properties[key].default);

    if (location.href.match('yuhan-script-config.netlify.app')
        || location.href.match('user-script-config-form.vercel.app')
        || location.href.match('yuhanawa.github.io/tools/userscriptconfig')
        || location.href.match('localhost')) {
        if (unsafeWindow.userscript === undefined) unsafeWindow.userscript = {};

        unsafeWindow.userscript[name] = {
            props: properties,
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
        const feature = fts[key];

        if (feature.match.filter(
            (m) => typeof m === "string" ? window.location.href.match(m) !== null : m.test(window.location.href)
        ).length === 0) continue;

        addFeature(key, feature);
    }

}

function addFeature(key, feature) {
    const { name, values } = feature;

    if (name === '$') {
        try {
            if (typeof values === "function") {
                const result = values(feature);
                if (typeof result === "string") style(result)
            }
            else if (typeof values === "string") style(value);
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


