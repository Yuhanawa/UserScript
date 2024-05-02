import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.css'
import Container from './container.jsx'
import App from './App.jsx'




ReactDOM.createRoot(document.getElementById('config-component-root')).render(
  <React.StrictMode>
    {window.useNewConfig ? <Container /> : <App />}
     <Container /> 
  </React.StrictMode >
)
