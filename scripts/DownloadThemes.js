#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const GetGoogleFonts = require('get-google-fonts');
const download = require('download-file-sync');
const NamedRegExp = require('named-regexp-groups');
const request = require('sync-request');
const querystring = require('querystring');


const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'lib');
const CHECK_DIRS = ['assets', 'assets/fonts', 'assets/themes'];

const THEME_API = 'https://bootswatch.com/api/4.json';
const THEME_FONT_DIR = '/assets/';
const THEME_FONT_URL = 'assets/';

const FILE_URL_IMPORT = new NamedRegExp(/\s*?lib:(.*?url\(['"]?(:<url>.*?)['"]?\).*);/);
const URL_REPLACE = new NamedRegExp(/url\(['"]?(:<url>.*?)['"]?\)/);

CHECK_DIRS.forEach(d => {
  const dir = path.join(ROOT_DIR, d);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

let BootswatchThemes = request('GET', THEME_API);
BootswatchThemes = JSON.parse(BootswatchThemes.getBody('utf8'));
const themeNames = [];

BootswatchThemes.themes.forEach(theme => {
  console.log(`Downloading Theme: ${theme.name}`);
  const themeName = theme.name.toLowerCase();
  themeNames.push(themeName);
  const css = request('GET', theme.css).getBody('utf8');

  // Imported items
  const preProcessCss = css.split(/\n\r?/gm).map(line => {
    if (line.startsWith('@import url("https://fonts.googleapis.com')){
      const ext_url = new NamedRegExp(/\s*?@import url(\(['"]?(:<url>.*?)['"]?\));/).exec(line).groups.url;
      const args = querystring.parse(ext_url.split('?').pop());
      const family = args.family.split(':').reverse().pop().replace(/[|\s]/g, '_');
      new GetGoogleFonts({
        cssFile: `${theme.name}-${family}.css`,
        outputDir:  path.join(ROOT_DIR, THEME_FONT_DIR, 'fonts', family)
      }).download(ext_url)
      return `@import url('${THEME_FONT_URL}fonts/${family}/${theme.name}-${family}.css');`;
    }
    return line;
  });

  // set imports to local & download files
  const postProcessCss = preProcessCss.map(line => {
    let processedLine = line;
    if (line.match(/\s*?lib:.*?url\(["']?https?:\/\/.*/) && !line.startsWith('/*')) {
      const ext_url = FILE_URL_IMPORT.exec(line).groups.url;
      const ext_file = ext_url.split(/\//g).pop()
      const font_file = path.join(ROOT_DIR, THEME_FONT_DIR, 'fonts', ext_file);

      if (!fs.existsSync(font_file)) {
        fs.writeFileSync(font_file, download(ext_url));
        console.log(`Downloaded reference: ${opts.filename}`);
      }
      processedLine = processedLine.replace(URL_REPLACE, `url('/${THEME_FONT_URL}${ext_file}')`);
    }
    processedLine = processedLine.replace(/\\[^\\]/g, '\\\\');
    processedLine = processedLine.replace(/^\s+\*/, '*');
    processedLine = processedLine.replace(/^\s+/, '\t');
    return processedLine;
  });

  const cssFile = fs.createWriteStream(path.join(ROOT_DIR, 'assets', 'themes', `${themeName}.css`), {flags: 'w'});
  cssFile.write(postProcessCss.join('\n').replace(/\n\n/g, '\n'));
  cssFile.end();
});

// make theme index file
const themeIndexFile = fs.createWriteStream(path.join(SOURCE_DIR, 'themes.ts'), {flags: 'w'});
themeIndexFile.write(`export type ThemeName = '${themeNames.join("'|'")}';\n`);
themeIndexFile.write(`const ThemeNames = ['${themeNames.join("', '")}'];\n`);
themeIndexFile.write(`export default ThemeNames;\n`);
themeIndexFile.end();
