视频页样式微调, ["www.bilibili.com/video"], {
  '已开启$on': (feature) => {
    timeoutOnLoad(() => {
      console.log(feature);
      window.addEventListener('scroll', () => feature.fn())
    }, 800)
    return $SASS(css / video_beautify.sass)
  }, '已关闭$off': null,
}, fn: () => {
  let playerWrap = document.getElementById("playerWrap");
  let width = Math.floor(playerWrap.getBoundingClientRect().width);
  if (width % 2 !== 0) width++;
  playerWrap.style.width = width + 'px';
  playerWrap.style.height = playerWrap.getBoundingClientRect().height + 'px';
  window.removeEventListener('scroll', () => feature.fn())
}