免登录复制, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
    '已开启$on': () => {
        timeoutOnLoad(() => {

            // 修改复制按钮
            document.querySelectorAll(".hljs-button").forEach((e) => {
                e.setAttribute("data-title", "点击复制");
                e.classList.remove('signin');
                e.removeAttribute("onclick");
                e.addEventListener("click", () => {
                    e.setAttribute("data-title", " ");
                    navigator.clipboard.writeText(e.parentNode.innerText);
                    e.setAttribute("data-title", "复制成功");
                    setTimeout(() => e.setAttribute("data-title", "点击复制"), 1200);
                })
            }, 250)

            // 复制功能
            document.querySelector('.blog-content-box').addEventListener("copy", (e) => {
                e.stopPropagation()
                e.preventDefault()

                navigator.clipboard.writeText(window.getSelection().toString())
            }, true)
            document.addEventListener("keydown", (e) => {
                if (e.ctrlKey && e.keyCode == 67) {
                    e.stopPropagation()
                    e.preventDefault()

                    navigator.clipboard.writeText(window.getSelection().toString())
                }
            }, true);



            document.oncopy = null
            window.oncopy = null

        }, 500)

        return $SASS('copy')
    },
    '已关闭$off': null
}
