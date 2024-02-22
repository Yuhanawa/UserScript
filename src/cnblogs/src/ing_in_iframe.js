name: sidenav
match: ['/ing.cnblogs.com/']
directlyRun: true
    ,
    () => {
        if (top === self) return;

        var style = $SASS(ing_in_iframe)


        timeoutOnLoad(() => {
            console.log(document.documentElement);
            unsafeWindow.parent.postMessage({
                type: "resizeIframe",
                height: document.body.clientHeight ?? document.body.scrollHeight
            }, "*")
        }, 250);

        return style
    }