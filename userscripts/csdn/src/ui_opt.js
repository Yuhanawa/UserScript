({
	pages: ["article"],
	value: {
		lite: (self) => {
			const value = [
				"#treeSkill",
				"#blogVoteBox",
				".recommend-box",
				".first-recommend-box",
				".second-recommend-box",
				".insert-baidu-box.recommend-box-style",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#toolBarBox",
				".blog-footer-bottom",
				"#rightAside",
				"#groupfile",
				"#rightAside .kind_person",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar",
				"#mainBox .blog_container_aside",
				"#csdn-toolbar .toolbar-container-left",
				"#csdn-toolbar .toolbar-container-right",
				"#csdn-toolbar .toolbar-container-middle",
				"#blogExtensionBox .extension_official",
				"#asideProfile",
				"#footerRightAds",
				"#asideWriteGuide",
				"#asideSearchArticle",
				"#asideHotArticle",
				"#asideCategory",
				"#asideNewComments",
				"#asideNewNps",
				"#asideArchive",
				"#asidedirectory",
				".passport-container-mini-tip",
				".passport-login-container",
			];

			self.hide(value);
		},
		lite1: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-btn-vip",
				"#csdn-toolbar .toolbar-btn-msg",
				"#csdn-toolbar .toolbar-btn-mp",
				"#csdn-toolbar .toolbar-btn-writet",
				"#blogExtensionBox .extension_official",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#treeSkill",
				"#blogVoteBox",
				".recommend-box",
				".first-recommend-box",
				".second-recommend-box",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				"#toolBarBox",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
				"#asideProfile .data-info",
				"#asideCategory",
				".passport-login-container",
			]);
		},
		lite2: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-btn-vip",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#commentBox",
				"#pcCommentBox",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
				"#asideCategory",
				".first-recommend-box",
				".second-recommend-box",
				".recommend-box",
				"#toolBarBox",
				".passport-login-container",
			]);
		},
		lite3: (self) => {
			self.hide([
				".passport-container-mini-tip",
				"#asideArchive",
				"#csdn-toolbar .toolbar-btn-vip",
				"#footerRightAds",
				"#asideProfile .item-rank",
				"#asideProfile .aside-box-footer",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"main .article-bar-top",
				"main .article-title-box .article-type-img",
				"#recommendNps",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				".blog-footer-bottom",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				"#asideCategory",
				"#toolBarBox",
				"#csdn-toolbar .toolbar-menus",
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-container-left",
			]);
		},
		normal: (self) => {
			const value = [
				"#csdn-toolbar .toolbar-logo",
				"#csdn-toolbar .toolbar-btn-mp",
				"#csdn-toolbar .toolbar-btn-write",
				"#csdn-toolbar .toolbar-btn-msg",
				"#csdn-toolbar .toolbar-btn-vip",
				"#asideProfile .profile-intro-name-boxOpration",
				"#asideProfile .aside-box-footer",
				"#asideProfile .item-rank",
				"#footerRightAds",
				"#asideWriteGuide",
				"#asideHotArticle",
				"#asideNewComments",
				"#asideNewNps",
				"#asideArchive",
				"#asideSearchArticle",
				"main .article-title-box .article-type-img",
				"#treeSkill",
				"#blogVoteBox",
				".insert-baidu-box.recommend-box-style",
				"#recommendNps",
				"#commentBox",
				".blog-footer-bottom",
				"#rightAside .kind_person",
				".sidetool-writeguide-box",
				".option-box[data-type=guide]",
				".option-box[data-type=cs]",
				".option-box[data-type=report]",
				".btn-side-chatdoc-contentbox",
				".passport-container-mini-tip",
				".passport-login-container",
			];

			self.hide(value);
		},
		custom: () => {
			style(
				`${get(
					"ui_opt_value",
				)} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
			);
		},
		off: null,
	},
	hide: (value) => {
		style(
			`${value.join(
				", ",
			)} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`,
		);
	},
});