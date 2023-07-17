样式美化 | 自定义背景 | 大幅度修改, ["bilibili.com"], {
  '已开启$on': () => {
    if ($get('bilibili_eye_protection_cover', 'on') === 'on') {
      style('html,:root{--bodybackground: ' +
        (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? $get('bilibili_eye_protection_cover_dark', `rgb(0 0 0 / 23%)`)
        : $get('bilibili_eye_protection_cover_light', `rgb(102 204 255 / 23%)`)) + '}'
      )
    } else {
      style('html,:root{--bodybackground:transparent}')
    }

    style(`html,:root{--background:${$get('bilibili_background_value', 'url(//s1.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg.png)')}}`)

    return $SASS(css / beautify.sass)
  }, '已关闭$off': null,
}