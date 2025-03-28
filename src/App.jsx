// src/App.jsx
import React, {useState } from 'react';
import { Layout } from 'antd';
import NavBar from './components/NavBar';
import Home from './components/Home';
import PlanaDay from './components/PlanaDay';
import ViewYourDay from './components/ViewYourDay';
import Pomodoro from './components/Pomodoro';

const { Header, Content } = Layout;


function App() {
  const [selectedKey, setSelectedKey] = useState('home');

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <Home onClickPlan={() => setSelectedKey('plan')}/>;
      case 'plan':
        return <PlanaDay/>;
      case 'tasks':
        return <h1>Your Tasks</h1>;
      case 'pomodoro':
        return <Pomodoro />;
      case 'view':
        return <ViewYourDay/>;
      default:
        return <h1>Welcome!</h1>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <NavBar onMenuClick={setSelectedKey} selectedKey={selectedKey}/>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '0 16px', padding: '24px', background: '#fff' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
