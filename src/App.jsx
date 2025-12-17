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
            <a
              href="https://github.com/Sunbridger/mywebsite"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                color: '#24292f',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
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