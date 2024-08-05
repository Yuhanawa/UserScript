({
	value: () => {
		style(
			`body{--font-size-title: ${get("font_size_title", "32px")};--font-size-p: ${get(
				"font_size_p",
				"18px",
			)};--font-size-h2: ${get("font_size_h2", "24px")};--font-size-code: ${get(
				"font_size_code",
				"15px",
			)};}`,
		);
		return $STYLE("fontsize");
	},
});
