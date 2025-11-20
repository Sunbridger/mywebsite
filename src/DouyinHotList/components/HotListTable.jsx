import { Spin, Button, Table, Tag, Space, Typography, Tooltip } from 'antd';
import { FireOutlined, EyeOutlined, TrophyOutlined, CrownOutlined, StarOutlined } from '@ant-design/icons';
import { formatHot } from '../utils';

const { Text } = Typography;

const HotListTable = ({ data, loading, platform }) => {
  // 获取平台颜色
  const getPlatformColor = () => {
    return platform === 'douyin' ? '#ff0064' : '#3e7bff';
  };

  // 获取平台渐变
  const getPlatformGradient = () => {
    return platform === 'douyin'
      ? 'linear-gradient(120deg, #ff0064, #fa7042)'
      : 'linear-gradient(120deg, #3e7bff, #00d8ff)';
  };

  // 根据排名获取不同的图标和颜色
  const getRankIcon = (index) => {
    if (index === 0) return <TrophyOutlined style={{ color: '#ffd700' }} />;
    if (index === 1) return <CrownOutlined style={{ color: '#c0c0c0' }} />;
    if (index === 2) return <StarOutlined style={{ color: '#cd7f32' }} />;
    return null;
  };

  const getRankColor = (index) => {
    if (index < 3) return 'red';
    if (index < 10) return 'orange';
    return 'blue';
  };

  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      render: (_, record, index) => {
        // 优化：优先使用 record.rank（在数据加载处预计算），fallback 使用当前行索引
        const globalIndex = typeof record.rank === 'number' ? record.rank - 1 : index;

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getRankIcon(globalIndex)}
            <Tag
              className="rank-tag"
              color={getRankColor(globalIndex)}
              style={{
                marginLeft: globalIndex < 3 ? 4 : 0,
                fontSize: globalIndex < 3 ? '14px' : '12px',
                padding: globalIndex < 3 ? '0 12px' : '0 8px',
                height: globalIndex < 3 ? '28px' : '24px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {globalIndex + 1}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '话题标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (title, record) => (
        <Space direction="vertical" size={0}>
          <Tooltip title={title}>
            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              className="topic-title"
              style={{
                fontSize: '16px'
              }}
            >
              {title}
            </a>
          </Tooltip>
          <Text style={{ color: 'rgba(0,0,0,0.65)', fontSize: '14px' }}>{record.desc}</Text>
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
        <Space style={{
          fontSize: '16px',
          color: getPlatformColor()
        }}>
          <FireOutlined className="hot-value" />
          <Text strong className="hot-value" style={{
            fontSize: '18px',
            background: getPlatformGradient(),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            {formatHot(hot)}
          </Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Tooltip title="查看详情">
          <Button
            className="action-button"
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            href={record.mobileUrl}
            target="_blank"
            size="middle"
            style={{
              background: getPlatformGradient(),
              border: 'none'
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '400px' }} className={`fade-in platform-${platform}`}>
      {loading && (
        <div className="loading-container">
          <Spin size="large" tip="数据加载中..." />
        </div>
      )}

      <Table
        columns={columns}
        dataSource={data.map((item, index) => ({
          ...item,
          key: item.uniqueKey || index,
        }))}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条热点`,
          position: ['bottomCenter'],
          size: 'default'
        }}
        scroll={{ x: 'max-content' }}
        loading={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
        size="middle"
        rowClassName={(record, index) => index < 3 ? 'top-rank-row' : ''}
      />
    </div>
  );
};

export default HotListTable;