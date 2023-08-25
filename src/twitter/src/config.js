$, ['yuhan-script-config.netlify.app', 'twitter.com', 'x.com'], () => {
    delay(async () => {
        let callback_num = 0;
        const getText = (url, callback) => {
            callback_num += 1
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    callback(response.responseText);
                    callback_num -= 1
                }
            });
        }

        loadRule($get("twitter_user_rule"))

        const feed = $get("twitter_feed_rule").trim();
        const feed_hash = feed.hashCode();

        let ruleObj = $get("twitter_feed_rule_cache", {})
        if (feed_hash !== $get("twitter_feed_rule_hash")) {
            $set("twitter_feed_rule_hash", feed_hash);
            $set("twitter_feed_rule_cache", {})
            ruleObj = {}


            for (let url of feed.split('\n')) {
                url = url.trim();
                if (url.length === 0) continue

                console.log(url);
                getText(url, (str) => {
                    ruleObj[url] = str
                    $set("twitter_feed_rule_cache", ruleObj);
                });
            }

            $set("twitter_feed_rule_cache_last_check", Date.now())
        }
        let lastCheckTime = $get("twitter_feed_rule_cache_last_check", 0)

        for (const key of Object.keys(ruleObj)) {
            loadRule(ruleObj[key]);
        }
        for (const url of Object.keys(ruleObj)) {
            // 一天检查一次
            if (Date.now() - lastCheckTime > 24 * 60 * 60 * 1000) {
                getText(url, (str) => {
                    ruleObj[url] = str
                    $set("twitter_feed_rule_cache", ruleObj);
                });
            }
        }
        if (Date.now() - lastCheckTime > 24 * 60 * 60 * 1000) {
            const save = () => {
                if (callback_num === 0) {
                    $set("twitter_feed_rule_cache_last_check", Date.now());
                    $set("twitter_feed_rule_cache", ruleObj);
                } else {
                    setTimeout(() => save(), 1000);
                }
            }
        }
    }, 200)
}