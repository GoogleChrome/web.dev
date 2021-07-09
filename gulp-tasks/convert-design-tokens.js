const fs = require('fs');
const slugify = require('slugify');
const prettier = require('prettier');
const tokens = require('../src/site/_data/design/tokens.json');

/*
  Converts the design tokens into Sass variables so Gorko can use
  them as the core of the CSS system.
*/
const convertDesignTokens = (cb) => {
  let result = '';
  const rootSize = 16;
  const nameSlug = (text) => slugify(text, {lower: true});

  // Generates a CSS clamp size with min and max values passed
  const clampGenerator = (min, max) => {
    if (min === max) {
      return `${min / 16}rem`;
    }

    const minSize = min / rootSize;
    const maxSize = max / rootSize;
    const minViewport = 20; // rems
    const maxViewport = 90; // rems

    // Slope and intersection allow us to have a fluid value but also keep that sensible
    const slope = (maxSize - minSize) / (maxViewport - minViewport);
    const intersection = -1 * minViewport * slope + minSize;

    return `clamp(${minSize}rem, ${intersection.toFixed(2)}rem + ${
      slope.toFixed(2) * 100
    }vw, ${maxSize}rem)`;
  };

  // Removes trailing commas and closes Sass map group
  const cleanResult = () => {
    result = result.replace(/,\s*$/, '');
    result += ');';
  };

  // Add a note that this is auto generated
  result += `
    /// Sass VARIABLES GENERATED WITH DESIGN TOKENS ON ${new Date().toLocaleDateString()}.
    /// Tokens location: ../src/site/_data/design/tokens.json
  `;

  // Start with colors
  result += `

    ///  COLORS
  `;
  result += '$gorko-colors: (';

  tokens.colors.forEach((group) => {
    group.items.forEach((color) => {
      result += `'${nameSlug(group.group + '-' + color.name)}': ${color.hex},`;
    });
  });

  cleanResult();

  // Move on to text sizes
  result += `

    ///  TEXT SIZES
  `;
  result += '$gorko-size-scale: (';

  tokens.textSizes.forEach((size) => {
    result += `'${nameSlug(size.name)}': ${clampGenerator(
      size.min,
      size.max,
    )},`;
  });

  cleanResult();

  // Move on to spacing
  result += `
  
    ///  SPACING SIZES
  `;
  result += '$gorko-space-scale: (';

  tokens.spacing.forEach((size) => {
    result += `'${nameSlug(size.name)}': ${clampGenerator(
      size.min,
      size.max,
    )},`;
  });

  cleanResult();

  // Move on to fonts
  result += `
  
    ///  FONTS 
  `;
  result += '$gorko-fonts: (';

  tokens.fonts.forEach((font) => {
    result += `'${nameSlug(font.name)}': '${font.values.join(',')}',`;
  });

  cleanResult();

  // Lastly, misc values like radius and transitions
  result += `
  
    ///  MISC 
  `;
  tokens.radius.forEach((item) => {
    result += `$global-radius-${nameSlug(item.name)}: ${item.value};`;
  });

  tokens.transitions.forEach((item) => {
    result += `$global-transition-${nameSlug(item.name)}: ${item.value};`;
  });

  // Make the Sass readable to help people with auto-complete in their editors
  result = prettier.format(result, {parser: 'scss'});

  // Push this file into the Sass dir, ready to go
  fs.writeFileSync('./src/scss/_tokens.scss', result);
  cb();
};

module.exports = convertDesignTokens;
