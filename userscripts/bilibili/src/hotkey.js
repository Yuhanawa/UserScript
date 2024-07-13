({
    name: '快捷键增强',
    pages: ["video"],
    showInMenu: false,
    value: () => {
        // TODO 烂代码 需重构
        delay(() => {
            const img_view = document.querySelector('.reply-view-image')
            if (img_view == undefined) return;

            img_view.addEventListener('keydown', (e) => {
                if (e.key == 'Escape') img_view.getElementsByClassName('close-container')[0].click();
                if (e.key == 'a' || e.key == 'ArrowLeft') img_view.getElementsByClassName('last-image')[0].click();
                if (e.key == 'd' || e.key == 'ArrowRight') img_view.getElementsByClassName('next-image')[0].click();
            })
        }, 1200, { loop: true });
    }
})
