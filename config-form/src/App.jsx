import { useState } from 'react'
import './App.css'

import FromMenu from './components/FromMenu.jsx';
import FromMain from './components/FromMain.jsx';
import { useEffect } from 'react';


function App() {
  const [menuKey, setMenuKey] = useState('index');

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    let spKey = sp.get('menuKey')
    if (spKey) setMenuKey(spKey)
  }, [])
  
  useEffect(() => {
    const searchParams = new URLSearchParams()
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
          <>该页面还在开发中,仅有部分功能可用</>
        </>}

        {menuKey === 'about' && <>

        </>}
      </div>
    </>
  )
}

export default App
