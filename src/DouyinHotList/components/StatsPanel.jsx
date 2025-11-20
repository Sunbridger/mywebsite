import { Row, Col, Card, Statistic, Tooltip, Progress } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { formatHot } from '../utils';

const StatsPanel = ({ data, platform }) => {
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
      className={`stats-panel platform-${platform}`}
      title={
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <BarChartOutlined style={{
            color: platform === 'douyin' ? '#ff0064' : '#3e7bff',
            fontSize: '20px'
          }} />
          <span style={{
            fontWeight: '600',
            fontSize: '18px'
          }}>
            数据统计
          </span>
        </span>
      }
      style={{
        borderLeft: `4px solid ${platform === 'douyin' ? '#ff0064' : '#3e7bff'}`,
      }}
    >
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} md={6}>
          <div
            className="gradient-card"
            style={{
              background: 'linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%)',
              borderRadius: '16px',
              padding: '20px',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={
                <span style={{
                  color: '#fa8c16',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  热点总数
                </span>
              }
              value={data.length}
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{
                color: '#fa8c16',
                fontSize: '32px',
                fontWeight: 'bold'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div
            className="gradient-card"
            style={{
              background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
              borderRadius: '16px',
              padding: '20px',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={
                <span style={{
                  color: '#ff4d4f',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  最高热度
                </span>
              }
              value={formatHot(maxHot)}
              prefix={<ThunderboltOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{
                color: '#ff4d4f',
                fontSize: '32px',
                fontWeight: 'bold'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div
            className="gradient-card"
            style={{
              background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
              borderRadius: '16px',
              padding: '20px',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Statistic
              title={
                <span style={{
                  color: '#1890ff',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  平均热度
                </span>
              }
              value={formatHot(avgHot)}
              precision={1}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{
                color: '#1890ff',
                fontSize: '32px',
                fontWeight: 'bold'
              }}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
            borderRadius: '16px',
            height: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <TrophyOutlined style={{
                color: '#722ed1',
                marginRight: '8px',
                fontSize: '18px'
              }} />
              <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#595959'
              }}>
                热点TOP3
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1
            }}>
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
                      fontSize: '14px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: index === 0 ? 'linear-gradient(120deg, #fff1f0, #ffccc7)' :
                                 index === 1 ? 'linear-gradient(120deg, #f6ffed, #d9f7be)' :
                                 'linear-gradient(120deg, #f0f5ff, #d6e4ff)',
                      transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    className="top3-item"
                  >
                    <span style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? '#ff4d4f' : index === 1 ? '#52c41a' : '#1890ff',
                      color: 'white',
                      fontSize: '14px',
                      marginRight: '10px',
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

      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={8}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>高热度 ({'>'}{Math.round(maxHot * 0.8)})</span>
              <span style={{ float: 'right', fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>{highHotCount}条 ({highHotPercent.toFixed(1)}%)</span>
            </div>
            <Progress
              percent={highHotPercent}
              strokeColor={{
                '0%': '#ff7875',
                '100%': '#ff4d4f',
              }}
              showInfo={false}
              size="small"
              strokeWidth={10}
              strokeLinecap="round"
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>中热度 ({Math.round(maxHot * 0.5)}-{Math.round(maxHot * 0.8)})</span>
              <span style={{ float: 'right', fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>{midHotCount}条 ({midHotPercent.toFixed(1)}%)</span>
            </div>
            <Progress
              percent={midHotPercent}
              strokeColor={{
                '0%': '#ffc069',
                '100%': '#faad14',
              }}
              showInfo={false}
              size="small"
              strokeWidth={10}
              strokeLinecap="round"
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>低热度 (≤{Math.round(maxHot * 0.5)})</span>
              <span style={{ float: 'right', fontSize: 15, color: '#8c8c8c', fontWeight: '500' }}>{lowHotCount}条 ({lowHotPercent.toFixed(1)}%)</span>
            </div>
            <Progress
              percent={lowHotPercent}
              strokeColor={{
                '0%': '#95de64',
                '100%': '#52c41a',
              }}
              showInfo={false}
              size="small"
              strokeWidth={10}
              strokeLinecap="round"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default StatsPanel;