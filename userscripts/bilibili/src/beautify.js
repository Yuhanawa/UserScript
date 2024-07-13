({
  name: '(美化总开关)样式美化 & 自定义背景等',
  pages: ["home"],
  showInMenu: true,
  value: () => {
    if (location.href === 'https://www.bilibili.com/' && get('beautify_work_on_index')===false) return;

    if (get('video_radius')) {
      style($STYLE('beautify.video_radius'))
    }
    if (get('background')) {
      style(`html,:root{--background:url(${get('background_value')})}`)
    }
    return $STYLE('beautify')
  }
})