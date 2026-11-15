import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import CourtsPage from './pages/customer/CourtsPage';
import CourtDetailPage from './pages/customer/CourtDetailPage';
import BookingPage from './pages/customer/BookingPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import AdminCourtsPage from './pages/admin/AdminCourtsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Masuk dashboard customer */}
        <Route path='/customer/dashboard' element={
           <ProtectedRoute allowedRole="customer">
             {<CustomerDashboardPage />} 
           </ProtectedRoute>
          }
        />

        {/* Masuk dashboard admin */}
        <Route path='/admin/dashboard' element={
           <ProtectedRoute allowedRole="admin">
             {<AdminDashboardPage />} 
           </ProtectedRoute>
          }
        />

        {/* Halaman manajemen lapangan admin */}
        <Route path='/admin/courts' element={
            <ProtectedRoute allowedRole='admin'>
              <AdminCourtsPage />
            </ProtectedRoute>
          }
        />

        {/* Halamam data bookings admin */}
        <Route path='/admin/bookings' element={
           <ProtectedRoute allowedRole="admin">
             {<AdminBookingsPage />} 
           </ProtectedRoute>
          }
        />

        {/* Halaman booking lapangan */}
        <Route path='/customer/courts' element={
          <ProtectedRoute allowedRole='customer'>
            <CourtsPage />
          </ProtectedRoute>
        }
        />

        {/* Halaman detail lapangan */}
        <Route path='/customer/courts/:id' element={
          <ProtectedRoute allowedRole='customer'>
            <CourtDetailPage />
          </ProtectedRoute>
        }
        />

        {/* Halaman detail booking customer */}
        <Route
          path="/customer/courts/:id/book"
          element={
            <ProtectedRoute allowedRole="customer">
              <BookingPage />
            </ProtectedRoute>
          }
        />

        {/* Halaman Booking Saya */}
        <Route
          path='/customer/bookings'
          element={
            <ProtectedRoute allowedRole='customer'>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Halaman profil customer */}
        <Route
          path='/customer/profile'
          element={
            <ProtectedRoute allowedRole='customer'>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App