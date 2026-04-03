// ══════════════════════════════════════════════════
//  INTERNATIONALISATION
//  To add a language: create lang/xx.js with LANG_XX,
//  then add it to LANGUAGES below.
// ══════════════════════════════════════════════════

const LANGUAGES = {
  en: { label: "EN", data: null } // loaded via lang/en.js → LANG_EN
};

let _currentLang = "en";
let _strings = {};

function initI18n() {
  // Register language data from global vars (set by lang/*.js files)
  if (typeof LANG_EN !== "undefined") LANGUAGES.en.data = LANG_EN;
  // Add more: if (typeof LANG_FR !== "undefined") LANGUAGES.fr.data = LANG_FR;

  // Restore saved language
  const saved = localStorage.getItem("mechafire-lang");
  if (saved && LANGUAGES[saved]) _currentLang = saved;

  _strings = LANGUAGES[_currentLang].data || {};
  buildLangSelector();
}

// Translation function -- returns the string for a key, or the key itself as fallback
function t(key) {
  return _strings[key] !== undefined ? _strings[key] : key;
}

function setLanguage(code) {
  if (!LANGUAGES[code]) return;
  _currentLang = code;
  _strings = LANGUAGES[code].data || {};
  localStorage.setItem("mechafire-lang", code);
  // Reload to re-render everything with new strings
  location.reload();
}

function buildLangSelector() {
  const codes = Object.keys(LANGUAGES);
  if (codes.length < 2) return; // no selector needed for single language
  const container = document.getElementById("lang-selector");
  if (!container) return;
  container.innerHTML = codes.map(code =>
    `<button onclick="setLanguage('${code}')" class="lang-btn${code === _currentLang ? ' active' : ''}">${LANGUAGES[code].label}</button>`
  ).join("");
}
