document.addEventListener("DOMContentLoaded", function () {
  initializeHistoryPage();

  function initializeHistoryPage() {
    if (typeof quizStorage === "undefined") {
      
      return;
    }

    displayHistoryByTopic();
    setupHistoryControls();
  }

  function displayHistoryByTopic() {
    const topics = [
      { key: "html", name: "HTML", container: "htmlQuizHistory" },
      { key: "css", name: "CSS", container: "cssQuizHistory" },
      {
        key: "javascript",
        name: "JavaScript",
        container: "javascriptQuizHistory",
      },
    ];

    topics.forEach((topic) => {
      const history = quizStorage.getHistoryByTopic(topic.key);
      const container = document.getElementById(topic.container);

      if (history.length === 0) {
        container.innerHTML = '<div class="no-history">No history found</div>';
      } else {
        container.innerHTML = history
          .map((entry) => createHistoryItemHTML(entry))
          .join("");
      }
    });
  }

  function createHistoryItemHTML(entry) {
    return `
            <div class="quiz-history-item">
                <div class="quiz-history-header">
                    <h4 class="quiz-title">${entry.quizName}</h4>
                    <div class="quiz-score">${entry.score}/${entry.totalQuestions}</div>
                </div>
                <p class="quiz-date">${entry.dateFormatted} at ${entry.timeFormatted}</p>
            </div>
        `;
  }

  function setupHistoryControls() {
    const clearAllBtn = document.getElementById("clearAllHistory");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", function () {
        if (
          confirm(
            "Are you sure you want to clear all quiz history? This action cannot be undone."
          )
        ) {
          if (quizStorage.clearHistory()) {
            displayHistoryByTopic();
            showMessage("All history cleared successfully!", "success");
          } else {
            showMessage("Error clearing history. Please try again.", "error");
          }
        }
      });
    }
  }

  function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value;
    }
  }

  function showMessage(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }
});

