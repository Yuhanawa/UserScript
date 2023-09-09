屏蔽器总开关, [/./],
{
    已开启$on: (f) => {
        const filter = () => {
            if ($get("twitter_white_fo","off")==="on" &&
                (
                    window.location.href.includes("foryou")
                   ||window.location.href.includes("follow")
                )
               ) return
            
            const articles = document.querySelectorAll('article:not([data-filter-checked])');
            for (const article of articles) {
                try {
                    article.setAttribute("data-filter-checked", "true")

                    const articleText = article.innerText
                    const retweet = article.querySelector("span[data-testid='socialContext'] > span >span")?.innerText
                    const name = article.querySelector("div[data-testid='User-Name'] div div a")?.innerText
                    const id = article.querySelector("div[data-testid='User-Name'] a > div > span")?.innerText
                    const content = article.querySelector("div[lang]")?.innerText ?? "以下媒体可能包含敏感内容。"

                    for (const rule of rules) {
                        if (
                            rule.id?.includes(id)
                            || rule.name?.some(i => name?.includes(i))
                            || rule.name?.some(i => retweet?.includes(i))
                            || rule.content?.some(i => content?.includes(i))
                            || rule.article?.some(i => articleText?.includes(i))
                        ) {
                            article.style.display = "none";
                            if ($get("twitter_show_note", true)) {
                                const note = document.createElement("div");
                                note.innerHTML = `<div class="note-tweet">该推文已被<a href="" target="_blank">屏蔽器</a>通过⌊${rule['rule-name']}⌉规则屏蔽,点击显示推文(你可以通过设置不再显示该提示)</div>`;
                                note.onclick = () => { article.style.display = "block"; note.style.display = "none" };
                                article.parentElement.appendChild(note)
                            }
                            break;
                        }
                    }
                } catch (error) {
                    // 忽略错误
                    // console.error(error);
                }
            }
        }
        const wait = () => {
            if (!document.querySelector('main')) {
                setTimeout(wait, 200);
                return;
            }

            new MutationObserver(filter)
                .observe(document.querySelector('main'),
                    { attributes: false, childList: true, subtree: true }
                );
        }
        wait();

        return $SASS(main)
    }, 已关闭$off: null,
}
