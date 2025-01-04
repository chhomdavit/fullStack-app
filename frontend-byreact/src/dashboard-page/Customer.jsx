import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { request } from '../util/apiUtil';

function Customer() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    const res = await request('GET', 'customers');
    console.log(res);
    if (res.status === 200) {
      setCustomers(res.data);
    }
  };

  const handleDelete = (id) => {
    console.log(`Deleting customer with ID: ${id}`);
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const customerColumns = [
    {
      title: 'លរ',
      key: 'No',
      fixed: 'left',
      width: '50px',
      render: (item, items, index) => String(index + 1).padStart(3, '0'),
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      filters: [
        { text: 'User', value: 'USER' },
        { text: 'Admin', value: 'ADMIN' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Last Login',
      key: 'last_login',
      dataIndex: 'last_login',
      sorter: (a, b) => new Date(a.last_login) - new Date(b.last_login),
    },
    {
      title: 'Created',
      key: 'created',
      dataIndex: 'created',
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
    },
    {
      title: 'Verified',
      key: 'is_verified',
      dataIndex: 'is_verified',
      render: (isVerified) => (isVerified ? 'Yes' : 'No'),
      filters: [
        { text: 'Verified', value: true },
        { text: 'Not Verified', value: false },
      ],
      onFilter: (value, record) => record.is_verified === value,
    },
    {
        title: "Action", 
        width: "75px", 
        key: "Action", 
        fixed: 'right', 
        render: (item, items) => (
          <Space>
            <Button size="small"><EditFilled /></Button>
            <Popconfirm
              placement="topLeft"
              title={"Delete"}
              description={"Are sure to remove!"}
              onConfirm={() => onClickDelete(items.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small"><DeleteFilled /></Button>
            </Popconfirm>
          </Space>
        )
      }
  ];

  return (
    <>
      <Table
        columns={customerColumns}
        dataSource={customers}
        rowKey="id"
        pagination={{ pageSize: 2, total: customers.length }}
        scroll={{ x: 1600 }}
        loading={customers.length === 0}
        bordered={true}
        size="small"
      />
    </>
  );
}

export default Customer;



// import React,{useEffect,useState} from 'react';
// import { request } from '../util/apiUtil';
// import { Table } from 'antd';


// function Customer() {
//     const [customers, setCustomers] = useState([]);

//     useEffect(() => {
//         getCustomers();
//     }, []);

//     const getCustomers = async () => { 
//         const res = await request( 'GET', 'customers');
//         console.log(res);
//         if(res.status === 200) {
//             setCustomers(res.data);
//         }
//     };

//     const customerColumns = [
//         {
//             title: "លរ", 
//             key: "No", 
//             fixed: "left", 
//             width: "50px",
//             render: (item, items, index) => String(index + 1).padStart(3, '0'),
//         },
//         {
//             title: "email", 
//             key: "email", 
//             dataIndex:"email"
//         },
//         {
//             title: "status", 
//             key: "status", 
//             dataIndex:"status"
//         },
//         {
//             title: "role", 
//             key: "role", 
//             dataIndex:"role"
//         },
//         {
//             title: "last_login", 
//             key: "last_login", 
//             dataIndex:"last_login"
//         },
//         {
//             title: "created", 
//             key: "created", 
//             dataIndex:"created"
//         },
//         {
//             title: "is_verified", 
//             key: "is_verified", 
//             dataIndex:"is_verified"
//         },
//     ];

//   return (
//     <>
//       <Table 
//         columns={customerColumns} 
//         dataSource={customers} 
//         rowKey="id" 
//         pagination={{ pageSize: 2, total: customers.length }} 
//         scroll={{ x: 1500 }} 
//         loading={customers.length === 0} 
//         bordered={true} 
//         size="small"
//       />
//     </>
//   )
// }

// export default Customer;
