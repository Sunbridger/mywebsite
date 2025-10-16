import { Row, Col, Card, Statistic } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { formatHot } from '../utils';

const StatsPanel = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card style={{ marginBottom: '24px' }} bodyStyle={{ padding: '16px 24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={8}>
          <Statistic
            title="热点数量"
            value={data.length}
            prefix={<FireOutlined />}
          />
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Statistic
            title="最高热度"
            value={formatHot(Math.max(...data.map((item) => item.hot)))}
          />
        </Col>
        <Col xs={24} sm={8} md={8}>
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
  );
};

export default StatsPanel;
