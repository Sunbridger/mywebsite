import dayjs from 'dayjs';

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('zh-CN');
};

/**
 * 格式化热度数值，根据数值大小转换为"千万"或"万"为单位
 * @param {number} hot - 需要格式化的热度数值
 * @returns {string} 格式化后的热度字符串
 */
export const formatHot = (hot) => {
  if (hot >= 10000000) {
    return (hot / 10000000).toFixed(1) + '千万';
  } else if (hot >= 10000) {
    return (hot / 10000).toFixed(1) + '万';
  }
  return hot.toString();
};

export const QUICK_DATE_BUTTONS = [
  { label: '今天', value: dayjs().format('YYYY-MM-DD') },
  { label: '昨天', value: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
  { label: '3天前', value: dayjs().subtract(3, 'day').format('YYYY-MM-DD') },
  { label: '一周前', value: dayjs().subtract(7, 'day').format('YYYY-MM-DD') },
];
