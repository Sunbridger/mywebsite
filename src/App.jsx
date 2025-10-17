import 'antd/dist/reset.css'; // 确保引入antd样式
import dayjs from 'dayjs';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN'; // 导入Ant Design中文语言包

dayjs.locale('zh-cn');

import DouyinHotList from './DouyinHotList';

const App = () => {
  return (
    <div>
      <ConfigProvider locale={locale}>
        <DouyinHotList />
      </ConfigProvider>
    </div>
  );
};
export default App;
