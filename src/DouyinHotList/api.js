import axios from 'axios';
import dayjs from 'dayjs';

const getBaseUrl = (platform) =>
  `https://raw.githubusercontent.com/Sunbridger/screenshot/refs/heads/main/data-${platform}`;

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

export const triggerGitHubAction = async (inputs = {}) => {
  const REPO_OWNER = 'Sunbridger'; // 替换为您的用户名
  const REPO_NAME = 'screenshot'; // 替换为您的仓库名
  const WORKFLOW_ID = 'update-data-byapi.yml'; // 工作流文件名

  try {
    const response = await axios(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`,
      {
        method: 'POST',
        headers: {
          // eslint-disable-next-line no-undef
          Authorization: `token ${__API_TOKEN__}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          ref: 'main', // 触发分支
          inputs: {
            triggered_by: 'web_interface',
            target_date: inputs?.target_date || '',
          },
        }),
      }
    );

    if (response.status === 204) {
      return { success: true, message: '工作流触发成功' };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(`触发失败: ${error.message}`);
  }
};
