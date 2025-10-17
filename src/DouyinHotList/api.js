import axios from 'axios';
import dayjs from 'dayjs';

const getBaseUrl = (platform) => `https://raw.githubusercontent.com/Sunbridger/screenshot/refs/heads/main/data-${platform}`;

export const fetchHotListData = async (date, platform) => {
  const url = `${getBaseUrl(platform)}/${date}.json`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchDateRangeData = async (dateRange, platform) => {
  const [startDate, endDate] = dateRange;
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const allData = [];

  // 改为从结束日期向开始日期遍历
  let currentDate = end;
  while (currentDate.isAfter(start) || currentDate.isSame(start)) {
    const dateStr = currentDate.format('YYYY-MM-DD');

    try {
      const data = await fetchHotListData(dateStr, platform);
      if (data && data.length > 0) {
        const datedData = data.map((item) => ({
          ...item,
          dataDate: dateStr,
          uniqueKey: `${dateStr}-${item.id}`,
        }));
        allData.push(...datedData);
      }
    } catch (err) {
      console.warn(`${dateStr} 数据获取失败:`, err.message);
    }

    currentDate = currentDate.subtract(1, 'day');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return allData;
};
