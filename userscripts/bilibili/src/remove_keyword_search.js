({
	// TODO 失效?
	// 移除评论关键字搜索跳转(失效)
	pages: ["video", "read"],
	showInMenu: true,
	value: {
		icon: () => ".icon.search-word:{display:none;}",
		color: () =>
			".icon.search-word:{display:none;} .search-word a{color: #222!important;}",
		link: () => {
			delay(
				() => {
					const as = document.getElementsByClassName("search-word");
					for (let i = 0; i < as.length; i++)
						as[i].parentElement.outerHTML = as[
							i
						].parentElement.outerHTML.replace(as[i].outerHTML, as[i].outerText);
				},
				8000,
				{ loop: true },
			);
			return ".icon.search-word:{display:none;} .search-word a{color: #222!important;}";
		},
		off: null,
	},
});
