import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Tag,
  Spin,
  Alert,
  Typography,
  Space,
  Button,
  DatePicker,
  message,
  Row,
  Col,
  Statistic,
  Divider,
} from 'antd';
import {
  FireOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DouyinHotList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2025-10-15');
  const [dateRange, setDateRange] = useState(null);
  const [tableKey, setTableKey] = useState(0); // 用于强制刷新表格

  // 获取基础URL
  const getBaseUrl = () => {
    return 'https://raw.githubusercontent.com/Sunbridger/screenshot/refs/heads/main/data-douyin';
  };

  // 构建请求URL
  const buildUrl = (date) => {
    return `${getBaseUrl()}/${date}.json`;
  };

  // 获取数据 - 优化加载体验
  const fetchData = async (date = selectedDate) => {
    setLoading(true);
    setError(null);

    try {
      const url = buildUrl(date);
      const response = await axios.get(url);

      if (response.data && response.data.length > 0) {
        // 添加日期标记到每条数据
        const datedData = response.data.map((item) => ({
          ...item,
          dataDate: date,
          uniqueKey: `${date}-${item.id}`,
        }));

        setData(datedData);
        setSelectedDate(date);
        setTableKey((prev) => prev + 1); // 更新表格key
        message.success(`成功加载 ${date} 的数据 (${response.data.length} 条)`);
      } else {
        setData([]);
        message.info(`${date} 没有数据`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setData([]);
        message.error(`${date} 数据文件不存在`);
      } else {
        setError('获取数据失败: ' + error.message);
        console.error('Fetch error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 日期变化处理 - 优化过渡效果
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

  // 获取日期范围内的数据 - 优化加载体验
  const fetchDateRangeData = async () => {
    if (!dateRange || dateRange.length !== 2) return;

    setLoading(true);
    setError(null);

    const [startDate, endDate] = dateRange;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const allData = [];

    try {
      // 遍历日期范围内的每一天
      let currentDate = start;
      while (currentDate.isBefore(end) || currentDate.isSame(end)) {
        const dateStr = currentDate.format('YYYY-MM-DD');
        const url = buildUrl(dateStr);

        try {
          const response = await axios.get(url, { timeout: 5000 });
          if (response.data && response.data.length > 0) {
            const datedData = response.data.map((item) => ({
              ...item,
              dataDate: dateStr,
              uniqueKey: `${dateStr}-${item.id}`,
            }));
            allData.push(...datedData);
          }
        } catch (err) {
          // 跳过不存在的文件
          console.warn(`${dateStr} 数据获取失败:`, err.message);
        }

        currentDate = currentDate.add(1, 'day');

        // 短暂延迟避免请求过快
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setData(allData);
      setTableKey((prev) => prev + 1); // 更新表格key
      if (allData.length > 0) {
        message.success(
          `成功加载 ${dateRange[0]} 到 ${dateRange[1]} 的数据 (${allData.length} 条)`
        );
      } else {
        message.info('指定日期范围内没有数据');
      }
    } catch (error) {
      setError('获取范围数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 快速选择按钮
  const quickDateButtons = [
    { label: '今天', value: dayjs().format('YYYY-MM-DD') },
    { label: '昨天', value: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
    { label: '3天前', value: dayjs().subtract(3, 'day').format('YYYY-MM-DD') },
    { label: '一周前', value: dayjs().subtract(7, 'day').format('YYYY-MM-DD') },
  ];

  // 格式化时间戳
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  };

  // 格式化热度数字
  const formatHot = (hot) => {
    if (hot >= 10000000) {
      return (hot / 10000000).toFixed(1) + '千万';
    } else if (hot >= 10000) {
      return (hot / 10000).toFixed(1) + '万';
    }
    return hot.toString();
  };

  // 表格列配置 - 优化列宽和响应式
  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      fixed: 'left',
      render: (_, __, index) => (
        <Tag color={index < 3 ? 'red' : index < 10 ? 'orange' : 'blue'}>
          {index + 1}
        </Tag>
      ),
    },
    {
      title: '话题标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 'bold',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block',
              maxWidth: '280px',
            }}
          >
            {title}
          </a>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            数据日期: {record.dataDate} | ID: {record.id}
          </Text>
        </Space>
      ),
    },
    {
      title: '热度',
      dataIndex: 'hot',
      key: 'hot',
      width: 150,
      sorter: (a, b) => a.hot - b.hot,
      render: (hot) => (
        <Space>
          <FireOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>{formatHot(hot)}</Text>
        </Space>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
      sorter: (a, b) => a.timestamp - b.timestamp,
      render: (timestamp) => (
        <Space>
          <ClockCircleOutlined />
          <Text type="secondary">{formatTime(timestamp)}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          href={record.mobileUrl}
          target="_blank"
        >
          查看
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '24px', margin: '0 auto' }}>
      <Card
        bordered={false}
        style={{
          boxShadow:
            '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
        }}
      >
        {/* 标题区域 */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ marginBottom: '8px' }}>
            <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
            抖音热榜数据查询
          </Title>
          <Text type="secondary">选择日期查看对应日期的抖音热榜数据</Text>
        </div>

        {/* 控制面板 */}
        <Card
          title={
            <Space>
              <CalendarOutlined />
              <span>数据查询</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8} lg={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  选择日期:
                </Text>
                <DatePicker
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={handleDateChange}
                  style={{ width: '100%' }}
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  allowClear={false}
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  快速选择:
                </Text>
                <Space wrap>
                  {quickDateButtons.map((btn) => (
                    <Button
                      key={btn.value}
                      size="small"
                      type={selectedDate === btn.value ? 'primary' : 'default'}
                      onClick={() =>
                        handleDateChange(dayjs(btn.value), btn.value)
                      }
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Space>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  日期范围:
                </Text>
                <RangePicker
                  style={{ width: '100%' }}
                  onChange={handleRangeChange}
                  format="YYYY-MM-DD"
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => (dateRange ? fetchDateRangeData() : fetchData())}
                loading={loading}
                style={{ width: '100%', marginTop: '30px' }}
                size="middle"
              >
                {dateRange ? '查询范围数据' : '查询数据'}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 统计信息 */}
        {data.length > 0 && (
          <Card
            style={{ marginBottom: '24px' }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="数据日期"
                  value={selectedDate}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="热点数量"
                  value={data.length}
                  prefix={<FireOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="最高热度"
                  value={formatHot(Math.max(...data.map((item) => item.hot)))}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="平均热度"
                  value={formatHot(
                    data.reduce((sum, item) => sum + item.hot, 0) / data.length
                  )}
                  precision={1}
                />
              </Col>
            </Row>
          </Card>
        )}

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

        {/* 数据表格 - 使用key强制刷新避免白屏 */}
        <div style={{ position: 'relative', minHeight: '300px' }}>
          {loading && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <Spin size="large" tip="数据加载中..." />
            </div>
          )}

          <Table
            key={tableKey} // 使用key强制刷新
            columns={columns}
            dataSource={data.map((item, index) => ({
              ...item,
              key: item.uniqueKey || index,
            }))}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条热点`,
            }}
            scroll={{ x: 1000 }}
            loading={false} // 禁用内置loading，使用我们的覆盖层
            style={{ opacity: loading ? 0.7 : 1 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default DouyinHotList;
