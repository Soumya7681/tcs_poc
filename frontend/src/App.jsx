import { lazy, Suspense } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'


const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));



function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading.........</div>}>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route path='/' element={<Navigate to="/dashboard" replace/>}/>
          <Route path='*' element={<Navigate to="/login" replace/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
