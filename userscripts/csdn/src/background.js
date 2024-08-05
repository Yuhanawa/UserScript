({
	pages: ["article"],
	value: () => {
		if (get("background-value")) {
			style(`body{background:url("${get("background-value")}")}`);
		}
		style(`body{--blog-content-box-background:${get("blog-content-box-background-value")}}`);
		style(`body{--blog-content-box-opacity:${get("blog-content-box-opacity-value")}}`);
		style(`body{--blog-header-box-background:${get("blog-header-box-background-value")}}`);
		return $STYLE("background");
	},
});
