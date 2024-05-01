移除评论关键字搜索跳转, ["www.bilibili.com/video", "www.bilibili.com/read"], {
    '移除图标$icon': () => `.icon.search-word:{display:none;}`,
    '移除图标和链接颜色$color': () => `.icon.search-word:{display:none;} .search-word a{color: #222!important;}`,
    '彻底移除$link': () => {
        intervalAfterLoad(() => {
            let as = document.getElementsByClassName("search-word")
            for (let i = 0; i < as.length; i++) as[i].parentElement.outerHTML = as[i].parentElement.outerHTML.replace(as[i].outerHTML, as[i].outerText)
        }, 8000);
        return '.icon.search-word:{display:none;} .search-word a{color: #222!important;}'
    },
    '已关闭$off': null,
}