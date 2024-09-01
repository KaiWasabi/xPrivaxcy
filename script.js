const elts = {
  text1: document.getElementById("text1"),
};

const initialText = "Privacy...";
const sentences = [
  "is a fundamental human right.",
  "is a cornerstone of democracy.",
  "and free speech go hand in hand.",
  "is essential for impartial justice.",
  "is our human right."
];

const typeSpeed = 55;
const dotDeleteSpeed = 800;
const sentenceDeleteSpeed = 30;
const pauseTime = 1500;
const initialPauseTime = 3000;

let cursorBlinkInterval;

function startCursorBlink() {
  cursorBlinkInterval = setInterval(() => {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }
  }, 500);
}

function stopCursorBlink() {
  clearInterval(cursorBlinkInterval);
  const cursor = document.getElementById('cursor');
  if (cursor) {
    cursor.style.opacity = '1'; // Ensure cursor is visible
  }
}

function typeText(text, prefix = "", callback) {
  stopCursorBlink();
  let i = 0;
  function typing() {
    if (i < text.length) {
      elts.text1.innerHTML = prefix + text.substring(0, i + 1) + "<span id='cursor'>|</span>";
      i++;
      setTimeout(typing, typeSpeed);
    } else {
      startCursorBlink();
      callback();
    }
  }
  typing();
}

function deleteText(text, prefix = "", callback) {
  stopCursorBlink();
  let i = text.length;
  function deleting() {
    if (i >= 0) {
      elts.text1.innerHTML = prefix + text.substring(0, i) + "<span id='cursor'>|</span>";
      i--;
      setTimeout(deleting, sentenceDeleteSpeed);
    } else {
      startCursorBlink();
      callback();
    }
  }
  deleting();
}

function deleteDots(callback) {
  let i = initialText.length;
  function deleteDotsAnimation() {
    stopCursorBlink();
    if (i > 7) {
      elts.text1.innerHTML = initialText.substring(0, i - 1) + "<span id='cursor'>|</span>";
      i--;
      setTimeout(deleteDotsAnimation, dotDeleteSpeed);
    } else {
      elts.text1.innerHTML = "Privacy<span id='cursor'>|</span>";
      startCursorBlink();
      callback();
    }
  }
  deleteDotsAnimation();
}

function startSentenceSequence() {
  let sentenceIndex = 0;
  function typeSentence() {
    stopCursorBlink();
    let i = 0;
    const sentence = sentences[sentenceIndex];
    function typingSentence() {
      if (i < sentence.length) {
        elts.text1.innerHTML = "Privacy " + sentence.substring(0, i + 1) + "<span id='cursor'>|</span>";
        i++;
        setTimeout(typingSentence, typeSpeed);
      } else {
        startCursorBlink();
        if (sentenceIndex < sentences.length - 1) {
          setTimeout(() => {
            deleteText(sentence, "Privacy ", () => {
              sentenceIndex++;
              typeSentence();
            });
          }, pauseTime);
        } else {
          applyFinalSentenceWithEmphasis();
        }
      }
    }
    typingSentence();
  }
  typeSentence();
}

function applyFinalSentenceWithEmphasis() {
  stopCursorBlink();
  const sentence = sentences[sentences.length - 1];
  const finalTextBeforeEmphasis = sentence.replace("is", "is");
  elts.text1.innerHTML = "Privacy " + finalTextBeforeEmphasis + "<span id='cursor'>|</span>";

  setTimeout(() => {
    const emphasizedText = sentence.replace(
      "is",
      "<span class='emphasized smooth-emphasis'>is</span>"
    );
    elts.text1.innerHTML = "Privacy " + emphasizedText + "<span id='cursor'>|</span>";
    startCursorBlink();
  }, pauseTime);
}

function startInitialSequence() {
  elts.text1.innerHTML = "";
  typeText(initialText, "", () => {
    setTimeout(() => {
      deleteDots(() => {
        startSentenceSequence();
      });
    }, initialPauseTime);
  });
}

startInitialSequence();
