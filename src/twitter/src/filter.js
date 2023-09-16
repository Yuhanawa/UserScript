屏蔽器总开关, [/./],
{
    已开启$on: (f) => {
        const filter = () => {
            if (!$get("twitter_block_on_home", "on") === "on" && (location.href.includes("twitter.com/home") || location.href.includes("x.com/home"))) return

            const articles = document.querySelectorAll('article:not([data-filter-checked])');
            for (const article of articles) {
                try {
                    article.setAttribute("data-filter-checked", "true")

                    const id = article.querySelector("div[data-testid='User-Name'] a > div > span")?.innerText.substring(1)

                    if (whiteList.has(id)) continue

                    if (!blackList.has(id)) {

                        const articleText = article.innerText
                        const retweet = article.querySelector("span[data-testid='socialContext'] > span >span")?.innerText
                        const text = article.querySelector("div[lang]")?.innerText ?? "以下媒体可能包含敏感内容。"

                        try {
                            for (const rule of rules) {
                                if (check(rule, id, 'name', retweet) || check(rule, id, 'text', text) || check(rule, id, 'all', articleText)) {
                                    break;
                                }
                            }                            
                        } catch (error) {
                        }
                    }

                    
                    // console.log(whiteList);
                    // console.log(blackList);
                    if (blackList.has(id)) {
                        article.style.display = "none";
                        if ($get("twitter_show_note", true)) {
                            const note = document.createElement("div");
                            note.innerHTML = `<div class="note-tweet">推文已被<a href="" target="_blank">屏蔽器</a>通过⌊${blackList.get(id).rule}⌉(${blackList.get(id).type})规则屏蔽,点击显示推文(你可以通过设置不再显示该提示)</div>`;
                            note.onclick = () => { article.style.display = "block"; note.style.display = "none" };
                            article.parentElement.appendChild(note)
                        }
                        continue
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
