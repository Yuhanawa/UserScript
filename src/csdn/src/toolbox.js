底部不跟随或移除, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
  '移除$remove': () => {
    return `.left-toolbox{
          display: none!important;
        }`
  },
  '不跟随$relative': () => {
    return `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`
  },
  '已关闭': null
}