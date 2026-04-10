import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import HomePage from '../pages/HomePage'
import RegisterPage from '../pages/RegisterPage'
import AboutPage from '../pages/AboutPage'
import ServicesPage from '../pages/ServicesPage'
import AdminPage from '../pages/AdminPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
