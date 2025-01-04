import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Product from './dashboard-page/Product'
import Order from './dashboard-page/Order';
import Employee from './dashboard-page/Employee';
import HomePage from './frondend-page/HomePage';
import AboutPage from './frondend-page/AboutPage';
import { Result } from 'antd';
import DashboardLayout from './layout/DashboardLayout'
import FrondendLayout from './layout/FrondendLayout';
import LoginLayout from './layout/LoginLayout';
import Login from './dashboard-page/Login';
import Profile from './dashboard-page/profile';
import PosPage from './frondend-page/PosPage';
import LoginPage from './frondend-page/LoginPage';
import Payment from './dashboard-page/Payment';
import RegisterPage from './frondend-page/RegisterPage';
import ForgotPasswordPage from './frondend-page/ForgotPasswordPage';
import ResetPasswordPage from './frondend-page/ResetPasswordPage';
import ImageFile from './dashboard-page/ImageFile';
import OrderItem from './dashboard-page/OrderItem';
import Customer from './dashboard-page/Customer';
import ProfilePage from './frondend-page/ProfilePage';

const App = () => {
  window.location.pathname.includes("/dashboard");
  return (
    <>
    <BrowserRouter basename="/">
      <Routes>

        <Route path="/" element={<FrondendLayout />}>
          <Route path="" element={<HomePage />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/>} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="product" element={<Product/>} />
          <Route path="order" element={<Order/>} />
          <Route path="order" element={<Order/>} />
          <Route path="order-item" element={<OrderItem/>} />
          <Route path="payment" element={<Payment/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="employee" element={<Employee/>} />
          <Route path="customer" element={<Customer />} />
          <Route path="image" element={<ImageFile />} />
          <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/>} />
        </Route>

        <Route path="/dashboard" element={<LoginLayout />}>
            <Route path="login" element={<Login />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </>
  )
}
export default App
