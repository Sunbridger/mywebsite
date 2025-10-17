import { Row, Card, Col, Space, Button, DatePicker, Typography } from 'antd';
import {
  PlayCircleOutlined,
  CalendarOutlined,
  ReloadOutlined,
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
        <Col xs={24} sm={12} md={8} lg={8}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              日期范围:
            </Text>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              onChange={onRangeChange}
              format="YYYY-MM-DD"
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
                <Button
                  key={btn.value}
                  size="small"
                  type={selectedDate === btn.value ? 'primary' : 'default'}
                  onClick={() => onDateChange(dayjs(btn.value), btn.value)}
                >
                  {btn.label}
                </Button>
              ))}
            </Space>
          </div>
        </Col>

        <Col xs={24} sm={8} md={8} lg={8}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => (dateRange ? onFetchRangeData() : onFetchData())}
            loading={loading}
            style={{ width: '100%', marginTop: '30px' }}
            size="middle"
          >
            {dateRange ? '查询范围数据' : '查询数据'}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ControlPanel;
