({
	pages: ["link"],
	value: () => {
		const url = new URLSearchParams(location.search).get("target");
		location.href = url;
		location.replace(url);
	},
});
