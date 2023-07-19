视频页宽屏, ["www.bilibili.com/video"], {
    '已开启$on': () => {
        timeoutOnLoad(() => {
            const player = document.getElementById("bilibili-player");
            const playerWarp = document.getElementById("playerWrap");
            const videoTitle = document.getElementsByClassName("video-title")[0];

            let old_title = videoTitle.innerHTML
            let old_position = "old";
            delay(() => {
                let position = window.getComputedStyle(player).position
                if (old_position == position && old_title == videoTitle.innerHTML) return;

                old_position = position
                old_title = videoTitle.innerHTML

                if (position == "relative") {
                    playerWarp.style.width = "120%"
                    playerWarp.style.marginLeft = "7.2%"
                } else {
                    playerWarp.style.width = "auto"
                    playerWarp.style.marginLeft = "0"
                }
                // player.style.width = "auto"
                player.style.height = "auto"

                setTimeout(() => {
                    let width = Math.floor(player.getBoundingClientRect().width);
                    if (width % 2 !== 0) width++;
                    playerWarp.style.width = width + 'px';
                    player.style.height = width/16*9 + 'px';
                }, 200)
            }, 200, true)
        }, 860)
        return $SASS(widescreen.sass)
    }, '已关闭$off': null,
}