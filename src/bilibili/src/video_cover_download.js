视频封面获取按钮, ["www.bilibili.com/video"], {
    '已开启$on': () => {
        old_pic = ""
        timeoutAfterLoad(()=>{
            setInterval(() => {
                if (unsafeWindow.__INITIAL_STATE__===undefined) return
                pic = unsafeWindow.__INITIAL_STATE__.videoData.pic;
                if (old_pic === pic) return;
                old_pic = pic;
                setTimeout(() => {
                    const toolbar = document.querySelector('#arc_toolbar_report .video-toolbar-right');
                    if (!toolbar) return;
                    if (!toolbar.querySelector('.video-tool-more')) {
                        // 等待加载完全 否则会出bug
                        old_pic = "";
                        return;
                    }
    
                    toolbar.querySelectorAll('.video-tool-getpic').forEach(e => e.remove());
    
                    const btn = document.createElement('div');
                    btn.className = 'video-toolbar-right-item video-tool-getpic';
                    btn.innerHTML = `<a class="video-toolbar-item-text" target="_blank" href="${pic}">获取封面</a>`;
                    toolbar.insertBefore(btn, toolbar.firstChild);
                }, 300);
    
            }, 1800);
        },2500)
        return $SASS('video_cover_download.sass')
    },
    '已关闭$off': null,
}