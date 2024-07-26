({ // 自定义推特图标
    value: () => {
        return `body{--twitter-icon-value: url("${get("icon_value")}")` + $STYLE("icon")
    }
})