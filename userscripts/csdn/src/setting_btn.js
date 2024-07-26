({
	pages: ["article"],
	value: () => {
		delay(() => {
			const articleTitleBox =
				document.getElementsByClassName("article-title-box")[0];
			const settingButton = document.createElement("a");
			settingButton.innerText = "脚本设置";
			settingButton.onclick = () => {
				openConfigPanel();
			};
			settingButton.style =
				"float: right;margin: 12px;font-size: 20px;text-decoration: underline !important;color: #4ea1db;";
			articleTitleBox.insertAdjacentElement("afterbegin", settingButton);
		}, 200);
	},
});
