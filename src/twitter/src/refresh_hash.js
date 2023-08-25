手动更新规则, [/./],
{
    点我更新$ready: () => {
    },
    以开始更新$running: () => {
        $set("twitter_feed_rule_hash", 0);
        $set("twitter_refresh_hash", "ready");
    },
}