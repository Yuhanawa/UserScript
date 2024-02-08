顶部菜单, [/blog\.csdn\.net(\/.*)?\/article\/details./], {
  '移除$remove': `#csdn-toolbar{ display: none!important; }`,
  '半透明$opacity': `#csdn-toolbar{opacity: 0.55;}`,
  '淡化不跟随$opacity_static': `#csdn-toolbar{position: static !important; opacity: 0.55;}`,
  '不跟随$static': `#csdn-toolbar{position: static !important;}`,
  '显示$off': null
}