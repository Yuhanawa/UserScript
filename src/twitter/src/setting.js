设置按钮, [/./],
{
    已开启$on: (f) => {
        delay(() => {
            UrlListener((i) => {
                f.add(f)
            })
        }, 200)
    },
    已关闭$off: null,
}, add: (f) => {
    const footer = document.querySelector('nav.css-1dbjc4n.r-18u37iz.r-1w6e6rj.r-ymttw5');
    if (footer && !footer.hasFilterSetting) {
        const a = document.createElement("a");
        a.href = "https://yuhan-script-config.netlify.app/?menuKey=twitter";
        a.innerText = "⚙️ Filter Setting";
        a.target = "_blank";
        a.style = `margin: 4px;font-size: 16px;color: #4ea1db;opacity: 0.75;`
        footer.append(a);
        footer.hasFilterSetting = true
    } else {
        setTimeout(() => {
            f.add(f);
        }, 100);
    }
}
