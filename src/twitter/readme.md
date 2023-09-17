## Twitter Tweets(X Posts) Blocker & Filter

Twitter 推特推文(X 帖子) 屏蔽器&过滤器

[[Github]](https://github.com/yuhanawa/UserScript) - [[Greasyfork]](https://greasyfork.org/zh-CN/scripts/473865)

自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等)

- 根据用户名/用户介绍Bio/id/内容等进行屏蔽
- 支持关键词/正则表达式匹配
- 支持自定义屏蔽规则,导入第三方规则
- 自动更新规则(每日更新一次)
- 关注列表白名单

~~青丝老师屏蔽器~~黄推屏蔽器

自带 2 个黄推的屏蔽规则
如果存在误伤或者遗漏请反馈(或考虑自建规则(参考下方自定义规则示例))  
附带自定义推特图标(默认关闭)

### 新的效果图

(2023/09/17)  
![1694915262889.png](https://img1.imgtp.com/2023/09/17/sIdcwrF4.png)

### 效果图

(2023/08/25)  
![tw-pb.png](https://img1.imgtp.com/2023/08/25/Cm8a2dAl.png)

配置界面

![tw-pz.png](https://img1.imgtp.com/2023/08/25/32sLIcR5.png)

注意:初次安装或更新后刷新才能生效

![tw_gx.png](https://img1.imgtp.com/2023/08/25/ULWOnIV9.png)

### 使用方法

#### 简单使用

1. 安装脚本

2. 打开推特

3. 等待获取规则(右下角弹出刷新提示)  
   ![tw_gx.png](https://img1.imgtp.com/2023/08/25/ULWOnIV9.png)

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

#name
用户名关键词
/支持正则/

#id
id名称(精准匹配)
/支持正则/

#id_num
数字id(精准匹配)

#location
地点

#bio
用户描述

#text
作用于正文

#all
作用于整条推文

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
