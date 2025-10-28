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
        background: 'linear-gradient(to right, #b37feb, #efdbff)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ color: '#531dab', fontSize: '20px', fontWeight: 'bold' }}>
          🔥 热榜数据查询平台
        </div>
      </Header>
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="fade-in">
          <ConfigProvider locale={locale}>
            <DouyinHotList />
          </ConfigProvider>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5', padding: '16px 24px' }}>
        热榜数据查询平台 ©{new Date().getFullYear()} Created with ❤️
      </Footer>
    </Layout>
  );
};

export default App;
