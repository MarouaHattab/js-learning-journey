class QuizStorage {
  constructor() {
    this.STORAGE_KEY = "quizHistory";
  }

  saveQuizResult(quizData) {
    try {
      const history = this.getQuizHistory();
      const result = {
        id: Date.now(),
        quizName: quizData.quizName,
        topic: quizData.topic,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        percentage: Math.round(
          (quizData.score / quizData.totalQuestions) * 100
        ),
        date: new Date().toISOString(),
        dateFormatted: this.formatDate(new Date()),
        timeFormatted: this.formatTime(new Date()),
        answers: quizData.answers || [],
      };

      history.unshift(result);

      if (history.length > 100) {
        history.splice(100);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      return true;
    } catch (error) {
      return false;
    }
  }

  getQuizHistory() {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      return [];
    }
  }

  getHistoryByTopic(topic) {
    const allHistory = this.getQuizHistory();
    return allHistory.filter((result) => result.topic === topic);
  }

  getStatistics() {
    const history = this.getQuizHistory();

    if (history.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        totalQuestions: 0,
        topicStats: {},
      };
    }

    const totalAttempts = history.length;
    const scores = history.map((h) => h.percentage);
    const averageScore = Math.round(
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    const topicStats = {};
    history.forEach((result) => {
      if (!topicStats[result.topic]) {
        topicStats[result.topic] = {
          attempts: 0,
          totalScore: 0,
          bestScore: 0,
          averageScore: 0,
        };
      }

      topicStats[result.topic].attempts++;
      topicStats[result.topic].totalScore += result.percentage;
      topicStats[result.topic].bestScore = Math.max(
        topicStats[result.topic].bestScore,
        result.percentage
      );
    });

    Object.keys(topicStats).forEach((topic) => {
      topicStats[topic].averageScore = Math.round(
        topicStats[topic].totalScore / topicStats[topic].attempts
      );
    });

    return {
      totalAttempts,
      averageScore,
      bestScore,
      worstScore,
      topicStats,
    };
  }

  clearHistory() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteResult(resultId) {
    try {
      const history = this.getQuizHistory();
      const updatedHistory = history.filter((result) => result.id !== resultId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      return false;
    }
  }

  formatDate(date) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  formatTime(date) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString("en-US", options);
  }

  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return this.formatDate(date);
  }

  isStorageAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  getStorageInfo() {
    if (!this.isStorageAvailable()) return null;

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      const sizeInBytes = new Blob([data || ""]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);

      return {
        entries: this.getQuizHistory().length,
        sizeInBytes,
        sizeInKB: `${sizeInKB} KB`,
      };
    } catch (error) {
      return null;
    }
  }

  exportData() {
    const history = this.getQuizHistory();
    const stats = this.getStatistics();

    return {
      exportDate: new Date().toISOString(),
      version: "1.0",
      history,
      statistics: stats,
    };
  }

  importData(importedData) {
    try {
      if (!importedData.history || !Array.isArray(importedData.history)) {
        throw new Error("Invalid import data format");
      }

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(importedData.history)
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

const quizStorage = new QuizStorage();
window.quizStorage = quizStorage;
