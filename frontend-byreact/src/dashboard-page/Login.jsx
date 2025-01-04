import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { request } from "../util/apiUtil";

const Login = () => {
    document.title = "Login";
    const [loading, setLoading] = useState(false);
    const onFinish = async (fields) => {
        var params = {
            email: fields.email,
            password: fields.password
        };
        setLoading(true);
        try {
            const res = await request('POST', 'employee/login', params);
            if (res.status === 200) {
                localStorage.setItem("login", "1")
                localStorage.setItem("response_data", JSON.stringify(res.data.response_data));
                localStorage.setItem("accessToken", res.data.response_data.access_token);
                localStorage.setItem("refreshToken", res.data.response_data.refresh_token);
                window.location.href = ("/dashboard");
            } else {
                message.error(res.message || 'Login Unsuccessful');
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

        <Form
            style={{
                maxWidth: "350px",
                margin: "auto",
                marginTop: "100px",
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
                Login
            </h2>

            <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Email or UserName" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a style={{ float: "right" }} href="">
                    Forgot password
                </a>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
                    Log in 
                </Button>
                
               Or <a href="register">register now!</a>
            </Form.Item>

        </Form>
    );
};

export default Login;
