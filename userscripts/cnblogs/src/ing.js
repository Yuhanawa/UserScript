({
	// ing
	pages: ["www_ing"],
	value: () => {
		show_ing_iframe();
		if (get("auto_pager_ing")) {
			setInterval(() => {
				if (
					document.body.offsetHeight - window.scrollY - window.innerHeight <
					window.innerHeight * 2
				) {
					document
						.getElementById("ing_iframe")
						.contentWindow.postMessage({ type: "nextPage" }, "*");
				}
			}, 2000);
		}
	},
});
