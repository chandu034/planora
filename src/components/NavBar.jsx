import React, { useState } from 'react';
import {
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Sider } = Layout;

function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}

const items = [
  getItem('Home', 'home', <HomeOutlined />),
  getItem('Plan a Day', 'plan', <CalendarOutlined />),
  getItem('Tasks', 'tasks', <CheckCircleOutlined />),
  getItem('Pomodoro Timer', 'pomodoro', <ClockCircleOutlined />),
  getItem('View Your Day', 'view', <EyeOutlined />),
];

// ✨ Styled logo
const Logo = styled.div`
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  color: white;
  font-size: 28px;
  padding: 20px;
  text-align: center;
  letter-spacing: 2px;
  user-select: none;
`;

const NavBar = ({ onMenuClick, selectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider width={220} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      {!collapsed && <Logo>Planaro</Logo>}
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        onClick={({ key }) => onMenuClick(key)}
      />
    </Sider>
  );
};

export default NavBar;
