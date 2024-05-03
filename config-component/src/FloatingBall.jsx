import { useState } from 'react'
import { useEffect } from 'react';
import './style/FloatingBall.css'
import './App.css'





function FloatingBall(props) {

    useEffect(() => {

    }, [])


    return (
        <>
            <div className="floating-ball" >
                <div className="floating-ball-button" title="描述" onClick={props.onClick}>🔧
                </div>
            </div>
        </>
    )
}

export default FloatingBall
