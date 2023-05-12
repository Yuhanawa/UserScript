isLoaded = false
onload(() => isLoaded = true);

class untils {

    // noinspection JSUnresolvedFunction
    // get config
    getValue = (key, d) => GM_getValue(key, d)
    // noinspection JSUnresolvedFunction
    // set config
    setValue = (key, v) => GM_setValue(key, v)

    // add style
    addCss = (css) => {
        css = css.replaceAll(/\s{2,}/g, " ")
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
            addStyle(css);
        } else {
            const node = document.createElement("style");
            node.appendChild(document.createTextNode(css));
            document.body.appendChild(node);
        }
    }

    // add options on menu
    addOption = (name, key, ValueList, onclick) => {
        const index = get(key, 0)
        name += `:${ValueList[index]}[${index + 1}/${ValueList.length}]<点击切换模式`;
        // noinspection JSUnresolvedFunction
        GM_registerMenuCommand(name, () => {
            if (index + 1 >= ValueList.length) set(key, 0); else set(key, index + 1);
            if (onclick != null && onclick != undefined) try { onclick() } catch { }
        });
        return index;
    }

    onload = (f) => {
        if (isLoaded) f(); else document.addEventListener("DOMContentLoaded", () => f())
    };
    setTimeoutAfterLoad = (f, t) => onload(() => setTimeout(() => f(), t));

    setIntervalAfterLoad = (f, timeout) => onload(() => {
        f();
        setInterval(f, timeout);
    })
    /*
    untils.addFeature('测试','描述',/正则表达式/,
        {
            '开启': () => {
                console.log('开启');
            }, 
            '关闭': null
        })
    */
    addFeature = (name, key, match, values) => {
        if (!match.test(window.location.href)) return;

        const options = Object.keys(values)
        let current = get(key, objKeys[0]);
        let index = objKeys.indexOf(current);

        if (index === -1) set(key, options[0]);
        this.addOption(name, key, options)

        // 功能
        try {
            const value = values[current];
            if (value == null) return;
            if (typeof value === "function") value(feature);
            else if (typeof value === "string") this.addCss(value);
            else console.error(`出现了不应该出现的类型: ${typeof value} ${value}`)
        } catch (e) {
            console.error(e)
        }
    }
}
