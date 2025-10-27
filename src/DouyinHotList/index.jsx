import { useState, useEffect } from 'react';
import {
  Card,
  Alert,
  Typography,
  Button,
  Divider,
  message,
  Select,
  Space,
} from 'antd';
import { SyncOutlined, FireOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  fetchHotListData,
  fetchDateRangeData,
  triggerGitHubAction,
} from './api';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import HotListTable from './components/HotListTable';

const { Title, Text } = Typography;
const { Option } = Select;

const HotList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );
  const [dateRange, setDateRange] = useState(null);
  const [tableKey, setTableKey] = useState(0);
  const [platform, setPlatform] = useState('baidu'); // 默认展示百度数据

  // 获取单日数据
  const fetchData = async (date = selectedDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchHotListData(date, platform);

      if (response && response.length > 0) {
        const datedData = response.map((item) => ({
          ...item,
          dataDate: date,
          uniqueKey: `${date}-${item.id}`,
        }));

        setData(datedData);
        setSelectedDate(date);
        setTableKey((prev) => prev + 1);
        message.success(
          `成功加载 ${date} 的${getPlatformName()}数据 (${response.length} 条)`
        );
      } else {
        setData([]);
        message.info(`${date} 没有${getPlatformName()}数据`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData([]);
        message.error(`${date} ${getPlatformName()}数据文件不存在`);
      } else {
        setError(`获取${getPlatformName()}数据失败: ` + error.message);
        console.error('Fetch error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取日期范围数据
  const fetchRangeData = async () => {
    if (!dateRange || dateRange.length !== 2) return;

    setLoading(true);
    setError(null);

    try {
      const allData = await fetchDateRangeData(dateRange, platform);

      // 对数据进行排序：按日期降序，然后按热度降序
      const sortedData = allData.sort((a, b) => {
        const dateCompare = dayjs(b.dataDate).diff(dayjs(a.dataDate));
        if (dateCompare !== 0) return dateCompare;
        return b.hot - a.hot;
      });

      setData(sortedData);
      setTableKey((prev) => prev + 1);

      if (sortedData.length > 0) {
        message.success(
          `成功加载 ${dateRange[0]} 到 ${
            dateRange[1]
          } 的${getPlatformName()}数据 (${sortedData.length} 条)`
        );
      } else {
        message.info('指定日期范围内没有数据');
      }
    } catch (error) {
      setError(`获取${getPlatformName()}范围数据失败: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 日期变化处理
  const handleDateChange = (date, dateString) => {
    if (date) {
      setSelectedDate(dateString);
      fetchData(dateString);
    }
  };

  // 日期范围变化处理
  const handleRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setDateRange(dateStrings);
    }
  };

  // 平台变化处理
  const handlePlatformChange = (value) => {
    setPlatform(value);
  };

  // 获取平台名称
  const getPlatformName = () => {
    return platform === 'douyin' ? '抖音' : '百度';
  };

  const refreshTodayData = async () => {
    messageApi.open({
      type: 'success',
      content: `后台任务已开启，请等待1分钟后重新查询${getPlatformName()}今日数据`,
    });

    await triggerGitHubAction();
  };

  useEffect(() => {
    if (platform) {
      fetchData();
    }
  }, [platform]);

  return (
    <div>
      <Card
        bordered={false}
        style={{
          boxShadow:
            '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
        }}
      >
        {/* 标题区域 */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Title level={3} style={{ marginBottom: '8px' }}>
              <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
              {getPlatformName()}热榜数据查询
            </Title>

            <Space>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={refreshTodayData}
                loading={loading}
              >
                刷新今日数据
              </Button>

              <Select
                defaultValue="baidu"
                style={{ width: 120 }}
                onChange={handlePlatformChange}
              >
                <Option value="douyin">抖音热榜</Option>
                <Option value="baidu">百度热榜</Option>
              </Select>
            </Space>
          </div>
          <Text type="secondary">
            选择日期查看对应日期的{getPlatformName()}热榜数据
          </Text>
        </div>

        {/* 控制面板 */}
        <ControlPanel
          selectedDate={selectedDate}
          dateRange={dateRange}
          loading={loading}
          onDateChange={handleDateChange}
          onRangeChange={handleRangeChange}
          onFetchData={fetchData}
          onFetchRangeData={fetchRangeData}
        />

        {/* 统计信息 */}
        <StatsPanel
          data={data}
          selectedDate={selectedDate}
          platform={platform}
        />

        {/* 错误提示 */}
        {error && (
          <Alert
            message="加载失败"
            description={error}
            type="error"
            action={
              <Button size="small" onClick={() => fetchData()}>
                重试
              </Button>
            }
            style={{ marginBottom: '16px' }}
            closable
          />
        )}

        <Divider />

        {/* 数据表格 */}
        <HotListTable
          data={data}
          loading={loading}
          key={tableKey}
          platform={platform}
        />
      </Card>

      {/* message 占位 */}
      {contextHolder}
    </div>
  );
};

export default HotList;
