CSDN移除顶部, [/blog\.csdn\.net\/.*\/article\/details/], {
  已关闭$off: null,
  已开启$on: () => {
    return `#csdn-toolbar{ display: none!important; }`
  },
}