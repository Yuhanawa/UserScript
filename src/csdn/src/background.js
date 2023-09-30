自定义背景, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
    '已关闭$off': null,
    '已开启$on': () => {
        if ($get('csdn_background-value')) {
            style(`body{background:url("${$get('csdn_background-value')}")}`)
        }
        style(`body{--blog-content-box-background:${$get('csdn_blog-content-box-background-value')}}`)
        style(`body{--blog-content-box-opacity:${$get('csdn_blog-content-box-opacity-value', '0.98')}}`)
        style(`body{--blog-header-box-background:${$get('csdn_blog-header-box-background-value')}}`)
        return $SASS(background)
    },
}