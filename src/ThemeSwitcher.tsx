/* eslint react/static-property-placement: 1 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './interfaces';
import BootswatchThemes, { ThemeName } from './themes';
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
  themeOptions?: Array<string>;
  children: null|HTMLElement
}

interface ThemeSwitcherState {
  currentTheme: string;
  customThemes: { [theme: string]: string };
  theme: string;
  themeOptions: Set<string>;
}

const ThemeSwitcherContext = React.createContext<ThemeContext>({
  defaultTheme: 'lumen',
  themeSwitcher: undefined,
  themes: [],
  currentTheme: ''
});

//------------------------------------------------------------------------------
// Top level ThemeSwitcher Component
//------------------------------------------------------------------------------
class ThemeSwitcher extends Component<ThemeSwitcherProps, ThemeSwitcherState> {
  static childContextTypes: Record<string, any>;
  static contextType = ThemeSwitcherContext;
  static defaultProps: ThemeSwitcherProps;
  context!: React.ContextType<typeof ThemeSwitcherContext>;

  constructor(props: ThemeSwitcherProps, context: ThemeContext) {
    super(props, context);
    this.getTheme = this.getTheme.bind(this);
    this.load = this.load.bind(this);
    this.setTheme = this.setTheme.bind(this);

    const {
      defaultTheme, storeThemeKey, themes, themeOptions
    } = this.props;

    const BootswatchNames = Object.keys(BootswatchThemes);
    const validThemeOptions = new Set((themeOptions || []).filter(t => BootswatchNames.includes(t)));
    const customThemes = themes || {};

    const defTheme = getItem(storeThemeKey) as string || defaultTheme;
    validThemeOptions.add(defTheme);
    Object.keys(customThemes).forEach(theme => {
      validThemeOptions.add(theme);
    });

    this.state = {
      currentTheme: defTheme,
      customThemes,
      theme: '',
      themeOptions: validThemeOptions
    };
  }

  // pass reference to this down to ThemeChooser component
  getChildContext(): ThemeContext {
    const { defaultTheme } = this.props;
    const { currentTheme, themeOptions } = this.state;

    return {
      defaultTheme,
      themeSwitcher: this,
      themes: [ ...themeOptions ],
      currentTheme
    };
  }

  componentDidMount() {
    const { currentTheme } = this.state;
    this.load(currentTheme);
  }

  setTheme() {
    const { theme } = this.state;
    const themeStyles: HTMLStyleElement = document.querySelector('style#themeStyles') || document.createElement('style');
    if (themeStyles.id !== 'themeStyles') {
      themeStyles.id = 'themeStyles';
      themeStyles.type = 'text/css';
    }
    document.head.append(themeStyles);
    themeStyles.innerHTML = theme;
  }

  getTheme(theme: string): string {
    const { customThemes, themeOptions } = this.state;
    if (Object.keys(customThemes).includes(theme)) {
      return customThemes[theme];
    } else if (themeOptions.has(theme)) {
      return BootswatchThemes[theme as ThemeName];
    }
    return '';
  }

  load(theme: string) {
    const themeStyles = this.getTheme(theme);
    if (themeStyles) {
      const { storeThemeKey } = this.props;
      setItem(storeThemeKey, theme);
      this.setState({
        currentTheme: theme,
        theme: themeStyles
      }, () => this.setTheme());
    }
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
    return children || <span />;
  }
}

// Static Properties
ThemeSwitcher.childContextTypes = {
  defaultTheme: PropTypes.string.isRequired,
  themeSwitcher: PropTypes.instanceOf(ThemeSwitcher).isRequired,
  themes: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTheme: PropTypes.string.isRequired
};

ThemeSwitcher.defaultProps = {
  defaultTheme: 'lumen',
  storeThemeKey: 'theme',
  themes: {},
  themeOptions: Object.keys(BootswatchThemes),
  children: null
};

export default ThemeSwitcher;