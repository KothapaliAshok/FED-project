import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Borrow from './pages/Borrow';
import Reservations from './pages/Reservations';
import Fines from './pages/Fines';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="borrow" element={<Borrow />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="fines" element={<Fines />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Legacy redirects for old routes */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/books" element={<Navigate to="/app/books" replace />} />
        <Route path="/borrow" element={<Navigate to="/app/borrow" replace />} />
        <Route path="/reservations" element={<Navigate to="/app/reservations" replace />} />
        <Route path="/fines" element={<Navigate to="/app/fines" replace />} />
        <Route path="/users" element={<Navigate to="/app/users" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
