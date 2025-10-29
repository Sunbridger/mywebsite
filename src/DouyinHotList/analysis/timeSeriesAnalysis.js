import dayjs from 'dayjs';
import { mean, standardDeviation, linearRegression } from 'simple-statistics';

/**
 * 时间序列分析模块
 */
export class TimeSeriesAnalysis {
  /**
   * 计算热度趋势
   * @param {Array} data - 原始数据数组
   * @returns {Object} 趋势分析结果
   */
  static analyzeTrend(data) {
    const timePoints = data.map(d => dayjs(d.dataDate).valueOf());
    const hotScores = data.map(d => d.hot);

    return {
      mean: mean(hotScores),
      std: standardDeviation(hotScores),
      trend: linearRegression(
        timePoints.map((t, i) => [t, hotScores[i]])
      )
    };
  }

  /**
   * 预测热度变化
   * @param {Array} data - 历史数据
   * @param {number} days - 预测天数
   * @returns {Array} 预测结果
   */
  static predictHotness(data, days = 7) {
    const trend = this.analyzeTrend(data);
    const lastDate = dayjs(data[data.length - 1].dataDate);

    return Array.from({ length: days }, (_, i) => {
      const futureDate = lastDate.add(i + 1, 'day');
      const predictedScore = trend.trend.m * futureDate.valueOf() + trend.trend.b;

      return {
        date: futureDate.format('YYYY-MM-DD'),
        predicted_score: Math.max(0, predictedScore)
      };
    });
  }

  /**
   * 识别热点高峰期
   * @param {Array} data - 原始数据
   * @returns {Array} 高峰期数据点
   */
  static findPeakPeriods(data) {
    const threshold = mean(data.map(d => d.hot)) +
                     standardDeviation(data.map(d => d.hot));

    return data.filter(d => d.hot > threshold)
               .map(d => ({
                 date: d.dataDate,
                 score: d.hot,
                 title: d.title
               }));
  }
}