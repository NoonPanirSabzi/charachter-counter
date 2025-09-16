const WPM = 238;
const MAX_PREVIEW_ITEMS = 5;
const LETTER_REGEX = /[A-Z]/;

const elements = {
  body: document.querySelector("body"),
  userText: document.getElementById("user-text"),
  excludeSpaces: document.getElementById("exclude-spaces"),
  chrLimit: document.getElementById("chr-limit"),
  chrLimitCount: document.getElementById("chr-limit-count"),
  readTime: document.getElementById("read-time"),
  totalCharacters: document.getElementById("total-characters"),
  wordCount: document.getElementById("word-count"),
  sentenceCount: document.getElementById("sentence-count"),
  hint: document.querySelector(".comp-textarea__hint"),
  noSpaceText: document.getElementById("nospace-text"),
  noChrFound: document.querySelector(".no-chr-found"),
  letterDensityStats: document.querySelector(".letter-density__stats"),
  themeToggleBtn: document.getElementById("theme-toggle"),
};
const root = document.documentElement;
let isDetailedLetterDensity = false;

/* ---------- Helpers ---------- */
function padTwo(n) {
  return n < 10 ? `0${n}` : String(n);
}

function formatReadTime(minutes) {
  return `Approx. reading time: ${minutes === 0 ? "<1" : minutes} minute`;
}

/* ---------- UI Updaters ---------- */
function showResult(totalCharacters, words, sentences, readTimeMinutes) {
  elements.totalCharacters.innerText = padTwo(totalCharacters);
  elements.wordCount.innerText = padTwo(words);
  elements.sentenceCount.innerText = padTwo(sentences);
  elements.readTime.innerText = formatReadTime(readTimeMinutes);
}

function showLetterDensity(sortedDensityArr, totalLetters) {
  let html = "";
  const seeMoreHTML = `
    <button type="button" class="toggle-ld-btn">
      <span>See more</span><i class="fas fa-angle-down"></i>
    </button>`;
  const seeLessHTML = `
    <button type="button" class="toggle-ld-btn">
      <span>See less</span><i class="fas fa-angle-up"></i>
    </button>`;

  for (let i = 0; i < sortedDensityArr.length; i++) {
    const [letter, count] = sortedDensityArr[i];
    const density = ((count / totalLetters) * 100).toFixed(2);
    html += `
      <div class="letter">
        <span>${letter}</span>
        <div class="outer-bar"><div class="inside-bar" style="width: ${density}%;"></div></div>
        <span>${count} (${density}%)</span>
      </div>
    `;
    if (
      i === MAX_PREVIEW_ITEMS - 1 &&
      i < sortedDensityArr.length - 1 &&
      !isDetailedLetterDensity
    ) {
      html += seeMoreHTML;
      break;
    }
  }

  if (sortedDensityArr.length > MAX_PREVIEW_ITEMS && isDetailedLetterDensity) {
    html += seeLessHTML;
  }

  elements.letterDensityStats.innerHTML = html;
}

/* ---------- Logic ---------- */
function evaluateLetterDensity(show, charArr) {
  elements.noChrFound.classList.toggle("hidden", show);
  elements.letterDensityStats.classList.toggle("hidden", !show);

  if (!show) return;

  const letters = charArr.filter((c) => LETTER_REGEX.test(c));
  const density = letters.reduce((acc, c) => {
    acc[c] = Object.hasOwn(acc, c) ? acc[c] + 1 : 1;
    return acc;
  }, {});

  const sortedDensity = Object.entries(density).sort(
    ([, v1], [, v2]) => v2 - v1
  );
  const totalLetters = sortedDensity.reduce((sum, [, count]) => sum + count, 0);

  showLetterDensity(sortedDensity, totalLetters);
}

function analyzeTextFromCharArray(charArr, excludeSpace) {
  const spaceCount = charArr.filter((ch) => ch === " ").length;
  const totalCharacters = charArr.length - (excludeSpace ? spaceCount : 0);
  const wordCount = charArr.length === 0 ? 0 : spaceCount + 1;
  const sentenceCount = charArr.filter((ch) => ch.match(/[.?!]/)).length;
  const readTime = Math.floor(wordCount / WPM);

  elements.noSpaceText.classList.toggle("invisible", !excludeSpace);
  showResult(totalCharacters, wordCount, sentenceCount, readTime);
}

function checkLimitAndApply(text) {
  if (elements.chrLimitCount.checkValidity() === false) {
    elements.chrLimitCount.reportValidity();
    elements.chrLimitCount.classList.add("error");
    return text;
  }
  elements.chrLimitCount.classList.remove("error");

  const hasLimit = elements.chrLimit.checked;
  const limitThreshold = elements.chrLimitCount.valueAsNumber;
  const limitReached = text.length > limitThreshold;

  if (hasLimit && limitReached) {
    elements.userText.value = text.slice(0, limitThreshold);
    elements.hint.innerText = `Limit reached! Your text exceeds ${limitThreshold} characters.`;
  }

  elements.hint.classList.toggle("hidden", !limitReached);
  elements.userText.classList.toggle("error", limitReached);
  return elements.userText.value;
}

function mainHandler(options = {}) {
  const { analyze = true, limit = true, density = true } = options;

  const raw = elements.userText.value;
  const userText = limit ? checkLimitAndApply(raw) : raw;
  const charArr = userText.trim().toUpperCase().split("");

  if (analyze)
    analyzeTextFromCharArray(charArr, elements.excludeSpaces.checked);
  if (density) evaluateLetterDensity(charArr.length !== 0, charArr);
}

/* ---------- Event Listeners ---------- */
elements.userText.addEventListener("input", () => {
  mainHandler({ analyze: true, limit: true, density: true });
});

elements.excludeSpaces.addEventListener("change", () => {
  mainHandler({ analyze: true, limit: false, density: false });
});

elements.chrLimit.addEventListener("change", () => {
  elements.chrLimitCount.classList.toggle("invisible");
  if (elements.chrLimitCount.classList.contains("invisible")) {
    elements.chrLimitCount.value = null;
  }
  mainHandler({ analyze: false, limit: true, density: false });
});

elements.chrLimitCount.addEventListener("change", () => {
  mainHandler({ analyze: true, limit: true, density: true });
});

elements.letterDensityStats.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest(".toggle-ld-btn");
  if (toggleBtn) {
    isDetailedLetterDensity = !isDetailedLetterDensity;
    mainHandler({ analyze: false, limit: false, density: true });
  }
});

/* ---------- Theme  ---------- */
function updatePictures(theme) {
  const pictures = document.querySelectorAll("picture");
  pictures.forEach((picture) => {
    const srcNext =
      theme === "dark"
        ? picture.querySelector('source[media="(prefers-color-scheme: dark)"]')
            .srcset
        : picture.querySelector("img").src;
    picture.querySelector("source[data-theme]").srcset = srcNext;
  });
}

elements.themeToggleBtn.addEventListener("click", () => {
  let currentTheme = root.getAttribute("data-theme");
  if (currentTheme === null) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  elements.body.classList.add("theme-transition");
  root.setAttribute("data-theme", nextTheme);
  updatePictures(nextTheme);
  localStorage.setItem("theme", nextTheme);
  setTimeout(() => {
    elements.body.classList.remove("theme-transition");
  }, 250);
});

// on load check Theme:
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  root.setAttribute("data-theme", storedTheme);
  updatePictures(storedTheme);
}

// if theme changes in one window, update in other windows
window.addEventListener("storage", (e) => {
  if (e.key === "theme") {
    const newTheme = e.newValue;
    root.setAttribute("data-theme", newTheme);
    updatePictures(newTheme);
    localStorage.setItem("theme", newTheme);
  }
});
