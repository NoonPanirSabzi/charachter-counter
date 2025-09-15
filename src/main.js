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
let detailedLetterDensity = false;

function showResult(totalCharacters, wordCount, sentenceCount, readTime) {
  elements.totalCharacters.innerText =
    totalCharacters < 10 ? "0" + String(totalCharacters) : totalCharacters;
  elements.wordCount.innerText =
    wordCount < 10 ? "0" + String(wordCount) : wordCount;
  elements.sentenceCount.innerText =
    sentenceCount < 10 ? "0" + String(sentenceCount) : sentenceCount;
  elements.readTime.innerText = `Approx. reading time: ${
    readTime === 0 ? "<1" : readTime
  } minute`;
}

function showLetterDensity(sortedDensityArr, totalLetters) {
  let lDContainerHTML = ``;
  const seeMoreHTML = `
          <button type="button" class="toggle-ld-btn">
            <span>See more</span
            ><i class="fas fa-angle-down"></i>
          </button>`;
  const seeLessHTML = `
          <button type="button" class="toggle-ld-btn">
            <span>See less</span
            ><i class="fas fa-angle-up"></i>
          </button>`;

  for (let i = 0; i < sortedDensityArr.length; i++) {
    let letter = sortedDensityArr[i][0];
    let count = sortedDensityArr[i][1];
    let density = ((count / totalLetters) * 100).toFixed(2);
    lDContainerHTML += `
          <div class="letter">
            <span>${letter}</span>
            <div class="outer-bar"><div class="inside-bar" style="width: ${density}%;"></div></div>
            <span>${count} (${density}%)</span>
          </div>
    `;
    if (i === 4 && i < sortedDensityArr.length - 1 && !detailedLetterDensity) {
      lDContainerHTML += seeMoreHTML;
      break;
    }
  }

  if (sortedDensityArr.length > 5 && detailedLetterDensity) {
    lDContainerHTML += seeLessHTML;
  }
  elements.letterDensityStats.innerHTML = lDContainerHTML;
}

function evaluateLetterDensity(show, charArr) {
  elements.noChrFound.classList.toggle("hidden", show);
  elements.letterDensityStats.classList.toggle("hidden", !show);

  charArr = charArr.filter((chr) => /[A-Z]/.test(chr));

  let density = {};
  charArr.forEach((chr) => {
    density[chr] = Object.hasOwn(density, chr) ? density[chr] + 1 : 1;
  });

  const sortedDensity = Object.entries(density).sort(
    ([, v1], [, v2]) => v2 - v1
  );
  const totalLetters = sortedDensity.reduce((ac, elm) => (ac += elm[1]), 0);

  showLetterDensity(sortedDensity, totalLetters);
}

function analyzeText(textArr) {
  const excludeSpace = elements.excludeSpaces.checked;
  const spaceCount = textArr.filter((chr) => chr === " ").length;
  const totalCharacters = textArr.length - (excludeSpace ? spaceCount : 0);
  const wordCount = spaceCount;
  const sentenceCount = textArr.filter((chr) => chr === ".").length;
  const readTime = Math.floor(wordCount / 238);

  elements.noSpaceText.classList.toggle("invisible", !excludeSpace);
  showResult(totalCharacters, wordCount, sentenceCount, readTime);
}

function checkLimit(text) {
  if (elements.chrLimitCount.checkValidity() === false) {
    elements.chrLimitCount.reportValidity();
    elements.chrLimitCount.classList.add("error");
    return text;
  } else {
    elements.chrLimitCount.classList.remove("error");
  }

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

function mainHandler(analyize, limit, density) {
  const userText = limit
    ? checkLimit(elements.userText.value)
    : elements.userText.value;
  const userTextArr = userText.trim().toUpperCase().split("");
  if (analyize) {
    analyzeText(userTextArr);
  }
  if (density) {
    evaluateLetterDensity(userTextArr.length === 0 ? false : true, userTextArr);
  }
}

elements.userText.addEventListener("input", () => {
  mainHandler(true, true, true);
});

elements.excludeSpaces.addEventListener("change", () => {
  mainHandler(true, false, false);
});

elements.chrLimit.addEventListener("change", () => {
  elements.chrLimitCount.classList.toggle("invisible");
  if (elements.chrLimitCount.classList.contains("invisible")) {
    elements.chrLimitCount.value = null;
  }
  mainHandler(false, true, false);
});

elements.chrLimitCount.addEventListener("change", () => {
  mainHandler(true, true, true);
});

elements.letterDensityStats.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest(".toggle-ld-btn");

  if (toggleBtn) {
    detailedLetterDensity = !detailedLetterDensity;
    mainHandler(false, false, true);
  }
});

function updatePictures(updateTheme) {
  const pictures = document.querySelectorAll("picture");

  pictures.forEach((picture) => {
    const srcNext =
      updateTheme === "dark"
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
