const {expect} = require('chai');
const path = require('path');
const {
  defaultLocale,
  imgixDomain,
} = require('../../../../../src/site/_data/site');
const algoliaItem = require('../../../../../src/site/_filters/algolia-item');

const createPost = () =>
  /** @type {EleventyCollectionItem} */ ({
    data: {
      lang: defaultLocale,
      title: 'Hello world',
    },
    templateContent: 'Hello world',
    url: '/hello-world/',
  });

describe('algoliaItem', function () {
  it('returns object with all required fields', function () {
    const post = createPost();
    const dummyItem = algoliaItem(post);

    expect(dummyItem)
      .to.be.an('object')
      .to.include.all.keys(
        'locale',
        'objectID',
        'priority',
        'tags',
        'title',
        'url',
      );

    expect(dummyItem.locale).to.be.a('string');
    expect(dummyItem.objectID).to.be.a('string');
    expect(dummyItem.priority).to.be.a('number');
    expect(dummyItem.tags).to.be.an.instanceof(Array);
    expect(dummyItem.title).to.be.a('string');
    expect(dummyItem.url).to.be.a('string');
  });

  it('returns object with optional fields if in post object', function () {
    const post = createPost();
    post.data.date = new Date();
    post.data.description = 'Hello world';
    post.data.updated = new Date();
    const dummyItem = algoliaItem(post);

    expect(dummyItem)
      .to.be.an('object')
      .to.include.all.keys('createdOn', 'description', 'updatedOn');

    expect(dummyItem.createdOn).to.be.an.instanceof(Date);
    expect(dummyItem.description).to.be.a('string');
    expect(dummyItem.updatedOn).to.be.an.instanceof(Date);
  });

  it('prefers `renderData` when provided', function () {
    const renderData = {
      title: 'Not hello world',
      description: 'Not hello world',
    };
    const post = createPost();
    post.data.description = 'Hello world';
    post.data.renderData = renderData;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.description).to.be.equal(renderData.description);
    expect(dummyItem.title).to.be.equal(renderData.title);
  });

  it('strips HTML from `templateContent`', function () {
    const post = createPost();
    const content = post.templateContent;
    post.templateContent = `<h1>${content}</h1>`;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.content).to.be.equal(content);
  });

  it('sets `locale` to default locale if no `data.lang`', function () {
    const post = createPost();
    delete post.data.lang;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.locale).to.be.equal(defaultLocale);
  });

  it('sets `priority` to `1` if no `data.algolia_priority`', function () {
    const post = createPost();
    const dummyItem = algoliaItem(post);

    expect(dummyItem.priority).to.be.equal(1);
  });

  it('keeps `priority` set in `data.algolia_priority`', function () {
    const post = createPost();
    const priority = 2;
    post.data.algolia_priority = priority;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.priority).to.be.equal(priority);
  });

  it('keeps `tags` set in `data.tags`', function () {
    const post = createPost();
    const tags = ['angular', 'react', 'vue'];
    post.data.tags = tags;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.tags).to.be.eql(tags);
  });

  it('gets default url when an i18n url', function () {
    const post = createPost();
    const url = post.url;
    post.url = path.join('/i18n', defaultLocale, url);
    const dummyItem = algoliaItem(post);

    expect(dummyItem.url).to.be.equal(url);
  });

  it('gets default url when not an i18n url', function () {
    const post = createPost();
    const dummyItem = algoliaItem(post);

    expect(dummyItem.url).to.be.equal(post.url);
  });

  it('generates imgix url if there is `data.hero`', function () {
    const post = createPost();
    const hero = 'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg';
    post.data.hero = hero;
    const dummyItem = algoliaItem(post);

    expect(dummyItem.image).to.have.string(imgixDomain);
    expect(dummyItem.image).to.have.string(hero);
  });
});
