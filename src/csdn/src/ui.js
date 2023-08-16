UI调整 | 设置中可开关每个UI, ['csdn.net'], {
    '已开启$on': () => {
        const add = (key, selector, defaultBool) => {
            if ($get(key, (defaultBool == undefined || defaultBool) ? "on" : "off") === 'off') style(`${selector}{display: none !important;}`)
        }

        // csdn-toolbar 顶部菜单
        add('csdn_ui_toolbar', '.csdn-toolbar', true)
        // toolbar-container-left 搜索框左侧
        add('csdn_ui_toolbar_container_left', '.toolbar_container_left', true)
        // toolbar-container-middle 搜索框
        add('csdn_ui_toolbar_container_middle', '.toolbar_container_middle', true)
        // toolbar-container-right 搜索框右侧
        add('csdn_ui_toolbar_container_right', '.toolbar_container_right', true)
        // toolbar-btn-vip 会员中心
        add('csdn_ui_toolbar_btn_vip', '.toolbar_btn_vip', false)
        // asideProfile 作者档案
        add('csdn_ui_asideProfile', '#asideProfile', true)
        // asideSearchArticle 搜索作者文章
        add('csdn_ui_asideSearchArticle', '#asideSearchArticle', true)
        // asideHotArticle 热门文章
        add('csdn_ui_asideHotArticle', '#asideHotArticle', false)
        // asideCategory 分类专栏
        add('csdn_ui_asideCategory', '#asideCategory', true)
        // asideNewComments 最新评论
        add('csdn_ui_asideNewComments', '#asideNewComments', true)
        // asideNewNps 您愿意向朋友推荐“博客详情页”吗
        add('csdn_ui_asideNewNps', '#asideNewNps', false)
        // asideArchive 最新文章
        add('csdn_ui_asideArchive', '#asideArchive', true)
        // asidedirectory 文章目录
        add('csdn_ui_asidedirectory', '#asidedirectory', true)
        // copyright-box copyright-box
        add('csdn_ui_copyright_box', '#copyright_box', false)
        // recommendNps “相关推荐”对你有帮助么
        add('csdn_ui_recommendNps', '#recommendNps', false)
        // recommend-box 文章推荐
        add('csdn_ui_recommend_box', '.recommend_box', true)
        // toolBarBox 下方工具栏
        add('csdn_ui_toolBarBox', '#toolBarBox', true)
    },
    '已关闭$off': null
}