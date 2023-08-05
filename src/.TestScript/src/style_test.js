样式测试, [/./],
{
    已关闭$off: null,
    已开启$on: () => {
        console.log("!!!!!!!! TEST !!!!!!!!!");
        return $SASS(test) + $CSS(test)
    }
}
