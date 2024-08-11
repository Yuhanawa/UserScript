({
	// 视频页宽屏
	// 大部分代码来自B站网页, 使用AI反混淆
	pages: ["video"],
	showInMenu: true,
	value: () => {
		function setSize() {
			// 是否宽屏
			const isWide = win.isWide;
			if (get("widescreen_hide_header_onWide")) {
				setTimeout(() => {
					try {
						document.querySelector("#biliMainHeader .bili-header.fixed-header").style.display =
							isWide ? "none" : "block";
					} catch (error) {
						console.error(error);
					}
				}, 50);
			}

			// 获取窗口宽度和高度
			const windowHeight = win.innerHeight;
			const windowWidth = Math.max(document.body?.clientWidth || win.innerWidth, 1100);

			// 设置侧边栏宽度
			const sidebarWidth = 1680 < innerWidth ? 411 : 350;

			// 计算主内容区域的高度和宽度
			const contentHeight = parseInt((16 * (windowHeight - (1690 < innerWidth ? 318 : 308))) / 9);
			const contentWidth = windowWidth - 112 - sidebarWidth;
			let finalContentWidth = contentWidth < contentHeight ? contentWidth : contentHeight;

			// 页面宽屏功能
			finalContentWidth = Math.round(finalContentWidth * get("widescreen-width-times"));

			// 限制内容宽度的最小和最大值
			if (finalContentWidth < 668) finalContentWidth = 668;
			if (finalContentWidth > 1694) finalContentWidth = 1694;

			// 计算总宽度
			let totalWidth = finalContentWidth + sidebarWidth;

			// 根据宽屏模式调整宽度
			if (isWide) {
				totalWidth -= 125;
				finalContentWidth -= 100;
			}

			// 计算播放器高度
			let playerHeight;
			const hasBlackSide = win.hasBlackSide;
			// biome-ignore format: 不要格式化这一坨
			if (hasBlackSide && !isWide) playerHeight =Math.round((finalContentWidth - 14 + (isWide ? sidebarWidth : 0)) * (9 / 16) +(1680 < innerWidth ? 56 : 46),) + 96; else playerHeight =Math.round((finalContentWidth + (isWide ? sidebarWidth : 0)) * (9 / 16)) + (1680 < innerWidth ? 56 : 46);

			// 计算左侧容器宽度
			const leftContainerWidth = totalWidth - sidebarWidth;

			// 构造 CSS 样式字符串
			// biome-ignore format: 不要格式化这一坨
			const styleString = constructStyleString(".video-container-v1", {width: "auto",padding: "0 10px"}) 
			+ constructStyleString(".left-container", {width: `${leftContainerWidth}px`}) 
			+ constructStyleString("#bilibili-player", {width: `${totalWidth - (isWide ? -30 : sidebarWidth)}px`,height: `${playerHeight}px`,position: isWide ? "relative" : "static"}) 
			+ constructStyleString("#oldfanfollowEntry", {position: "relative",top: isWide ? `${playerHeight + 28 - 18}px` : "0"}) 
			+ constructStyleString("#danmukuBox", {"margin-top": isWide ? `${playerHeight + 28}px` : "0"}) 
			+ constructStyleString("#playerWrap", {height: `${playerHeight}px`}) 
			+ constructStyleString(".video-discover", {"margin-left": `${(leftContainerWidth) / 2}px`});

			// 应用样式
			setSizeStyle.innerHTML = styleString;
		}
		function constructStyleString(e, i) {
			// biome-ignore lint: 没人想知道他是个什么东西
			for (var t = e + " {", n = Object.keys(i), o = 0; o < n.length; o++)
				t += `${n[o]}: ${i[n[o]]};`;
			return `${t}}\n`;
		}

		const change = () => {
			if (!win.setSizeStyle) {
				setTimeout(change, 120);
				return;
			}

			win.setSize = setSize;

			setSize();
			setTimeout(setSize, 200);
			win.addEventListener("resize", setSize);
			win.PlayerAgent = {
				changed: true,
				player_widewin: () => {
					"new_video" === win.__INITIAL_STATE__.pageVersion && win.scrollTo(0, 60);
					win.isWide = true;
					setSize();
				},
				player_fullwin: (i) => {
					win.scrollTo(0, 0);
					win.isWide = false;
					setSize();
				},
				toggleBlackSide: (i) => {
					win.hasBlackSide = i;
					setSize();
				},
			};
		};
		change();
		// 解决有时不生效
		onload(change);
		delay(change, 200);
	},
});
