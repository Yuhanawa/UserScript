import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import ConfigComponent from './ConfigComponent.jsx'
import ConfigWeb from './ConfigWeb.jsx'
import r2wc from "react-to-webcomponent"




// const ConfigWebComponent = r2wc(ConfigComponent, React, ReactDOM)

// customElements.define("config-component", ConfigWebComponent)

if (window.ConfigWeb) {
  ReactDOM.createRoot(document.getElementById('config-web-root')).render(
    <React.StrictMode>
      <ConfigWeb />
    </React.StrictMode >
  )
}

