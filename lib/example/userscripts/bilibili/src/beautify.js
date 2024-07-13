({
  name: '(美化总开关)样式美化 & 自定义背景等',
  pages: ["home"],
  showInMenu: true,
  value: () => {
    if (location.href === 'https://www.bilibili.com/' && get('bilibili_beautify_work_on_index', 'on') === 'off') return;

    if (get('bilibili_video_radius')) {
      style($STYLE('beautify.video'))
    }
    if (get('bilibili_background')) {
      style(`html,:root{--background:url(${get('bilibili_background_value')})}`)
    }
    return $STYLE('beautify')
  }
})