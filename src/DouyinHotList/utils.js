import dayjs from 'dayjs';

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString('zh-CN');
};

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
