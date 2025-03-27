// src/components/NavBar.jsx
import React, { useState } from 'react';
import {
  HomeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

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

const NavBar = ({ onMenuClick, selectedKey }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider width={220} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="demo-logo-vertical" />
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
