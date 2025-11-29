import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import { ProtectedRoute } from './components/ProtectedRoute'

export default function App(){
  return(
    <Router>
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home/>}></Route>
      </Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
      <Route path='/reset-password' element={<ResetPassword/>}></Route>
    </Routes>
  </Router>
  )
  
}