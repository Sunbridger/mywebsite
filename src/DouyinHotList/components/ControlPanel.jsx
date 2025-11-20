import { Row, Card, Col, Space, Button, DatePicker, Typography, Tooltip } from 'antd';
import {
  PlayCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { QUICK_DATE_BUTTONS } from '../utils';
import dayjs from 'dayjs';

const { Text } = Typography;

const ControlPanel = ({
  selectedDate,
  dateRange,
  loading,
  onDateChange,
  onRangeChange,
  onFetchData,
  onFetchRangeData,
  platform,
}) => {
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

  return (
    <Card
      className={`control-panel platform-${platform}`}
      title={
        <Space>
          <CalendarOutlined style={{
            color: getPlatformColor(),
            fontSize: '18px'
          }} />
          <span style={{
            fontWeight: '600',
            fontSize: '18px'
          }}>
            数据查询
          </span>
        </Space>
      }
      extra={
        <Tooltip title="选择日期范围后可查询多日数据">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 提示：可选择日期范围查询多日数据
          </Text>
        </Tooltip>
      }
      style={{
        borderLeft: `4px solid ${getPlatformColor()}`,
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={8}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>
              日期范围:
            </Text>
            <DatePicker.RangePicker
              style={{
                width: '100%',
                borderRadius: '8px',
                borderColor: '#d9d9d9'
              }}
              onChange={onRangeChange}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
              size="large"
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '15px' }}>
              快速选择:
            </Text>
            <Space wrap>
              {QUICK_DATE_BUTTONS.map((btn) => (
                <Tooltip key={btn.value} title={`查询${btn.label}的热榜数据`}>
                  <Button
                    className="action-button"
                    size="middle"
                    type={selectedDate === btn.value ? 'primary' : 'default'}
                    onClick={() => onDateChange(dayjs(btn.value), btn.value)}
                    style={{
                      borderRadius: '20px',
                      ...(selectedDate === btn.value && {
                        background: getPlatformGradient(),
                        border: 'none'
                      })
                    }}
                  >
                    {btn.label}
                  </Button>
                </Tooltip>
              ))}
            </Space>
          </div>
        </Col>

        <Col xs={24} sm={24} md={8} lg={8}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => (dateRange ? onFetchRangeData() : onFetchData())}
            loading={loading}
            style={{
              width: '100%',
              marginTop: '30px',
              borderRadius: '24px',
              height: '44px',
              background: getPlatformGradient(),
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
            size="large"
            className="action-button pulse"
          >
            {dateRange ? '查询范围数据' : '查询数据'}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ControlPanel;