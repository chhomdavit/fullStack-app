import React, { useState, useEffect } from 'react';
import { Affix, Menu, AutoComplete, Input, Pagination, Card, Splitter, InputNumber, Image, Button, Modal, Spin, Divider, Col, Row, message, Avatar, List } from 'antd';
import { DeleteOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { request, Config } from '../util/apiUtil';
import { colors, startColorChangeInterval } from '../util/colorUtil';
import JsbarcodeUtil from '../util/jsbarcodeUtil';
import usePrint from '../util/printUtil';
import dayjs from 'dayjs';

function PosPage() {
  const customerProfile = JSON.parse(localStorage.getItem("response_data_customer"))
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [card, setCard] = useState([]);
  const colorList = colors();
  const [backgroundColor, setBackgroundColor] = useState(colorList[1]);
  const [subTotal, setSubTotal] = useState(0);
  const [billUSD, setBillUSD] = useState(0);
  const [billRiel, setBillRiel] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [cashReceivedRiel, setCashReceivedRiel] = useState(0);
  const [cashReceivedUSD, setCashReceivedUSD] = useState(0);
  const [cashChange, setCashChange] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 3, total: 0, });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const componentRef = React.useRef(null);
  const printFn = usePrint(componentRef);
  const exchangeRate = 4100;
  const [orderId, setOrderId] = useState("");


  useEffect(() => {
    const colorChangeInterval = startColorChangeInterval(
      setBackgroundColor
    );
    return () => clearInterval(colorChangeInterval);
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [card, tax, discount, cashReceived, cashReceivedRiel]);

  useEffect(() => {
    getProduct();
    getCategory();
    getCard();
  }, [pagination.current, searchKeyword, selectedCategory]);

  const showModal = () => {
    setIsModalOpen(true);
    setOrderId(`ORD-${Date.now()}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleClear();
  };

  const getCategory = async () => {
    const response = await request('GET', `categories`);
    if (response.status === 200) {
      setCategory(response.data);
    }
  }

  const getProduct = () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const categoryFilter = selectedCategory ? `&categoryId=${selectedCategory}` : "";
    const url = `products/product-pagination?keyword=${searchKeyword}&pageNumber=${current - 1}&pageSize=${pageSize}${categoryFilter}`;
    request("get", url, {}).then(res => {
      if (res.status === 200) {
        setProduct(res.data.list);
        setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
        autoSuggestions(res.data.list);
        setTimeout(() => {
          setLoading(false)
        }, 500)
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
    setSelectedDescription(item.description);
    setIsDescriptionModalOpen(true);
  };

  const getCard = async () => {
    const response = await request('GET', `cards/${customerProfile.id}`);
    if (response.status === 200) {
      setCard(response.data);
    }
  }

  const handleCreatCart = (item) => {
    const param = {
      quantity_cart: 1,
      customer_id: customerProfile.id,
      product_id: item.id,
    };
    request("post", "cards", param).then((res) => {
      if (res.status === 200 || res.status === 201) {
        getCard();
      }
    }).catch(() => {
      message.error("An error occurred while adding product to cart.");
    });
  }

  const handleUpdateCart = (item, value) => {
    if (value !== undefined && value >= 1 && Number.isInteger(value)) {
      const param = {
        quantity_cart: value,
        customer_id: item.customer_id.id,
        product_id: item.product_id.id,
      };
      request("put", `cards/${item.id}`, param)
        .then((res) => {
          if (res.status === 200) {
            getCard();
          }
        })
        .catch(() => {
          message.error("An error occurred while updating the cart.");
        });
    }
  };

  const handleDeleteCart = (item) => {
    setCard((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
    request("delete", `cards/${item.id}/customers/${customerProfile.id}`, {}).then((res) => {
      if (res.status === 200) {
        getCard();
      }
    }).catch(() => {
      message.error("An error occurred while delete the cart.");
    });
  }

  const calculateTotals = () => {
    const newSubTotal = card.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = (tax / 100) * newSubTotal;
    const discountAmount = (discount / 100) * newSubTotal;
    const newBillUSD = newSubTotal + taxAmount - discountAmount;
    const newBillRiel = newBillUSD * exchangeRate;

    const cashReceivedUSD = cashReceived + cashReceivedRiel / exchangeRate;
    const newCashChange = cashReceivedUSD - newBillUSD;

    setSubTotal(newSubTotal);
    setBillUSD(newBillUSD);
    setBillRiel(newBillRiel);
    setCashChange(newCashChange);
    setCashReceivedUSD(cashReceivedUSD);
  };

  const handleClear = () => {
    setCashReceived(0);
    setCashReceivedRiel(0);
    setTax(0);
    setDiscount(0);
  }

  const handleCheckout = () => {
    const totalReceived = cashReceived + cashReceivedRiel / exchangeRate;
    if (totalReceived < billUSD) {
      message.error('Please provide enough cash to proceed with checkout.');
      return;
    }
    const param = {
      customer_id: customerProfile.id,
      discount: discount,
      tax: tax,
      bill: billUSD,
      subTotal: subTotal,
    };
    request("post", "orders", param).then((res) => {
      if (res.status === 200 || res.status === 201) {
        setCard([]);
        handleClear();
        closeModal();
        setTimeout(() => {
          printFn();
        }, 500);
      }
    }).catch(() => {
      message.error("An error occurred while adding product to cart.");
    });
  };


  return (
    <>
      <Splitter style={{ height: "90vh", backgroundColor: backgroundColor, borderRadius: "10px", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        {/* // ផ្នែកទី product  */}
        <Splitter.Panel collapsible defaultSize="55%" style={{ margin: '10px' }}>
          <Spin spinning={loading}>
            <Row style={{ backgroundColor: backgroundColor }}>
              <Col span={12} style={{ fontWeight: "bold", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span>POS</span>
              </Col>
              <Col span={12}>
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
              <Col span={24} style={{ padding: "10px", margin: "10px" }}>
                <Menu
                  mode="horizontal"
                  style={{ fontWeight: 'bold', color: '#007bff' }}
                  hoverable
                  onClick={(e) => handleCategoryClick(e.key)}
                >
                  <Menu.Item key="">All</Menu.Item>
                  {category.map(cat => (
                    <Menu.Item key={cat.id}>
                      {cat.name}
                    </Menu.Item>
                  ))}
                </Menu>
              </Col>
            </Row>
            <Row gutter={[8, 8]}>
              {product.map((item) => (
                <Col key={item.id} span={8}>
                  <Card
                    hoverable
                    style={{ marginTop: "20px" }}
                    cover={
                      <Image
                        alt={item.name}
                        src={item.product_image ? `${Config.image_path}${item.product_image}` : 'https://via.placeholder.com/150'}
                        style={{ height: 100, objectFit: "fill", marginTop: "10px" }}
                      />
                    }
                    actions={[
                      <ShoppingCartOutlined key="product_id" onClick={() => handleCreatCart(item)} />,
                      <EyeOutlined key="description" onClick={() => onClickViewContent(item)} />
                    ]}
                  >
                    <Card.Meta
                      description={
                        <div style={{ height: "60px", color: "black" }}>
                          <span style={{ fontSize: "15px", fontWeight: "bold", }}>
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
          </Spin>
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter layout="vertical">
            {/* // ផ្នែកទី គិតលុយ  */}
            <Splitter.Panel collapsible defaultSize="55%" style={{ marginTop: '5px', padding: '5px' }}>
              <Row gutter={8}>
                <Col span={6}><Button onClick={() => showModal()}>Check Out</Button></Col>
                <Col span={10}>
                  <InputNumber
                    min={0}
                    addonBefore="Disc:"
                    suffix="(%)"
                    value={discount}
                    onChange={(value) => setDiscount(value)}
                  />
                </Col>
                <Col span={8}>
                  <InputNumber
                    min={0}
                    addonBefore="Tax:"
                    suffix="(%)"
                    value={tax}
                    onChange={(value) => setTax(value)}
                  />
                </Col>
              </Row>
              <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
              <div style={{
                fontWeight: 'bold',
                padding: '10px',
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Subtotal:</span><span>$ {subTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Tax:</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Discount:</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Bill:</span><span>$ {billUSD.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span></span><span>R {billRiel.toFixed(2)}</span>
                </div>
                <Divider style={{ borderColor: '#7cb305', margin: '5px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>
                    <InputNumber
                      style={{ width: "180px" }}
                      addonBefore="រៀល:"
                      min={0}
                      suffix="(R)"
                      value={cashReceivedRiel}
                      onChange={(value) => setCashReceivedRiel(value)}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    />
                  </span>
                  <span>
                    <InputNumber
                      style={{ width: "180px" }}
                      addonBefore="USD:"
                      min={0}
                      suffix="($)"
                      value={cashReceived}
                      onChange={(value) => setCashReceived(value)}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    />
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Cash Change:</span>
                  <span>R {(cashChange * exchangeRate).toFixed(2)}</span>
                  <span>$ {cashChange.toFixed(2)}</span>
                </div>
              </div>
            </Splitter.Panel>
            {/* // ផ្នែកទី card  */}
            <Splitter.Panel>
              <Divider style={{ borderColor: '#7cb305', margin: '5px', fontSize: '18px', fontWeight: "bold" }}>List Cart</Divider>
              <List
                itemLayout="horizontal"
                dataSource={[...card].sort((a, b) => a.id - b.id)}
                renderItem={(item, index) => {
                  const color = colorList[index % colorList.length];
                  return (
                    <List.Item
                      key={item.id}
                      actions={[<DeleteOutlined key="delete" style={{ color: 'red', fontSize: '18px', backgroundColor: "white", padding: "10px", borderRadius: "10px" }} onClick={() => handleDeleteCart(item)} />]}
                      style={{
                        backgroundColor: color,
                        padding: "10px",
                        borderRadius: "10px",
                        margin: '3px',
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f0f0';
                        e.currentTarget.style.boxShadow = "0px 6px 8px rgba(0, 0, 0, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = color;
                        e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              item.product_id.product_image
                                ? `${Config.image_path}${item.product_id.product_image}`
                                : 'https://via.placeholder.com/150'
                            }
                            alt={item.product_id.name}
                          />
                        }
                        title={
                          <div>
                            <span>NO: {index + 1}</span>&nbsp;&nbsp;||&nbsp;
                            <span>តម្លែរាយ: {item.product_id.price.toFixed(2)} $</span>&nbsp;&nbsp;||&nbsp;
                            <span>តម្លែសរុប: {item.total_price.toFixed(2)} $</span>&nbsp;&nbsp;<br />
                            <span>ឈ្មោះ: {item.product_id.name}</span>
                          </div>
                        }
                        description={
                          <InputNumber
                            prefix="Qty"
                            size="large"
                            min={1}
                            max={item.product_id.product_quantity}
                            value={item.quantity_cart}
                            onChange={value => handleUpdateCart(item, value)}
                          />
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>

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

      {/* ផ្នែក invoice Receipt */}
      <Modal
        open={isModalOpen}
        onCancel={() => closeModal()}
        footer={[
          <Button key="confirm" onClick={() => handleCheckout()}>Checkout</Button>,
          <Button danger key="cancel" onClick={() => closeModal()}>Cancel</Button>,
        ]}
        width={400}
      >
        <div ref={componentRef} style={{ fontFamily: 'monospace', width: '58mm', margin: '0 auto', fontSize: '12px', lineHeight: '1.5' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>POS ktv</div>
            <div style={{ fontSize: '14px' }}>No.123 St44, City, Country</div>
            <div style={{ fontSize: '14px' }}>Phone: (012) 349-211</div>
            <div style={{ fontSize: '12px' }}>
              Date: {dayjs().format('YYYY-MM-DD')},
              Time: {dayjs().format('HH:mm:ss')}
            </div>
          </div>
          <Divider style={{ margin: '10px 0' }} />
          <div style={{ fontWeight: 'bold' }}>Receipt:</div>
          <div style={{ marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '5px', borderBottom: '1px solid #ddd' }}>Item</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '5px', borderBottom: '1px solid #ddd' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {card.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>{item.product_id.name}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.product_id.price.toFixed(2)}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>{item.quantity_cart}</td>
                    <td style={{ padding: '5px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>${item.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Subtotal</span><span>${subTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Tax</span><span>% {tax ? tax.toFixed(2) : '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Discount</span><span>% {discount ? discount.toFixed(2) : '0.00'}</span>
            </div>
            <Divider style={{ margin: '2px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span>ប្រាក់បង់</span><span>${cashReceivedUSD.toFixed(2)} / R{(cashReceivedUSD * exchangeRate).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <span>ប្រាក់អាប់</span><span>${cashChange.toFixed(2)} / R{(cashChange * exchangeRate).toFixed(2)}</span>
            </div>

            <Divider style={{ margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
              <span>Bill</span><span>${billUSD.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px' }}>
              <span></span><span>R{billRiel.toFixed(2)}</span>
            </div>
          </div>
          <Divider style={{ margin: '2px' }} />
          <div style={{ textAlign: 'center' }}>
            <JsbarcodeUtil barcode={orderId}/>
          </div>
          <div style={{ textAlign: 'center', fontSize: '12px' }}>
            <span>Thank you for shopping with us!</span>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default PosPage;
