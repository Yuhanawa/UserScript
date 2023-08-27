自定义推特图标, ['twitter.com', 'x.com'],
{
    已关闭$off: null,
    已开启$on: () => {
        style(`body{--twitter-icon-value: url("${$get("twitter_icon_value")}")`)
        return $SASS(icon)
    },
}