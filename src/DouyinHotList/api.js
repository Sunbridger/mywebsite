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

/**
 * 触发 GitHub Actions 工作流
 * @param {Object} inputs - 工作流输入参数
 * @param {string} [inputs.target_date] - 目标日期，用于指定数据抓取的日期
 * @returns {Promise<void>} 无返回值的 Promise
 * @throws {Error} 当 GitHub API 调用失败时抛出错误
 */
export const triggerGitHubAction = async (inputs = {}) => {
  // 仓库配置
  const REPO_OWNER = 'Sunbridger'; // 仓库所有者用户名
  const REPO_NAME = 'screenshot'; // 目标仓库名称
  const WORKFLOW_ID = 'update-data-byapi.yml'; // GitHub Actions 工作流文件名

  // GitHub Token 获取逻辑
  // 支持多种环境变量名称，按以下优先级尝试：
  // 1. VITE_GITHUB_PERSONAL_ACCESS_TOKEN (Vite 环境变量)
  // 2. VITE_GITHUB_TOKEN (Vite 环境变量)
  // 3. GITHUB_PERSONAL_ACCESS_TOKEN (Node 环境变量)
  // 4. GITHUB_TOKEN (Node 环境变量)
  const tokenFromProcess = typeof globalThis !== 'undefined' && globalThis['process'] && globalThis['process'].env
    ? (globalThis['process'].env.GITHUB_PERSONAL_ACCESS_TOKEN || globalThis['process'].env.GITHUB_TOKEN)
    : undefined;
  const tokenFromVite = typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_GITHUB_PERSONAL_ACCESS_TOKEN || import.meta.env.VITE_GITHUB_TOKEN)
    : undefined;

  // 优先使用 Vite 注入的环境变量
  const authToken = tokenFromVite || tokenFromProcess;

  // 初始化 GitHub API 客户端
  const octokit = new Octokit({
    auth: authToken,
  });

  // 调用 GitHub API 触发工作流
  // 使用 workflow_dispatch 事件触发指定的工作流
  await octokit.request(
    'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      workflow_id: WORKFLOW_ID,
      ref: 'main', // 指定在哪个分支上运行工作流
      inputs: {
        triggered_by: 'web_interface', // 标记触发来源
        target_date: inputs?.target_date || '', // 可选的目标日期参数
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28', // 指定 GitHub API 版本
      },
    }
  );
};
