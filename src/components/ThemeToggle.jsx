import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, effectiveTheme } = useTheme();

  const getThemeIcon = (currentTheme) => {
    switch (currentTheme) {
    case 'light':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'dark':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      );
    case 'system':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    default:
      return null;
    }
  };

  const getThemeLabel = (currentTheme) => {
    switch (currentTheme) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    case 'system':
      return 'Auto';
    default:
      return '';
    }
  };

  const getThemeTooltip = (currentTheme) => {
    switch (currentTheme) {
    case 'light':
      return 'Switch to dark mode';
    case 'dark':
      return 'Switch to system mode';
    case 'system':
      return `Switch to light mode (currently ${effectiveTheme})`;
    default:
      return '';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
      title={getThemeTooltip(theme)}
      aria-label={`Current theme: ${getThemeLabel(theme)}. ${getThemeTooltip(theme)}`}
    >
      {getThemeIcon(theme)}
      <span className="text-sm font-medium hidden sm:inline">{getThemeLabel(theme)}</span>
    </button>
  );
};

export default ThemeToggle;
