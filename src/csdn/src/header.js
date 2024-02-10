顶部菜单, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
  '移除$remove':
    `#csdn-toolbar{ display: none!important; }`,
  '半透明$opacity':
    `#csdn-toolbar{
      transition: opacity 0.5s!important;
      opacity: 0.75;
      backdrop-filter: blur(8px);
      filter: blur(2px);
    } 
    #csdn-toolbar:hover,
    #csdn-toolbar:focus,
    #csdn-toolbar:focus-within,
    #csdn-toolbar:active {
      opacity: 1;
      backdrop-filter: none;
      filter: none;
    } `,
  '淡化不跟随$opacity_static':
    `#csdn-toolbar{position: static !important; opacity: 0.5; transition: opacity 1.5s!important;} #csdn-toolbar:hover{opacity: 1;}`,
  '不跟随$static':
    `#csdn-toolbar{position: static !important;}`,
  '显示$off': null
}