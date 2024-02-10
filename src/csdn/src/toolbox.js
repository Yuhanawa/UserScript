低部菜单工具栏, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
  '移除$remove':
    `.left-toolbox{
          display: none!important;
        }`,
  '不跟随$relative':
    `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }`,
  '半透明$opacity':
    `.left-toolbox{
          opacity: 0.55!important;
          transition: opacity 0.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
  '淡化不跟随$opacity_relative':
    `.left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
          opacity: 0.55!important;
          transition: opacity 1.5s!important;
        }
        .left-toolbox:hover{
          opacity: 1!important;
        }`,
  '显示$off': null
}