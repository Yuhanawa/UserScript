视频封面获取按钮, ["www.bilibili.com/video"], {
    '已开启$on': () => {
        intervalAfterLoad(() => {
            const toolbar = document.querySelector('#arc_toolbar_report .video-toolbar-right:not([video_cover])');
            if (!toolbar) return;

            toolbar.setAttribute('video_cover', 'true');
            const btn = document.createElement('div');
            btn.className = 'video-toolbar-right-item';
            btn.innerHTML = `<a class="video-toolbar-item-text" target="_blank" href="${unsafeWindow.__INITIAL_STATE__.videoData.pic}">获取封面</a>`;
            toolbar.insertBefore(btn, toolbar.firstChild);
        }, 8000, true);
    },
    '已关闭$off': null,
}