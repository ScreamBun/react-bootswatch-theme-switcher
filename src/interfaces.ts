import ThemeSwitcher from './ThemeSwitcher';

//------------------------------------------------------------------------------
// Theme Interfaces
//------------------------------------------------------------------------------
export interface ThemeContext {
  defaultTheme: string;
  themeSwitcher?: ThemeSwitcher;
  themes: Array<string>;
  currentTheme: string;
}