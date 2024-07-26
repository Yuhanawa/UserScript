({
    runAlways: true,
    value: () => {
        onload(() => {
            console.log("test");
            const aside = document.getElementsByClassName('blog_container_aside')[0]
            if (aside == undefined || aside == null) {
                setTimeout(fn, 150);
                return;
            }

            if (getComputedStyle(aside).display === 'none') {
                style(`#mainBox { width: auto !important; }`);
                style(`main { margin: 0px 6px 40px 6px }`);
                if (get('width')) {
                    style(`#mainBox > main{ width: 100% !important; }`);
                    style(`body #mainBox{ width: ${get('width_value', '82')}% !important; }`);
                }
            }
        })

        return $STYLE(base);
    }
})
