视频页宽屏, ["www.bilibili.com/video"], {
    '已开启$on': () => {
        timeoutOnLoad(() => {
            const player = document.getElementById("bilibili-player");
            const playerWarp = document.getElementById("playerWrap");
            const video = player.querySelector("video");
            const updateText = document.getElementsByClassName("pubdate-text")[0];
            let miniPlayerWarp = document.getElementsByClassName("bpx-player-mini-warp")[0];

            let old_size = {
                height: playerWarp.getBoundingClientRect().height,
                width: playerWarp.getBoundingClientRect().width
            }

            let old_isFullScreen = (Boolean)(document.fullscreenElement)
            let old_text = updateText.innerHTML
            let old_position = "old";
            let old_miniPlayerWarpDisplay = "none";
            if (miniPlayerWarp != null) old_miniPlayerWarpDisplay = miniPlayerWarp.style.display
            delay(() => {
                let position = window.getComputedStyle(player).position
                let miniPlayerWarpDisplay = "none";
                miniPlayerWarp = document.getElementsByClassName("bpx-player-mini-warp")[0];
                if (miniPlayerWarp != null) miniPlayerWarpDisplay = miniPlayerWarp.style.display
                if (old_position == position && old_text == updateText.innerHTML && old_miniPlayerWarpDisplay == miniPlayerWarpDisplay && old_isFullScreen == (Boolean)(document.fullscreenElement)) return;

                if (miniPlayerWarpDisplay != 'none') {
                    // 小窗
                    playerWarp.style.height = old_size.height + "px";
                    playerWarp.style.width = old_size.width + "px";
                    video.style.maxHeight = '';
                } else {
                    playerWarp.style.height = 'auto';
                    playerWarp.style.width = 'auto';
                    if (document.fullscreenElement) {
                        // 全屏
                        playerWarp.style.width = "auto"
                        playerWarp.style.marginLeft = "0"
                        player.style.width = "100%"
                        video.style.maxHeight = '100%';                        
                    } else if (player.classList.contains('mode-webscreen')) {
                        // 网页全屏
                        playerWarp.style.width = "auto"
                        playerWarp.style.marginLeft = "0"
                        player.style.width = "100%"
                        video.style.maxHeight = '100%';
                    } else if (position == "relative") {
                        // 剧场模式
                        playerWarp.style.width = "120%"
                        playerWarp.style.marginLeft = "7.2%"
                        player.style.width = "auto"
                        video.style.maxHeight = '80vh';
                    } else {
                        // 默认
                        playerWarp.style.width = "auto"
                        playerWarp.style.marginLeft = "0"
                        player.style.width = "100%"
                        video.style.maxHeight = '80vh';
                    }

                    old_position = position
                    old_isFullScreen = (Boolean)(document.fullscreenElement)
                    old_text = updateText.innerHTML
                    old_miniPlayerWarpDisplay = miniPlayerWarpDisplay
                    old_size = {
                        height: playerWarp.getBoundingClientRect().height,
                        width: playerWarp.getBoundingClientRect().width
                    }
                }
            }, 200, true)
        }, 500)
        return $SASS(widescreen.sass)
    }, '已关闭$off': null,
}