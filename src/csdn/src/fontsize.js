调整字体大小, ['csdn.net'], {
    '已开启$on': () => {
        style(`body{--font-size-title: ${get('csdn_font_size_title', '32px')};--font-size-p: ${get('csdn_font_size_p', '18px')};--font-size-h2: ${get('csdn_font_size_h2', '24px')};--font-size-code: ${get('csdn_font_size_code', '15px')};}`)
        return $SASS(fontsize)
    },
    '已关闭$off': null
}