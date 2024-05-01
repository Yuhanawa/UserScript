isLoaded = false
// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
onload(() => isLoaded = true);
const __props__ = new Map()

//#region config get&set
function get(k, d) { return GM_getValue(k, d === undefined ? __props__.get(k) : d) }
function set(k, v) { return GM_setValue(k, v) }
function cfg(k, v) { return v===undefined?get(k):set(k, v) }
//#endregion


//#region misc utils
function getOptionKeyAndName(optionStr) {
    const key = optionStr.match(/\$([^ ]+)/)?.[0];

    if (key) return { key: key.replace("$", ""), name: optionStr.replace(key, '') };
    return { key: optionStr, name: optionStr };
};

//#endregion


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
function addMenu(name, key, options, current, index, onclick) {
   
    const getOptionKey = o => getOptionKeyAndName(o).key;
    const getOptionName = o => getOptionKeyAndName(o).name;
   
    // 设置默认值
    if (current === undefined || index == undefined|| index === -1) {
        current = set(key, getOptionKey(options[0]));
        index = 0;
    }

    const display = `${name}:${getOptionName(options[index])}[${index + 1}/${options.length}]<点击切换`;
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(display, () => {
        set(key, getOptionKey(
            options[index + 1>= options.length?0:index + 1]
        ));
        if (onclick) try { onclick() } catch(e) { console.log(`发生错误(${name}-${current}-onclick): ${e}`); }
        location.reload();
    });
    return index;
}

//#region utils: onload timeoutAfterLoad intervalAfterLoad delay
function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function timeoutAfterLoad(f, t) { onload(() => setTimeout(() => f(), t)) }
function intervalAfterLoad(f, timeout) { onload(() => setInterval(f, timeout)) }
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

    if (feature.switchable && !get(`${key}_switch`, feature.default_switch_state ?? true)) return;

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
    let current = get(key, key0);
    let index = options.findIndex(x => getOptionKeyAndName(x).key === current)

    if (index === -1 || index === undefined) {
        set(key, key0);
        index = 0;
        current = key0;
    }

    if (!feature.hideInMenu)
        addMenu(name, key, options, current, index)

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


