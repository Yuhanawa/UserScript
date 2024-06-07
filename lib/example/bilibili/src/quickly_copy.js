({
    name: "视频快捷分享复制",
    match: ["www.bilibili.com/video"],
    showInMenu: true,
    value: {
        '[标题]链接$all': (feature) => {
            intervalAfterLoad(() => {
                feature.fn('[标题]链接', `【${document.querySelector('h1.video-title').innerText}】\t${location.origin}${location.pathname}`)
            }, 1200);
        }, 'BV$BV': (feature) => {
            intervalAfterLoad(() => {
                feature.fn('BV', location.pathname.split("/")[2])
            }, 1200);
        }, '链接$url': (feature) => {
            intervalAfterLoad(() => {
                feature.fn('链接', `${location.origin}${location.pathname}`)
            }, 1200);
        }, '标题$title': (feature) => {
            intervalAfterLoad(() => {
                feature.fn('标题', `${document.querySelector('h1.video-title').innerText}`)
            }, 1200);
        }, '关闭$off': null
    }, 
    fn: (title, text) => {
        // TODO: 重构
        if (document.querySelector('h1.video-title').innerHTML.indexOf('🏷️') !== -1) return
        const copy_btn = document.createElement('span')
        copy_btn.title = `复制当前视频的${title}`
        copy_btn.style.cursor = 'pointer'
        copy_btn.style.fontSize = '22px'
        copy_btn.innerText = '🏷️'
        copy_btn.addEventListener('click', () => navigator.clipboard.writeText(text))

        document.querySelector('h1.video-title').append(copy_btn);

        if (get("quickly_copy_hotkey", 'off') === 'on') {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'c') {
                    navigator.clipboard.writeText(text)
                }
            })
        }

    }
})