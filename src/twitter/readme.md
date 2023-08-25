## Twitter Tweets(X Posts) Blocker & Filter

Twitter 推特推文(X 帖子) 屏蔽器&过滤器

自定义屏蔽或过滤你不想看到推文(黄推,建政或某特定群体等)  
支持自定义屏蔽器,导入第三方规则等  
自动更新规则(每日更新一次)

~~青丝老师屏蔽器~~黄推屏蔽器

可以通过名字/内容的关键词或 id 进行屏蔽  
自带一个黄推的屏蔽规则,尽量避免了误伤  
如果存在误伤或者遗漏请反馈

### 效果图

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
示例名称
#rule-description
这是第1条描述
这是第2条描述
这里可以填多条
也可以不填
下面的rule-timestamp暂时可以随便填
#rule-timestamp
95fcc2e2-7578-46d2-9420-47fcfe3a4465
#rule-more
这里可以填多条
也可以不填

#name
要屏蔽用户名关键词
一行一个
只要用户名含有该关键词就会屏蔽这条推文

#id
要屏蔽用户ID(如@xxx(不需要写@))
一行一个
屏蔽用户ID的推文

#content
要屏蔽推文正文关键词
一行一个
只要推文正文含有该关键词就会屏蔽这条推文

#article
不管在哪
只要出现关键词
就屏蔽这条推文
一行一个

```


### TODO

- 正则匹配
- 白名单
- 显示规则详细信息
