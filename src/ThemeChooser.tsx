/* eslint react/static-property-placement: 1 */
import React, { Component, CSSProperties, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonDropdown, ButtonGroup, DropdownMenu, DropdownToggle
} from 'reactstrap';
import { ThemeContext } from './interfaces';
import ThemeSwitcher from './ThemeSwitcher';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.substring(1);

//------------------------------------------------------------------------------
// ThemeChooser Interfaces
//------------------------------------------------------------------------------
interface ThemeChooserProps {
  style: { [key: string]: CSSProperties };
  size: 'sm'|'lg'|'';
  change: (theme: string) => void;
}

interface ThemeChooserState {
  listOpen: boolean;
  currentTheme: string;
  defaultTheme: string;
}

//------------------------------------------------------------------------------
// ThemeChooser Component
//------------------------------------------------------------------------------
class ThemeChooser extends Component<ThemeChooserProps, ThemeChooserState> {
  static contextTypes: Record<string, any>;
  static defaultProps: ThemeChooserProps;
  themes: Array<string>;

  constructor(props: ThemeChooserProps, context: ThemeContext) {
    super(props, context);
    this.onSelect = this.onSelect.bind(this);
    this.toggleList = this.toggleList.bind(this);

    // get themes from context and sort them for display
    const { currentTheme, defaultTheme, themes } = this.context;
    this.themes = [ ...themes ];
    this.themes.sort();

    this.state = {
      listOpen: false,
      currentTheme: currentTheme || '',
      defaultTheme
    };
  }

  onSelect(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    const { currentTarget } = e;
    if (currentTarget) {
      this.setState({
        currentTheme: currentTarget.getAttribute('data-theme') || ''
      }, () => {
        const { change } = this.props;
        const { currentTheme } = this.state;
        const { themeSwitcher } = this.context;
        if (themeSwitcher) {
          themeSwitcher.load(currentTheme);
          if (change) {
            change(currentTheme);
          }
        }
      });
    }
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  }

  render() {
    const { size, style } = this.props;
    const { currentTheme, defaultTheme, listOpen } = this.state;

    const themes = this.themes.map(theme => {
      return (
        <Button
          key={ theme }
          color="info"
          active={ theme === currentTheme }
          data-theme={ theme }
          onClick={ this.onSelect }
        >
          { `${theme === defaultTheme ? '* ' : ''}${capitalize(theme)}` }
        </Button>
      );
    });

    return (
      <ButtonDropdown isOpen={ listOpen } toggle={ this.toggleList } style={ style }>
        <DropdownToggle
          caret
          color='default'
          size={ size }
        >
          Theme
        </DropdownToggle>

        <DropdownMenu className='p-0'>
          <ButtonGroup vertical size={ size } className='w-100'>
            { themes }
          </ButtonGroup>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

// Static Properties
ThemeChooser.contextTypes = {
  defaultTheme: PropTypes.string.isRequired,
  themeSwitcher: PropTypes.instanceOf(ThemeSwitcher).isRequired,
  themes: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTheme: PropTypes.string.isRequired
};

ThemeChooser.defaultProps = {
  style: {},
  size: '',
  change: () => {}
};

export default ThemeChooser;