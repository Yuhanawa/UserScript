import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import './style/Container.css'

import FloatingBall from './FloatingBall.jsx'
import './App.css'

import FromMain from './components/FromMain.jsx';



function ConfigComponent() {

    const [display, setDisplay] = useState('none')
    const FloatingBallOnClick = () => {
        const panel = document.getElementById('config-panel');

        if (display == 'block') {
            panel.style.animation = 'collapsePanel 2s ease forwards';
            panel.addEventListener('animationend', (event) => {
                if (event.animationName === 'collapsePanel') {
                    setDisplay('none')
                }
            });
        } else {
            setDisplay('block')
            panel.style.animation = 'expandPanel 3.5s ease forwards';
        }

    }


    useEffect(() => {

    }, [])


    return (
        <>
            <FloatingBall onClick={FloatingBallOnClick} />
            <div id='config-panel' style={{ display: display }} >
                <div className='config-main'>
                    <FromMain menuKey={window.awa.current} />
                </div>
            </div>
        </>
    )
}

export default ConfigComponent