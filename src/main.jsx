import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import GlobalStyles from "./style/GlobalStyles.jsx"
import Modal from 'react-modal'

// 앱의 루트 요소 지정
Modal.setAppElement('#root')

createRoot(document.getElementById('root')).render(
  <>
    <GlobalStyles />
    <App />
  </>,
)
