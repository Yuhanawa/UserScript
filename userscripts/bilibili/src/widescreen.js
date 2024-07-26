({
	// 视频页宽屏
	pages: ["video"],
	showInMenu: true,
	value: () => {
		function setSize() {
			// if (unsafeWindow.__INITIAL_STATE__) {
			//     var i = unsafeWindow.__INITIAL_STATE__.pageVersion,
			//         e = unsafeWindow.__INITIAL_STATE__.isPrVideo;
			//     "new_video" === i ? part1SetSize() : e && unsafeWindow.__INITIAL_STATE__.premiereInfo ? part1SetSize() : originSetSize()
			// } else originSetSize(),
			// 我也不知道上面的代码干什么用的，反正注释掉就正常了
			part1SetSize();
		}
		function constructStyleString(i, e) {
			for (let t = `${i} {`, n = Object.keys(e), o = 0; o < n.length; o++)
				t += `${n[o]}: ${e[n[o]]};`;
			return `${t}}\n`;
		}
		function part1SetSize() {
			// 是否宽屏
			const isWide = unsafeWindow.isWide;

			if (get("widescreen_hide_header_onWide")) {
				setTimeout(() => {
					try {
						document.querySelector(
							"#biliMainHeader .bili-header.fixed-header",
						).style.display = isWide ? "none" : "block";
					} catch (error) {
						console.error(error);
					}
				}, 50);
			}

			// 浏览器窗口高度
			const innerHeight = unsafeWindow.innerHeight;

			// 浏览器窗口宽度
			const innerWidth = Math.max(
				document.body?.clientWidth || unsafeWindow.innerWidth,
				1100,
			);

			// 右侧栏宽度
			const rightWidth = innerWidth > 1680 ? 411 : 350;

			// 计算主区域宽度
			const maxWidth = parseInt(
				(16 * (innerHeight - (innerWidth > 1690 ? 318 : 308))) / 9,
			);
			const mainWidth = innerWidth - 112 - rightWidth;
			let width = mainWidth < maxWidth ? mainWidth : maxWidth;

			width = Math.round(width * get("widescreen-width-times", 1.2));

			// 设置最小和最大宽度
			if (width < 668) {
				width = 668;
			}
			if (width > 1694) {
				width = 1694;
			}

			// 总宽度
			let totalWidth = width + rightWidth;

			// 计算高度
			let height;
			if (isWide) {
				totalWidth -= 125;
				width -= 100;
			}
			if (unsafeWindow.hasBlackSide && !isWide) {
				height =
					Math.round(
						(width - 14 + (isWide ? rightWidth : 0)) * (9 / 16) +
							(innerWidth > 1680 ? 56 : 46),
					) + 96;
			} else {
				height =
					Math.round((width + (isWide ? rightWidth : 0)) * (9 / 16)) +
					(innerWidth > 1680 ? 56 : 46);
			}

			// 主区域宽度
			const mainBoxWidth = totalWidth - rightWidth;

			// 生成设置样式的CSS
			const css =
				constructStyleString(".video-container-v1", {
					width: "auto",
					padding: "0 10px",
				}) +
				constructStyleString(".left-container", {
					width: `${mainBoxWidth}px`,
				}) +
				constructStyleString("#bilibili-player", {
					width: `${totalWidth - (isWide ? -30 : rightWidth)}px`,
					height: `${height}px`,
					position: isWide ? "relative" : "static",
				}) +
				constructStyleString("#oldfanfollowEntry", {
					position: "relative",
					top: isWide ? `${height + 28 - 18}px` : "0",
				}) +
				constructStyleString("#danmukuBox", {
					"margin-top": isWide ? `${height + 28}px` : "0",
				}) +
				constructStyleString("#playerWrap", {
					height: `${height}px`,
				}) +
				constructStyleString(".video-discover", {
					"margin-left": `${(totalWidth - rightWidth) / 2}px`,
				});
			setSizeStyle.innerHTML = css;
		}

		const set = () => {
			if (!unsafeWindow.setSizeStyle) {
				setTimeout(() => set(), 120);
				return;
			}

			unsafeWindow.setSize = setSize;

			setSize();
			setTimeout(setSize, 250);
			unsafeWindow.addEventListener("resize", () => {
				setSize();
			});
			unsafeWindow.PlayerAgent = {
				changed: true,
				player_widewin: () => {
					"new_video" === unsafeWindow.__INITIAL_STATE__.pageVersion &&
						unsafeWindow.scrollTo(0, 60);
					unsafeWindow.isWide = true;
					setSize();
				},
				player_fullwin: (i) => {
					unsafeWindow.scrollTo(0, 0);
					unsafeWindow.isWide = false;
					setSize();
				},
				toggleBlackSide: (i) => {
					unsafeWindow.hasBlackSide = i;
					setSize();
				},
			};
		};
		set();
	},
});
