import { useState } from "react";
import { Tree } from 'antd';

const treeData = [
  {
    key: '#csdn-toolbar',
    title: '头部工具栏toolbar',
    children: [
      {
        key: '#csdn-toolbar .toolbar-container-left',
        title: '左边部分',
        children: [
          {
            key: '#csdn-toolbar .toolbar-logo',
            title: 'CSDN LOGO',
          },
          {
            key: '#csdn-toolbar .toolbar-menus',
            title: '菜单',
          },
        ],
      },
      {
        key: '#csdn-toolbar .toolbar-container-middle',
        title: '中间部分',
        children: [
          {
            key: '#csdn-toolbar .toolbar-search',
            title: '搜索',
            children: [
              {
                key: '#toolbar-search-button',
                title: '搜索按钮',
              }
            ],
          },

        ],
      }
      , {
        key: '#csdn-toolbar .toolbar-container-right',
        title: '右边部分',
        children: [
          {
            key: '#csdn-toolbar .toolbar-btn-login',
            title: '登录',
          },
          {
            key: '#csdn-toolbar .toolbar-btn-vip',
            title: '会员中心',
          }, {
            key: '#csdn-toolbar .toolbar-btn-msg',
            title: '消息',
          },
          {
            key: '#csdn-toolbar .toolbar-btn-collect',
            title: '历史',
          },
          {
            key: '#csdn-toolbar .toolbar-btn-mp',
            title: '创作中心',
          }, {
            key: '#csdn-toolbar .toolbar-btn-writet',
            title: '发布',
          },
        ],
      },
    ],
  }, {
    key: '#mainBox',
    title: '主内容',
    children: [
      {
        key: '#mainBox .blog_container_aside',
        title: '左侧边栏',
        children: [
          {
            key: '#asideProfile',
            title: '用户档案',
            children: [
              {
                key: '#asideProfile .profile-intro',
                title: '头像及名称',
              },
              {
                key: '#asideProfile .data-info',
                title: '数据信息',
              },
              {
                key: '#asideProfile .item-rank',
                title: 'item-rank',
              },
              {
                key: '#asideProfile .aside-box-footer',
                title: '徽章',
              },
              {
                key: '#asideProfile .profile-intro-name-boxOpration',
                title: '私信及关注按钮',
              }
            ],
          }, {
            key: '#footerRightAds',
            title: '广告',
          },
          {
            key: '#asideWriteGuide',
            title: '创作推广',
          }, {
            key: '#asideSearchArticle',
            title: '搜索博主文章',
          },
          {
            key: '#asideHotArticle',
            title: '热门文章',
          },
          {
            key: '#asideCategory',
            title: '收藏',
          }, {
            key: '#asideNewComments',
            title: '最新评论',
          },
          {
            key: '#asideNewNps',
            title: '您愿意向朋友推荐“博客详情页”吗？',
          },
          {
            key: '#asideArchive',
            title: '最新文章',
          }, {
            key: '#asidedirectory',
            title: '目录',
          }
        ],
      },
      {
        key: 'main .blog-content-box',
        title: '文章主体',
        children: [
          {
            key: 'main .article-header-box',
            title: '头部',
            children: [
              {
                key: 'main .article-title-box',
                title: '标题',
              },
              {
                key: 'main .article-info-box',
                title: '信息',
                children: [
                  {
                    key: 'main .article-bar-top',
                    title: 'bar top',
                    children: [
                      {
                        key: 'main .article-title-box .article-type-img',
                        title: '图标',
                      }]
                  },
                  {
                    key: 'main .blog-tags-box',
                    title: '标签',
                  }
                ],
              },],
          },
          {
            key: 'main .baidu_pl',
            title: '文章',
            children: [
              {
                key: '#article_content',
                title: '文章内容',
              },
              {
                key: '#treeSkill',
                title: '文章知识点与官方知识档案匹配，可进一步学习相关知识',
              },
              {
                key: '#blogVoteBox',
                title: '投票',
              },
            ],
          },
          {
            key: '.recommend-box',
            title: '推荐',
            children: [
              {
                key: '.first-recommend-box',
                title: '第一条推荐',
              },
              {
                key: '.second-recommend-box',
                title: '第二条推荐',
              },
              {
                key: '.insert-baidu-box.recommend-box-style',
                title: '其他推荐',
              },
            ],
          }, {
            key: '#recommendNps',
            title: '“相关推荐”对你有帮助么？',
          },
          {
            key: '#commentBox',
            title: '评论Box',
          }, {
            key: '#pcCommentBox',
            title: 'pc评论Box',
          },
        ],
      },
      {
        key: '#toolBarBox',
        title: '底部工具栏',
      }, {
        key: '.blog-footer-bottom',
        title: '页脚(版权/备案)',
      },
    ],
  }, {
    key: '#rightAside',
    title: '右侧边栏(登录后才有)',
    children: [
      {
        key: '#groupfile',
        title: '目录',
      },
      {
        key: '#rightAside .kind_person',
        title: '分类',
      },
    ],
  },
  {
    key: '.csdn-side-toolbar',
    title: '侧边工具栏',
    children: [
      {
        key: '.sidetool-writeguide-box',
        title: '创作话题',
      },
      {
        key: '.option-box[data-type=guide]',
        title: '新手引导',
      }, {
        key: '.option-box[data-type=cs]',
        title: '客服',
      }, {
        key: '.option-box[data-type=report]',
        title: '举报',
      }, {
        key: '.option-box[data-type=gotop]',
        title: '返回顶部',
      },
    ],
  }, {
    key: '.passport-container-mini-tip',
    title: '右下角登录提示'
  }
];
const CSDN_UI_editor = (props) => {
  const [checkedKeys, setCheckedKeys] = useState(props.value);
  const [expandedKeys, setExpandedKeys] = useState(props.value);
  const onCheck = (keys) => {
    setCheckedKeys(keys);
    props.onChange(keys);
  };

  return (<>
    <div style={{ width: "100%", backgroundColor: "white", padding: "2px", borderRadius: "4px" }}>
      <h3 style={{ margin: "4px" }}>❗勾选要⌊隐藏⌉的部分❗</h3>
      <Tree
        blockNode
        checkable
        showLine
        defaultExpandParent
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        treeData={treeData}
        onCheck={onCheck}
        style={{ width: "100%", padding: "10px" }}
      />
    </div>

  </>)
};
export default CSDN_UI_editor;