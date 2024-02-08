低部菜单工具栏, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
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
  '半透明$opacity': () => {
    return `.left-toolbox{
          opacity: 0.55!important;
        }`
  },
  '淡化不跟随$opacity_relative': () => {
    return `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
          opacity: 0.55!important;
        }`
  },
  '显示$off': null
}