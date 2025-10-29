import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Typography, Space } from 'antd';
import { Line } from '@ant-design/plots';
import {
  LineChartOutlined,
  RiseOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { GradientCard } from './GradientCard';
import { TimeSeriesAnalysis } from '../analysis/timeSeriesAnalysis';
import { ContentAnalysis } from '../analysis/contentAnalysis';

const { Text } = Typography;

const AdvancedAnalysis = ({ data, loading }) => {
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (!data || loading) return;

    const trendAnalysis = TimeSeriesAnalysis.analyzeTrend(data);
    const prediction = TimeSeriesAnalysis.predictHotness(data);
    const peakPeriods = TimeSeriesAnalysis.findPeakPeriods(data);

    setAnalysisResult({ trendAnalysis, prediction, peakPeriods });
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
        gradientColors={['#8EC5FC', '#E0C3FC']}
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
              size: 3,
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
            yAxis={{}}
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
        gradientColors={['#FBAB7E', '#F7CE68']}
      >
        <Table
          dataSource={analysisResult.peakPeriods}
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              width: '25%',
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
                <Text strong style={{ color: '#ff4d4f' }}>
                  {score}
                </Text>
              ),
            },
          ]}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </GradientCard>
    );
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {renderTrendChart()}
        {renderHotTopics()}
      </Space>
    </div>
  );
};

export default AdvancedAnalysis;