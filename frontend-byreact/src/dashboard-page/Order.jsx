import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Pagination, Popconfirm, Row, Select, Space, Spin, Table } from 'antd'
import { DeleteFilled, EditFilled } from '@ant-design/icons'
import { request } from '../util/apiUtil'
import { formatDateForClient } from '../util/serviceUtil'

const Order = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([])
  const [orderItem, setOrderItem] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    getOrder();
    getOrderItem();
  }, [pagination.current, searchKeyword]);

  const getOrderItem = async (id) => {
    if (!id) {
      console.warn("Order ID is undefined. Skipping API call.");
      return;
    }
    setLoading(true);
    const res = await request('GET', `order-items/${id}`);
    if (res.status === 200) {
      setOrderItem(res.data.response_data);
      setLoading(false);
    }
  }

  const getOrder = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const url = `orders/order-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}`;
    const res = await request("get", url, {});
    if (res.status === 200) {
      setOrder(res.data.list);
      setPagination({ ...pagination, total: res.data.totalElements });
      setLoading(false);
    } else {
      console.error("Error fetching order:", res);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const onClickEditBySelect = (orderId, newStatus) => { 
      const param = { order_status: newStatus };
      const res = request("PUT", `orders/${orderId}`, param);
      if (res.status === 200) {
        getOrder();
      } else {
        console.error("Failed to update order status:", res);
      } 
  };

  const OrderColumns = [
    {
      title: "លរ", 
      key: "No", 
      fixed: "left", 
      width: "50px",
      render: (item, items, index) => String(index + 1).padStart(3, '0'),
    },
    {
      title: "ឈ្មោះ", 
      dataIndex: ["customer", "name"], 
      key: "customer",
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 5,
      },
    },
    {
      title: "តំលៃត្រូវបង់ប្រាក់", 
      dataIndex: "bill", 
      key: "bill", 
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item != null ? `${item.toFixed(2)} $` : "N/A"}
        </p>
      ),
    },
    {
      title: "តំលៃសរុបទំនិញ", 
      dataIndex: "subTotal", 
      key: "subTotal", 
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item != null ? `${item.toFixed(2)} $` : "N/A"}
        </p>
      ),
    },
    {
      title: "បញ្ចុះតំលៃ(%)", 
      dataIndex: "discount", 
      key: "discount", 
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item != null ? `${item.toFixed(2)} %` : "N/A"}
        </p>
      ),
    },
    {
      title: "ពន្ធ(%)", 
      dataIndex: "tax",
       key: "tax", 
       render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold" }}>
          {item != null ? `${item.toFixed(2)} %` : "N/A"}
        </p>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      width: "250px",
      render: (item, record) => {
        return (
          <Select
            defaultValue={item}
            style={{ width: 200 }}
            onChange={(value) => onClickEditBySelect(record.id, value)}
            options={[
              {
                label: <span>Payment Method</span>,
                title: 'Payment Method',
                options: [
                  { label: <span style={{color: "green"}}>SUCCESS</span>, value: 'SUCCESS' },
                  { label: <span style={{color: "gold"}}>PENDING</span>, value: 'PENDING' },
                  { label: <span style={{color: "red"}}>FAILED</span>, value: 'FAILED' },
                ],
              },
              {
                label: <span>Order Status</span>,
                title: 'Order Status',
                options: [
                  { label: <span style={{color: "blue"}}>PREPARING</span>, value: 'PREPARING' },
                  { label: <span style={{color: "#00b7eb"}}>OUT_FOR_DELIVERY</span>, value: 'OUT_FOR_DELIVERY' },
                  { label: <span style={{color: "#ff69b4"}}>DELIVERED</span>, value: 'DELIVERED' },
                ],
              },
            ]}
          />
        );
      }
    },
    { title: "Payment", dataIndex: ["payment", "payment_method"], key: "payment" },
    { title: "Create At", dataIndex: "created_at", key: "created_at", render: (created) => formatDateForClient(created) },
    { title: "Update At", dataIndex: "updated_at", key: "updated_at", render: (updated) => updated ? formatDateForClient(updated) : "N/A" },
    {
      title: "Action", 
      width: "75px", 
      key: "Action", 
      fixed: 'right', 
      render: (item, items) => (
        <Space>
          <Button size="small" onClick={() => onClickEdit(items)}><EditFilled /></Button>
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

  const orderItemColumns = [
    { title: "ID", render: (item, items, index) => index + 1, key: "No", fixed: 'left', width: "50px" },
    { title: "Customer Name", dataIndex: ["customer", "name"], key: "customerName" },
    { title: "Product Name", dataIndex: ["product", "name"], key: "productName" },
    { title: "Quantity", dataIndex: "quantity_order", key: "quantity_order" },
    { title: "Price", dataIndex: "total_price", key: "total-Price" },
    {
      title: "Action", width: "75px", key: "Action", fixed: 'right', render: (item, items) => (
        <Space>
          <Button size="small" onClick={() => alert(items)}><EditFilled /></Button>
          <Popconfirm
            placement="topLeft"
            title={"Delete"}
            description={"Are sure to remove!"}
            onConfirm={() => alert(items.id)}
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

      <Row gutter={[8, 8]}>
        <Col span={16}>
          <Input.Search
            allowClear
            placeholder="Search"
            value={searchKeyword}
            onChange={(event) => {
              setSearchKeyword(event.target.value);
              setPagination({ ...pagination, current: 1 });
            }}
          />
          <Spin spinning={loading}>
            <Table
              loading={order.length === 0}
              dataSource={order}
              size="small"
              columns={OrderColumns}
              scroll={{ x: 1700 }}
              pagination={false}
              rowKey={(record) => record.id}
              onRow={(item) => ({
                onClick: () => {
                  if (item?.id) {
                    getOrderItem(item.id);
                  } else {
                    console.warn("No ID found for the clicked row.");
                  }
                },
              })}
            />
          </Spin>
          <Pagination
            style={{ marginTop: 20, textAlign: "center" }}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["1", "3", "5"]}
            showTotal={(total, range) => (
              <span style={{ fontSize: "14px", color: "#999" }}>
                {`Showing ${range[0]}-${range[1]} of ${total} items`}
              </span>
            )}
          />
        </Col>
        <Col span={8}>
          <Spin spinning={loading}>
            <Table
              dataSource={orderItem}
              pagination={false}
              scroll={{ x: 600 }}
              columns={orderItemColumns}
            />
          </Spin>
        </Col>
      </Row>
    </>
  )
}

export default Order
