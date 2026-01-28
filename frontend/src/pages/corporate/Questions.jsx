// Questions.jsx
import React, { useState, useEffect } from 'react';

const Questions = () => {
  useEffect(() => {
        document.title = "Corporate FNA Survey | Financial Needs Analysis";
      }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Define your 10 questions here
  const questions = [
    {
      id: 1,
      title: "When you receive your paycheck, what happens first?",
      options: [
        "Bills and expenses take it all",
        "I save whatever's left at month end",
        "I manually transfer some to savings",
        "Automatic transfer to savings happens immediately"
      ]
    },
    {
      id: 2,
      title: "How often do you review your budget?",
      options: [
        "Never — I just wing it",
        "Once a year, if I remember",
        "Monthly — I track income vs. spending",
        "Weekly — I adjust as needed"
      ]
    },
    {
      id: 3,
      title: "What’s your biggest financial goal right now?",
      options: [
        "Pay off debt",
        "Build an emergency fund",
        "Save for a big purchase (car, house, etc.)",
        "Invest for retirement or growth"
      ]
    },
    {
      id: 4,
      title: "Do you have a dedicated savings account?",
      options: [
        "No — I keep everything in my checking",
        "Yes, but I rarely use it",
        "Yes — I actively contribute to it",
        "Yes — and I automate transfers to it"
      ]
    },
    {
      id: 5,
      title: "How do you handle unexpected expenses?",
      options: [
        "I panic and use credit cards",
        "I dip into my savings if I have any",
        "I cut back on other spending to cover it",
        "I have an emergency fund ready to go"
      ]
    },
    {
      id: 6,
      title: "How confident are you about your financial future?",
      options: [
        "Not at all — I’m stressed daily",
        "Somewhat — I’m trying to get better",
        "Fairly confident — I have a plan",
        "Very confident — I’m on track"
      ]
    },
    {
      id: 7,
      title: "Do you invest beyond your employer’s retirement plan?",
      options: [
        "No — I don’t know how to start",
        "Sometimes — I dabble with apps",
        "Yes — I have a diversified portfolio",
        "Yes — and I consult a financial advisor"
      ]
    },
    {
      id: 8,
      title: "What’s your biggest financial fear?",
      options: [
        "Running out of money in retirement",
        "Unexpected medical bills",
        "Losing my job and not being able to pay bills",
        "Not being able to afford my kids’ education"
      ]
    },
    {
      id: 9,
      title: "How much of your income do you aim to save each month?",
      options: [
        "Less than 5%",
        "5–10%",
        "10–20%",
        "20% or more"
      ]
    },
    {
      id: 10,
      title: "What would make you feel more financially secure?",
      options: [
        "A higher salary",
        "More knowledge about personal finance",
        "A solid emergency fund",
        "Professional financial guidance"
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option
    });
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="questions-container">
      {/* Header */}
      <header className="header">
        <img src="https://via.placeholder.com/180x40?text=CAELUM+Insight" alt="CAELUM Insight" className="logo" />
        <span className="progress-text">{currentQuestionIndex + 1} of {questions.length}</span>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question Section */}
      <main className="question-section">
        <div className="section-title">Savings Habits</div>
        <div className="sub-title">Let’s understand your saving reflexes</div>
        <h2 className="question-title">{currentQuestion.title}</h2>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="option-item">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                onChange={() => handleOptionSelect(option)}
                checked={answers[currentQuestion.id] === option}
              />
              <span className="option-label">{option}</span>
            </label>
          ))}
        </div>
      </main>

      {/* Navigation Buttons */}
      <footer className="navigation">
        <button
          className="btn-prev"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          &lt; Previous
        </button>
        <button
          className="btn-continue"
          onClick={handleContinue}
          disabled={!answers[currentQuestion.id]}
        >
          Continue &gt;
        </button>
      </footer>
    </div>
  );
};

export default Questions;