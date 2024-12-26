import React, { useState, useEffect } from 'react';
import {
  DownOutlined,
  MessageFilled,
  NotificationFilled,
  OrderedListOutlined,
  ProductFilled,
  SmileOutlined,
  SyncOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Dropdown, Layout, Menu, Space, theme } from 'antd';

const DashboardLayout = () => {
  const { Header, Content, Footer, Sider } = Layout;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const employee = JSON.parse(localStorage.getItem("response_data")) 
  const isLogin = localStorage.getItem("login") === "1";
  useEffect(() => {
    if (!isLogin) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  if (!isLogin) {
    return null;
  }

  const onChangeMenu = (item) => {
    navigate(item.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/dashboard/login");
  };

  function getItem(label, key, icon, children) {
    return { key, icon, children, label };
  }

  const items = [
    getItem('Product', '/dashboard/product', <ProductFilled />),
    getItem('Employee', '/dashboard/employee', <UsergroupAddOutlined />),
    getItem('Order', '/dashboard/order', <OrderedListOutlined />),
    getItem('Profile', '/dashboard/profile', <SmileOutlined/>),
    getItem('POS', '/dashboard/pos', <SyncOutlined spin/>),
  ];

  const itemsProfile = [
    { key: '1', label: <span onClick={() => navigate("/dashboard/profile")}>My Profile</span>, icon: <SmileOutlined/> },
    { key: '2', label: <span>Change Password</span> },
    { key: '', label: <span onClick={handleLogout}>Logout</span> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
        <Menu
          style={{ minHeight: '100vh', backgroundColor: "#333" }}
          onClick={onChangeMenu}
          theme="dark"
          defaultSelectedKeys={['/dashboard']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s ease' }}>
        <Header
          style={{
            padding: "0 10px",
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            position: 'fixed',
            top: 0,
            left: collapsed ? 80 : 200,
            right: 0,
            zIndex: 1000,
            height: 64,
            lineHeight: '64px',
          }}
        >
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            <Avatar
              src={"https://cdn.pixabay.com/photo/2013/01/14/08/40/marguerite-74886_1280.jpg"}
              style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }}
            />
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>Davit Group</div>
          </div>
          <Space
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              padding: 10,
            }}
          >
            <Badge count={4} offset={[0, 10]}>
              <MessageFilled style={{ fontSize: 24 }} />
            </Badge>
            <Badge count={2} offset={[0, 10]}>
              <NotificationFilled style={{ fontSize: 24 }} />
            </Badge>
            <Button type="link" onClick={() => navigate("/dashboard/profile")}>
                <UserOutlined />
                {employee.full_name}
              </Button>
            <Dropdown menu={{ items: itemsProfile }} placement="bottomRight">
              <Avatar style={{ width: 40, height: 40 }}>
              {employee.full_name.charAt(0).toUpperCase()}
              </Avatar>  
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ marginTop: 64, padding: 5 }}>
          <div
            style={{
              padding: 5,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;






//==========================ទំរង់សំរាប់ប្រើពេលក្រោយ=====================


// import React from 'react'
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import DashboardLayout from './component/DashboardLayout'
// import Product from './dashboard-page/Product'
// import Order from './dashboard-page/Order';
// import Employee from './dashboard-page/Employee';
// import { Result } from 'antd';

// const App = () => {
//   return (
//     <>
//     <BrowserRouter basename="/">
//       <Routes>

//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route path="product" element={<Product/>} />
//           <Route path="order" element={<Order/>} />
//           <Route path="employee" element={<Employee/>} />

//           <Route path="*" element={<Result status="404" title="404" subTitle="Sorry, the page you visited does not exist."/>} />
//         </Route>

//         <Route path="/dashboard" element={<LoginLayout />}>
//         <Route path="login" element={<LoginPage />} />
//         </Route> 
      
//       </Routes>
//     </BrowserRouter>
//   </>
//   )
// }

// export default App

//==========================ទំរង់សំរាប់ប្រើពេលក្រោយ=====================

// import React, { useState } from 'react';
// import {
//   MessageFilled,
//   NotificationFilled,
//   OrderedListOutlined,
//   ProductFilled,
//   UsergroupAddOutlined,
// } from '@ant-design/icons';
// import { Outlet, useNavigate } from "react-router-dom";
// import { Avatar, Badge, Dropdown, Layout, Menu, Space, theme } from 'antd';

// const DashboardLayout = () => {
//   document.title = "Dashboard";
//   const { Header, Content, Footer, Sider } = Layout;
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const { token: { colorBgContainer } } = theme.useToken();

//   const onChangeMenu = (item) => {
//     navigate(item.key);
//   };

//   const handleLogout = () => {
//     localStorage.setItem("isLogin", "0");
//     window.location.href = "/dashboard/login";
//   };

//   function getItem(label, key, icon, children) {
//     return { key, icon, children, label };
//   }

//   const items = [
//     getItem('Product', '/dashboard/product', <ProductFilled />),
//     getItem('Employee', '/dashboard/employee', <UsergroupAddOutlined />),
//     getItem('Order', '/dashboard/order', <OrderedListOutlined />),
//     getItem('Empty', '/dashboard/empty', <OrderedListOutlined />),
//   ];

//   const itemsProfile = [
//     { key: '1', label: <span>My Account</span> },
//     { key: '2', label: <span>Change Password</span> },
//     { key: '3', label: <span>Address</span> },
//     { key: '4', label: <span onClick={handleLogout}>Logout</span> },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
//         <Menu
//           style={{ minHeight: '100vh', backgroundColor: "#333" }}
//           onClick={onChangeMenu}
//           theme="dark"
//           defaultSelectedKeys={['/dashboard']}
//           mode="inline"
//           items={items}
//         />
//       </Sider>
//       <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s ease' }}>
//         <Header
//           style={{
//             padding: "0 10px",
//             background: colorBgContainer,
//             display: 'flex',
//             justifyContent: 'space-between',
//             position: 'fixed',
//             top: 0,
//             left: collapsed ? 80 : 200,
//             right: 0,
//             zIndex: 1000,
//             height: 64,
//             lineHeight: '64px',
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
//             <Avatar
//               src={"https://cdn.pixabay.com/photo/2013/01/14/08/40/marguerite-74886_1280.jpg"}
//               style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }}
//             />
//             <div style={{ fontSize: "16px", fontWeight: "bold" }}>Davit Group</div>
//           </div>
//           <Space
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 20,
//               padding: 10,
//             }}
//           >
//             <Badge count={4} offset={[0, 10]}>
//               <MessageFilled style={{ fontSize: 24 }} />
//             </Badge>
//             <Badge count={2} offset={[0, 10]}>
//               <NotificationFilled style={{ fontSize: 24 }} />
//             </Badge>
//             <Dropdown menu={{ items: itemsProfile }} placement="bottomRight">
//               <Avatar
//                 style={{ width: 40, height: 40 }}
//                 src={"https://cdn.pixabay.com/photo/2013/01/14/08/40/marguerite-74886_1280.jpg"}
//               />
//             </Dropdown>
//           </Space>
//         </Header>
//         <Content style={{ marginTop: 64, padding: 10 }}>
//           <div
//             style={{
//               padding: 5,
//               minHeight: 360,
//               background: colorBgContainer,
//             }}
//           >
//             <Outlet />
//           </div>
//         </Content>
//         <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
//       </Layout>
//     </Layout>
//   );
// };

// export default DashboardLayout;
