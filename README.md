# Yuhan 的脚本集

> CSDN 极简化\沉浸式阅读\免登录复制\自定义等等
> 哔哩哔哩(bilibili)美化\视频快捷分享复制\移除评论区关键字搜索蓝字等等
> 博客园(cnblog)美化/增强/字体放大
> 推特推文屏蔽过滤器|黄推屏蔽器

#### [[Github]](https://github.com/yuhanawa/UserScript) - [[Greasyfork-BILIBILI]](https://greasyfork.org/zh-CN/scripts/471069) - [[Greasyfork-CSDN]](https://greasyfork.org/zh-CN/scripts/471071) - [[Greasyfork-Twitter]](https://greasyfork.org/zh-CN/scripts/473865) - [[Greasyfork-博客园]](https://greasyfork.org/zh-CN/scripts/487754)


## 脚本

- [哔哩哔哩脚本|美化|增强|自定义背景|评论过滤](https://greasyfork.org/zh-CN/scripts/471069-bilibili-beautify)
  - 图片截取自 2023-10 距今可能发生较大变化  
    ![image.png](https://s2.loli.net/2023/10/22/Pdq619G5lvDCO8X.png)
- [CSDN 脚本-优化美化极简化-沉浸式阅读-免登录复制-去广告](https://greasyfork.org/zh-CN/scripts/471071-csdn-optimize-beautify-simplify)
  - 图片截取自 2023-10 距今可能发生较大变化  
    ![效果截图](https://s2.loli.net/2023/10/22/MNxA6JUz4uCEdDk.png)
    ![设置界面](https://s2.loli.net/2023/10/22/yuOm9iBnS2kxpMq.png)
- [博客花园-博客园美化增强](https://greasyfork.org/zh-CN/scripts/487754)
  - 图片截取自 2024-02 距今可能发生较大变化  
    ![效果截图](https://s2.loli.net/2024/02/22/aGYp6m3osOLIUjl.png)
- [Twitter 推文屏蔽器&过滤器](https://greasyfork.org/zh-CN/scripts/473865)
  - 图片截取自 2023-08 距今可能发生较大变化  
    ![效果图](https://s2.loli.net/2023/10/22/PBfTdO6rvuR8qJI.png)
- 搜索引擎美化 | 切换工具
  - ?
  - 目前可用使用,但有待重构,故不建议使用
  - 但你可以[手动安装](https://raw.githubusercontent.com/Yuhanawa/UserScript/releases/out/search.js)它

## 支持功能

### [哔哩哔哩脚本 美化|增强|自定义背景|评论过滤](https://greasyfork.org/zh-CN/scripts/471069-bilibili-beautify)

- 样式美化 | 自定义背景
- 视频页样式微调
  - 哔哩哔哩修改 UP 觉得很赞标签位置
- 视频快捷复制分享 (4 种模式)
- 移除评论关键字搜索图标
- 移除评论关键字搜索跳转
- 评论区过滤(自定义关键词未完成)
- 页面宽屏
- 护眼蒙版
- 快捷键增强

#### TODO(随缘更新(?)):

- 自动播放优化
- 彩色弹幕褪色
- 隐藏头部
- 视频下载
- 封面下载
- 深色模式

### [CSDN 脚本-优化美化极简化-沉浸式阅读-免登录复制-去广告](https://greasyfork.org/zh-CN/scripts/471071-csdn-optimize-beautify-simplify)

- 免登录复制
- 样式美化|沉浸式阅读
  - 调整页面宽度
- 移除顶部导航或不跟随
- 隐藏底部工具栏或不跟随
- 去广告
- UI 调整
  - 每一个卡片都可以关闭
- 调整字体大小
- 自定义背景

#### TODO:

- 专注模式(按钮,按下后全屏且仅显示文章内容)

### [Twitter 屏蔽器&过滤器](https://greasyfork.org/zh-CN/scripts/473865)

- 自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等)
- 支持自定义屏蔽规则,导入第三方规则等
- 自动更新规则(每日更新一次)

### 搜索引擎美化 | 切换工具

- 搜索引擎优化美化净化
- 搜索引擎快速切换工具
- 搜索引擎自定义背景
- 搜索引擎自定义字体
- 搜索引擎半自定义搜索引擎
- 搜索引擎快速聚焦搜索框 (Ctrl+[K|Q|S]) 模式：["清空","关闭", "选中", "聚焦"]

## How to build

### 欢迎 PR

请确保已经安装 nodejs 和 pnpm

0. 项目结构

- lib
  - 依赖库
- config-form
  - 设置网站源码
- src
  - 脚本源码,每一个子文件夹为一个脚本,`.`开头的文件夹会被忽略
- out
  - 构建结果输出目录
- dev.js
  - 热更新所需要的脚本,见下文(4.热更新)

1. 克隆此仓库

```sh
git clone https://github.com/Yuhanawa/UserScript.git
```

2. 安装依赖

```sh
pnpm i
```

3. 构建

```sh
pnpm build
```

构建结果在 out 文件夹中

4. 热更新

修改`dev.js`中的`{PATH}` 为当前目录的绝对路径, 将此脚本添加到脚本管理器(Tampermonkey)中, 并打开脚本管理器[允许访问文件网址]权限

> 在 chrome 中, 你可以访问`chrome://extensions/`找到你的脚本管理器插件(Tampermonkey),点击`详情`, 打开`允许访问文件网址`选项

运行以下命令或者在 VSCode 中按 F5 运行

```sh
pnpm run dev
```


#### CommitLint

| 类型   | 描述   |
| ------ | ------ |
| build | 对项目构建系统或外部依赖项的更改 |  例如，修改构建脚本、配置文件等 |  
| chore | 非业务性的任务和更改 |  通常用于修改构建过程、辅助工具的代码，或者进行一些不涉及用户功能的工作 |  
| ci | 对持续集成 (Continuous Integration) 配置文件和脚本的更改 |  
| docs | 文档变更，包括但不限于 README 文件、文档生成器或注释的变更 |  
| feat | 新功能的添加 |  通常伴随着用户功能或其他明显的变更 |  
| fix | 修复 bug |  
| perf | 改进性能的代码更改 |  
| refactor | 代码重构，不是修复 bug 也不是添加新功能的代码更改 |  
| revert | 撤销先前的提交 |  
| style | 与代码风格相关的更改，例如空格、格式化等，而不涉及功能性代码更改 |  
| test | 添加或修改测试 |  

