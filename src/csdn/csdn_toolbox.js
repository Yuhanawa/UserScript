/* csdn_toolbox.js */

CSDN底部不跟随, [/blog\.csdn\.net\/.*\/article\/details/], {

    '已开启$on': () => {

        return $CSS(`
        .left-toolbox{
          z-index: 996!important;
          left: 0px!important;
          bottom: 0px!important;
          width: 900px!important;
          position: relative!important;
        }
      `)

    },

    '已关闭': null

}