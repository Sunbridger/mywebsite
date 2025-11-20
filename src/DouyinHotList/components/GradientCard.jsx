import React from 'react';
import { Card, Space } from 'antd';

export const GradientCard = ({ title, children, loading, gradientColors, platform }) => {
  // 获取平台渐变
  const getPlatformGradient = () => {
    if (platform === 'douyin') {
      return 'linear-gradient(120deg, #ff0064, #fa7042)';
    } else if (platform === 'baidu') {
      return 'linear-gradient(120deg, #3e7bff, #00d8ff)';
    }
    return 'linear-gradient(120deg, #1890ff, #00d8ff)';
  };

  const gradient = gradientColors
    ? `linear-gradient(135deg, ${gradientColors.join(', ')})`
    : getPlatformGradient();

  return (
    <Card
      title={
        <Space>
          {title}
        </Space>
      }
      loading={loading}
      className={`gradient-card platform-${platform}`}
      style={{
        background: gradient,
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: 'none'
      }}
      headStyle={{
        background: 'rgba(255,255,255,0.95)',
        borderBottom: 'none',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        padding: '0 24px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center'
      }}
      bodyStyle={{
        padding: '24px',
        background: 'rgba(255,255,255,0.95)',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
      }}
    >
      {children}
    </Card>
  );
};