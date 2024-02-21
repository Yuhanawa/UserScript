
var list = [
    // '<link href="//ing.cnblogs.com/bundles/home_mvc.min.css?v=14sdN4DsEPAQkzc0_eMCL6h9tChtSoS3fXbs-j1aq_g" rel="stylesheet">',
    '<link rel="stylesheet" type="text/css" href="//mention.cnblogs.com/css/mention-simple.css?id=20160613">',
    '<script type="text/javascript" src="//common.cnblogs.com/script/common.js?id=201905-1"></script>',
    '<script src="//ing.cnblogs.com/bundles/home_mvc.js?v=N60FalhWlJFIdLQYhZbYhH5ryG5tiC7IkIQYSWC6V6k"></script>',
    '<script type="text/javascript" src="//mention.cnblogs.com/bundles/mention.js?id=20160729-1226"></script>',
]

// TODO 添加动态页，获取ing信息
function show_ing() {
    for (const i of list)
        document.head.insertAdjacentHTML("beforeend", i);

    getPage("https://ing.cnblogs.com/", {
        onload: (response) => {
            try {
                const doc = (new DOMParser()).parseFromString(response.responseText, "text/html");//"text/html"
                const main = doc.querySelector('#main')
                main.id = 'main_ing'
                document.querySelector('#main_flow').replaceChild(main, document.querySelector('#main_flow>.card'))
            } catch (e) {
                console.error('ERR', e, response.responseText);
            }
        }
    })
}

function getPage(url, obj) {
    GM_xmlhttpRequest({
        url: url,
        method: 'GET',
        overrideMimeType: `text/html; charset=${document.characterSet || document.charset || document.inputEncoding}`,
        headers: {
            'x-requested-with': 'XMLHttpRequest',
            'Referer': location.href,
            'User-Agent': navigator.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml'
        },
        timeout: 10000,
        onerror: (response) => {
            console.error(`ERR: URL:${url}`, response);
        },
        ontimeout: (response) => {
            console.warn(`TIMEOUT: URL:${url}`, response);
        },
        ...obj
    });
}