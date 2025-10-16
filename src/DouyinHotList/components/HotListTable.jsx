import { Spin, Button, Table, Tag, Space, Typography } from 'antd';
import { FireOutlined, EyeOutlined } from '@ant-design/icons';
import { formatHot } from '../utils';

const { Text } = Typography;

const HotListTable = ({ data, loading }) => {
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

  return (
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
        loading={false}
        style={{ opacity: loading ? 0.7 : 1 }}
      />
    </div>
  );
};

export default HotListTable;
