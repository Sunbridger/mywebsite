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

    // 中文分词处理
    titles.forEach(title => {
      const segmentedWords = this.segmentChinese(title);
      segmentedWords.forEach(word => {
        words[word] = (words[word] || 0) + 1;
      });
    });

    return Object.entries(words)
      .filter(([word]) => word.length > 1) // 过滤单字
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20); // 取前20个关键词
  }

  /**
   * 中文分词函数
   * @param {string} text - 待分词的文本
   * @returns {Array} 分词结果数组
   */
  static segmentChinese(text) {
    // 使用浏览器兼容的简单中文分词方法
    // 在实际项目中，可以使用更专业的分词库如 nodejieba（服务端）或 jieba-js（浏览器端）
    
    // 常见停用词列表
    const stopWords = new Set([
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人',
      '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去',
      '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '他',
      '她', '它', '们', '这个', '那个', '什么', '怎么', '为什么', '因为',
      '所以', '但是', '如果', '虽然', '然而', '因此', '而且', '或者',
      '吗', '呢', '吧', '啊', '哦', '嗯', '哈', '呀', '啦', '嘛',
      '我们', '你们', '他们', '她们', '它们', '这些', '那些', '哪些',
      '这里', '那里', '哪里', '现在', '以前', '以后', '刚才','马上',
      '可以', '能够', '应该', '必须', '需要', '想要', '希望', '觉得',
      '知道', '认为', '以为', '发现', '明白', '理解', '相信', '怀疑',
      '给', '为', '被', '把', '让', '使', '由', '从', '向', '往',
      '对', '关于', '对于', '根据', '按照', '依据', '通过', '经过',
      '已经', '正在', '曾经', '将要', '可能', '或许', '大概', '约',
      '非常', '特别', '十分', '极其', '超级', '最', '更', '比较',
      '还', '还是', '或者', '要么', '不是', '没', '无', '非', '未',
      '来', '去', '上', '下', '进', '出', '回', '过', '到', '在'
    ]);
    
    // 简单的基于规则的分词方法
    // 1. 按标点符号分割
    const sentences = text.split(/[，。！？；：""（）【】《》、]/);
    
    // 2. 对每个句子进行分词
    const result = [];
    
    sentences.forEach(sentence => {
      if (sentence.trim() === '') return;
      
      // 3. 识别数字、英文、中文混合内容
      // 正则表达式匹配：数字、英文单词、连续汉字
      const tokens = sentence.match(/\d+\.?\d*|[a-zA-Z]+|[\u4e00-\u9fa5]+/g) || [];
      
      tokens.forEach(token => {
        // 如果是英文或数字，直接添加
        if (/^\d+\.?\d*$/.test(token) || /^[a-zA-Z]+$/.test(token)) {
          result.push(token);
        } 
        // 如果是中文，进行进一步处理
        else if (/^[\u4e00-\u9fa5]+$/.test(token)) {
          // 简单的基于字典的中文分词
          // 这里使用一个简化的算法，实际项目中应使用专业分词库
          
          // 常见中文词汇模式（2-4字词）
          const patterns = [
            // 4字词
            /([^\s]{4})(?=[^\u4e00-\u9fa5]|$)/g,
            // 3字词
            /([^\s]{3})(?=[^\u4e00-\u9fa5]|$)/g,
            // 2字词
            /([^\s]{2})(?=[^\u4e00-\u9fa5]|$)/g
          ];
          
          let remaining = token;
          const words = [];
          
          // 尝试匹配长词优先
          patterns.forEach(pattern => {
            const matches = [...remaining.matchAll(pattern)];
            matches.forEach(match => {
              if (match.index > 0) {
                // 处理匹配位置之前的部分
                const before = remaining.substring(0, match.index);
                if (before) {
                  // 对未匹配部分进行单字切分
                  for (let i = 0; i < before.length; i++) {
                    words.push(before[i]);
                  }
                }
              }
              
              // 添加匹配的词
              words.push(match[1]);
              
              // 更新剩余部分
              remaining = remaining.substring(match.index + match[1].length);
            });
          });
          
          // 处理剩余未匹配的部分
          if (remaining) {
            for (let i = 0; i < remaining.length; i++) {
              words.push(remaining[i]);
            }
          }
          
          // 过滤停用词并添加到结果中
          words.forEach(word => {
            if (word.length > 0 && !stopWords.has(word)) {
              result.push(word);
            }
          });
        }
      });
    });
    
    return result;
  }

  /**
   * 分析关键词趋势
   * @param {Array} data - 原始数据数组
   * @returns {Object} 关键词趋势分析结果
   */
  static analyzeKeywordTrends(data) {
    // 按日期分组数据
    const dataByDate = {};
    data.forEach(item => {
      const date = item.dataDate;
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }
      dataByDate[date].push(item);
    });

    // 获取所有日期并排序
    const dates = Object.keys(dataByDate).sort();

    // 为每个日期统计关键词频率
    const keywordTrends = {};
    dates.forEach(date => {
      const dayData = dataByDate[date];
      const words = {};
      
      dayData.forEach(item => {
        const segmentedWords = this.segmentChinese(item.title);
        segmentedWords.forEach(word => {
          // 只统计长度大于1的词
          if (word.length > 1) {
            words[word] = (words[word] || 0) + 1;
          }
        });
      });

      // 存储该日期的关键词频率
      keywordTrends[date] = words;
    });

    // 找出出现频率最高的关键词
    const allKeywords = {};
    dates.forEach(date => {
      Object.entries(keywordTrends[date]).forEach(([word, count]) => {
        allKeywords[word] = (allKeywords[word] || 0) + count;
      });
    });

    // 按总频率排序，取前20个关键词
    const topKeywords = Object.entries(allKeywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);

    // 为每个关键词构建时间序列数据
    const trends = {};
    topKeywords.forEach(keyword => {
      trends[keyword] = {
        data: dates.map(date => ({
          date,
          count: keywordTrends[date][keyword] || 0
        }))
      };
    });

    return {
      trends,
      dates,
      topKeywords
    };
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