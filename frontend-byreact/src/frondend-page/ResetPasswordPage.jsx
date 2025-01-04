import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { request } from '../util/apiUtil';

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (fields) => {
        const params = {
            email: fields.email,
            verfication_code: fields.verificationCode,
            new_password: fields.newPassword
        };
        setLoading(true);
        try {
            const res = await request('POST', 'customers/reset-password', params);
            if (res.status === 200) {
                message.success(res.message || 'Password reset successfully!');
                window.location.href = 'login';
            } else {
                message.error(res.message || 'Failed to reset password.');
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
                <h2 style={{ textAlign: 'center' }}>Reset Password</h2>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="verificationCode"
                    rules={[{ required: true, message: 'Please input the verification code!' }]}
                >
                    <Input placeholder="Verification Code" />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password placeholder="New Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;
