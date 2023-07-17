移除评论关键字搜索跳转, ["www.bilibili.com/video", "www.bilibili.com/read"], {
    '已关闭$off': null, '已开启$on': () => {
        // TODO: 重构
        intervalOnLoad(() => {
            let as = document.getElementsByClassName("jump-link search-word")
            for (let i = 0; i < as.length; i++) {
                as[i].parentElement.outerHTML = as[i].parentElement.outerHTML.replace(as[i].outerHTML, as[i].outerText)
            }
            if (as.length > 0) console.log(`remove ${as.length} search icon`)
        }, 8000);
    },
}