净化, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
    '极简化$lite': () => {
        var value = [
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
            "#csdn-toolbar",
            "#mainBox .blog_container_aside",
            "#csdn-toolbar .toolbar-container-left",
            "#csdn-toolbar .toolbar-container-right",
            "#csdn-toolbar .toolbar-container-middle",
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
            ".passport-container-mini-tip"
        ]

        style(`${value.join(', ')} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`)
    },
    '常规$normal': () => {
        var value = [
            "#csdn-toolbar .toolbar-logo",
            "#csdn-toolbar .toolbar-btn-mp",
            "#csdn-toolbar .toolbar-btn-writet",
            "#csdn-toolbar .toolbar-btn-msg",
            "#csdn-toolbar .toolbar-btn-vip",
            "#asideProfile .profile-intro-name-boxOpration",
            "#asideProfile .aside-box-footer",
            "#asideProfile .item-rank",
            "#footerRightAds",
            "#asideWriteGuide",
            "#asideHotArticle",
            "#asideCategory",
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
            ".passport-container-mini-tip"
        ]

        style(`${value.join(', ')} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`)
    },
    '自定义$custom': () => {
        style(`${$get('csdn_ui_opt_value')} { display: none !important; width: 0 !important; height: 0 !important; visibility: collapse !important; }`)
    },
    '已关闭$off': () => {

    },
}