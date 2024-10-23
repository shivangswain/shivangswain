/**
 * Sets up the theme toggle functionality
 */
export function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement;
  const themeIcon = themeToggle.querySelector('i') as HTMLElement;
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Function to toggle dark mode
  const toggleDarkMode = (isDark: boolean): void => {
    document.body.classList.toggle('dark-mode', isDark);
    themeIcon.textContent = isDark ? 'dark_mode' : 'light_mode';
    themeIcon.className = isDark ? 'material-symbols-rounded dark' : 'material-symbols-rounded light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // Check for saved user preference, if any, on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    toggleDarkMode(true);
  }

  // Listen for clicks on the toggle button
  themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleDarkMode(!isDarkMode);
  });

  // Listen for changes in the OS-level color scheme preference
  prefersDarkScheme.addEventListener('change', (e) => {
    toggleDarkMode(e.matches);
  });
}

// Initialize theme toggle functionality
setupThemeToggle();