import 'antd/dist/reset.css'; // 确保引入antd样式
import dayjs from 'dayjs';
import { ConfigProvider, Layout } from 'antd';
import locale from 'antd/es/locale/zh_CN'; // 导入Ant Design中文语言包
import './styles/global.css'; // 引入全局样式

dayjs.locale('zh-cn');

import DouyinHotList from './DouyinHotList';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: 'linear-gradient(120deg, #1890ff, #00d8ff)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '72px'
      }} className="app-header">
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            🔥
          </div>
          热榜数据查询平台
        </div>
      </Header>
      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="fade-in">
          <ConfigProvider locale={locale}>
            <DouyinHotList />
          </ConfigProvider>
        </div>
      </Content>
      <Footer style={{
        textAlign: 'center',
        backgroundColor: '#f0f2f5',
        padding: '24px',
        borderTop: '1px solid #f0f0f0',
        color: '#8c8c8c'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <div>热榜数据查询平台 ©{new Date().getFullYear()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Created with ❤️</span>
            <span style={{
              background: 'linear-gradient(120deg, #1890ff, #00d8ff)',
              padding: '2px 8px',
              borderRadius: '12px',
              color: 'white',
              fontSize: '12px'
            }}>
              数据驱动洞察
            </span>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default App;