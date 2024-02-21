name: LOGO替换
match:
    - /www.cnblogs.com\/[^\/]*$/
    - /www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//
directlyRun: true
switchable: true
,
$SASS(logo)
