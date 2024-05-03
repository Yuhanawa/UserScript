import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import Container from './Container.jsx'
import App from './App.jsx'
import r2wc from "react-to-webcomponent"




const ConfigComponent = r2wc(Container, React, ReactDOM)

customElements.define("config-component", ConfigComponent)

ReactDOM.createRoot(document.getElementById('config-component-root')).render(
  <React.StrictMode>
    {window.useNewConfig ? <Container /> : <App />}
     {/* <Container />  */}
  </React.StrictMode >
)
