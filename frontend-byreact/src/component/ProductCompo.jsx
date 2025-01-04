import React, { useEffect, useState } from 'react';
import { request, Config } from '../util/apiUtil';
import { Col, Divider, Row, Menu, Card, Avatar, Image, Pagination, AutoComplete, Input, Modal, Button } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
const { Meta } = Card;

function ProductCompo() {
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getCategory();
    getProduct();
  }, [pagination.current, searchKeyword, selectedCategory]);

  const getCategory = async () => {
    const res = await request('GET', `categories`);
    if (res.status === 200) {
      setCategory(res.data);
    }
  };

  const getProduct = () => {
    const { current, pageSize } = pagination;
    const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
    const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
    request("get", url, {}).then(res => {
      if (res.status === 200) {
        setProduct(res.data.list);
        setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
        autoSuggestions(res.data.list);
      }
    })
      .catch(error => {
        console.error("Error fetching list product:", error);
      });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchKeyword("");
    setPagination({ ...pagination, current: 1 });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setSelectedCategory("");
    setPagination({ ...pagination, current: 1 });
  };

  const autoSuggestions = (products) => {
    const productNames = products.map(item => ({
      value: item.name,
      id: item.productId
    }));
    setSuggestions(productNames);
  };

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  const onClickViewContent = (item) => {
    const content =
      `<div>
        <p>${item.name}</p>
        <p>${item.description}</p>
        <p>${item.barcode}</p>
        <p>${item.price ? `${item.price.toFixed(2)} $` : "N/A"}</p>
        <p>${item.product_quantity ? `${item.product_quantity} Qty` : "N/A"}</p>
        ${item.product_image ? `<div><img src="${Config.image_path + item.product_image}" alt="${item.name}" style="max-width:50%; height:auto; border:1px solid #ddd; border-radius:4px; padding:5px;"/></div>` : "<p>N/A</p>"}
      </div>`;
    setSelectedDescription(content);
    setIsDescriptionModalOpen(true);
  };

  const itemCategory = [
    {
      label: 'CATEGORY',
      type: 'group',
      children: [
        {
          key: "",
          label: "All"
        },
        ...category.map((cat) => ({
          key: cat.id.toString(),
          label: cat.name,
        })),
      ],
    },
  ];

  return (
    <>
      <marquee>
        <Divider orientation="left" style={{ borderColor: '#7cb305' }}>PRODUCT</Divider>
      </marquee>
      <div style={{
        margin: 'auto',
        maxWidth: '1200px'
      }}>
        <Row gutter={[10, 10]}>
          <Col span={6}>
            <Menu
              onClick={(e) => handleCategoryClick(e.key)}
              defaultSelectedKeys={['']}
              mode="inline"
              items={itemCategory}
            />
          </Col>

          <Col span={18}>
            <Row gutter={[15, 15]}>
              <Col span={24}>
                <AutoComplete
                  options={suggestions.map(sug => ({ value: sug.value }))}
                  style={{ width: '100%' }}
                  onSearch={handleSearch}
                  onSelect={(value) => handleSearch(value)}
                  placeholder="Search"
                  value={searchKeyword}
                >
                  <Input.Search size="large" allowClear />
                </AutoComplete>
              </Col>
              {product.map((item) => (
                <Col key={item.id} span={8}>
                  <Card
                    style={{
                      width: 300,
                    }}
                    hoverable
                    cover={
                      <Image
                        alt={item.name}
                        preview={false}
                        src={item.product_image ? `${Config.image_path}${item.product_image}` : 'https://via.placeholder.com/150'}
                        style={{ height: 200, objectFit: "cover", marginTop: "10px" }}
                      />
                    }
                    actions={[
                      <ShoppingCartOutlined key="product_id" onClick={() => handleCreatCart(item)} />,
                      <EyeOutlined key="description" onClick={() => onClickViewContent(item)} />
                    ]}
                  >
                    <Meta
                      avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                      title={item.created_by.full_name}
                      description={
                        <div style={{ height: "60px", color: "black" }}>
                          <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                            {item.name}<br />
                          </span>
                          <span>
                            តម្លែរាយ: {item.price != null ? `${item.price} $` : 'N/A'}
                          </span>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              style={{ marginTop: 20, textAlign: 'center', justifyContent: "center" }}
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["1", "3", "5"]}
              showTotal={(total, range) => (
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {`Showing ${range[0]}-${range[1]} of ${total} items`}
                </span>
              )}
            />
          </Col>
        </Row>
      </div>

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
        <div dangerouslySetInnerHTML={{ __html: selectedDescription }} />
      </Modal>

    </>
  );
}

export default ProductCompo;

