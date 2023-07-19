移除评论关键字搜索图标, ["www.bilibili.com/video", "www.bilibili.com/read"], {
    '已启用$on': () => {
        // TODO: 重构
        intervalOnLoad(() => {
            // remove with class " icon search-word "  
            let icons = document.getElementsByClassName("icon search-word")
            for (let i = 0; i < icons.length; i++) {
                icons[i].remove()
            }
            if (icons.length > 0) console.log(`remove ${icons.length} search icon`)
        }, 8000);
    },
    '已关闭$off': null
}