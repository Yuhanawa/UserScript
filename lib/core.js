isLoaded = false
onload(() => isLoaded = true);
const __props__ = new Map()

function $get(k, d) {
    if (d === undefined) return GM_getValue(k, __props__.get(k))
    return GM_getValue(k, d)
}
function $set(k, v) { return GM_setValue(k, v) }

function loadConfig(name, properties) {
    GM_registerMenuCommand("打开设置中心(vercel|如果打不开点下一个)", () => {
        location.href = 'https://user-script-config-form.vercel.app'
    });
    GM_registerMenuCommand("打开设置中心(netlify|如果打不开点上一个)", () => {
        location.href = 'https://yuhan-script-config.netlify.app'
    });

    Object.keys(properties).forEach(key => __props__.set(`${name}_${key}`, properties[key].default))

    if (location.href.match('yuhan-script-config.netlify.app') || location.href.match('user-script-config-form.vercel.app') || location.href.match('localhost')) {
        if (unsafeWindow.banana == undefined) unsafeWindow.banana = {};

        unsafeWindow.banana[name] = {
            props: properties,
            get: $get,
            set: $set,
        }
    }
}

// add style
function style(css) {
    if (typeof GM_addStyle != "undefined") GM_addStyle(css);
    else {
        const node = document.createElement("style");
        node.appendChild(document.createTextNode(css));
        document.body.appendChild(node);
    }
}

function option(name, key, options, current, index, onclick) {
    if (current === undefined || current === null || index == undefined) {
        current = $set(key, getOptionKeyAndName(options[0]).key);
        index = options.indexOf(options.filter(x => getOptionKeyAndName(x).key == current)[0])
    }
    if (index === -1 || index == undefined) {
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

function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function timeoutOnLoad(f, t) { onload(() => setTimeout(() => f(), t)) }
function intervalOnLoad(f, timeout) { onload(() => setInterval(f, timeout)) }
function delay(fn, time, interval) { interval ? intervalOnLoad(fn, time) : timeoutOnLoad(fn, time) }

function run(fts) {
    if (fts === undefined) {
        fts = features
    }

    for (const key of Object.keys(fts)) {
        const feature = fts[key];

        if (feature.match.filter(
            (m) => typeof m === "string" ? window.location.href.match(m) !== null : m.test(window.location.href)
        ).length == 0) continue;

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

    if (index === -1 || index == undefined) {
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


function getOptionKeyAndName(optionStr) {
    const key = optionStr.match(/\$([^ ]+)/)?.[0];

    if (key) return { key: key.replace("$", ""), name: optionStr.replace(key, '') };
    return { key: optionStr, name: optionStr };
};