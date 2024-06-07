({
  name: '(美化总开关)样式美化 & 自定义背景等',
  match: ["www.bilibili.com"],
  showInMenu: true,
  value: () => {
    if (location.href === 'https://www.bilibili.com/' && get('bilibili_beautify_work_on_index', 'on') === 'off') return;

    if (get('bilibili_eye_protection_cover', 'on') === 'on') {
      style('html,:root{--bodybackground: ' +
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? get('bilibili_eye_protection_cover_dark', `rgb(0 0 0 / 23%)`)
          : get('bilibili_eye_protection_cover_light', `rgb(102 204 255 / 23%)`)) + '}'
      )
    } else {
      style('html,:root{--bodybackground:transparent}')
    }

    if (get('bilibili_video_radius', 'on') === 'on') {
      style($STYLE('beautify.video'))
    }
    if (get('bilibili_background', 'on') === 'on') {
      style(`html,:root{--background:url(${get('bilibili_background_value')})}`)
    }
    return $STYLE('beautify')
  }
})