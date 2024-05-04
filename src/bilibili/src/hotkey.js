快捷键增强, ["bilibili.com"], {
    '已关闭$off': null,
    '已开启$on': () => {
        // TODO 烂代码 需重构
        if (location.href.match('www.bilibili.com/video')) {
            intervalAfterLoad(() => {
                const img_view = document.querySelector('.reply-view-image')
                if (img_view == undefined) return;

                img_view.addEventListener('keydown', (e) => {
                    if (e.key == 'Escape')  img_view.getElementsByClassName('close-container')[0].click();
                    if (e.key == 'a' || e.key == 'ArrowLeft')  img_view.getElementsByClassName('last-image')[0].click();
                    if (e.key == 'd' || e.key == 'ArrowRight')  img_view.getElementsByClassName('next-image')[0].click();
                })
            }, 400);
        }
    },
  }