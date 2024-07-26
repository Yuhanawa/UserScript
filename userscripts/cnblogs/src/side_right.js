({
	// 右侧吸底
	pages: ["home"],
	showInMenu: true,
	value: () => {
		fn = () => {
			const side = document.getElementById("side_right");
			if (side && side.clientHeight > window.innerHeight)
				side.style.top = `${window.innerHeight - side.clientHeight}px`;
			else setTimeout(fn, 200);
		};
		delay(fn, 200);
	},
});
