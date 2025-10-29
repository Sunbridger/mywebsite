import { Row, Col, Card, Statistic, Tooltip, Progress } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { formatHot } from '../utils';

const StatsPanel = ({ data }) => {
  if (!data || data.length === 0) return null;

  // 计算最高热度和平均热度
  const maxHot = Math.max(...data.map((item) => item.hot));
  const avgHot = data.reduce((sum, item) => sum + item.hot, 0) / data.length;

  // 计算热度分布
  const highHotCount = data.filter(item => item.hot > maxHot * 0.8).length;
  const midHotCount = data.filter(item => item.hot > maxHot * 0.5 && item.hot <= maxHot * 0.8).length;
  const lowHotCount = data.filter(item => item.hot <= maxHot * 0.5).length;

  // 计算百分比
  const highHotPercent = (highHotCount / data.length) * 100;
  const midHotPercent = (midHotCount / data.length) * 100;
  const lowHotPercent = (lowHotCount / data.length) * 100;

  return (
    <Card
      className="stats-panel"
      title={
        <span>
          <BarChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          数据统计
        </span>
      }
    >
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="热点总数"
            value={data.length}
            prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="最高热度"
            value={formatHot(maxHot)}
            prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="平均热度"
            value={formatHot(avgHot)}
            precision={1}
            prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
            borderRadius: '8px',
            height: '100%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <TrophyOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#595959' }}>热点TOP3</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.slice(0, 3).map((item, index) => (
                <Tooltip key={item.id} title={item.desc || '点击查看详情'}>
                  <a
                    href={item.url || item.mobileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: '#262626',
                      fontSize: '13px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      background: index === 0 ? '#fff1f0' : index === 1 ? '#f6ffed' : '#f0f5ff',
                      transition: 'all 0.3s',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    className="top3-item"
                  >
                    <span style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? '#ff4d4f' : index === 1 ? '#52c41a' : '#1890ff',
                      color: 'white',
                      fontSize: '12px',
                      marginRight: '8px',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </span>
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {item.title}
                    </span>
                  </a>
                </Tooltip>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#8c8c8c' }}>高热度 ({'>'}{Math.round(maxHot * 0.8)})</span>
            <span style={{ float: 'right', fontSize: 14, color: '#8c8c8c' }}>{highHotCount}条 ({highHotPercent.toFixed(1)}%)</span>
          </div>
          <Progress
            percent={highHotPercent}
            strokeColor={{
              '0%': '#ff7875',
              '100%': '#ff4d4f',
            }}
            showInfo={false}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#8c8c8c' }}>中热度 ({Math.round(maxHot * 0.5)}-{Math.round(maxHot * 0.8)})</span>
            <span style={{ float: 'right', fontSize: 14, color: '#8c8c8c' }}>{midHotCount}条 ({midHotPercent.toFixed(1)}%)</span>
          </div>
          <Progress
            percent={midHotPercent}
            strokeColor={{
              '0%': '#ffc069',
              '100%': '#faad14',
            }}
            showInfo={false}
            size="small"
          />
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#8c8c8c' }}>低热度 (≤{Math.round(maxHot * 0.5)})</span>
            <span style={{ float: 'right', fontSize: 14, color: '#8c8c8c' }}>{lowHotCount}条 ({lowHotPercent.toFixed(1)}%)</span>
          </div>
          <Progress
            percent={lowHotPercent}
            strokeColor={{
              '0%': '#95de64',
              '100%': '#52c41a',
            }}
            showInfo={false}
            size="small"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default StatsPanel;
