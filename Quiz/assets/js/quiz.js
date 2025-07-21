class QuizInterface {
  constructor() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.questions = [];
    this.currentTopic = "";
    this.userAnswers = [];
    this.initializeQuiz();
  }
  initializeQuiz() {
    const selectedQuiz = sessionStorage.getItem("selectedQuiz");
    if (!selectedQuiz) {
      window.location.href = "index.html";
      return;
    }
    const quizData = JSON.parse(selectedQuiz);
    this.currentTopic = quizData.topic;
    this.loadQuestions();
    this.setupUI();
    this.displayQuestion();
  }
  loadQuestions() {
    if (typeof QuizData === "undefined") {
      console.error("Quiz data not loaded");
      return;
    }
    const topicQuestions = QuizData[this.currentTopic];
    if (!topicQuestions) {
      console.error("No questions found for topic:", this.currentTopic);
      return;
    }
    this.questions = this.shuffleArray([...topicQuestions]).slice(
      0,
      this.totalQuestions
    );
    this.userAnswers = new Array(this.totalQuestions).fill(null);
    
    
  }
  setupUI() {
    // Setup navigation buttons
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextQuestion());
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.submitQuiz());
    }
  }
  displayQuestion() {
    if (!this.questions[this.currentQuestionIndex]) return;
    this.resetAnswerStyles();
    const question = this.questions[this.currentQuestionIndex];
    const questionNumber = document.getElementById("questionNumber");
    if (questionNumber) {
      questionNumber.textContent = `Question ${
        this.currentQuestionIndex + 1
      } of ${this.totalQuestions}`;
    }
    const questionText = document.getElementById("questionText");
    if (questionText) {
      questionText.textContent = question.question;
    }
    const optionsContainer = document.getElementById("optionsContainer");
    if (optionsContainer) {
      
      optionsContainer.innerHTML = question.options
        .map(
          (option, index) => `
            <button class="answer-option" data-value="${index}" ${
            this.userAnswers[this.currentQuestionIndex] === index
              ? 'data-selected="true"'
              : ""
          }>
              <span class="option-text">${this.escapeHtml(option)}</span>
            </button>
          `
        )
        .join("");
      const answerOptions = optionsContainer.querySelectorAll(".answer-option");
      answerOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          answerOptions.forEach((opt) => opt.classList.remove("selected"));
          e.currentTarget.classList.add("selected");
          const selectedValue = parseInt(e.currentTarget.dataset.value);
          this.userAnswers[this.currentQuestionIndex] = selectedValue;
          this.showAnswerFeedback(selectedValue, answerOptions);
          this.updateNavigationButtons();
        });
      });
      if (
        this.userAnswers[this.currentQuestionIndex] !== null &&
        this.userAnswers[this.currentQuestionIndex] !== undefined
      ) {
        const selectedOption = optionsContainer.querySelector(
          `[data-value="${this.userAnswers[this.currentQuestionIndex]}"]`
        );
        if (selectedOption) {
          selectedOption.classList.add("selected");
        }
      }
    }
    this.updateProgress();
    this.updateNavigationButtons();
  }
  goToQuestion(questionIndex) {
    if (questionIndex >= 0 && questionIndex < this.totalQuestions) {
      this.currentQuestionIndex = questionIndex;
      this.displayQuestion();
    }
  }
  nextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion();
    }
  }
  showAnswerFeedback(selectedValue, answerOptions) {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    answerOptions.forEach((option, index) => {
      const optionValue = parseInt(option.dataset.value);
      if (optionValue === correctAnswer) {
        option.style.setProperty("background-color", "#4CAF50", "important");
        option.style.setProperty("color", "white", "important");
        option.style.setProperty("border", "2px solid #4CAF50", "important");
        option.style.setProperty("transform", "scale(1.02)", "important");
      } else if (optionValue === selectedValue) {
        option.style.setProperty("background-color", "#F44336", "important");
        option.style.setProperty("color", "white", "important");
        option.style.setProperty("border", "2px solid #F44336", "important");
        option.style.setProperty("transform", "scale(1.02)", "important");
      } else {
        option.style.setProperty("opacity", "0.4", "important");
      }
    });
  }
  resetAnswerStyles() {
    const answerOptions = document.querySelectorAll(".answer-option");
    answerOptions.forEach((option) => {
      option.style.backgroundColor = "";
      option.style.color = "";
      option.style.border = "";
      option.style.opacity = "";
      option.style.pointerEvents = "";
      option.classList.remove("selected");
    });
  }
  updateNavigationButtons() {
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const isCurrentQuestionAnswered =
      this.userAnswers[this.currentQuestionIndex] !== null &&
      this.userAnswers[this.currentQuestionIndex] !== undefined;
    if (this.currentQuestionIndex === this.totalQuestions - 1) {
      if (nextBtn) nextBtn.style.display = "none";
      if (submitBtn) {
        submitBtn.style.display = "block";
        submitBtn.disabled = !isCurrentQuestionAnswered;
      }
    } else {
      if (nextBtn) {
        nextBtn.style.display = "block";
        nextBtn.disabled = !isCurrentQuestionAnswered;
      }
      if (submitBtn) submitBtn.style.display = "none";
    }
  }
  updateProgress() {
    const answeredQuestions = this.userAnswers.filter(
      (answer) => answer !== null && answer !== undefined
    ).length;
    const progressPercentage = (answeredQuestions / this.totalQuestions) * 100;
    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    if (progressText) {
      progressText.textContent = `Question ${
        this.currentQuestionIndex + 1
      } of ${this.totalQuestions}`;
    }
    if (progressFill) {
      progressFill.style.width = `${progressPercentage}%`;
    }
    
  }
  submitQuiz() {
    this.calculateScore();
    this.completeQuiz();
  }
  calculateScore() {
    this.score = 0;
    this.userAnswers.forEach((userAnswer, index) => {
      if (userAnswer !== null && this.questions[index]) {
        if (userAnswer === this.questions[index].correctAnswer) {
          this.score++;
        }
      }
    });
  }
  completeQuiz() {
    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    
    this.saveQuizResults(percentage);
    const quizContent = document.querySelector(".quiz-content");
    const quizControls = document.querySelector(".quiz-controls");
    if (quizContent) {
      quizContent.style.display = "none";
      
    }
    if (quizControls) {
      quizControls.style.display = "none";
      
    }
    const scoreMessage = document.getElementById("scoreMessage");
    if (scoreMessage) {
      scoreMessage.textContent = `You scored ${this.score} out of ${this.totalQuestions}!`;
      let performanceClass = "score-good";
      if (percentage >= 80) {
        performanceClass = "score-excellent";
      } else if (percentage < 60) {
        performanceClass = "score-average";
      }
      scoreMessage.className = performanceClass;
      
    } else {
      
    }
    const resultsHeader = document.querySelector(".results-header h1");
    if (resultsHeader) {
      resultsHeader.textContent = "🎉 Quiz Completed!";
    }
    const resultsContainer = document.getElementById("resultsContainer");
    if (resultsContainer) {
      resultsContainer.style.display = "block";
      
    } else {
      
    }
  }
  saveQuizResults(percentage) {
    if (typeof quizStorage === "undefined") {
      console.warn("QuizStorage not available");
      return;
    }
    const quizData = {
      quizName: `${this.currentTopic.toUpperCase()} Quiz`,
      topic: this.currentTopic,
      score: this.score,
      totalQuestions: this.totalQuestions,
      answers: this.userAnswers.map((answer, index) => ({
        questionIndex: index,
        userAnswer: answer,
        correctAnswer: this.questions[index]?.correct,
        correct: answer === this.questions[index]?.correct,
      })),
    };
    try {
      const saved = quizStorage.saveQuizResult(quizData);
      if (saved) {
        
      } else {
        console.error("Failed to save quiz results");
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  }
  escapeHtml(unsafe) {
    if (typeof unsafe !== "string") return unsafe;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  window.quizInterface = new QuizInterface();
});
window.quizInterface = new QuizInterface();


