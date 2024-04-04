name: ing
match: ['/www.cnblogs.com\/#ing*$/']
directlyRun: true
    ,
    () => {
        show_ing_iframe()
        if ($get("cnblogs_auto_pager_ing_switch")) {
            setInterval(() => {
                if ((document.body.offsetHeight - window.scrollY - window.innerHeight) < window.innerHeight * 2) {
                    document.getElementById("ing_iframe").contentWindow.postMessage({ type: "nextPage", }, "*");
                }
            }, 2000);
        }
    }