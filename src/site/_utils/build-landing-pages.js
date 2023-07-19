const {findByUrl} = require('../_filters/find-by-url');
const {i18n} = require('../_filters/i18n');
const {getFile} = require('./get-file');
const {exportFile} = require('./export-file');
const {
  EXPLORE_PATHS,
  getExportDetails,
} = require('../_includes/components/Export.js');
const yaml = require('js-yaml');

async function buildLandingPages() {
  for (const topic of EXPLORE_PATHS) {
    const slug = topic.slug;
    let cover = topic.cover;
    if (cover) {
      cover = await getFile(cover);
      await exportFile(null, cover, `/explore/${slug}/cover.svg`);
    }

    const header = {
      options: ['description-50', 'hero'],
      background: 'grey',
      items: [
        {
          image: {
            path: `/explore/${slug}/cover.svg`,
          },
          heading: i18n(topic.title),
          description: i18n(topic.description),
        },
      ],
    };

    const items = [];
    for (const item of topic.topics) {
      const list = [];
      for (const pathItem of item.pathItems) {
        if (pathItem.title && pathItem.url) {
          list.push({
            heading: pathItem.title,
            path: pathItem.url,
          });
        } else {
          const page = findByUrl(`/${pathItem}/`);
          if (page) {
            const title = page?.template?.frontMatter?.data.title;
            const {exportPath, articleName} = getExportDetails(page.url);
            list.push({
              heading: title,
              path: `${exportPath}${articleName}`,
            });
          } else {
            console.warn(`Could not find page for ${pathItem}`);
            list.push({
              heading: `TODO: Devsite: Check link - ${pathItem}`,
              path: `/${pathItem}/`,
            });
          }
        }
      }

      items.push({heading: i18n(item.title), list});
    }

    let landingPage = {
      project_path: '/_project.yaml',
      book_path: '/_book.yaml',
      title: i18n(topic.title),
      landing_page: {
        rows: [
          header,
          {
            position: 'left',
            heading: 'Overview',
            description: i18n(topic.overview),
            items: items,
          },
        ],
      },
    };

    let toc = [];
    for (const item of items) {
      if (item.heading) {
        toc.push({heading: item.heading});
      }

      if (item.list) {
        for (const subItem of item.list) {
          toc.push({title: subItem.heading, path: subItem.path});
        }
      }
    }

    landingPage = yaml.dump(landingPage);
    await exportFile(null, landingPage, `/explore/${slug}/_index.yaml`);

    toc = yaml.dump({toc});
    await exportFile(null, toc, `/explore/${slug}/_toc.yaml`);
  }
}

module.exports = {buildLandingPages};
