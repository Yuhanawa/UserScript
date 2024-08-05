({
	pages: ["video"],
	value: () => {
		const wide = () => {
			const e = document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-wide");
			if (!e) setTimeout(wide, 250);

			win?.PlayerAgent?.player_widewin();
			e?.click();
		};
		wide();
	},
});
