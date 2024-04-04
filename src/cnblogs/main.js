
function receiveMessage(event) {
    const data = event.data
    switch (data.type) {
        case "resizeIframe":
            document.getElementById("ing_iframe").style.height = `${data.height}px`;
            break;

        default:
            break;
    }
}
unsafeWindow.addEventListener("message", receiveMessage, false);

function show_ing_iframe() {
    if (document.getElementById("ing_iframe")) return;
    timeoutOnLoad(() => {
        const iframe = document.createElement('iframe')
        iframe.id = "ing_iframe"
        iframe.src = "https://ing.cnblogs.com/"
        document.querySelector('#main_flow').replaceChild(iframe, document.querySelector('#main_flow>.card'))
    }, 50)
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