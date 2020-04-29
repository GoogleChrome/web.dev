const fs = require('fs');
const path = require('path');

const newsletters = [
  {
    title: 'March 2020 Newsletter',
    year: '2020',
    month: '03',
  },
];

const processedNewsletters = newsletters.map((newsletter) => {
  return {
    ...newsletter,
    permalink: path.join('newsletter', newsletter.year, newsletter.month),
    html: fs.readFileSync(
      path.join(
        __dirname,
        'newsletters',
        newsletter.year,
        `${newsletter.month}.html`,
      ),
      'utf8',
    ),
  };
});

module.exports = processedNewsletters;
