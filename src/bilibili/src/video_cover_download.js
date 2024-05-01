视频封面下载, ["www.bilibili.com/video", "www.bilibili.com/read"], {
    '已开启$on': () => {
        intervalAfterLoad(() => {
            const toolbar = document.querySelector('#arc_toolbar_report .video-toolbar-right:not([video_cover])');
            if (!toolbar) {
                return;
            }

            toolbar.setAttribute('video_cover', 'true');

            // const btn = document.createElement('div');
            // btn.className = 'video-toolbar-right-item';
            // btn.innerHTML = '<span class="video-toolbar-item-text">下载封面</span>';
            // toolbar.insertBefore(btn, toolbar.firstChild);

            // btn.addEventListener('click', () => {
            //     // GM_download(unsafeWindow.__INITIAL_STATE__.videoData.pic);
            // });

            const btn = document.createElement('div');
            btn.className = 'video-toolbar-right-item';
            btn.innerHTML = `<a class="video-toolbar-item-text" target="_blank" href="${unsafeWindow.__INITIAL_STATE__.videoData.pic}">下载封面</a>`;
            toolbar.insertBefore(btn, toolbar.firstChild);


        }, 8000);
    },
    '已关闭$off': null,
}