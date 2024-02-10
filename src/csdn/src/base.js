$, ['csdn.net'], () => {
    if ($get('csdn_beautify', true)) {
        timeoutOnLoad(() => {
            // 移动文字标签位置
            const taghtml = document.getElementsByClassName("blog-tags-box")[0].outerHTML + "";
            document.getElementsByClassName("blog-tags-box")[0].remove();
            document.getElementsByClassName("article-bar-top")[0].innerHTML = document.getElementsByClassName("article-bar-top")[0].innerHTML + taghtml;
            // 简介时间格式
            document.getElementsByClassName("time")[0].innerHTML = document.getElementsByClassName("time")[0].innerHTML
                .replace("于&nbsp;", "").replace("&nbsp;发布", "");
            // 刷新底部工具栏位置 使其居中
            document.getElementsByClassName("left-toolbox")[0].style.left = "auto";
            // 删除不美观的冒号
            document.getElementsByClassName("blog-tags-box")[0].innerHTML = document.getElementsByClassName("blog-tags-box")[0].innerHTML.replaceAll("：", "");
        }, 100)
    }

    timeoutOnLoad(() => {
        const aside = document.getElementsByClassName('blog_container_aside')[0]
        if (getComputedStyle(aside).display === 'none') {
            style(`#mainBox { width: auto !important; }`);
            style(`main { margin: 0px 6px 40px 6px }`);
            if ($get('csdn_width', 'on') === 'on') {
                style(`#mainBox > main{ width: 100% !important; }`);
                style(`body #mainBox{ width: ${$get('csdn_width_value', '82')}% !important; }`);
            }
        }
    }, 200)




    return $SASS(base);
}