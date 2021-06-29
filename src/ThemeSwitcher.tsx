/* eslint react/static-property-placement: 1 */
import React, { Component } from 'react';
import axios from 'axios';
import BootswatchThemes from './themes';
// import '../assets/loader.css';

const setItem = (key: string, obj: any): void => {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    // TODO: something...
  }
};

const getItem = (key: string): any => {
  if (!key) return null;
  try {
    const item = localStorage.getItem(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return item ? JSON.parse(item) : null;
  } catch (err) {
    return null;
  }
};

//------------------------------------------------------------------------------
// ThemeChooser Interfaces
//------------------------------------------------------------------------------
interface ThemeSwitcherProps {
  defaultTheme: string;
  storeThemeKey: string;
  themes?: { [theme: string]: string };
  themeOptions?: Array<string>
}

interface ThemeSwitcherState {
  loadedThemes: { [theme: string]: string };
  theme: string;
  themeOptions: Set<string>;
}

export interface ThemeContext {
  defaultTheme: string;
  // eslint-disable-next-line no-use-before-define
  themeSwitcher?: ThemeSwitcher;
  themes: Array<string>;
  currentTheme: string;
}

export const ThemeSwitcherContext = React.createContext<ThemeContext>({
  defaultTheme: 'lumen',
  themeSwitcher: undefined,
  themes: [],
  currentTheme: ''
});

//------------------------------------------------------------------------------
// Top level ThemeSwitcher Component
//------------------------------------------------------------------------------
const DefaultProps: ThemeSwitcherProps = {
  defaultTheme: 'lumen',
  storeThemeKey: '',
  themes: {},
  themeOptions: Object.keys(BootswatchThemes)
};

class ThemeSwitcher extends Component<ThemeSwitcherProps, ThemeSwitcherState> {
  static defaultProps = DefaultProps;

  constructor(props: ThemeSwitcherProps) {
    super(props);
    this.getTheme = this.getTheme.bind(this);
    this.load = this.load.bind(this);
    this.setTheme = this.setTheme.bind(this);

    const {
      defaultTheme, storeThemeKey, themes, themeOptions
    } = this.props;

    const validThemeOptions = new Set((themeOptions || []).filter(t => BootswatchThemes.includes(t)));
    const loadedThemes = themes || {};

    const defTheme = getItem(storeThemeKey) as string || defaultTheme;
    validThemeOptions.add(defTheme);
    Object.keys(loadedThemes).forEach(theme => {
      validThemeOptions.add(theme);
    });

    this.state = {
      loadedThemes,
      theme: defTheme,
      themeOptions: validThemeOptions
    };
  }

  componentDidMount() {
    const { theme } = this.state;
    this.load(theme);
  }

  setTheme() {
    const { theme } = this.state;
    const themeStyle = this.getTheme(theme);
    const themeStyles: HTMLStyleElement = document.querySelector('style#themeStyles') || document.createElement('style');
    if (themeStyles.id !== 'themeStyles') {
      themeStyles.id = 'themeStyles';
      themeStyles.type = 'text/css';
    }
    document.head.append(themeStyles);
    themeStyles.innerHTML = themeStyle;
  }

  // pass reference to this down to ThemeChooser component
  getContext(): ThemeContext {
    const { defaultTheme } = this.props;
    const { theme, themeOptions } = this.state;
    return {
      defaultTheme,
      themeSwitcher: this,
      themes: Array.from(themeOptions),
      currentTheme: theme
    };
  }

  getTheme(theme: string): string {
    const { loadedThemes } = this.state;
    if (Object.keys(loadedThemes).includes(theme)) {
      return loadedThemes[theme];
    }
    this.loadTheme(theme);
    return '';
  }

  load(theme: string) {
    const themeStyles = this.getTheme(theme);
    if (themeStyles) {
      const { storeThemeKey } = this.props;
      setItem(storeThemeKey, theme);
      this.setState({
        theme
      }, () => this.setTheme());
    } else {
      this.loadTheme(theme);
    }
  }

  loadTheme(theme: string) {
    axios({
      method: 'GET',
      url: `assets/themes/${theme}.css`,
      timeout: 5000    // 5 seconds timeout
    }).then(styles => {
      this.setState(prevState => ({
        loadedThemes: {
          ...prevState.loadedThemes,
          [theme]: styles.data
        }
      }), () => this.load(theme));
      return styles;
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    const { theme } = this.state;
    if (theme.length === 0) {
      return (
        <div
          style={{
            display: 'table',
            position: 'fixed',
            top: 0,
            height: '100%',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'table-cell',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            <div className="loader" />
            <p className='pt-0 mt-0'>Loading...</p>
          </div>
        </div>
      );
    }
    const { children } = this.props;
    return (
      <ThemeSwitcherContext.Provider value={ this.getContext() }>
        { children }
      </ThemeSwitcherContext.Provider>
    );
  }
}

export default ThemeSwitcher;
