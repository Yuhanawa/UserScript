import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react';
import { DatePicker } from 'antd';
import FromMenu from './components/FromMenu.tsx';
import FromMain from './components/FromMain.tsx';


function App() {
  const [menuKey, setMenuKey] = useState('index');

  return (
    <>
      <div className='menu' >
        <FromMenu menuKey={menuKey} setMenuKey={setMenuKey} />
      </div>
      <div className='main'>
        {menuKey !== 'index' && menuKey !== 'about' && <FromMain menuKey={menuKey} />}

        {menuKey === 'index' && <>

        </>}

        {menuKey === 'about' && <>

        </>}
      </div>
    </>
  )
}

export default App
