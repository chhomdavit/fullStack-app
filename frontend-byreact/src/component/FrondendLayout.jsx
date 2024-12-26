import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Affix, Avatar, Badge, Dropdown, Layout, Space } from 'antd';
import { BsFacebook, BsYoutube, BsTiktok, BsTelegram, BsInstagram, BsHouseHeart, BsFillPatchQuestionFill, BsFillInboxesFill, BsFillPCircleFill } from "react-icons/bs";
import { MessageFilled, NotificationFilled } from '@ant-design/icons';

function FrondendLayout() {
    document.title = "Frondend";
    const { Header, Footer, Content } = Layout;
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("/");  
    const onClickMenu = (routeName) => {
        setActiveMenu(routeName); 
        navigate(routeName);
    };
    const navLinks = [
        { name: "Home", route: "/", icon: <BsHouseHeart /> },
        { name: "About", route: "/about", icon: <BsFillPatchQuestionFill /> },
        { name: "Product", route: "/product", icon: <BsFillPCircleFill /> },
        { name: "Category", route: "/category", icon: <BsFillInboxesFill /> },
    ];
    const socialMedia = [
        {
            name: "Facebook",
            icon: <BsFacebook className="iconNormal" />,
            link: "https://www.facebook.com/",
            color: "#4267B2",
        },
        {
            name: "YouTube",
            icon: <BsYoutube className="iconNormal" />,
            link: "https://www.youtube.com/",
            color: "#FF0000",
        },
        {
            name: "Instagram",
            icon: <BsInstagram className="iconNormal" />,
            link: "https://www.instagram.com/",
            color: "#C13584",
        },
        {
            name: "TikTok",
            icon: <BsTiktok className="iconNormal" />,
            link: "https://www.tiktok.com/login",
            color: "#000000",
        },
        {
            name: "Telegram",
            icon: <BsTelegram className="iconNormal" />,
            link: "https://www.telegram.org/",
            color: "#0088CC",
        },
    ];
    const itemsProfile = [
        { key: '1', label: <span>My Account</span> },
        { key: '2', label: <span>Change Password</span> },
        { key: '3', label: <span>Address</span> },
    ];

    return (
        <div>
            <Layout>
                <Layout>
                    <Header style={{ height: "100px", color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
                                <Avatar
                                    src={"https://cdn.pixabay.com/photo/2023/09/12/20/41/ai-generated-8249555_1280.png"}
                                    style={{ width: 50, height: 50, marginRight: 10, marginLeft: 10 }}
                                />
                                <div style={{ fontSize: "16px", fontWeight: "bold" }}>Davit Group</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            {socialMedia.map((media) => (
                                <a
                                    key={media.name}
                                  s  href={media.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: media.color,
                                        fontSize: '20px',
                                        transition: 'color 0.5s',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '50%',
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#555')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = media.color)}
                                >
                                    {media.icon}
                                </a>
                            ))}
                        </div>
                    </Header>
                    <Affix offsetTop={0}>
                        <Header
                            style={{
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '20px',
                                color: 'black',
                                backgroundColor: 'white',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <div>
                                <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0, margin: 0 }}>
                                    {navLinks.map((link) => (
                                        <li
                                            key={link.name}
                                            onClick={() => onClickMenu(link.route)}
                                            style={{
                                                cursor: 'pointer',
                                                transition: '0.5s',
                                                color: 'black',
                                                fontWeight: 'bold',
                                                padding: '10px 10px',
                                                borderRadius: '5px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                backgroundColor: activeMenu === link.route ? '#000dff' : 'transparent',  
                                                color: activeMenu === link.route ? 'white' : 'black',  
                                            }}
                                            onMouseEnter={(e) => {
                                                if (activeMenu !== link.route) {
                                                    e.currentTarget.style.backgroundColor = '#000dff';
                                                    e.currentTarget.style.color = 'white';
                                                    e.currentTarget.style.height = '40px';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (activeMenu !== link.route) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = 'black';
                                                    e.currentTarget.style.height = '40px';
                                                }
                                            }}
                                        >
                                            {link.icon}&nbsp;
                                            {link.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <Space
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 20,
                                        padding: 10,
                                    }}
                                >
                                    <Badge count={4} offset={[0, 10]}>
                                        <MessageFilled style={{ fontSize: 24 }} />
                                    </Badge>
                                    <Badge count={2} offset={[0, 10]}>
                                        <NotificationFilled style={{ fontSize: 24 }} />
                                    </Badge>
                                    <Dropdown menu={{ items: itemsProfile }} placement="bottomRight">
                                        <Avatar
                                            style={{ width: 40, height: 40 }}
                                            src={"https://cdn.pixabay.com/photo/2024/09/08/09/30/ai-generated-9031615_1280.jpg"}
                                        />
                                    </Dropdown>
                                </Space>
                            </div>
                        </Header>
                    </Affix>
                </Layout>
                <Content>
                    <Outlet />
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </div>
    );
}

export default FrondendLayout;
