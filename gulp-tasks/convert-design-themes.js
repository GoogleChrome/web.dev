const fs = require('fs');
const prettier = require('prettier');
const themes = require('../src/site/_data/design/themes.js');

/*
  Converts the theme config into Sass variables that can be used
  by Gorko to generate both Custom Property groups and also utility
  classes that have a direct relationship to in-context design tokens
*/
const convertDesignThemes = (cb) => {
  let result = '';

  // Add a note that this is auto generated
  result += `
    /// Sass THEMES GENERATED WITH CONFIG ON ${new Date().toLocaleDateString()}.
    /// Config location: ../src/site/_data/design/themes.js
  `;

  result += `
  
    /// THEME KEYS 
    /// These are used to generate utility classes for themeable properties like color and background
  `;
  result += '$gorko-theme-keys: (';

  Object.keys(themes.colorKeys).forEach((colorKey) => {
    result += `'${themes.colorKeys[colorKey]}': var(--color-${themes.colorKeys[colorKey]}),`;
  });

  result += ');';

  result += `
  
    /// THEMES
    /// The gorko config for the actual themes starts https://github.com/andy-piccalilli/gorko#using-themes
  `;
  result += '$gorko-themes: (';

  themes.generate().forEach(({name, key, value, tokens}) => {
    result += `'${name}': (`;

    if (key) {
      result += `'${key}': '${value}',`;
    }

    result += `'tokens': (`;

    result += `'color': (`;

    Object.keys(tokens).forEach((tokenKey) => {
      result += `'${themes.colorKeys[tokenKey]}': var(--color-${tokens[tokenKey]}),`;
    });

    result += '),'; // end color

    result += '),'; // end tokens

    result += '),'; // end theme
  });

  result += ');'; // end $gorko-themes

  // Make the Sass readable to help people with auto-complete in their editors
  result = prettier.format(result, {parser: 'scss'});

  // Push this file into the Sass dir, ready to go
  fs.writeFileSync('./src/scss/_themes.scss', result);
  cb();
};

module.exports = convertDesignThemes;
