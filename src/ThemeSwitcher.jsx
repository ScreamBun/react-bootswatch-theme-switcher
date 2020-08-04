import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootswatchThemes from './themes';
import '../assets/loader.css';

const setItem = (key, obj) => {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    // TODO: something...
  }
};

const getItem = key => {
  if (!key) return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (err) {
    return null;
  }
};

//------------------------------------------------------------------------------
// Top level ThemeSwitcher Component
//------------------------------------------------------------------------------
class ThemeSwitcher extends Component {
  constructor(props, context) {
    super(props, context);
    this.getTheme = this.getTheme.bind(this);
    this.load = this.load.bind(this);
    this.setTheme = this.setTheme.bind(this);

    const {
      defaultTheme, storeThemeKey, themes, themeOptions
    } = this.props;

    const BootswatchNames = Object.keys(BootswatchThemes);
    const validThemeOptions = new Set(themeOptions.filter(t => BootswatchNames.includes(t)));
    const customThemes = themes || {};

    const defTheme = getItem(storeThemeKey) || defaultTheme;
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

  componentDidMount() {
    const { currentTheme } = this.state;
    this.load(currentTheme);
  }

  // pass reference to this down to ThemeChooser component
  getChildContext() {
    const { defaultTheme, themeOptions } = this.props;
    const { currentTheme } = this.state;

    return {
      defaultTheme,
      themeSwitcher: this,
      themes: [ ...themeOptions ],
      currentTheme
    };
  }

  setTheme() {
    const { theme } = this.state;
    let themeStyles = document.querySelector('style#themeStyles') || document.createElement("style");
    if (themeStyles.id !== 'themeStyles') {
      themeStyles.type = 'text/css';
      themeStyles.id = 'themeStyles';
    }
    document.head.append(themeStyles);
    themeStyles.innerHTML = theme;
  }

  getTheme(theme) {
    const { customThemes, themeOptions } = this.state;
    if (Object.keys(customThemes).includes(theme)) {
      return customThemes[theme];
    } else if (themeOptions.has(theme)) {
      return BootswatchThemes[theme];
    }
    return '';    
  }

  load(theme) {
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

ThemeSwitcher.childContextTypes = {
  defaultTheme: PropTypes.string,
  themeSwitcher: PropTypes.instanceOf(ThemeSwitcher),
  themes: PropTypes.array,
  currentTheme: PropTypes.string
};

ThemeSwitcher.propTypes = {
  defaultTheme: PropTypes.string,
  storeThemeKey: PropTypes.string,
  themes: PropTypes.object,
  themeOptions: PropTypes.array,
  children: PropTypes.element
};

ThemeSwitcher.defaultProps = {
  defaultTheme: 'lumen',
  storeThemeKey: null,
  themes: {},
  themeOptions: BootswatchThemes,
  children: null
};

export default ThemeSwitcher;
