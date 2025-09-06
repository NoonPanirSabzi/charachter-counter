const elements = {
  userText: document.getElementById("user-text"),
  excludeSpaces: document.getElementById("exclude-spaces"),
  chrLimit: document.getElementById("chr-limit"),
  chrLimitCount: document.getElementById("chr-limit-count"),
  readTime: document.getElementById("read-time"),
  totalCharacters: document.getElementById("total-characters"),
  wordCount: document.getElementById("word-count"),
  sentenceCount: document.getElementById("sentence-count"),
  hint: document.querySelector(".comp-textarea__hint"),
};

function showResult(totalCharacters, wordCount, sentenceCount, readTime) {
  elements.totalCharacters.innerText = totalCharacters;
  elements.wordCount.innerText = wordCount;
  elements.sentenceCount.innerText = sentenceCount;
  elements.readTime.innerText = `Approx. reading time: ${
    readTime === 0 ? "<1" : readTime
  } minute`;
}

function analyzeText(text) {
  const textArr = text.trim().split("");
  const excludeSpace = elements.excludeSpaces.checked;
  const spaceCount = textArr.filter((chr) => chr === " ").length;
  const totalCharacters = textArr.length - (excludeSpace ? spaceCount : 0);
  const wordCount = spaceCount;
  const sentenceCount = textArr.filter((chr) => chr === ".").length;
  const readTime = Math.floor(wordCount / 238);

  showResult(totalCharacters, wordCount, sentenceCount, readTime);
}

function checkLimit(text) {
  const hasLimit = elements.chrLimit.checked;
  const limitTreshhold = elements.chrLimitCount.valueAsNumber;
  const limitReached = text.length > limitTreshhold;

  if (hasLimit && limitReached) {
    elements.userText.value = text.slice(0, limitTreshhold);
    elements.hint.innerText = `Limit reached! Your text exceeds ${limitTreshhold} characters.`;
  }

  elements.hint.classList.toggle("hidden", !limitReached);
  elements.userText.classList.toggle("error", limitReached);
  return elements.userText.value;
}

elements.userText.addEventListener("input", () => {
  const userText = checkLimit(elements.userText.value);

  analyzeText(userText);
});

elements.excludeSpaces.addEventListener("change", () => {
  analyzeText(elements.userText.value);
});

elements.chrLimit.addEventListener("change", () => {
  elements.chrLimitCount.classList.toggle("invisible");
  if (elements.chrLimitCount.classList.contains("invisible")) {
    elements.chrLimitCount.value = null;
  }

  const userText = checkLimit(elements.userText.value);
  analyzeText(userText);
});

elements.chrLimitCount.addEventListener("change", () => {
  const userText = checkLimit(elements.userText.value);
  analyzeText(userText);
});
