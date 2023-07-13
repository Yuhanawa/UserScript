isLoaded = false
onload(() => isLoaded = true);

function cfg_get(k, d) { GM_getValue(k, d) }
function cfg_set(k, v) { GM_setValue(k, v) }

function cfg(k, v) {
    if (v === undefined) return cfg_get(k);
    else cfg_set(k, v);
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

// add options on menu
function option (name, key, ValueList, onclick) {
    const index = get(key, 0)
    name += `:${ValueList[index]}[${index + 1}/${ValueList.length}]<点击切换模式`;
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(name, () => {
        if (index + 1 >= ValueList.length) set(key, 0); else set(key, index + 1);
        if (onclick != null && onclick != undefined) try { onclick() } catch { }
    });
    return index;
}

function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function timeoutOnLoad(f, t) { onload(() => setTimeout(() => f(), t)) }
function intervalOnLoad(f, timeout) { onload(() => setInterval(f, timeout)) }

function run(fts) {
    if (fts === undefined) {
        fts = features
    }

    for (const key of Object.keys(fts)) {
        const v = f[key];
        if (!v.match.test(window.location.href)) continue;

        feature(v.name, key, v.values);
    }

}

function feature(name, key, values) {

    const options = Object.keys(values)
    let current = get(key, objKeys[0]);
    let index = objKeys.indexOf(current);

    if (index === -1) set(key, options[0]);
    option(name, key, options)

    // 功能
    try {
        const value = values[current];

        if (value == null) return;
        if (typeof value === "function") value(feature);
        else if (typeof value === "string") style(value);
        else console.error(`出现了不应该出现的类型: ${typeof value} ${value}`)
    } catch (e) {
        console.error(e)
    }
}
