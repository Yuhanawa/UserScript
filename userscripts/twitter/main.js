String.prototype.hashCode = function () {
	let hash = 0;
	let i;
	let chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

function showToast(message) {
	const toast = document.createElement("div");
	toast.classList.add("toast");
	toast.textContent = message;

	setTimeout(() => {
		toast.classList.add("toast-active");
		setTimeout(() => {
			toast.classList.add("hide");
			setTimeout(() => {
				toast.remove();
			}, 3500);
		}, 3500);
	}, 500);

	document.body.appendChild(toast);
}

function getCookie(cname) {
	const name = `${cname}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; ++i) {
		const c = ca[i].trim();
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function blockUserByScreenName(screen_name) {
	const xhr = new XMLHttpRequest();

	// Open request
	xhr.open("POST", "https://api.twitter.com/1.1/blocks/create.json");
	xhr.withCredentials = true;

	// Set request headers
	xhr.setRequestHeader(
		"Authorization",
		"Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
	);
	xhr.setRequestHeader("X-Twitter-Auth-Type", "OAuth2Session");
	xhr.setRequestHeader("X-Twitter-Active-User", "yes");
	xhr.setRequestHeader("X-Csrf-Token", getCookie("ct0"));
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Send request
	xhr.send(`screen_name=${screen_name}`);
	console.log(`已为您自动屏蔽用户 ${screen_name}`);
	showToast(`已为您自动屏蔽用户 ${screen_name}`);
}
async function blockUserById(id, display) {
	const xhr = new XMLHttpRequest();

	// Open request
	xhr.open("POST", "https://api.twitter.com/1.1/blocks/create.json");
	xhr.withCredentials = true;

	// Set request headers
	xhr.setRequestHeader(
		"Authorization",
		"Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
	);
	xhr.setRequestHeader("X-Twitter-Auth-Type", "OAuth2Session");
	xhr.setRequestHeader("X-Twitter-Active-User", "yes");
	xhr.setRequestHeader("X-Csrf-Token", getCookie("ct0"));
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Send request
	xhr.send(`user_id=${id}`);
	console.log(`已为您自动屏蔽用户id ${id}, 用户名:${display ?? "未知"}`);
	showToast(`已为您自动屏蔽用户id ${id} ${display ? `用户名:${display}` : "(通过id精准匹配)"}`);
}

function check(rule, screen_name, key, target, notShowNote) {
	if (!target) return false;

	if (rule[key]?.some((i) => target?.includes(i))) {
		blackList.set(screen_name, {
			// id: id,
			screen_name: screen_name,
			rule: rule["rule-name"],
			type: key,
			notShowNote: notShowNote,
		});
	} else if (rule[`${key}-reg`]?.some((i) => i.test(target ?? ""))) {
		blackList.set(screen_name, {
			// id: id,
			screen_name: screen_name,
			rule: rule["rule-name"],
			type: `${key}-reg`,
			notShowNote: notShowNote,
		});
	} else return false;

	return true;
}

unsafeWindow.addEventListener("load", () => {
	if (!location.host.includes("x.com") && !location.host.includes("twitter.com")) return;

	const originalOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (method, url) {
		if (
			// biome-ignore lint/correctness/noConstantCondition: TODO
			url.startsWith("https://twitter.com/i/api/2/notifications/all.json") &&
			false
		) {
			this.addEventListener("load", function () {
				// console.log('拦截到请求:', method, url);
				// console.log('响应内容:', this.responseText);

				if (this.responseText?.globalObjects?.users) {
					const users = this.responseText.globalObjects.users;
					for (const user of users) {
						const id = user.id_str;
						const name = user.name;
						const screen_name = user.screen_name;
						const location = user.location;
						const description = user.description;
						const created_at = user.created_at;
						const followers_count = user.followers_count;
						const friends_count = user.friends_count;
						const following = user.following;
						const url = user.url;

						if (whiteList.has(screen_name) || blackList.has(screen_name)) return;

						if (following) {
							whiteList.add(screen_name);
							continue;
						}

						const auto_block = get("auto_block");
						const auto_block_by_more = auto_block && get("auto_block_by_more");
						if (
							check(internalRule, screen_name, "name", name, auto_block) ||
							check(internalRule, screen_name, "bio", description, auto_block) ||
							check(internalRule, screen_name, "location", location, auto_block) ||
							check(internalRule, screen_name, "url", url, auto_block)
						) {
							if (auto_block) {
								blockUserById(id, screen_name);
								showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`);
							}
							continue;
						}

						for (const rule of rules) {
							if (rule.id_num?.some((i) => id === i)) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id-num",
								});
							} else if (rule.id?.some((i) => screen_name === i)) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id",
								});
							} else if (rule["id-reg"]?.some((i) => i.test(screen_name ?? ""))) {
								blackList.set(screen_name, {
									id: id,
									screen_name: screen_name,
									rule: rule["rule-name"],
									type: "id-reg",
								});
							} else if (
								check(rule, screen_name, "name", name, auto_block_by_more) ||
								check(rule, screen_name, "bio", description, auto_block_by_more) ||
								check(rule, screen_name, "location", location, auto_block_by_more) ||
								check(rule, screen_name, "url", url, auto_block_by_more)
							) {
								if (auto_block_by_more) blockUserById(id, screen_name);
							} else continue;
							break;
						}
					}
				}
			});
		} else if (url.startsWith("https://twitter.com/i/api/graphql")) {
			// console.log("拦截到请求:", method, url);

			this.addEventListener("load", function () {
				// console.log("响应内容:", this.responseText);

				// 处理 result
				const handledResult = (result) => {
					// console.log(result);

					const legacy = result.legacy;

					const id = result.rest_id;
					const name = legacy.name;
					const created_at = legacy.created_at;
					const description = legacy.description;
					const followers_count = legacy.followers_count;
					const location = legacy.location;
					const screen_name = legacy.screen_name;
					const following = legacy.following ?? false;
					const blocking = legacy.blocking ?? false;
					const url = legacy.entities?.url?.urls[0]?.display_url ?? "";

					if (following) {
						whiteList.add(screen_name);
						return;
					}
					if (blocking) {
						blackList.set(screen_name, {
							id: id,
							screen_name: screen_name,
							rule: "blocking",
							type: "blocking",
							notShowNote: true,
						});
						return;
					}

					const auto_block = get("auto_block");
					const auto_block_by_more = auto_block && get("auto_block_by_more");
					if (
						check(internalRule, screen_name, "name", name, auto_block) ||
						check(internalRule, screen_name, "bio", description, auto_block) ||
						check(internalRule, screen_name, "location", location, auto_block) ||
						check(internalRule, screen_name, "url", url, auto_block)
					) {
						if (auto_block) {
							blockUserById(id, screen_name);
							showToast(`[Beta] 用户${name}@${screen_name}由内置规则自动屏蔽`);
						}
						return;
					}

					for (const rule of rules) {
						if (rule.id_num?.some((i) => id === i)) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id-num",
							});
							if (auto_block) blockUserById(id, screen_name);
						} else if (rule.id?.some((i) => screen_name === i)) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id",
							});
							if (auto_block) blockUserById(id, screen_name);
						} else if (rule["id-reg"]?.some((i) => i.test(screen_name ?? ""))) {
							blackList.set(screen_name, {
								id: id,
								screen_name: screen_name,
								rule: rule["rule-name"],
								type: "id-reg",
							});
						} else if (
							check(rule, screen_name, "name", name, auto_block_by_more) ||
							check(rule, screen_name, "bio", description, auto_block_by_more) ||
							check(rule, screen_name, "location", location, auto_block_by_more) ||
							check(rule, screen_name, "url", url, auto_block_by_more)
						) {
							if (auto_block_by_more) blockUserById(id, screen_name);
						} else continue;
					}
				};

				if (this.responseText.startsWith('{"data":{"user":{"result"')) {
					// 用户页
					handledResult(JSON.parse(this.responseText).data.user.result);
				} else if (this.responseText.includes("threaded_conversation_with_injections_v2")) {
					// 推文页
					const instructions = JSON.parse(this.responseText).data
						.threaded_conversation_with_injections_v2.instructions;

					for (entry of instructions.filter((i) => i.entries).map((i) => i.entries)) {
						for (content of entry.filter((i) => i.content).map((i) => i.content)) {
							let items = [];
							if (content.itemContent !== undefined) {
								items = [
									content?.itemContent?.tweet_results?.result?.tweet?.core ??
										content?.itemContent?.tweet_results?.result?.core,
								];
							} else if (content.items !== undefined) {
								items = content.items
									.filter((i) => i.item?.itemContent?.tweet_results?.result?.core)
									.map((i) => i.item.itemContent.tweet_results.result.core);
							}

							for (const core of items) {
								if (core == null || core === undefined) {
									continue;
								}

								handledResult(core.user_results.result);
							}
						}
					}
				} else {
					// console.log(`content:${this.responseText}`);
				}
			});
		}

		// biome-ignore lint/style/noArguments: TODO
		originalOpen.apply(this, arguments);
		// console.log(blackList);
	};
});

const urlListenCallbacks = [];
function UrlListener(callback) {
	urlListenCallbacks.push(callback);
}
let old_url = "";
setInterval(() => {
	if (old_url !== window.location.href) {
		urlListenCallbacks.forEach((callback) =>
			callback({
				old_url: old_url,
				new_url: window.location.href,
			}),
		);
		old_url = window.location.href;
	}
}, 500);

let internalRuleStr = "";
if (get("internal_blocker")) {
	internalRuleStr = `
#rule-name
内置屏蔽规则
#rule-description
最高优先级
#rule-lastupdate
2077-02-31
#rule-more
null

#name
🔞
反差
私信领福利
同城
可约

#bio
/(?=.*(私))(?=.*(福利))/
/(?=.*(同城))(?=.*(约))/
/(?=.*(寂寞|孤独|刺激|激情|情趣))(?=.*(性|骚扰))/
/(?=.*(年轻|未成年|青少年|\d{2}以下)|未满\d{2})(?=.*(勿扰))/
/(.*(男[Mm]|女[Ss]|反差|调教|人妻|勿扰|(探索|玩法)|(线下|同城|私信|电报|联系)|(sm|SM))){4}/
/(.*(另一面|渴望|冲动|脱|放肆|人妻|宣泄|寂寞|孤独|刺激|激情|情趣|性|骚扰|(电报|私信|联系)|(线下|同城))){5}/
t.me/dwaydgfuya
t.me/OgdenDelia14
t.me/RefMonster3
t.me/cdyu168

#url
t.me/dwaydgfuya
t.me/OgdenDelia14
t.me/RefMonster3
t.me/Anzzmingyue
t.me/Kau587
t.me/MegNaLiSha520
t.me/nDxyS520
t.me/SegWKeC520

#text
/^想上课的私信主人/
/^太阳射不进来的地方/
/^挂空就是舒服，接点地气/
/^总说我下面水太多/
/^在这个炮火连天的夜晚/
/^只进入身体不进入生活/
/^生活太多伪装，只能在推上面卸下伪装/
/^生活枯燥无味，一个人的夜晚总想找个/
/^我每天都有好好的穿衣服.*俘获/
/^人不可能每一步都正确，我不想回头看，也不想批判当时的自己/
/^如果你连试着的胆量也没有，你也就配不上拥有性福/
/^我希望以后可以不用再送我回家，而是我们一起回我们的家/
/^勇敢一点我们在.*就有故事/
/^只要你主动一点点我们就会有机会.*线下/
`;
}
const internalRule = parseRule(internalRuleStr);

const rules = new Set();
const whiteList = new Set();
const blackList = new Map();

function parseRule(str) {
	if (!str || str.trim() === "") return;
	let key;
	const rule = {};
	for (line of str.split("\n")) {
		line = line.trim();
		if (!line || line.startsWith("//")) continue;

		if (line.startsWith("#")) {
			key = line.slice(1);
			if (line.startsWith("#rule-")) {
				rule[key] = "";
			} else {
				rule[key] = [];
				rule[`${key}-reg`] = [];
			}
		} else {
			if (key.startsWith("rule-")) rule[key] += line;
			else if (line.startsWith("/") && line.endsWith("/"))
				rule[`${key}-reg`].push(new RegExp(line.slice(1, line.length - 1)));
			else rule[key].push(line);
		}
	}
	return rule;
}

function loadRule(str) {
	rules.add(parseRule(str));
}
