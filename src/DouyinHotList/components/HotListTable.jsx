import { Spin, Button, Table, Tag, Space, Typography, Tooltip } from 'antd';
import { FireOutlined, EyeOutlined, TrophyOutlined, CrownOutlined, StarOutlined } from '@ant-design/icons';
import { formatHot } from '../utils';

const { Text } = Typography;

const HotListTable = ({ data, loading }) => {
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
      fixed: 'left',
      render: (_, record, index) => {
        // 优化：优先使用 record.rank（在数据加载处预计算），fallback 使用当前行索引
        const globalIndex = typeof record.rank === 'number' ? record.rank - 1 : index;

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getRankIcon(globalIndex)}
            <Tag
              className="rank-tag"
              color={getRankColor(globalIndex)}
              style={{ marginLeft: globalIndex < 3 ? 4 : 0 }}
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
            >
              {title}
            </a>
          </Tooltip>
          <Text style={{ color: 'rgba(0,0,0,0.65)' }}>{record.desc}</Text>
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
          <FireOutlined className="hot-value" />
          <Text strong className="hot-value">{formatHot(hot)}</Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="查看详情">
          <Button
            className="action-button"
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            href={record.mobileUrl}
            target="_blank"
            size="small"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '300px' }} className="fade-in">
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
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条热点`,
          position: ['bottomCenter'],
        }}
        scroll={{ x: 1000 }}
        loading={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
        size="middle"
        rowClassName={(record, index) => index < 3 ? 'top-rank-row' : ''}
      />
    </div>
  );
};

export default HotListTable;
