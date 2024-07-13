(美化总开关)样式美化 & 自定义背景等, ["www.bilibili.com"], {
  '已开启$on': () => {
    if (location.href === 'https://www.bilibili.com/' && get('bilibili_beautify_work_on_index', 'on') === 'off') return;

    if (get('bilibili_video_radius')) {
      style($SASS('beautify.video.sass'))
    }
    if (get('bilibili_background')) {
      style(`html,:root{--background:url(${get('bilibili_background_value')})}`)
    }
    return $SASS('beautify.sass')
  }, '已关闭$off': null,
}