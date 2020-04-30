const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const newsletters = [
  {
    data: {
      title: 'March 2020 Newsletter',
    },
    year: '2020',
    month: '03',
    day: '30',
  },
];

const processedNewsletters = newsletters.map((newsletter) => {
  newsletter.date = new Date(
    `${newsletter.year}-${newsletter.month}-${newsletter.day}`,
  );
  newsletter.permalink = path.join(
    'newsletter',
    'archive',
    newsletter.year,
    newsletter.month,
  );
  newsletter.url = path.join('/en', newsletter.permalink);
  newsletter.html = fs.readFileSync(
    path.join(__dirname, newsletter.permalink, 'index.html'),
    'utf8',
  );

  if (!newsletter.data.subhead) {
    newsletter.data.subhead = `Read our ${newsletter.data.title} for the latest news, updates, and stories for developers!`;
  }

  if (!newsletter.data.alt) {
    newsletter.data.alt = newsletter.data.title;
  }

  if (!newsletter.data.thumbnail) {
    newsletter.data.thumbnail = `/images/newsletter.png`;

    const $ = cheerio.load(newsletter.html);
    const imgs = $('.padtopB20').find('img');

    if (imgs.length > 0) {
      newsletter.data.thumbnail = imgs[0].attribs.src;
      newsletter.data.alt = imgs[0].attribs.alt;
    }
  }

  return newsletter;
});

module.exports = processedNewsletters;
