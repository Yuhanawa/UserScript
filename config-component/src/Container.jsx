import { useState } from 'react'
import { useEffect } from 'react';
import './App.css'
import './style/Container.css'
import App from './App.jsx'

import FloatingBall from './FloatingBall.jsx'




function Container() {

    const [display, setDisplay] = useState('none')
    const FloatingBallOnClick = () => {
        const panel = document.getElementById('panel');

        if (display == 'block') {
            panel.style.animation = 'collapsePanel 2s ease forwards';
            panel.addEventListener('animationend', (event) => {
                if (event.animationName === 'collapsePanel') {
                    setDisplay('none')
                }
            });
        }else{
            setDisplay('block')
            panel.style.animation = 'expandPanel 3.5s ease forwards';
        }

    }


    useEffect(() => {

    }, [])


    return (
        <>
            <FloatingBall onClick={FloatingBallOnClick} />
            <div id='panel' style={{ display: display }} >
                <App />
            </div>
        </>
    )
}

export default Container