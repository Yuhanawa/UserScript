Ctrl + Enter开启专注模式, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
    '已关闭$off': null,
    '已开启$on': () => {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.keyCode == 13) {
                if (document.fullscreenElement)
                    document.exitFullscreen()
                else
                    document.querySelector('.blog-content-box').requestFullscreen()
            }
        })
    }
}