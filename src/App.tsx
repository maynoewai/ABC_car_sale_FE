import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarDetailsPage from './pages/CarDetailsPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CarListingPage from './pages/CarListingPage';
import SellCarPage from './pages/SellCarPage';
import AboutUSPage  from './pages/AboutUSPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="cars/:id" element={<CarDetailsPage />} />
        <Route path="cars/list" element={<CarListingPage />} />
        <Route path="sell-car" element={<SellCarPage />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="about-us" element={<AboutUSPage />} />
        

          <Route path="admin/*" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;