/**
 * 内容分析模块
 */
export class ContentAnalysis {
  /**
   * 提取关键词
   * @param {Array} data - 原始数据数组
   * @returns {Array} 关键词及其频率
   */
  static extractKeywords(data) {
    // 实现中文分词和关键词提取
    const titles = data.map(d => d.title);
    const words = {};

    // 简单的词频统计（后续可以使用更复杂的分词算法）
    titles.forEach(title => {
      const uniqueWords = new Set(title.split(''));
      uniqueWords.forEach(word => {
        words[word] = (words[word] || 0) + 1;
      });
    });

    return Object.entries(words)
      .filter(([word]) => word.length > 1) // 过滤单字
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20); // 取前20个关键词
  }

  /**
   * 话题聚类分析
   * @param {Array} data - 原始数据
   * @returns {Object} 聚类结果
   */
  static clusterTopics(data) {
    const categories = {
      entertainment: [],
      social: [],
      technology: [],
      lifestyle: [],
      other: []
    };

    // 基于关键词的简单分类（后续可以使用机器学习模型）
    const keywords = {
      entertainment: ['明星', '综艺', '电影', '音乐', '演唱会'],
      social: ['社会', '事件', '政策', '新闻'],
      technology: ['科技', '数码', '发布', '创新'],
      lifestyle: ['美食', '旅游', '生活', '穿搭']
    };

    data.forEach(item => {
      let categorized = false;
      for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => item.title.includes(word))) {
          categories[category].push(item);
          categorized = true;
          break;
        }
      }
      if (!categorized) {
        categories.other.push(item);
      }
    });

    return categories;
  }

  /**
   * 相关话题分析
   * @param {Array} data - 原始数据
   * @returns {Array} 相关话题组
   */
  static findRelatedTopics(data) {
    const relatedGroups = [];
    const processed = new Set();

    data.forEach(item => {
      if (processed.has(item.id)) return;

      const related = data.filter(other =>
        other.id !== item.id &&
        this.calculateSimilarity(item.title, other.title) > 0.3
      );

      if (related.length > 0) {
        relatedGroups.push({
          main: item,
          related: related
        });

        processed.add(item.id);
        related.forEach(r => processed.add(r.id));
      }
    });

    return relatedGroups;
  }

  /**
   * 计算两个标题的相似度（简单实现）
   * @private
   */
  static calculateSimilarity(title1, title2) {
    const set1 = new Set(title1);
    const set2 = new Set(title2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }
}