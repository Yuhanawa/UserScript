name: AutoPager
match:
- 'www.cnblogs.com'
directlyRun: true
    ,
    () => {
        timeoutOnLoad(() => {
            if (!document.querySelector(".pager")||document.querySelector("#Autopage_number")) return

            var timeout = 0
            setInterval(() => { if (timeout > 0) timeout-- }, 1000);
            unsafeWindow.nextPage = nextPage

            setInterval(() => {
                console.log((document.body.offsetHeight - window.scrollY - window.innerHeight) < window.innerHeight);
                if ((document.body.offsetHeight - window.scrollY - window.innerHeight) < window.innerHeight * 2) {
                    nextPage();
                }
            }, 2000);


            function nextPage () {
                if (timeout > 0) return
                timeout = 3;

                GM_xmlhttpRequest({
                    url: document.querySelector(".pager > a:nth-last-child(1)").href,
                    method: 'GET',
                    overrideMimeType: `text/html; charset=${document.characterSet || document.charset || document.inputEncoding}`,
                    headers: {
                        'x-requested-with': 'XMLHttpRequest',
                        'Referer': location.href,
                        'User-Agent': navigator.userAgent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml'
                    },
                    timeout: 10000,
                    onload: (response) => {
                        try {
                            const doc = (new DOMParser()).parseFromString(response.responseText, "text/html");//"text/html"
                            const articles = doc.querySelectorAll('#post_list>article')
                            for (const article of articles) {
                                document.querySelector('#post_list').insertAdjacentElement('beforeend', article)
                            }
                            document.querySelector('.pager').parentNode.replaceChild(doc.querySelector('.pager'), document.querySelector('.pager'))

                        } catch (e) {
                            console.error('ERR', e, response.responseText);
                        }
                    },
                    onerror: (response) => {
                        console.error(`ERR: URL:${url}`, response);
                    },
                    ontimeout: (response) => {
                        console.warn(`TIMEOUT: URL:${url}`, response);
                    }
                });
            }
        }, 400)
    }