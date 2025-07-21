document.addEventListener("DOMContentLoaded", function () {
  initializeMainPage();

  function initializeMainPage() {
    setupNavigationButtons();
  }

  function setupNavigationButtons() {
    const startButtons = document.querySelectorAll(".start-quiz-btn");

    startButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        const topic = this.getAttribute("data-topic");
        const quizName = this.getAttribute("data-quiz");

        if (topic && quizName) {
          // Store selected quiz info in sessionStorage for quiz page
          sessionStorage.setItem(
            "selectedQuiz",
            JSON.stringify({
              topic: topic,
              quizName: quizName,
              startTime: new Date().toISOString(),
            })
          );

          // Navigate to quiz page
          window.location.href = "quiz.html";
        } else {
          console.error("Missing topic or quiz name");
        }
      });
    });

    // History navigation button
    const historyBtn = document.getElementById("historyBtn");
    if (historyBtn) {
      historyBtn.addEventListener("click", function () {
        window.location.href = "history.html";
      });
    }

    // Settings or about button if exists
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", showAboutModal);
    }
  }

  // Add smooth animations to cards
  function addCardAnimations() {
    const cards = document.querySelectorAll(".quiz-card, .stats-card");

    // Intersection Observer for fade-in animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    cards.forEach((card, index) => {
      // Initial state
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = `opacity 0.6s ease ${
        index * 0.1
      }s, transform 0.6s ease ${index * 0.1}s`;

      // Observe for animation
      observer.observe(card);

      // Add hover effects
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  // Show about modal
  function showAboutModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📚 About Quiz App</h3>
                    <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <p>A responsive web quiz application featuring:</p>
                    <ul>
                        <li>🌐 HTML, CSS, and JavaScript quizzes</li>
                        <li>📊 Progress tracking and statistics</li>
                        <li>💾 Local storage for quiz history</li>
                        <li>📱 Fully responsive design</li>
                        <li>🎨 Modern coding-themed interface</li>
                    </ul>
                    <p><strong>Built with:</strong> Vanilla HTML, CSS, JavaScript</p>
                    <p><strong>Version:</strong> 1.0.0</p>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.modal-overlay').remove()">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  // Show confirmation modal
  function showConfirmModal(title, message, onConfirm) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="btn-danger" id="confirmAction">Confirm</button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    modal
      .querySelector("#confirmAction")
      .addEventListener("click", function () {
        onConfirm();
        modal.remove();
      });
  }

  // Show message notification
  function showMessage(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);
  }

  // Utility function to get quiz progress for a topic
  function getTopicProgress(topic) {
    if (typeof quizStorage === "undefined") return 0;

    const history = quizStorage.getHistoryByTopic(topic);
    return history.length;
  }

  // Export functions for global use
  window.mainPageUtils = {
    displayQuickStats,
    showMessage,
    showConfirmModal,
    getTopicProgress,
  };
});

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Uncomment if you want to add PWA capabilities
    // navigator.serviceWorker.register('/sw.js')
    //   .then(reg => console.log('SW registered'))
    //   .catch(err => console.log('SW registration failed'));
  });
}
