({
	// 自定义背景
	showInMenu: true,
	value: () => {
		if (get("background")) {
			style(`html,:root{--background:url(${get("background_value")})}`);
		}
		return $STYLE("background");
	},
});
