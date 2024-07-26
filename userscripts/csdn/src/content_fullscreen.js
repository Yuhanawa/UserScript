({
	pages: ["article"],
	value: () => {
		document.addEventListener("keydown", (e) => {
			if (e.ctrlKey && e.keyCode === 13) {
				if (document.fullscreenElement) document.exitFullscreen();
				else document.querySelector(".blog-content-box").requestFullscreen();
			}
		});
	},
});
