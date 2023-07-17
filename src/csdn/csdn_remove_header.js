/* csdn_remove_header.js */

CSDN移除顶部, [/blog\.csdn\.net\/.*\/article\/details/], {

    '已开启$on': () => {
  
      return $CSS(`
        #csdn-toolbar{
          display: none!important;
        }
      `)
  
    },
  
    '已关闭': null
    
  }