import 'antd/dist/reset.css';
import dayjs from 'dayjs';
import { ConfigProvider, Layout, Typography } from 'antd';
import locale from 'antd/es/locale/zh_CN';
import './styles/global.css';

dayjs.locale('zh-cn');

import DouyinHotList from './DouyinHotList';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <ConfigProvider locale={locale}>
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Header style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f0f0f0',
          height: '60px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>🔥</span>
              <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                热榜数据查询
              </Title>
            </div>
          </div>
        </Header>

        <Content className="app-container">
          <DouyinHotList />
        </Content>

        <Footer style={{
          textAlign: 'center',
          background: 'transparent',
          padding: '24px',
          color: '#8c8c8c',
          fontSize: '13px'
        }}>
          热榜数据查询平台 ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;