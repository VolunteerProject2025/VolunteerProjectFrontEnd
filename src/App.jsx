import { HashRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { Role } from './pages/Role'
import Layout from './layout/Layout'
import { AuthProvider } from "./context/AuthContext"; 
function App() {


  return (
    <div>
       <AuthProvider>
       <HashRouter>
        <Routes>
          <Route path='/login' element={
            <Layout>
              <Login />

            </Layout>
            
          } />
         
          <Route path='/role' element={
             <Layout>
          <Role />

             </Layout>
          } />
          <Route path='/' element={
          <Layout>
              <Home />

          </Layout>

          } />
          <Route path='/register' element={
               <Layout>
          <Register />

               </Layout>
          } />
        </Routes>
      </HashRouter>
       </AuthProvider>
      
    </div>

  )
}

export default App
