极简化, [/blog\.csdn\.net(\/.*)?\/article\/details./],
{
    '已开启$on': () => {
        timeoutOnLoad(() => {
            // 移除右侧多余悬浮按钮 仅保留回到顶部按钮
            try {
                document.getElementsByClassName("option-box")[0].remove();
                document.getElementsByClassName("option-box")[0].remove();
                document.getElementsByClassName("option-box")[0].remove();                
            } catch{}
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

        if ($get('csdn_width','on') === 'on') {
            style(`#mainBox > main{ width: 100% !important; }`);
            style(`body #mainBox{ width: ${$get('csdn_width_value','82')}% !important; }`);
        }

        return $CSS(csdn.css)
    }, '已关闭$off': null
}