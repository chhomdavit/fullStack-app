import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Product from './dashboard-page/Product'
import Order from './dashboard-page/Order';
import Employee from './dashboard-page/Employee';
import HomePage from './frondend-page/HomePage';
import AboutPage from './frondend-page/AboutPage';
import { Result } from 'antd';
import DashboardLayout from './component/DashboardLayout'
import FrondendLayout from './component/FrondendLayout';
import LoginLayout from './component/LoginLayout';
import LoginPage from './frondend-page/LoginPage';
import Profile from './dashboard-page/profile';

const App = () => {
  window.location.pathname.includes("/dashboard");
  return (
    <>
    <BrowserRouter basename="/">
      <Routes>

        <Route path="/" element={<FrondendLayout />}>
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/>} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="product" element={<Product/>} />
          <Route path="order" element={<Order/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="employee" element={<Employee/>} />
          <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/>} />
        </Route>

        <Route path="/dashboard" element={<LoginLayout />}>
            <Route path="login" element={<LoginPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </>
  )
}
export default App
