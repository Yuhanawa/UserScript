({
    name: "视频快捷分享复制",
    pages: ["video"],
    showInMenu: true,
    value: {
        'all': (feature) => {
            feature.fn('[标题]链接', () => `【${document.querySelector('h1.video-title').innerText}】\t${location.origin}${location.pathname}`)
        }, 'BV': (feature) => {
            feature.fn('BV', () => location.pathname.split("/")[2])
        }, 'url': (feature) => {
            feature.fn('链接', () => `${location.origin}${location.pathname}`)
        }, 'title': (feature) => {
            feature.fn('标题', () => `${document.querySelector('h1.video-title').innerText}`)
        }, 'off': null
    },
    fn: (title, getText) => {
        delay(() => {
            // TODO: 重构
            const h1 = document.querySelector('h1.video-title');
            if (!h1) return;

            const text = getText();
            if (document.querySelector('h1.video-title').innerHTML.indexOf('🏷️') !== -1) return
            const copy_btn = document.createElement('span')
            copy_btn.title = `复制当前视频的${title}:${text}`
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

        }, 2500, { loop: true });
    }
})