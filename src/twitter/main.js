String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function getCookie(cname) {
    const name = cname + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; ++i) {
        const c = ca[i].trim()
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

function blockUserByScreenName(screen_name) {
    const xhr = new XMLHttpRequest();

    // Open request
    xhr.open('POST', 'https://api.twitter.com/1.1/blocks/create.json');
    xhr.withCredentials = true

    // Set request headers
    xhr.setRequestHeader('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
    xhr.setRequestHeader('X-Twitter-Auth-Type', 'OAuth2Session');
    xhr.setRequestHeader('X-Twitter-Active-User', 'yes');
    xhr.setRequestHeader('X-Csrf-Token', getCookie('ct0'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send request
    xhr.send(`screen_name=${screen_name}`);
    console.log(`已为您屏蔽用户 ${screen_name}`);
}
async function blockUserById(id, display) {
    const xhr = new XMLHttpRequest();

    // Open request
    xhr.open('POST', 'https://api.twitter.com/1.1/blocks/create.json');
    xhr.withCredentials = true

    // Set request headers
    xhr.setRequestHeader('Authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
    xhr.setRequestHeader('X-Twitter-Auth-Type', 'OAuth2Session');
    xhr.setRequestHeader('X-Twitter-Active-User', 'yes');
    xhr.setRequestHeader('X-Csrf-Token', getCookie('ct0'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Send request
    xhr.send(`user_id=${id}`);
    console.log(`已为您屏蔽用户id ${id}, 用户名:${display ?? "未知"}`);
}

function check(rule, screen_name, key, target) {
    if (!target) return false;

    if (rule[key]?.some(i => target?.includes(i))) {
        blackList.set(screen_name, {
            // id: id,
            screen_name: screen_name,
            rule: rule['rule-name'],
            type: key,
        })
    } else if (rule[key + "-reg"]?.some(i => i.test(target ?? ''))) {
        blackList.set(screen_name, {
            // id: id,
            screen_name: screen_name,
            rule: rule['rule-name'],
            type: key + "-reg",
        })
    } else return false

    return true

}

unsafeWindow.addEventListener('load', function () {
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {

        if (url.startsWith('https://twitter.com/i/api/2/notifications/all.json')) {
            this.addEventListener('load', function () {
                // console.log('拦截到请求:', method, url);
                // console.log('响应内容:', this.responseText);


                {

                    if (this.responseText?.globalObjects?.users) {
                        const users = this.responseText.globalObjects.users
                        for (var user of users) {
                            var id = user.id_str
                            var name = user.name
                            var screen_name = user.screen_name
                            var location = user.location
                            var description = user.description
                            var created_at = user.created_at
                            var followers_count = user.followers_count
                            var friends_count = user.friends_count
                            var following = user.following
                            var url = user.url

                            if (whiteList.has(screen_name) || blackList.has(screen_name)) return;

                            if (following) {
                                whiteList.add(screen_name)
                                return
                            }



                            for (const rule of rules) {
                                if (rule["id_num"]?.some(i => id === i)) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id-num',
                                    })
                                } else if (rule["id"]?.some(i => screen_name === i)) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id',
                                    })
                                } else if (rule["id-reg"]?.some(i => i.test(screen_name ?? ''))) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id-reg',
                                    })
                                } else if (check(rule, screen_name, 'name', name) || check(rule, screen_name, 'bio', description) || check(rule, screen_name, 'location', location)) {
                                    /* checking */
                                } else continue

                                break
                            }

                        }
                    }
                }
            })
        } else if (url.startsWith('https://twitter.com/i/api/graphql')) {
            // console.log("拦截到请求:", method, url);

            this.addEventListener('load', function () {

                if (!this.responseText.includes('threaded_conversation_with_injections_v2')) {
                    return
                }

                let instructions = JSON.parse(this.responseText).data.threaded_conversation_with_injections_v2.instructions;

                for (entry of instructions.filter(i => i.entries).map(i => i.entries)) {
                    for (content of entry.filter(i => i.content).map(i => i.content)) {
                        let items = [];
                        if (content.itemContent != undefined) {
                            items = [content?.itemContent?.tweet_results?.result?.core]
                        } else if (content.items != undefined) {
                            items = content.items.filter(i => i.item?.itemContent?.tweet_results?.result?.core).map(i => i.item.itemContent.tweet_results.result.core)
                        }

                        for (const core of items) {
                            if (core == null || core == undefined) {
                                continue
                            }
                            let legacy = core.user_results.result.legacy

                            let id = core.user_results.result.rest_id
                            let name = legacy.name
                            let created_at = legacy.created_at
                            let description = legacy.description
                            let followers_count = legacy.followers_count
                            let location = legacy.location
                            let screen_name = legacy.screen_name
                            let following = legacy.following ?? false


                            for (const rule of rules) {
                                if (rule["id_num"]?.some(i => id === i)) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id-num',
                                    })
                                    if ($get('twitter_auto_block', 'on') === 'on') blockUserById(id, screen_name)
                                } else if (rule["id"]?.some(i => screen_name === i)) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id',
                                    })
                                    if ($get('twitter_auto_block', 'on') === 'on') blockUserById(id, screen_name)
                                } else if (rule["id-reg"]?.some(i => i.test(screen_name ?? ''))) {
                                    blackList.set(screen_name, {
                                        id: id,
                                        screen_name: screen_name,
                                        rule: rule['rule-name'],
                                        type: 'id-reg',
                                    })
                                } else if (check(rule, screen_name, 'name', name) || check(rule, screen_name, 'bio', description) || check(rule, screen_name, 'location', location)) {
                                    /* checking */
                                } else continue

                                break
                            }
                        }
                    }
                }
            })
        }

        originalOpen.apply(this, arguments);
        // console.log(blackList);
    };
});

const urlListenCallbacks = []
function UrlListener(callback) {
    urlListenCallbacks.push(callback)
}
let old_url = "";
setInterval(() => {
    if (old_url != window.location.href) {
        urlListenCallbacks.forEach(callback => callback(
            {
                old_url: old_url,
                new_url: window.location.href
            }
        ))
        old_url = window.location.href
    }
}, 500)

const rules = new Set();
const whiteList = new Set();
const blackList = new Map();

function loadRule(str) {
    if (!str || str.trim() === '') return;
    let key;
    const rule = {};
    str.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('#')) {
            key = line.slice(1);
            rule[key] = [];
            rule[key + "-reg"] = [];
        } else {
            if (line.startsWith('/') && line.endsWith('/'))
                rule[key + "-reg"].push(new RegExp(line.slice(1, line.length - 1)))
            else
                rule[key].push(line);
        }
    });
    rules.add(rule);
}
