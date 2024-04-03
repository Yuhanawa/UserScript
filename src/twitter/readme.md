## Twitter Tweets(X Posts) Blocker & Filter

[月潆-月为月光;潆为溪流代指推特信息流;以皎洁高雅的月光洗礼信息溪流;]

Twitter 推特推文(X 帖子) 屏蔽器&过滤器

[[Github]](https://github.com/yuhanawa/UserScript) - [[Greasyfork]](https://greasyfork.org/zh-CN/scripts/473865)

> 很抱歉，最近在准备期末考试，没有时间进行更新 ＞︿＜
> 因此，所有的 bug 和功能需要等到春节才能进行修复
>
> 开学了...
> 2024-2 月

自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等)

- 根据用户名/用户介绍 Bio/id/内容等进行屏蔽
- 支持关键词/正则表达式匹配
- 支持自定义屏蔽规则,导入第三方规则
- 自动更新规则(每日更新一次)
- 关注列表白名单
- 被精准匹配的用户自动屏蔽
- 可疑用户快捷屏蔽

~~青丝老师屏蔽器~~黄推屏蔽器

自带 2 个黄推的屏蔽规则
如果存在误伤或者遗漏请反馈(或考虑自建规则(参考下方自定义规则示例))  
附带自定义推特图标(默认关闭)

### 效果图

(2023/09/17)  
![image.png](https://s2.loli.net/2023/10/22/PBfTdO6rvuR8qJI.png)

![image.png](https://s2.loli.net/2023/10/22/SBERCqHri7szoAQ.png)

配置界面
![image.png](https://s2.loli.net/2023/10/22/UQN5I3PGSZMwg4K.png)

### 使用方法

1. 安装脚本

2. 打开推特

3. 等待获取规则(右下角弹出刷新提示)  
   ![tw_gx.png](https://s2.loli.net/2023/10/22/1JXnOiTIuRFev39.png)

4. 刷新

#### 自定义规则示例

```
#rule-name
名称
#rule-description
描述
#rule-lastupdate
2023-09-16
#rule-more
补充信息

// /支持正则/
#name
// 用户名关键词

#id
// id名称(精准匹配)

#id_num
// 数字id(精准匹配)

#location
// 地点

#bio
// 用户介绍

#text
// 正文

#all
// 整条推文

```

### TODO

- 显示规则详细信息
- 显示推文收入(估算值)
- 快捷屏蔽
- 规则编辑器
- 自动更新开关
- 自动屏蔽触发脚本屏蔽功能的推特账号
- 隐藏更新提示
- 转推白名单


