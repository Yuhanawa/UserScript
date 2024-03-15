外链重定向自动跳转, ["link.csdn.net/"], {
    '已开启$on': () => {
        const url = new URLSearchParams(location.search).get("target");
        location.href = url
        location.replace(url)
    },
    '已关闭$off': null
}