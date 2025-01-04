import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined, RobotOutlined, BlockOutlined } from '@ant-design/icons';
import { request } from '../util/apiUtil';
import { FcRegisteredTrademark } from "react-icons/fc";

const RegisterPage = () => {
    document.title = "register-page";
    const [loading, setLoading] = useState(false);
    const onFinish = async (fields) => {
        var params = {
            email: fields.email,
            name: fields.name,
            password: fields.password
        };
        setLoading(true);
        try {
            const res = await request('POST', 'customers', params);
            console.log(res);
            if (res.status === 200) {
                window.location.href = ("login");
            } else {
                message.error(res.message || 'ការចុះឈ្មោះរបស់អ្នកបានជោគជ័យ​ និង សូមឆែកក្នុងអុីមែលរបស់អ្នកដើម្បី verification'); 
            }
        } catch (error) {
            message.error('An error occurred while processing your request');
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{
            backgroundImage: 'linear-gradient(135deg, #a8edea 10%, #fed6e3 100%)',
            marginTop: "-10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}
        >
            <Form
                style={{
                    width: "400px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    padding: "20px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2), 0px 6px 20px rgba(0, 0, 0, 0.19)"
                }}
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

                <h2 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    Register&nbsp;<FcRegisteredTrademark />
                </h2>

                <Divider style={{ margin: "15px 0", borderColor: '#7cb305' }} />

                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input prefix={<RobotOutlined />} placeholder="name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<BlockOutlined />} placeholder="Confirm Password" />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterPage;

