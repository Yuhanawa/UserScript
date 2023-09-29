name: example示例
match: 
    - 'example.com'
,
{
    已关闭$off: null,
    已开启$on: () => {
        return $SASS(example)
    },
}