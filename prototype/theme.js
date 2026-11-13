const root = document.documentElement;
const button = document.querySelector('#theme-toggle');
const browserColour = document.querySelector('meta[name="theme-color"]');

export function refreshThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  const french = root.lang === 'fr';
  const label = french
    ? (dark ? 'Passer au thème clair' : 'Passer au thème sombre')
    : (dark ? 'Switch to light theme' : 'Switch to dark theme');
  button.setAttribute('aria-label', label);
  button.title = label;
  button.setAttribute('aria-pressed', String(dark));
}
function applyTheme(theme) {
  root.dataset.theme = theme;
  browserColour.content = theme === 'dark' ? '#0b1220' : '#fcfdff';
  refreshThemeLabel();
}
button.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('portfolio-theme', theme); }
  catch { /* The switch still works when browser storage is unavailable. */ }
});
applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
