import { useState, useEffect } from "react"
import { request, Config } from "../util/apiUtil";
import { formatDateForClient } from "../util/serviceUtil";
import { Button, Image, Modal, Table, Form, Divider, Input, Row, Col, Upload, Space, Popconfirm, Pagination, AutoComplete, message, Select, InputNumber, Menu } from "antd";
import { DeleteFilled, EditFilled, EyeOutlined, PlusOutlined } from '@ant-design/icons';

function Product() {

  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form] = Form.useForm();
  const [items, setItems] = useState(null)
  const [suggestions, setSuggestions] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewDescription, setViewDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);


  // const onClickViewContent = (item) => {
  //   setViewDescription(item.description);
  //   setIsDescriptionModalOpen(true);
  // };

  const onClickViewContent = (item) => {
    const content =
      `<div>
        <p>${item.name}</p>
        <p>${item.description}</p>
        <p>${item.barcode}</p>
        <p>${item.price ? `${item.price.toFixed(2)} $` : "N/A"}</p>
        <p>${item.product_quantity ? `${item.product_quantity} Qty` : "N/A"}</p>
        ${item.product_image ? `<div><img src="${Config.image_path + item.product_image}" alt="${item.name}" style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:4px; padding:5px;"/></div>` : "<p>N/A</p>"}
      </div>`;
    setViewDescription(content);
    setIsDescriptionModalOpen(true);
  };


  useEffect(() => {
    getProduct();
    getCategory();
  }, [pagination.current, searchKeyword, selectedCategory]);

  const productColumns = [
    {
      title: "ID", key: "No", fixed: "left", width: "50px",
      render: (item, items, index) => String(index + 1).padStart(3, '0'),
    },
    {
      title: "Product Name", dataIndex: "name", key: "name",
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 5,
      },
    },
    {
      title: "Description", dataIndex: "description", key: "description",
      render: (_, item) => (
        <Button onClick={() => onClickViewContent(item)}>
          View <EyeOutlined />
        </Button>
      ),
    },
    { title: "Barcode", dataIndex: "barcode", key: "barcode" },
    { title: "CreateBy", dataIndex: ["created_by", "full_name"], key: "full_name" },
    { title: "Category", dataIndex: ["category", "name"], key: "name" },
    {
      title: "Price", dataIndex: "price", key: "price",
      render: (item) => (
        <p style={{ color: "#1c1cf0", fontSize: "16px", fontWeight: "bold", textDecoration: "underline", }}>
          {item != null ? `${item.toFixed(2)} $` : "N/A"}
        </p>
      ),
    },
    {
      title: "Quantity", dataIndex: "product_quantity", key: "product_quantity",
      render: (item) => (
        <p style={{ color: "#34495e", fontSize: "16px", fontWeight: "bold", textDecoration: "underline", }}>
          {item != null ? `${item} Qty` : "N/A"}
        </p>
      ),
    },
    { title: "Create At", dataIndex: "created_at", key: "created_at", render: (created) => formatDateForClient(created) },
    { title: "Update At", dataIndex: "updated_at", key: "updated_at", render: (updated) => updated ? formatDateForClient(updated) : "N/A" },
    {
      title: "Image", key: "product_image", dataIndex: 'product_image',
      render: (item) => {
        return (
          <Image
            width={80} height={60}
            style={{ borderRadius: 5, boxShadow: "10px 10px 15px -6px rgba(56,19,19,0.84)" }}
            src={Config.image_path + item} alt={item}
          />
        )
      }
    },
    {
      title: "Action", width: "75px", key: "Action", fixed: 'right', render: (item, items) => (
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

  const clear = () => {
    setIsModalOpen(false);
    form.resetFields();
    setItems(null)
    setFileList([]);
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    clear();
  };
  const handleCancel = () => {
    clear()
  };

  const getCategory = () => {
    request("get", "categories", {}).then((res) => {
      if (res.status === 200) {
        setCategory(res.data);
      }
    })
  }

  const getProduct = () => {
    const { current, pageSize } = pagination;
    const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
    const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
    request("get", url, {})
      .then((res) => {
        if (res.status === 200) {
          setProduct(res.data.list);
          setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
          autoSuggestions(res.data.list);
        }
      })
      .catch((error) => {
        console.error("Error fetching list product:", error);
      });
  }

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setSelectedCategory("");
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchKeyword("");
    setPagination({ ...pagination, current: 1 });
  };

  const autoSuggestions = (products) => {
    const productNames = products.map((item) => ({
      value: item.barcode,
      value: item.name,
      id: item.productId,
    }));
    setSuggestions(productNames);
  };


  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const onFinish = async (item) => {
    setIsModalOpen(false);
    setFileList([]);

    var formData = new FormData();
    Object.keys(item).forEach((key) => formData.append(key, item[key]));
    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }
    const method = items ? "put" : "post";
    const url = items ? `products/${items.id}` : "products";
    const res = await request(method, url, formData);
    if (res.status === 200) {
      message.success(res.data.message);
      setItems(null);
      getProduct();
    }
  };

  const onClickEdit = (item) => {
    setIsModalOpen(true);
    setItems(item)
    const categoryId = item.category ? item.category.id : undefined;
    console.log(categoryId)
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      product_quantity: item.product_quantity,
      price: item.price,
      category_id: categoryId
    });
    setFileList([
      {
        uid: '-1',
        url: Config.image_path + item.product_image,
      }
    ]);
  }

  const onClickDelete = (id) => {
    request("delete", "products/hardDelete/" + id, {}).then(res => {
      if (res.status === 200) {
        getProduct();
      }
    })
  };

  const [fileList, setFileList] = useState([]);
  const handleChange = (info) => { setFileList(info.fileList.slice(-1)); };
  const uploadButton = (
    <div>
      <PlusOutlined /> <div style={{ marginTop: 8 }}> Upload</div>
    </div>
  );

  return (
    <>
      <Menu
        mode="horizontal"
        selectedKeys={[selectedCategory]}
        onClick={(e) => handleCategoryClick(e.key)}
        style={{ marginBottom: 20 }}
      >
        <Menu.Item key="">All</Menu.Item>
        {category.map((cat) => (
          <Menu.Item key={cat.id}>{cat.name}</Menu.Item>
        ))}
      </Menu>
      <Space style={{ margin: "10px" }}>
        <Button type="primary" size="large" onClick={showModal}>
          CREATE <PlusOutlined />
        </Button>

        <AutoComplete
          options={suggestions.map((sug) => ({ value: sug.value }))}
          onSearch={handleSearch}
          onSelect={(value) => handleSearch(value)}
          placeholder="Search"
          value={searchKeyword}
        >
          <Input.Search size="large" allowClear />
        </AutoComplete>
      </Space>

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
            price: 1.0,
            product_quantity: 1,
            category_id: category.length > 0 ? category[0].id : undefined,
          }}
        >
          <Divider style={{ margin: "5px" }} />
          <Form.Item label="Name" name={"name"}>
            <Input placeholder="Enter title name" />
          </Form.Item>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item label="Description" name={"description"}>
                <Input.TextArea placeholder="Enter content description" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Quality" name={"product_quantity"}>
                <Input placeholder="Enter Quality" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Row gutter={[24, 24]}>
                <Form.Item label="Price" name={"price"}>
                  <Input placeholder="Enter Price" />
                </Form.Item>
              </Row>
              <Row gutter={[24, 24]}>
                <Form.Item label="Category" name="category_id">
                  <Select placeholder="Select Category" allowClear>
                    {category.map((item, index) => (
                      <Select.Option key={index.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Row>

            </Col>

            <Col span={12}>
              <Form.Item label="Image Upload" name={"file"} enctype="multipart/form-data">
                <Upload
                  name="file"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
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
                {items != null ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ================================================ */}

      <Modal
        title="Details"
        open={isDescriptionModalOpen}
        onCancel={() => setIsDescriptionModalOpen(false)}
        width={650}
        footer={[
          <Button key="close" onClick={() => setIsDescriptionModalOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <Divider />
        <div dangerouslySetInnerHTML={{ __html: viewDescription }} />
      </Modal>

      {/* ================================================ */}

      <Table
        dataSource={product}
        size="small"
        columns={productColumns}
        scroll={{ x: 1300 }}
        pagination={false}
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
    </>
  )
}

export default Product;
