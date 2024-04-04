$, ['csdn.net'], () => {

    if ($get('csdn_beautify', true)) {
        if (false) {
            // 可能存在问题，临时删除
        }
    }

    fn = () => {
        const aside = document.getElementsByClassName('blog_container_aside')[0]
        if (aside == undefined || aside == null) {
            setTimeout(fn, 150);
            return;
        }

        if (getComputedStyle(aside).display === 'none') {
            style(`#mainBox { width: auto !important; }`);
            style(`main { margin: 0px 6px 40px 6px }`);
            if ($get('csdn_width', 'on') === 'on') {
                style(`#mainBox > main{ width: 100% !important; }`);
                style(`body #mainBox{ width: ${$get('csdn_width_value', '82')}% !important; }`);
            }
        }
    }
    onload(fn)




    return $SASS(base);
}