import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import TumanLogin from './pages/TumanLogin'
import TumanDashboard from './pages/TumanDashboard'
import TumanMurojaatlar from './pages/TumanMurojaatlar'
import SuperAdminLogin from './pages/SuperAdminLogin'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import PublicDashboard from './pages/PublicDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/tuman/login" element={<TumanLogin />} />
        <Route path="/tuman/dashboard" element={<TumanDashboard />} />
        <Route path="/tuman/murojaatlar" element={<TumanMurojaatlar />} />
        <Route path="/super/login" element={<SuperAdminLogin />} />
        <Route path="/super/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin12/dashboard" element={<PublicDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

