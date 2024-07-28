({
	// ing_in_iframe
	pages: ["ing"],
	showInMenu: true,

	value: () => {
		let style = $STYLE("ing");

		if (top === self) return style;

		style = style + $STYLE("ing_in_iframe");
		const refreshHeight = () => {
			unsafeWindow.parent.postMessage(
				{
					type: "resizeIframe",
					height:
						document.body.scrollHeight ?? document.body.clientHeight + 220,
				},
				"*",
			);
		};
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// 遍历所有变化
				if (mutation.type === "childList") {
					refreshHeight();
				} else if (mutation.type === "attributes") {
					// 属性变化
				}
			});
		});
		onload(() => {
			refreshHeight();

			// 观察 #main 元素
			observer.observe(document.getElementById("main"), {
				childList: true,
				attributes: false,
				subtree: true,
			});
		});

		delay(() => {
			// if (!document.querySelector(".pager")) return

			let timeout = 0;
			setInterval(() => {
				if (timeout > 0) timeout--;
			}, 1000);
			unsafeWindow.nextPage = nextPage;
			document.querySelectorAll(".pager").forEach((e) => e.remove());

			function receiveMessage(event) {
				const data = event.data;
				switch (data.type) {
					case "nextPage":
						nextPage();
						break;

					default:
						break;
				}
			}
			if (get("auto_pager_ing")) {
				unsafeWindow.addEventListener("message", receiveMessage, false);
			}

			function nextPage() {
				if (timeout > 0) return;
				timeout = 3;

				IngListType = "All";
				PageIndex = 2;
				getPage(
					`/ajax/ing/GetIngList?IngListType=${IngListType}&PageIndex=${PageIndex}&PageSize=30&Tag=&_=${Date.now()}`,
					{
						onload: (response) => {
							try {
								const doc = response.responseText;
								document
									.querySelector("#feed_list")
									.insertAdjacentHTML("beforeend", doc);

								document
									.querySelectorAll(".feed_loading")
									.forEach((e) => e.remove());
								document
									.querySelector("#feed_list")
									.insertAdjacentHTML(
										"beforeend",
										`<div class="feed_loading"><img align="absmiddle" src="//assets.cnblogs.com/images/loading.gif" alt=""> 正在加载数据...</div>`,
									);
								PageIndex++;
							} catch (e) {
								console.error("ERR", e, response.responseText);
							}
						},
						onerror: (response) => {
							console.error(`ERR: URL:${url}`, response);
						},
					},
				);
			}
		}, 400);

		return style;
	},
});
