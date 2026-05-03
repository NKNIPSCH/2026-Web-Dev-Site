// grab the elements we need up front
const form = document.getElementById('quiz-form');
const resultsDiv = document.getElementById('quiz-results');
const summaryDiv = document.getElementById('results-summary');
const breakdownDiv = document.getElementById('results-breakdown');
const submitBtn = document.getElementById('submit-btn');
const retakeBtn = document.getElementById('retake-btn');

// correct answers for the radio/text questions
const correctAnswers = {
  q1: 'v8',         // lowercased for comparison -- case insensitive
  q2: 'a',          // Document Object Model
  q3: 'c',          // Mozilla
  q4: 'b',          // Just-in-Time
};

// correct checkbox values for q5 -- has to match all 3 and none of the wrong ones
const q5Correct = ['browser', 'renderer', 'gpu'];

// friendly labels for each question so the feedback makes sense
const questionLabels = {
  q1: 'Q1 (Fill in the Blank): Chrome\'s JavaScript engine',
  q2: 'Q2: What does DOM stand for?',
  q3: 'Q3: Which company makes Gecko?',
  q4: 'Q4: What does JIT stand for?',
  q5: 'Q5: Separate browser processes',
};

// correct answer text to show in feedback
const answerText = {
  q1: 'V8',
  q2: 'Document Object Model',
  q3: 'Mozilla',
  q4: 'Just-in-Time',
  q5: 'Browser Process, Renderer Process, GPU Process',
};

// grade the quiz when they click submit
submitBtn.addEventListener('click', function () {
  let score = 0;
  const total = 5;
  const feedback = [];

  // check q1 -- trim so spaces dont mess it up, lowercase both sides
  const q1Val = document.getElementById('q1').value.trim().toLowerCase();
  const q1Correct = q1Val === correctAnswers.q1;
  if (q1Correct) score++;
  feedback.push({ label: questionLabels.q1, correct: q1Correct, rightAnswer: answerText.q1 });

  // loop through the radio questions and check each one
  ['q2', 'q3', 'q4'].forEach(function (qName) {
    const selected = document.querySelector('input[name="' + qName + '"]:checked');
    const isCorrect = selected && selected.value === correctAnswers[qName];
    if (isCorrect) score++;
    feedback.push({ label: questionLabels[qName], correct: isCorrect, rightAnswer: answerText[qName] });
  });

  // check q5 -- get all checked boxes and compare to the correct set
  const q5Checked = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(function (cb) {
    return cb.value;
  });
  // right if they picked all 3 correct ones and nothing else
  const q5IsCorrect =
    q5Correct.every(function (v) { return q5Checked.includes(v); }) &&
    q5Checked.every(function (v) { return q5Correct.includes(v); });
  if (q5IsCorrect) score++;
  feedback.push({ label: questionLabels.q5, correct: q5IsCorrect, rightAnswer: answerText.q5 });

  // figure out if they passed -- 70% or above
  const percent = Math.round((score / total) * 100);
  const passed = percent >= 70;

  // build the summary section at the top
  summaryDiv.innerHTML =
    '<div class="result-score ' + (passed ? 'result-pass' : 'result-fail') + '">' +
      '<span class="result-verdict">' + (passed ? 'PASS' : 'FAIL') + '</span>' +
      '<span class="result-num">You scored ' + score + ' out of ' + total + ' (' + percent + '%)</span>' +
      (passed
        ? '<span class="result-msg">Nice work! You passed.</span>'
        : '<span class="result-msg">You need 70% to pass. Review the material and try again!</span>') +
    '</div>';

  // build per-question feedback cards
  let breakdownHTML = '<h3 class="breakdown-heading">Question Breakdown</h3>';
  feedback.forEach(function (item) {
    breakdownHTML +=
      '<div class="feedback-item ' + (item.correct ? 'feedback-correct' : 'feedback-wrong') + '">' +
        '<span class="feedback-icon">' + (item.correct ? '&#10003;' : '&#10007;') + '</span>' +
        '<div class="feedback-text">' +
          '<strong>' + item.label + '</strong>' +
          (!item.correct ? '<span class="correct-answer">Correct answer: ' + item.rightAnswer + '</span>' : '') +
        '</div>' +
      '</div>';
  });
  breakdownDiv.innerHTML = breakdownHTML;

  // hide the quiz and show results when they submit
  form.style.display = 'none';
  resultsDiv.style.display = 'block';

  // scroll up so they see their score
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// retake button -- reset everything and show the form again
retakeBtn.addEventListener('click', function () {
  form.reset();
  resultsDiv.style.display = 'none';
  form.style.display = 'block';
  // scroll back to the top of the quiz
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
