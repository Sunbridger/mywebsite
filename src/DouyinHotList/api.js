import axios from 'axios';
import { Octokit } from '@octokit/core';
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

  // 支持常见的环境变量名，优先使用 GITHUB_PERSONAL_ACCESS_TOKEN
  // 尝试从多种环境来源读取 token：优先 VITE_ 前缀（Vite 注入），其次 process.env（Node 环境）
  const tokenFromProcess = typeof globalThis !== 'undefined' && globalThis['process'] && globalThis['process'].env
    ? (globalThis['process'].env.GITHUB_PERSONAL_ACCESS_TOKEN || globalThis['process'].env.GITHUB_TOKEN)
    : undefined;
  const tokenFromVite = typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_GITHUB_PERSONAL_ACCESS_TOKEN || import.meta.env.VITE_GITHUB_TOKEN)
    : undefined;

  const authToken = tokenFromVite || tokenFromProcess;

  const octokit = new Octokit({
    auth: authToken,
  });

  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: WORKFLOW_ID,
      ref: 'main',
      inputs: {
        triggered_by: 'web_interface',
        target_date: inputs?.target_date || '',
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  );
};
