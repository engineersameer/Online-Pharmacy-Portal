import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Welcome from '../pages/Welcome';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Placeholder components for other routes
const CustomerHome = () => <div className="p-4">Customer Home</div>;
const CustomerOrders = () => <div className="p-4">Customer Orders</div>;
const CustomerProfile = () => <div className="p-4">Customer Profile</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard</div>;
const AdminManageOrders = () => <div className="p-4">Manage Orders</div>;
const AdminUsers = () => <div className="p-4">Manage Users</div>;

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout><Welcome /></MainLayout>} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Customer routes */}
      <Route path="/customer">
        <Route index element={<MainLayout><CustomerHome /></MainLayout>} />
        <Route path="orders" element={<MainLayout><CustomerOrders /></MainLayout>} />
        <Route path="profile" element={<MainLayout><CustomerProfile /></MainLayout>} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin">
        <Route index element={<MainLayout><AdminDashboard /></MainLayout>} />
        <Route path="orders" element={<MainLayout><AdminManageOrders /></MainLayout>} />
        <Route path="users" element={<MainLayout><AdminUsers /></MainLayout>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 