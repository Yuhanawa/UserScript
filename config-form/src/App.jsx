import { useState } from 'react'
import './App.css'

import FromMenu from './components/FromMenu.jsx';
import FromMain from './components/FromMain.jsx';


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
