name: ing_in_iframe
match: ['/ing.cnblogs.com/']
directlyRun: true
    ,
    () => {
        var style = $SASS(ing)


        if (top === self) return style;

        var style = style + $SASS(ing_in_iframe)
        var refreshHeight = () => {
            console.log(document.documentElement);
            unsafeWindow.parent.postMessage({
                type: "resizeIframe",
                height: document.body.scrollHeight ?? document.body.clientHeight + 220
            }, "*")
        }

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                console.log(mutation);
                // 遍历所有变化
                if (mutation.type === 'childList') {
                    refreshHeight()
                } else if (mutation.type === 'attributes') {
                    // 属性变化
                }
            });
        });
        onload(() => {
            refreshHeight()

            // 观察 #main 元素
            observer.observe(document.getElementById('main'), {
                childList: true,
                attributes: false,
                subtree: true,
            });
        })




        return style
    }