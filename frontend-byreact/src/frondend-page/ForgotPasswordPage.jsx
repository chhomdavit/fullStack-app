import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { request } from '../util/apiUtil';

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (fields) => {
        const params = { email: fields.email };
        setLoading(true);
        try {
            const res = await request('POST', 'customers/forgot-password', params);
            if (res.status === 200) {
                message.success(res.message || 'Reset link sent to your email!');
                window.location.href = 'reset-password';
            } else {
                message.error(res.message || 'Request failed. Try again.');
            }
        } catch (error) {
            message.error('An error occurred while processing your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Form
                style={{ width: '400px', padding: '20px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <h2 style={{ textAlign: 'center' }}>Forgot Password</h2>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Send Reset Link
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPasswordPage;
