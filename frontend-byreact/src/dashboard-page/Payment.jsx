import React, {useState, useEffect} from 'react';
import { request } from '../util/apiUtil';
import { Button, Popconfirm, Space, Table } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';


const Payment = () => {
  const [payment, setPayment] = useState();

  useEffect(() => {
    getPayment();
  }, []);

  const getPayment = async () => {
    const res = await request('GET', 'payments');
    if (res.status === 200) {
      setPayment(res.data.response_data);
    }
  }

  const paymentColunms = [
    {
       title: "លរ",
       key: "No", 
       fixed: "left", 
       width: "50px",
      render: (item, items, index) => String(index + 1).padStart(3, '0'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item != null ? `$ ${item.toFixed(2)} ` : "N/A"}
        </p>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item}
        </p>
      ),
    },
    {
      title: 'Payment Status Method',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item}
        </p>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'payment_description',
      key: 'payment_description',
      render: (item) => (
        <p style={{ fontSize: "12px", fontWeight: "bold" }}>
          {item}
        </p>
      ),
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
            // onConfirm={() => onClickDelete(items.id)}
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
      loading={payment === 0}
      columns={paymentColunms}
      dataSource={payment}
      rowKey="id"
      pagination={{ pageSize: 5 }}
     />
    </>
  )
}

export default Payment;
