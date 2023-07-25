移除空白卡片(广告被插件屏蔽后的区域)(卡顿)(不建议开启)(需安装广告屏蔽插件), ["www.bilibili.com"], {
    '已关闭$off': null,
    '已开启$on': () => {
        timeoutOnLoad(() => {
            for (const card of document.getElementsByClassName("feed-card")) {
                if (card.getElementsByClassName('🎇filtered').length > 0) 
                    card.classList.add("🎇filtered");
            }            
        },2400)     
        intervalOnLoad(() => {
            for (const card of document.getElementsByClassName("bili-video-card")) {
                try {
                    if (card.classList.contains("🎇checked")) continue;
                    // 标记元素已处理
                    card.classList.add("🎇checked");

                    if ((card.getElementsByClassName('bili-video-card__wrap')[0] == null && card.getElementsByClassName('hide').length > 0 ) || card.getElementsByClassName('bili-video-card__wrap')[0].style.display === 'none') {
                        card.classList.add("🎇filtered");
                    }
                } catch(e) {
                    card.classList.add("🎇checked");
                }
            }
        }, 2000)

        return `.🎇filtered{display:none;}`;
    }
}