({
	runAlways: true,
	value: () => {
		delay(async () => {
			let callback_num = 0;

			const getText = (url, callback) => {
				callback_num += 1;
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					headers: {
						"Content-Type": "application/json",
					},
					onload: (response) => {
						callback(response.responseText);
						callback_num -= 1;
					},
				});
			};
			const onupdate = (reload) => {
				if (callback_num === 0) {
					set("feed_rule_cache_last_check", Date.now());
					set("feed_rule_cache", ruleObj);

					if (reload) location.reload();

					const btn = document.createElement("button");
					btn.onclick = () => location.reload();
					btn.className = "note-update";
					btn.innerText = "屏蔽器规则更新完成|刷新即可生效|点击刷新";
					document.body.insertAdjacentElement("beforeend", btn);
				} else {
					setTimeout(() => onupdate(reload), 1000);
				}
			};

			const user_rule = parseRule(get("user_rule"));
			if (user_rule) {
				user_rule["rule-name"] = "自定义用户规则";
				rules.add(user_rule);
			}

			const feed = get("feed_rule").trim();
			const feed_hash = feed.hashCode();

			let ruleObj = get("feed_rule_cache", {});
			if (feed_hash !== get("feed_rule_hash")) {
				set("feed_rule_hash", feed_hash);
				set("feed_rule_cache", {});
				ruleObj = {};

				const btn = document.createElement("button");
				btn.onclick = () => location.reload();
				btn.className = "note-update";
				btn.innerText = "屏蔽器规则已清空|正在重新获取规则";
				btn.style.zIndex = "10086";
				document.body.insertAdjacentElement("beforeend", btn);

				for (let url of feed.split("\n")) {
					url = url.trim();
					if (url.length === 0) continue;

					getText(url, (str) => {
						ruleObj[url] = str;
						set("feed_rule_cache", ruleObj);
					});
				}

				setTimeout(() => onupdate(true), 1200);
				set("feed_rule_cache_last_check", Date.now());
			}
			const lastCheckTime = get("feed_rule_cache_last_check", 0);

			for (const key of Object.keys(ruleObj)) {
				loadRule(ruleObj[key]);
			}
			// 一天检查一次
			if (Date.now() - lastCheckTime > 24 * 60 * 60 * 1000) {
				for (const url of Object.keys(ruleObj)) {
					getText(url, (str) => {
						ruleObj[url] = str;
						set("feed_rule_cache", ruleObj);
					});
				}
				setTimeout(() => onupdate(), 800);
			}
		}, 250);
	},
});
