const win = unsafeWindow;
isLoaded = false;

//#region utils: onload delay loop
function onload(f) {
    if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
};
function delay(f, t, delayConfig) {
    const afterLoad = delayConfig?.afterLoad ?? true
    const loop = delayConfig?.loop ?? false
    const runOnFirst = delayConfig?.runOnFirst ?? false

    const run = afterLoad ? onload : (f) => f()
    if (loop) {
        if (runOnFirst) run(f)
        run(() => setInterval(f, t))
    }
    else run(() => setTimeout(f, t))
}
function loop(f, t, loopConfig) {
    delay(f, t, { ...loopConfig, loop: true })
}
//#endregion

onload(() => { isLoaded = true });

//#region config: get set cfg
function get(k, d) { return GM_getValue(k, d === undefined ? config.props[k]?.defaultValue ?? console.error(`Can't found key (${k}) in config.`) : d) }
function set(k, v) { return GM_setValue(k, v) }
function cfg(k, v) { return v === undefined ? get(k) : set(k, v) }
//#endregion

//#region settingCustomWidgets
const settingCustomWidgets = []
function addSettingWidget(type, creatorFunction) { settingCustomWidgets.push({ type, creatorFunction }) }
//#endregion

//#region style
function style(css, id) {
    if (id || typeof GM_addStyle === "undefined") {
        const node = document.createElement("style");
        if (id) node.setAttribute("id", id);
        node.appendChild(document.createTextNode(css));
        if (document.body) document.body.appendChild(node);
        else document.head.appendChild(node);
        return node;
    }
    // else direct add
    GM_addStyle(css);
}
//#endregion

//#region Menu: addOptionOnMenu addButtonOnMenu
function addOptionOnMenu(key, reload = true) {
    const configProps = config.props;
    if (!configProps || !configProps[key]) {
        console.error(`addOptionOnMenu: Can't find config key "${key}"`);
        return;
    }

    try {
        const { category, display, defaultValue, type, options } = configProps[key]
        const current = cfg(key);

        if (type === "bool") {
            const menuDisplay = `${configProps[key]?.display}:${current ? "已启用" : "已禁用"}`;
            // noinspection JSUnresolvedFunction
            GM_registerMenuCommand(menuDisplay, () => {
                cfg(key, !current);
                if (reload) location.reload();

            });
        } else if (type === "option") {
            let index = options.findIndex(o => o.key === current);
            if (index === -1) { cfg(key, options[0].key); index = 0 }

            const menuDisplay = `${configProps[key]?.display}:${current} [${index + 1}/${options.length}]`;
            // noinspection JSUnresolvedFunction
            GM_registerMenuCommand(menuDisplay, () => {
                const nextIndex = (index + 1) % options.length;
                cfg(key, options[nextIndex].key);
                if (reload) location.reload();

            });

        } else {
            console.error(`addOptionOnMenu: Unsupported type "${type}" for key "${key}"`);
            return;
        }
    } catch (error) {
        console.error(`addOptionOnMenu: An error occurred when add "${key}", ${error}`);
    }
}
function addButtonOnMenu(display, onclick, reload = true) {
    // noinspection JSUnresolvedFunction
    GM_registerMenuCommand(display, () => {
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
//#endregion

//#region Module: addModule
function addModule(module) {
    const condition = module.condition
    if (condition !== undefined && (
        (typeof condition === "boolean" && !condition)
        || (typeof condition === "function" && !condition()))) return;

    const pages = module.pages
    let isMatchedPage = undefined;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    if (pages !== undefined && !(isMatchedPage = pages.some(page => config.isMatchedPages[page]))) return;
    if ((pages === undefined && module.matchUrls !== undefined) || isMatchedPage === false) {
        const urls = module.matchUrls
        if (urls !== undefined && !urls.some(testUrlMatched)) return;
    }

    if (module.showInMenu) {
        if (module.runAlways) addButtonOnMenu(`${module.key}: runAlways`, () => { }, false);
        else addOptionOnMenu(module.key);
    }

    let cfgValue = null;
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    if (module.runAlways || (cfgValue = cfg(module.key)) === true || typeof module.value === "object") {
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
            }
        } else if (typeof moduleValue === "undefined" || moduleValue === null) {
            // do nothing
        }
        else console.error("异常的module.value在addModeModule中", module.value);
    }
}
//#endregion

//#region MatchUtils: testUrlMatched initIsMatchedPages
function testUrlMatched(url) {
    return url.startsWith("/") && url.endsWith("/") ?
        new RegExp(url.substring(1, url.length - 1)).test(location.href)
        : location.href.includes(url)
}
function initIsMatchedPages() {
    if (!config.pages) return;
    config.isMatchedPages = {}

    for (const key of Object.keys(config.pages)) {
        config.isMatchedPages[key] = config.pages[key].some(testUrlMatched);
    }

}
//#endregion

//#region init
function init() {
    addButtonOnMenu("⚙️", () => {
        openConfigPanel();
    }, false);
    initIsMatchedPages();
}

init();
//#endregion
