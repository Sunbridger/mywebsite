import React, { useMemo } from 'react';
import { Card, Tag, Row, Col, Typography } from 'antd';
import { TagOutlined, FileTextOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

/**
 * 简化版高级分析组件
 * 只做关键词分析和简单总结
 */
const AdvancedAnalysis = ({ data, loading, platform }) => {
  // 分析关键词
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // 提取所有标题中的关键词
    const allText = data.map(item => item.title).join(' ');

    // 简单分词（按空格、标点分割，过滤短词）
    const words = allText
      .replace(/[，。！？、：；""''（）【】《》\[\]#@\d]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 2 && word.length <= 10)
      .filter(word => !['的', '了', '是', '在', '和', '与', '为', '被', '让', '把'].includes(word));

    // 统计词频
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 排序获取 Top 15 关键词
    const topKeywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));

    // 生成简单总结
    const totalItems = data.length;
    const maxHot = Math.max(...data.map(item => item.hot));
    const topItem = data.find(item => item.hot === maxHot);
    const keywordsList = topKeywords.slice(0, 5).map(k => k.word).join('、');

    const summary = `本次查询共 ${totalItems} 条热榜数据。当前最热话题是「${topItem?.title?.slice(0, 20)}...」，热度达 ${maxHot.toLocaleString()}。热门关键词包括：${keywordsList}。`;

    return { topKeywords, summary };
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

      {/* 关键词云 */}
      <Card size="small" title={<><TagOutlined /> 热门关键词</>}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {analysis.topKeywords.map(({ word, count }, index) => (
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