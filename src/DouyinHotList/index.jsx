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
  Tag,
  Tooltip,
  Empty,
} from 'antd';
import {
  SyncOutlined,
  FireOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  fetchHotListData,
  fetchDateRangeData,
  triggerGitHubAction,
} from './api';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import HotListTable from './components/HotListTable';
import AdvancedAnalysis from './components/AdvancedAnalysis';

const { Title, Text } = Typography;
const { Option } = Select;

const HotList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
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
        // 在加载时为每条记录注入 rank，避免表格内重复查找
        const datedData = response.map((item, idx) => ({
          ...item,
          dataDate: date,
          uniqueKey: `${date}-${item.id}`,
          rank: idx + 1,
        }));

        setData(datedData);
        setSelectedDate(date);
        setTableKey((prev) => prev + 1);
        messageApi.success({
          content: `成功加载 ${date} 的${getPlatformName()}数据 (${response.length} 条)`,
          icon: <FireOutlined style={{ color: '#ff4d4f' }} />,
        });
      } else {
        setData([]);
        messageApi.info({
          content: `${date} 没有${getPlatformName()}数据`,
          icon: <InfoCircleOutlined />,
        });
      }
    } catch (err) {
      // 处理 404 文件未找到情况
      if (err.response && err.response.status === 404) {
        setData([]);
        messageApi.error({
          content: `${date} ${getPlatformName()}数据文件不存在`,
          icon: <InfoCircleOutlined />,
        });
      } else {
        setError(`获取${getPlatformName()}数据失败: ` + err.message);
        console.error('Fetch error:', err);
        messageApi.error({
          content: `获取${getPlatformName()}数据失败`,
          icon: <InfoCircleOutlined />,
        });
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
      // 为合并后的数据注入全局 rank（按照当前排序）
      const ranked = sortedData.map((item, idx) => ({ ...item, rank: idx + 1 }));
      setData(ranked);
      setTableKey((prev) => prev + 1);

      if (sortedData.length > 0) {
        messageApi.success({
          content: `成功加载 ${dateRange[0]} 到 ${
            dateRange[1]
          } 的${getPlatformName()}数据 (${sortedData.length} 条)`,
          icon: <FireOutlined style={{ color: '#ff4d4f' }} />,
        });
      } else {
        messageApi.info({
          content: '指定日期范围内没有数据',
          icon: <InfoCircleOutlined />,
        });
      }
    } catch (error) {
      setError(`获取${getPlatformName()}范围数据失败: ` + error.message);
      messageApi.error({
        content: `获取${getPlatformName()}范围数据失败`,
        icon: <InfoCircleOutlined />,
      });
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

  // 获取平台图标
  const getPlatformIcon = () => {
    return platform === 'douyin' ? '🎵' : '🔍';
  };

  // 切换高级分析面板
  const toggleAnalysis = () => {
    setShowAnalysis(prev => !prev);
  };

  const refreshTodayData = async () => {
    messageApi.open({
      type: 'loading',
      content: '正在启动后台任务...',
      duration: 1,
    });

    try {
      await triggerGitHubAction();
      setTimeout(() => {
        messageApi.success({
          content: `后台任务已开启，请等待1分钟后重新查询${getPlatformName()}今日数据`,
          icon: <CalendarOutlined />,
        });
      }, 1000);
    } catch (err) {
      console.error('triggerGitHubAction error:', err);
      messageApi.error({
        content: '启动后台任务失败，请稍后再试',
        icon: <InfoCircleOutlined />,
      });
    }
  };

  useEffect(() => {
    if (platform) {
      // 安全调用，不把 fetchData 添加为依赖以避免重复注册
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return (
    <div className="fade-in">
      <Card
        bordered={false}
        className="main-card"
      >
        {/* 标题区域 */}
        <div className="page-header">
          <div className="page-title">
            <span className="platform-icon">{getPlatformIcon()}</span>
            <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
              {getPlatformName()}热榜数据查询
            </Title>
            <Tag color={platform === 'douyin' ? 'purple' : 'blue'}>
              {platform === 'douyin' ? '抖音' : '百度'}
            </Tag>
          </div>

          <Space>
            <Tooltip title="刷新今日数据">
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={refreshTodayData}
                loading={loading}
                className="action-button"
              >
                刷新今日数据
              </Button>
            </Tooltip>

            <Tooltip title={showAnalysis ? '关闭分析面板' : '打开分析面板'}>
              <Button
                type={showAnalysis ? "primary" : "default"}
                icon={<BarChartOutlined />}
                onClick={toggleAnalysis}
                className="action-button"
              >
                高级分析
              </Button>
            </Tooltip>

            <Select
              defaultValue="baidu"
              style={{ width: 120 }}
              onChange={handlePlatformChange}
              className="platform-selector"
            >
              <Option value="douyin">
                <span style={{ marginRight: 4 }}>🎵</span>抖音热榜
              </Option>
              <Option value="baidu">
                <span style={{ marginRight: 4 }}>🔍</span>百度热榜
              </Option>
            </Select>
          </Space>
        </div>

        <div className="page-description">
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
        {data.length > 0 && (
          <StatsPanel
            data={data}
            selectedDate={selectedDate}
            platform={platform}
          />
        )}

        {/* 错误提示 */}
        {error && (
          <Alert
            message="加载失败"
            description={error}
            type="error"
            action={
              <Button size="small" icon={<ReloadOutlined />} onClick={() => fetchData()}>
                重试
              </Button>
            }
            style={{ marginBottom: '16px' }}
            closable
          />
        )}

        <Divider />

        {/* 高级分析面板 */}
        {showAnalysis && data.length > 0 && (
          <AdvancedAnalysis
            data={data}
            loading={loading}
          />
        )}

        <Divider />

        {/* 数据表格或空状态 */}
        {data.length > 0 ? (
          <HotListTable
            data={data}
            loading={loading}
            key={tableKey}
            platform={platform}
          />
        ) : (
          !loading && (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  暂无{getPlatformName()}热榜数据
                  <br />
                  请尝试选择其他日期或刷新数据
                </span>
              }
            >
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => fetchData()}
              >
                重新加载
              </Button>
            </Empty>
          )
        )}
      </Card>

      {/* message 占位 */}
      {contextHolder}
    </div>
  );
};

export default HotList;
