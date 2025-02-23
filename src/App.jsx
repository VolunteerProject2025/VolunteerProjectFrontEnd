import { HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Register } from './pages/Register'

function App() {


  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Login />} />

          <Route path='/home' element={<Home />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </HashRouter>
    </div>

  )
}

export default App
