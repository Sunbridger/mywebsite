import React, { useMemo } from 'react';
import { Card, Tag, Row, Col, Typography, Progress, Statistic } from 'antd';
import {
  TagOutlined,
  FileTextOutlined,
  FireOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { formatHot } from '../utils';

const { Text, Paragraph } = Typography;

/**
 * 高级分析组件
 * 包含：数据统计 + 关键词分析 + 简单总结
 */
const AdvancedAnalysis = ({ data, loading, platform }) => {
  // 分析数据
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 计算统计数据
    const maxHot = Math.max(...data.map(item => item.hot));
    const avgHot = data.reduce((sum, item) => sum + item.hot, 0) / data.length;
    const topItem = data.find(item => item.hot === maxHot);

    // 热度分布
    const highHotCount = data.filter(item => item.hot > maxHot * 0.8).length;
    const midHotCount = data.filter(item => item.hot > maxHot * 0.5 && item.hot <= maxHot * 0.8).length;
    const lowHotCount = data.filter(item => item.hot <= maxHot * 0.5).length;
    const highHotPercent = (highHotCount / data.length) * 100;
    const midHotPercent = (midHotCount / data.length) * 100;
    const lowHotPercent = (lowHotCount / data.length) * 100;

    // 提取关键词
    const allText = data.map(item => item.title).join(' ');
    const words = allText
      .replace(/[，。！？、：；""''（）【】《》\[\]#@\d]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 2 && word.length <= 10)
      .filter(word => !['的', '了', '是', '在', '和', '与', '为', '被', '让', '把'].includes(word));

    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));

    // 生成总结
    const keywordsList = topKeywords.slice(0, 5).map(k => k.word).join('、');
    const summary = `本次查询共 ${data.length} 条热榜数据。最热话题「${topItem?.title?.slice(0, 20)}...」热度达 ${maxHot.toLocaleString()}。热门关键词：${keywordsList}。`;

    return {
      maxHot, avgHot, topItem,
      highHotCount, midHotCount, lowHotCount,
      highHotPercent, midHotPercent, lowHotPercent,
      topKeywords, summary,
      top3: data.slice(0, 3)
    };
  }, [data]);

  if (!analysis) return null;

  const platformColor = platform === 'douyin' ? '#ff0064' : '#1677ff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 数据总结 */}
      <Card size="small" title={<><FileTextOutlined /> 数据总结</>}>
        <Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.8 }}>
          {analysis.summary}
        </Paragraph>
      </Card>

      {/* 数据统计 */}
      <Card size="small" title={<><BarChartOutlined /> 数据统计</>}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="热点总数"
              value={data.length}
              prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="最高热度"
              value={formatHot(analysis.maxHot)}
              prefix={<ThunderboltOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="平均热度"
              value={formatHot(analysis.avgHot)}
              prefix={<BarChartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 600 }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>热度分布</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>高热度</span>
                  <span>{analysis.highHotCount}条</span>
                </div>
                <Progress percent={analysis.highHotPercent} showInfo={false} strokeColor="#ff4d4f" size="small" />
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* TOP3 热点 */}
      <Card size="small" title={<><TrophyOutlined /> 热点 TOP3</>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {analysis.top3.map((item, index) => (
            <a
              key={item.id}
              href={item.url || item.mobileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 8,
                background: index === 0 ? '#fff1f0' : index === 1 ? '#f6ffed' : '#f0f5ff',
                textDecoration: 'none',
                color: '#262626'
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: index === 0 ? '#ff4d4f' : index === 1 ? '#52c41a' : '#1890ff',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, marginRight: 12
              }}>
                {index + 1}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </Card>

      {/* 热门关键词 */}
      <Card size="small" title={<><TagOutlined /> 热门关键词</>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {analysis.topKeywords.map(({ word }, index) => (
            <Tag
              key={word}
              style={{
                padding: '4px 12px',
                fontSize: index < 5 ? 14 : 12,
                fontWeight: index < 5 ? 600 : 400,
                borderRadius: 16,
                background: index < 3 ? platformColor : '#f5f5f5',
                color: index < 3 ? 'white' : '#595959',
                border: 'none',
              }}
            >
              {word}
            </Tag>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdvancedAnalysis;