({
    name: '移除评论关键字搜索跳转',
    pages: ["video", "read"],
    showInMenu: true,
    value: {
        '隐藏🔍图标$icon': () => `.icon.search-word:{display:none;}`,
        '隐藏图标和恢复颜色$color': () => `.icon.search-word:{display:none;} .search-word a{color: #222!important;}`,
        '彻底移除$link': () => {
            delay(() => {
                let as = document.getElementsByClassName("search-word")
                for (let i = 0; i < as.length; i++) 
                    as[i].parentElement.outerHTML = as[i].parentElement.outerHTML.replace(as[i].outerHTML, as[i].outerText)
            }, 8000, { loop: true });
            return '.icon.search-word:{display:none;} .search-word a{color: #222!important;}'
        },
        '已关闭$off': null,
    }
})