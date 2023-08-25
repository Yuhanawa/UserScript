屏蔽器总开关, [/./],
{
    已开启$on: (f) => {
        const filter = () => {
            const articles = document.querySelectorAll('article:not([data-filter-checked])');
            for (const article of articles) {
                article.setAttribute("data-filter-checked", "true")

                const articleText = article.innerText
                const articleTextSplits = article.innerText.split('\n')
                const name = articleTextSplits[0]
                const id = articleTextSplits[1].slice(1)
                const content = article.querySelector("div[lang]")?.innerText ?? "以下媒体可能包含敏感内容。"

                for (const rule of rules) {
                    if (
                        rule.id?.includes(id) ||
                        rule.name?.find(i => name.includes(i)) !== undefined ||
                        rule.content?.find(i => content.includes(i)) !== undefined ||
                        rule.article?.find(i => articleText.includes(i)) !== undefined ||
                        false
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
            }
        }
        const wait = () => {
            if (document.querySelector('main') == null) {
                setTimeout(wait, 200);
            } else {
                const observer = new MutationObserver(() => filter());
                observer.observe(document.querySelector('main'), { attributes: false, childList: true, subtree: true });
            }
        }
        wait();

        return $SASS(main)
    }, 已关闭$off: null,
}
