import React, { useEffect, useState } from 'react';
import { request } from '../util/apiUtil';
import dayjs from 'dayjs';
import { Button, DatePicker, message, Popconfirm, Space, Table } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import ExcelexportUtil from "../util/ExcelexportUtil";
import { formatDateForClient } from '../util/serviceUtil';

function OrderItem() {
    const [orderItems, setOrderItems] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getOrderItems();
    }, []);

    const getOrderItems = async () => {
        const res = await request('GET', 'order-items');
        console.log(res);
        if (res.status === 200) {
            setOrderItems(res.data.response_data);
        }
    };

    const orderItemColumns = [
        {
            title: "ID", render: (item, items, index) => index + 1,
            key: "No",
            fixed: 'left',
            width: "50px"
        },
        {
            title: "Customer Name",
            dataIndex: ["customer", "name"],
            key: "customerName"
        },
        {
            title: "Product Name",
            dataIndex: ["product", "name"],
            key: "productName"
        },
        {
            title: "Quantity",
            dataIndex: "quantity_order",
            key: "quantity_order"
        },
        {
            title: "Price",
            dataIndex: "total_price",
            key: "total_Price"
        },
        { 
            title: "Create At", 
            dataIndex: "created_at",
            key: "created_at", 
            render: (created) => formatDateForClient(created) 
        },
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

    const filterDataByDate = () => {
        if (!startDate || !endDate) {
            message.error("Please select both start and end dates.");
            return;
        }

        const filtered = orderItems.filter((item) => {
            const itemDate = dayjs(item.created_at);
            return itemDate.isAfter(dayjs(startDate)) && itemDate.isBefore(dayjs(endDate).add(1, "day"));
        });

        const mappedData = filtered.map((item) => ({
            OrderID: item.id,
            CustomerName: item.customer?.name || "N/A",
            ProductName: item.product?.name || "N/A",
            Quantity: item.quantity_order,
            TotalPrice: item.total_price,
            CreatedDate: item.created_at ? dayjs(item.created).format("YYYY-MM-DD HH:mm") : "N/A",
        }));

        setFilteredData(mappedData);
        message.success("Data filtered successfully.");
    };

    const getExportFileName = () => {
        const start = startDate ? dayjs(startDate).format('YYYY-MM-DD') : 'start';
        const end = endDate ? dayjs(endDate).format('YYYY-MM-DD') : 'end';
        return `OrderItems_${start}_to_${end}`;
    };

    return (
        <div>
            <Space style={{ margin: "10px", padding: "10px" }}>
                <span>Start</span>
                <DatePicker onChange={(date) => setStartDate(date)} />
                <span>End</span>
                <DatePicker onChange={(date) => setEndDate(date)} />
                <Button onClick={filterDataByDate}>Filter</Button>
                <ExcelexportUtil data={filteredData} fileName={getExportFileName()} />
            </Space>
            <Table
                loading={orderItems === 0}
                columns={orderItemColumns}
                dataSource={orderItems}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 }}
                bordered
            />
        </div>
    )
}

export default OrderItem;
