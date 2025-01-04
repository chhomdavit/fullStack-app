import React, { useState, useEffect } from 'react'
import dayjs, { locale } from 'dayjs';
import { request } from '../util/apiUtil'
import { formatDateForClient } from "../util/serviceUtil";
import { Button, Col, ConfigProvider, DatePicker, Divider, Form, Input, Modal, Pagination, Popconfirm, Radio, Row, Select, Space, Table } from 'antd';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';


const Emplyee = () => {
  const [employee, setEmployee] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dob, setDob] = useState(dayjs());

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setItems(null);
    form.resetFields();
    setDob(dayjs());
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setItems(null);
    form.resetFields();
    setDob(dayjs());
  };

  const onChangeDay = (date, dateString) => {
    setDob(date)
  }

  useEffect(() => {
    getEmployee();
  }, [pagination.current, searchKeyword]);

  const getEmployee = async () => {
    const { current, pageSize } = pagination;
    const url = `employee?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}`;
    const res = await request('GET', url, {});
    if (res.status === 200) {
      setEmployee(res.data.list);
      setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const employeeColumns = [
    {
      title: "ID", key: "No", fixed: "left", width: "80px", fixed: 'left',
      render: (item, items, index) => String(index + 1).padStart(3, '0'),
    },
    {
      title: 'ឈ្មោះពេញ',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'ឈ្មោះត្រកូល',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'ឈ្មោះខ្លួន',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត',
      dataIndex: 'dob',
      key: 'dob',
      width: '250px',
      render: (item) => formatDateForClient(item) || "N/A",
    },
    {
      title: 'លេខទូរស័ព្ទ',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      render: (item) => item === '1' ? "Male" : "Female"
    },
    {
      title: 'អ៊ីម៉ែល',
      dataIndex: 'email',
      key: 'email',
      width: '200px',
    },
    {
      title: 'អាសយដ្ឋាន',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'មុខងារ',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '250px',
      render: (created) => formatDateForClient(created) || "N/A",
    },
    {
      title: 'last_login',
      dataIndex: 'last_login',
      key: 'last_login',
      width: '250px',
      render: (item) => formatDateForClient(item) || "N/A",
    },
    {
      title: "Action", width: "100px", key: "Action", fixed: 'right', render: (item, items) => (
        <Space>
          <Button size="small" onClick={() => onClickEdit(items)}><EditFilled /></Button>
          {/* <Button size="small"><EditFilled /></Button> */}
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

  const onFinish = async (item) => {
    setDob(dayjs());
    setIsModalOpen(false);
    const params = {};
    Object.keys(item).forEach((key) => params[key] = item[key]);
    params.dob = dob ? dob.format("YYYY-MM-DD") : null;

    var method = "post";
    var url = "employee";
    if (items !== null) {
      method = "put";
      url = `employee/${items.id}`;
    }
    const res = await request(method, url, params);
    if (res.status === 200) {
      getEmployee();
    }
  };

  const onClickEdit = (item) => {
    setItems(item);
    setIsModalOpen(true);
    const dobUpdate = item.dob ? dayjs(item.dob, "YYYY-MM-DD") : null;
    const roleUpdate = item.role ? item.role : null;
    form.setFieldsValue({
      full_name: item.full_name,
      first_name: item.first_name,
      last_name: item.last_name,
      gender: item.gender,
      email: item.email,
      role: roleUpdate,
      phone_number: item.phone_number,
      address: item.address,
    });
    setDob(dobUpdate);
  }

  return (
    <>
{/* ផ្នែក button and input search */}
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" size="large" onClick={showModal}>
          CREATE <PlusOutlined />
        </Button>
        <Input.Search
          allowClear
          placeholder="Search"
          value={searchKeyword}
          onChange={(event) => {
            setSearchKeyword(event.target.value);
            setPagination({ ...pagination, current: 1 });
          }}
        />
      </Space>
{/* ផ្នែក table and pagination */}
      <Table
        loading={employee.length === 0}
        dataSource={employee}
        columns={employeeColumns}
        pagination={false}
        scroll={{ x: 2500 }}
        rowKey={(record) => record.id}
      />
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
{/* ផ្នែក modal form */}
      <Modal
        title={items != null ? "Update !" : "Add New"}
        open={isModalOpen}
        onOk={handleOk}
        footer={null}
        width={650}
        onCancel={() => {
          form.resetFields()
          handleCancel()
        }}
      >
        <Form
          form={form}
          onFinish={(item) => {
            form.resetFields()
            onFinish(item)
          }}
          layout="vertical"
          initialValues={{
            gender: '1',
          }}
        >
          <Divider style={{ margin: "5px" }} />
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item label="full_name" name={"full_name"}>
                <Input placeholder="Enter title name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="First Name" name={"first_name"}>
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Last Name" name={"last_name"}>
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item label="email" name={"email"}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="password" name={"password"} hidden={items != null}>
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item label="Gender" name={'gender'}>
                <Radio.Group>
                  <Radio value={"1"}>Male</Radio>
                  <Radio value={"0"}>Female</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Role" name={"role"} hidden={items == null}>
                <Select
                  defaultValue="AUTHS"
                  style={{ width: 120 }}
                  options={[
                    { value: 3, label: 'AUTHS' },
                    { value: 2, label: 'ADMIN' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item label='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត' name={'dob'}>
                <ConfigProvider locale={locale}>
                  <DatePicker
                    style={{ width: '100%' }}
                    placement='BottomLeft'
                    placeholder='ថ្ងៃ-ខែ-ឆ្នាំ-កំណើត'
                    format={'DD-MM-YYYY'}
                    value={dob}
                    onChange={onChangeDay}
                  />
                </ConfigProvider>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Phone Number" name={"phone_number"}>
                <Input placeholder="Enter Phone Number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="address" name={"address"}>
                <Input.TextArea placeholder="Enter address" />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: "5px" }} />
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button danger onClick={handleCancel}>
                Cancel
              </Button>
              <Button htmlType='submit'>
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Emplyee;
