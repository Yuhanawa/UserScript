设置按钮, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
    '已开启$on': () => {
        timeoutAfterLoad(() => {
            const articleTitleBox = document.getElementsByClassName('article-title-box')[0];
            const settingButton = document.createElement('a');
            settingButton.innerText = "脚本设置"
            settingButton.href = 'https://yuhanawa.github.io/tools/userscriptconfig/';
            settingButton.target = '_blank';
            settingButton.style = `float: right;margin: 12px;font-size: 20px;text-decoration: underline !important;color: #4ea1db;`
            articleTitleBox.insertAdjacentElement("afterbegin", settingButton);
            

        }, 200)
    },
    '已关闭$off': null
}