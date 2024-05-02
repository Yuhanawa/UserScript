import { useState } from 'react'
import { useEffect } from 'react';
import './style/FloatingBall.css'





function FloatingBall(props) {

    useEffect(() => {

    }, [])


    return (
        <>
            <div class="floating-ball" >
                <div class="floating-ball-button" title="描述" onClick={props.onClick}>🔧
                </div>
            </div>
        </>
    )
}

export default FloatingBall
