# react-bootswatch-theme-switcher

A React component for dynamically switching between [Bootswatch](https://bootswatch.com/) themes. Two lines of code and copy themes to your Web server.

<!--
Update This image
<img src="http://demo.ray3.io/theme-switcher/theme-switcher.png" />

Update Demos
[A live demo is here](http://demo.ray3.io/theme-switcher)

[Code for demo here](https://github.com/raythree/theme-switcher-demo)
-->

### Install

```
npm install https://github.com/czack425/react-bootswatch-theme-switcher.git
```
### Setup
The theme switcher works by dynamically modifying the document's style element to switch between the Bootswatch themes. There are two components:

 * A ```ThemeSwitcher``` component that wraps your top-level component. This is responsible for theme loading and hiding your app during the load.
 * A ```ThemeChooser``` component that displays a dropdown select menu allowing the user to choose a theme.

The ThemeSwitcher will make sure your app is not displayed until the selected theme is loaded, and will also hide it whenever the ThemeChooser selects a new theme. Here is an example of an app that uses the Redux Provider and React Router rendered in index.js:

```javascript
import { ThemeSwitcher } from 'react-bootswatch-theme-switcher';
const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
      <ThemeSwitcher defaultTheme="yeti">
        <Router history={history} routes={routes} />
      </ThemeSwitcher>
    </Provider>, document.getElementById('app')
);
```

To let users swich themes add the ```ThemeChooser``` to one of your pages (e.g. a Settings page). The ```ThemeChooser``` gets passed a reference to the ```ThemeSwitcher``` via the ```React Context``` mechanism, so it can trigger a re-render and not display the children components during theme unloading and reloading.

###ThemeSwitcher props
* ```defaultTheme``` - Default theme to use if user has not selected one (default ```'lumen'```)
* ```storeThemeKey``` - Name of localStorage key used to save the last theme (default ```theme```)
* ```themes``` - Array of custom themes to choose, formatted as `{THEME: "CSS AS STRING"}`  (default ```{}```)
* ```themeOptions``` -  Array of theme names that can be selected & shown in the ```ThemeChooser``` (default is all Bootswatch themes)

###ThemeChooser props
* ```style``` - Custom styles to apply to the ```ThemeChooser``` (default ```{}```)
* ```size``` - Size of the ```ThemeChooser```, one of (sm, lg) (default ```''```)
* ```change``` - Function called when the theme is changed  (default ```null```)


### Theme files (and required Bootstrap and JQuery javascript)

- For convenience the theme switcher comes bundled with the [Bootswatch](https://bootswatch.com/) themes and dependent fontfaces. These files MUST be copied to your distribution folder of your Web server.

- The theme switcher will add and remove themes by changing the style of the document. For example, all theme styles will be places in the documents style tag with the id attribute of `themeStyles`.

```
<style id="themeStyles" type="text/css">
	THEME STYLES...
</style>
```

- Here is a sample Webpack config that uses the [CopyWebpackPlugin](https://github.com/kevlened/copy-webpack-plugin) to copy the theme files provided with the distribution into your bundle:

```javascript
import CopyWebpackPlugin from "copy-webpack-plugin";

export default {
  ...
  plugins: [
    new CopyWebpackPlugin([
      { // Theme Assets
        from: "node_modules/react-bootstwatch-theme-switcher/assets/",
        to: "assets/",
        toType: "dir"
      }
    ]),
  ...  
```

### Auto reload last theme used

If you want the last theme used to be automatically loaded using a custom theme key in the future you can provide the ThemeSwitcher with the name of a localStorage key:

```javascript
<ThemeSwitcher defaultTheme="yeti" storeThemeKey="theme" />
```
This way, if no theme is currently loaded 'yeti' will be used, but if the user selects another theme it's name will be saved in localStorage under the ```theme``` key and used in the future until it is changed again.

### Theme selection
By default the ```ThemeChooser``` displays all Bootswatch themes. However, if you only want to use a subset you can specify the theme names via the ```themeOptions``` property of the ```ThemeSwitcher```, for example:

```javascript
let themes = ['default', 'cerulean', 'darkly'];

render(
    <Provider store={store}>
      <ThemeSwitcher defaultTheme='default' storeThemeKey="theme" themeOptions={themes}>
        <Router history={history} routes={routes} />
      </ThemeSwitcher>
    </Provider>, document.getElementById('app')
);
```

#### Credit
- This is an updated variation of the [react-bootstrap-theme-switcher](https://github.com/raythree/react-bootstrap-theme-switcher) by raythee
