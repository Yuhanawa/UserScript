移除顶部, [/blog\.csdn\.net\/.*\/article\/details/], {
  已开启$on: () => {
    return `#csdn-toolbar{ display: none!important; }`
  },
  已关闭$off: null,
}