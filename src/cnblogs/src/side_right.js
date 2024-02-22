name: 右侧吸底
match: 
    - /www.cnblogs.com\/[^\/]*$/
    - /www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//
directlyRun: true
switchable: true
,
() => {
    fn = () => {
        const side = document.getElementById('side_right')
        if (side && side.clientHeight > window.innerHeight)
            side.style.top = `${window.innerHeight - side.clientHeight}px`
        else setTimeout(fn, 200)
    }
    timeoutOnLoad(fn, 200)
}
