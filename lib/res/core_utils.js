const win = unsafeWindow;
let data = unsafeWindow.scriptsdata;
if (!data) {
    data = {};
}


//#region utils: onload delay
function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function delay(f, t, afterLoad = true, loop = false, runOnFirst = false) {
    const run = afterLoad ? onload : (f) => f()
    if (loop) {
        if (runOnFirst) run(f())
        run(setInterval(f(), t))
    }
    else run(setTimeout(f(), t))
}
//#endregion

onload(() => { data.isLoaded = true });


//#region config get&set
function get(k, d) { return GM_getValue(k, d === undefined ? __props__.get(k) : d) }
function set(k, v) { return GM_setValue(k, v) }
function cfg(k, v) { return v === undefined ? get(k) : set(k, v) }
//#endregion

//#region style
function styleUtil(node) {
    return {
        id: node.id,
        node: () => node,
        remove: () => document.body.removeChild(node),
        change: (css) => node.innerHTML = css,
        context: () => node.innerHTML,
        toString: () => node.innerHTML
    }
}
function style(css, id) {
    if (id || typeof GM_addStyle === "undefined") {
        const node = document.createElement("style");
        if (id) node.setAttribute("id", id);
        node.appendChild(document.createTextNode(css));
        document.body.appendChild(node);
        return styleUtil(node);
    }
    else GM_addStyle(css, id);
}
function getStyleUtil(id) {
    return styleUtil(document.getElementById(id));
}

//#endregion

// test
let setting = {
    name: 'test',
    props: {
        "key1": {
            key: 'test1',
            category: "a",
            display: 'test1',
            type: 'string',
            default: 'test1',
        },
        "key2": {
            key: 'test1',
            category: "a",
            display: 'test1',
            type: 'option',
            default: 'test1',
            options: [{
                key: 'a',
                display: 'a',
            },
            {
                key: 'b',
                display: 'b',
            }]
        },
    },
    category: [
        {
            key: 'test1',
            display: 'test1',
            icon: 'test1',
        }
    ]
}

//#region core
function addOptionOnMenu(key, reload = true) {
    const { category, display, default, type, options } = setting.props[key]

    const current = cfg(key);
    const index = options.map(o => o.key).indexOf(current);
    const menuDisplay = `${name}:${current} [${index + 1}/${options.length}]`;
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(menuDisplay, () => {
        cfg(key, options[index + 1 >= options.length ? 0 : index + 1].key);
        if (reload) location.reload();
    });
}
function addButtonOnMenu(display, onclick, reload = true) {
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(menuDisplay, () => {
        if (onclick) {
            try {
                onclick()
            } catch (e) {
                console.error(`addButtonOnMenu: An error occurred when add "${display}", ${e}`);
            }
        }
        if (reload) location.reload();
    });
}

function addModule(key, module) {
    const cfgValue = cfg(key)
    if (cfgValue === true || typeof module.value === "object") {
        let moduleValue = module.value;
        if (typeof module.value === "object") 
            moduleValue = module.value[cfgValue];

        if (typeof moduleValue === "string") style(moduleValue);
        else if (typeof moduleValue === "function") {
            try {
                const result = moduleValue(module);
                if (typeof result === "string") style(result);
            } catch (e) {
                console.error("An error occurred when addModeModule", e);
            }6
        } else console.error("异常的module.value在addModeModule中", module.value);
    }
}

// old

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


//#endregion


const current = data.currents['name'] = {
    isLoaded: false,
    cfg: cfg
}