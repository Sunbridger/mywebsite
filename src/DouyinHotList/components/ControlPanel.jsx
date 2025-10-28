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
}) => {
  return (
    <Card
      className="control-panel"
      title={
        <Space>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <span>数据查询</span>
        </Space>
      }
      extra={
        <Tooltip title="选择日期范围后可查询多日数据">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            💡 提示：可选择日期范围查询多日数据
          </Text>
        </Tooltip>
      }
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={8}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              日期范围:
            </Text>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              onChange={onRangeChange}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              快速选择:
            </Text>
            <Space wrap>
              {QUICK_DATE_BUTTONS.map((btn) => (
                <Tooltip key={btn.value} title={`查询${btn.label}的热榜数据`}>
                  <Button
                    className="action-button"
                    size="small"
                    type={selectedDate === btn.value ? 'primary' : 'default'}
                    onClick={() => onDateChange(dayjs(btn.value), btn.value)}
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
            style={{ width: '100%', marginTop: '30px' }}
            size="middle"
            className="action-button"
          >
            {dateRange ? '查询范围数据' : '查询数据'}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ControlPanel;
