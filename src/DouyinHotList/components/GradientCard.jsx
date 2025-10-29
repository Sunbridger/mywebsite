import React from 'react';
import { Card, Space } from 'antd';

export const GradientCard = ({ title, children, loading, gradientColors }) => {
  const gradient = `linear-gradient(135deg, ${gradientColors.join(', ')})`;

  return (
    <Card
      title={
        <Space>
          {title}
        </Space>
      }
      loading={loading}
      style={{
        background: gradient,
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
      headStyle={{
        background: 'rgba(255,255,255,0.9)',
        borderBottom: 'none',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
      }}
      bodyStyle={{
        padding: '24px',
        background: 'rgba(255,255,255,0.9)',
      }}
    >
      {children}
    </Card>
  );
};