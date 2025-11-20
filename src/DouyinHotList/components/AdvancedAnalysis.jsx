import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Typography, Space, Select, Tag } from 'antd';
import { Line, Column } from '@ant-design/plots';
import {
  LineChartOutlined,
  RiseOutlined,
  FireOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { GradientCard } from './GradientCard';
import { TimeSeriesAnalysis } from '../analysis/timeSeriesAnalysis';
import { ContentAnalysis } from '../analysis/contentAnalysis';

const { Text } = Typography;
const { Option } = Select;

const AdvancedAnalysis = ({ data, loading, platform }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [keywordTrends, setKeywordTrends] = useState(null);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    if (!data || loading) return;

    const trendAnalysis = TimeSeriesAnalysis.analyzeTrend(data);
    const prediction = TimeSeriesAnalysis.predictHotness(data);
    const peakPeriods = TimeSeriesAnalysis.findPeakPeriods(data);
    const keywordAnalysis = ContentAnalysis.analyzeKeywordTrends(data);

    setAnalysisResult({ trendAnalysis, prediction, peakPeriods });
    setKeywordTrends(keywordAnalysis);

    // 默认选择第一个关键词
    if (keywordAnalysis.topKeywords.length > 0) {
      setSelectedKeyword(keywordAnalysis.topKeywords[0]);
    }
  }, [data, loading]);

  const renderTrendChart = () => {
    if (!analysisResult?.trendAnalysis) return null;

    const chartData = [
      ...data.map(item => ({
        date: item.dataDate,
        value: item.hot,
        type: '实际热度'
      })),
      ...analysisResult.prediction.map(item => ({
        date: item.date,
        value: item.predicted_score,
        type: '预测热度'
      }))
    ];

    return (
      <GradientCard
        title={<><LineChartOutlined /> 热度趋势分析</>}
        loading={loading}
        platform={platform}
      >
        <div style={{ height: 400 }}>
          <Line
            data={chartData}
            xField="date"
            yField="value"
            seriesField="type"
            smooth={true}
            animation={false}
            point={{
              size: 4,
            }}
            legend={{
              position: 'top'
            }}
            xAxis={{
              type: 'timeCat',
              label: {
                autoRotate: true,
                formatter: (v) => v.split(' ')[0]
              },
            }}
            yAxis={{
              title: {
                text: '热度值',
                style: {
                  fontSize: 14
                }
              }
            }}
            lineStyle={({ type }) => {
              if (type === '实际热度') {
                return { lineWidth: 3, stroke: platform === 'douyin' ? '#ff0064' : '#3e7bff' };
              }
              return { lineWidth: 2, stroke: '#faad14', lineDash: [5, 5] };
            }}
          />
        </div>
      </GradientCard>
    );
  };

  const renderHotTopics = () => {
    if (!analysisResult?.peakPeriods?.length) return null;

    return (
      <GradientCard
        title={<><FireOutlined /> 热点话题</>}
        loading={loading}
        platform={platform}
      >
        <Table
          dataSource={analysisResult.peakPeriods}
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              width: '25%',
              render: (date) => (
                <Text strong style={{
                  color: platform === 'douyin' ? '#ff0064' : '#3e7bff',
                  fontSize: '14px'
                }}>
                  {date}
                </Text>
              ),
            },
            {
              title: '话题',
              dataIndex: 'title',
              ellipsis: true,
              width: '50%',
            },
            {
              title: '热度',
              dataIndex: 'score',
              width: '25%',
              render: (score) => (
                <Text strong style={{
                  color: platform === 'douyin' ? '#ff0064' : '#3e7bff',
                  fontSize: '16px'
                }}>
                  {score}
                </Text>
              ),
            },
          ]}
          pagination={{ pageSize: 5 }}
          size="middle"
        />
      </GradientCard>
    );
  };

  const renderKeywordTrends = () => {
    if (!keywordTrends || !selectedKeyword) return null;

    const chartData = keywordTrends.trends[selectedKeyword].data;

    return (
      <GradientCard
        title={<><BarChartOutlined /> 关键词趋势分析</>}
        loading={loading}
        platform={platform}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ fontSize: '16px' }}>选择关键词：</Text>
          <Select
            value={selectedKeyword}
            onChange={setSelectedKeyword}
            style={{ width: 200, marginLeft: 8 }}
            size="large"
          >
            {keywordTrends.topKeywords.map(keyword => (
              <Option key={keyword} value={keyword}>{keyword}</Option>
            ))}
          </Select>
        </div>
        <div style={{ height: 400 }}>
          <Line
            data={chartData}
            xField="date"
            yField="count"
            smooth={true}
            animation={false}
            point={{
              size: 4,
            }}
            color={platform === 'douyin' ? '#ff0064' : '#3e7bff'}
            xAxis={{
              type: 'timeCat',
              label: {
                autoRotate: true,
                formatter: (v) => v.split(' ')[0]
              },
            }}
            yAxis={{
              title: {
                text: '出现次数',
                style: {
                  fontSize: 14
                }
              }
            }}
            lineStyle={{ lineWidth: 3 }}
          />
        </div>
      </GradientCard>
    );
  };

  const renderTopKeywords = () => {
    if (!keywordTrends) return null;

    // 获取每个关键词在最近一天的出现次数
    const latestDate = keywordTrends.dates[keywordTrends.dates.length - 1];
    const latestCounts = {};

    keywordTrends.topKeywords.forEach(keyword => {
      const trendData = keywordTrends.trends[keyword].data;
      const latestData = trendData.find(d => d.date === latestDate);
      latestCounts[keyword] = latestData ? latestData.count : 0;
    });

    // 按最近一天的出现次数排序
    const sortedKeywords = [...keywordTrends.topKeywords].sort((a, b) =>
      latestCounts[b] - latestCounts[a]
    );

    const chartData = sortedKeywords.slice(0, 10).map(keyword => ({
      keyword,
      count: latestCounts[keyword]
    }));

    return (
      <GradientCard
        title={<><FireOutlined /> 热门关键词</>}
        loading={loading}
        platform={platform}
      >
        <div style={{ height: 400 }}>
          <Column
            data={chartData}
            xField="keyword"
            yField="count"
            columnWidthRatio={0.6}
            color={platform === 'douyin' ? '#ff0064' : '#3e7bff'}
            label={{
              position: 'middle',
              style: {
                fill: '#FFFFFF',
                opacity: 0.8,
                fontWeight: 'bold',
                fontSize: 14
              },
            }}
            meta={{
              keyword: { alias: '关键词' },
              count: { alias: '出现次数' }
            }}
            xAxis={{
              label: {
                autoRotate: false,
                autoHide: true,
                autoEllipsis: true,
                style: {
                  fontSize: 14
                }
              }
            }}
            yAxis={{
              title: {
                text: '出现次数',
                style: {
                  fontSize: 14
                }
              }
            }}
          />
        </div>
      </GradientCard>
    );
  };

  return (
    <div style={{ padding: '16px 0' }} className={`platform-${platform}`}>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {renderTrendChart()}
        {renderKeywordTrends()}
        {renderTopKeywords()}
        {renderHotTopics()}
      </Space>
    </div>
  );
};

export default AdvancedAnalysis;