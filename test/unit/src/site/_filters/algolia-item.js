const {expect} = require('chai');
const path = require('path');
const {
  defaultLocale,
  imgixDomain,
} = require('../../../../../src/site/_data/site');
const algoliaItem = require('../../../../../src/site/_filters/algolia-item');
const {memoize} = require('../../../../../src/site/_filters/find-by-url');

const createPost = () =>
  /** @type {EleventyCollectionItem} */ ({
    data: {
      lang: defaultLocale,
      title: 'Hello world',
      page: {
        filePathStem: '',
      },
    },
    templateContent: 'Hello world',
    url: '/hello-world/',
  });

/**
 * Adds parent to memorized posts for following tests, this is required as get-post-parent-url
 * is called by algoliaItem(post)
 */
const initParent = () => {
  const mockParent = createPost();
  mockParent.data.title = 'Parent Title';
  mockParent.url = '/parent/';
  memoize([mockParent]);
};

describe('algoliaItem', function () {
  initParent();

  it('returns object with all required fields', function () {
    const post = createPost();
    const mockItem = algoliaItem(post);

    expect(mockItem)
      .to.be.an('object')
      .to.include.all.keys(
        'locale',
        'objectID',
        'priority',
        'tags',
        'title',
        'url',
      );

    expect(mockItem.locale).to.be.a('string');
    expect(mockItem.objectID).to.be.a('string');
    expect(mockItem.priority).to.be.a('number');
    expect(mockItem.tags).to.be.an.instanceof(Array);
    expect(mockItem.title).to.be.a('string');
    expect(mockItem.url).to.be.a('string');
  });

  it('returns object with optional fields if in post object', function () {
    const post = createPost();
    post.data.date = new Date();
    post.data.description = 'Hello world';
    post.data.updated = new Date();
    const mockItem = algoliaItem(post);

    expect(mockItem)
      .to.be.an('object')
      .to.include.all.keys('createdOn', 'description', 'updatedOn');

    expect(mockItem.createdOn).to.be.an.instanceof(Date);
    expect(mockItem.description).to.be.a('string');
    expect(mockItem.updatedOn).to.be.an.instanceof(Date);
  });

  it('prefers `renderData` when provided', function () {
    const renderData = {
      title: 'Not hello world',
      description: 'Not hello world',
    };
    const post = createPost();
    post.data.description = 'Hello world';
    post.data.renderData = renderData;
    const mockItem = algoliaItem(post);

    expect(mockItem.description).to.be.equal(renderData.description);
    expect(mockItem.title).to.be.equal(renderData.title);
  });

  it('strips HTML from `templateContent`', function () {
    const post = createPost();
    const content = post.templateContent;
    post.templateContent = `<h1>${content}</h1>`;
    const mockItem = algoliaItem(post);

    expect(mockItem.content).to.be.equal(content);
  });

  it('sets `locale` to default locale if no `data.lang`', function () {
    const post = createPost();
    delete post.data.lang;
    const mockItem = algoliaItem(post);

    expect(mockItem.locale).to.be.equal(defaultLocale);
  });

  it('sets `priority` to `1` if no `data.algolia_priority`', function () {
    const post = createPost();
    const mockItem = algoliaItem(post);

    expect(mockItem.priority).to.be.equal(1);
  });

  it('keeps `priority` set in `data.algolia_priority`', function () {
    const post = createPost();
    const priority = 2;
    post.data.algolia_priority = priority;
    const mockItem = algoliaItem(post);

    expect(mockItem.priority).to.be.equal(priority);
  });

  it('keeps `tags` set in `data.tags`', function () {
    const post = createPost();
    const tags = ['angular', 'react', 'vue'];
    post.data.tags = tags;
    const mockItem = algoliaItem(post);

    expect(mockItem.tags).to.be.eql(tags);
  });

  it('gets default url when an i18n url', function () {
    const post = createPost();
    const url = post.url;
    post.url = path.join('/i18n', defaultLocale, url);
    const mockItem = algoliaItem(post);

    expect(mockItem.url).to.be.equal(url);
  });

  it('gets default url when not an i18n url', function () {
    const post = createPost();
    const mockItem = algoliaItem(post);

    expect(mockItem.url).to.be.equal(post.url);
  });

  it('generates imgix url if there is `data.hero`', function () {
    const post = createPost();
    const hero = 'image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg';
    post.data.hero = hero;
    const mockItem = algoliaItem(post);

    expect(mockItem.image).to.have.string(imgixDomain);
    expect(mockItem.image).to.have.string(hero);
  });
});
