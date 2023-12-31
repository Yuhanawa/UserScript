import { useState } from 'react'
import './App.css'

import FromMenu from './components/FromMenu.jsx';
import FromMain from './components/FromMain.jsx';
import { useEffect } from 'react';


function App() {
  const sp = new URLSearchParams(window.location.search);
  const [menuKey, setMenuKey] = useState(sp.get('menuKey') || 'index');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)

    console.log("searchParams.get('menuKey'):", searchParams.get('menuKey')) // test
    console.log("menuKey:", menuKey)      // index
    if (searchParams.get('menuKey')==menuKey) return;


    searchParams.set('menuKey', menuKey)
    window.history.pushState(null, '', '?' + searchParams.toString())
  }, [menuKey])


  return (
    <>
      <div className='menu' >
        <FromMenu menuKey={menuKey} setMenuKey={setMenuKey} />
      </div>
      <div className='main'>
        {menuKey !== 'index' && menuKey !== 'about' && <FromMain menuKey={menuKey} />}

        {menuKey === 'index' && <>
          <h2> 点击左测标签栏选择脚本 </h2>

          <h2> 很抱歉，最近在准备期末考试，没有时间进行更新 ＞︿＜ </h2>
          <h4> 因此，所有的bug和功能需要等到春节才能进行修复 </h4>
          
          <h4>其他脚本: </h4>
          <div>
            <br></br>
            <a href="https://greasyfork.org/zh-CN/scripts/471069">哔哩哔哩 BILIBILI 美化|增强|自定义背景|评论过滤等</a>
          </div>
          <div>
            <br></br>
            <a href="https://greasyfork.org/zh-CN/scripts/471071">CSDN-优化美化极简化-沉浸式阅读-免登录复制-去广告等</a>
          </div>
          <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <a href="https://github.com/yuhanawa/UserScript">GITHUB仓库</a>
          </div>
          <a></a>
        </>}

        {menuKey === 'about' && <>
          <h4>其他脚本: </h4>
          <div>
            <br></br>
            <a href="https://greasyfork.org/zh-CN/scripts/471069">哔哩哔哩 BILIBILI 美化|增强|自定义背景|评论过滤等</a>
          </div>
          <div>
            <br></br>
            <a href="https://greasyfork.org/zh-CN/scripts/471071">CSDN-优化美化极简化-沉浸式阅读-免登录复制-去广告等</a>
          </div>
          <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <a href="https://github.com/yuhanawa/UserScript">GITHUB仓库</a>
          </div>
        </>}
      </div>
    </>
  )
}

export default App
