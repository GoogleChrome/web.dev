/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {html} = require('common-tags');
const {generateImgixSrc} = require('./Img');
const site = require('../../_data/site');
const strip = require('../../_filters/strip');
const {getTranslatedUrls} = require('../../_filters/urls');
const {findByUrl} = require('../../_filters/find-by-url');

const i18nRegex = /i18n\/\w+\//;

module.exports = (locale, page, renderData = {}) => {
  const forbiddenCharacters = [{searchValue: /"/g, replaceValue: '&quot;'}];
  const pageData = {
    ...findByUrl(page.url)?.data,
    ...renderData,
    page,
  };
  const pageUrl = pageData.page.url;
  const canonical = new URL(pageUrl, site.url).href;

  /**
   * Find post meta data associated with a social media platform.
   * Post authors should be able to create a `social` object in their YAML
   * frontmatter and specify a unique title, description, and image for each
   * social media platform.
   * Supported platforms are Google (mostly for Search cards),
   * Facebook Open Graph, and Twitter.
   * @param {!string} platform The name of a social media platform.
   * @return {Object} Meta data object for the social media platform specified.
   */
  function getMetaByPlatform(platform) {
    const social =
      pageData.social && pageData.social[platform]
        ? pageData.social[platform]
        : pageData;

    const title = strip(
      social.title || (social.path && social.path.title),
      forbiddenCharacters,
    );
    const description = strip(
      social.description || (social.path && social.path.description),
      forbiddenCharacters,
    );
    let thumbnail = social.thumbnail || social.hero || site.thumbnail;
    const alt = social.alt || site.name;
    let imgixOptions = {};

    const IS_SVG_IMG = /\.svg$/i.test(thumbnail);
    if (!IS_SVG_IMG) {
      imgixOptions = {
        fit: 'max',
        w: 1200,
        fm: 'auto',
      };
    }
    thumbnail = generateImgixSrc(thumbnail, imgixOptions);

    return {title, description, thumbnail, alt};
  }

  function renderGoogleMeta() {
    const meta = getMetaByPlatform('google');
    return html`
      <meta itemprop="name" content="${meta.title}" />
      <meta itemprop="description" content="${meta.description}" />
      <meta itemprop="image" content="${meta.thumbnail}" />
    `;
  }

  function renderFacebookMeta() {
    const meta = getMetaByPlatform('facebook');
    // nb. This will mark pages like /404/ and /offline/ as "article" but that's
    // probably fine as those shouldn't show up in search results anyway.
    const type = pageUrl === '/' ? 'website' : 'article';
    // Filter out tags that we don't want to show up in Search.
    // These tags are only used internally to determine which layout a page
    // should use.
    let tags = (type === 'article' ? pageData.tags : null) || [];
    tags = tags.filter((tag) => tag !== 'post' && tag !== 'blog');

    // prettier-ignore
    return html`
      <meta property="og:locale" content="${locale}" />
      <meta property="og:type" content="${type}" />
      <meta property="og:url" content="${canonical}" />
      <meta property="og:site_name" content="${site.title}" />
      <meta property="og:title" content="${meta.title}" />
      <meta property="og:description" content="${meta.description}" />
      <meta property="og:image" content="${meta.thumbnail}" />
      <meta property="og:image:alt" content="${meta.alt}" />
      ${tags.map((tag) => html`<meta property="tag" content="${tag}" />`)}
    `;
  }

  function renderTwitterMeta() {
    const meta = getMetaByPlatform('twitter');
    /**
     * We replace the `<` and `>` characters for Twitter because HTML tags
     * get rendered as HTML and therefore do not show up on Twitter cards.
     * So in order to render the tag correctly, we replace them with pointing
     * angle quotation marks. While we considered using the HTML entities
     * `&lt;` and `&gt;`, Twitter seems to render them as `<` and `>` anyway.
     */
    const htmlCharacters = [
      {searchValue: /</g, replaceValue: '&lsaquo;'},
      {searchValue: />/g, replaceValue: '&rsaquo;'},
    ];
    const title = strip(meta.title, htmlCharacters);
    const description = strip(meta.description, htmlCharacters);

    return html`
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${meta.thumbnail}" />
    `;
  }

  function renderHreflangMeta() {
    if (!pageUrl) {
      // This can happen when a page is not intended to be included in the final
      // output, e.g. has a permalink: false.
      return;
    }
    const url = pageUrl.startsWith('/i18n/')
      ? pageUrl.replace(i18nRegex, '')
      : pageUrl;

    // Find i18n equivalents of the current url and check if they exist.
    const langhrefs = getTranslatedUrls(pageUrl).map((langhref) => {
      const href = new URL(langhref[1], site.url).href;
      return `<link rel="alternate" hreflang="${langhref[0]}" href="${href}" />`;
    });
    // If some i18n equivalents are found, add also the default language (en).
    if (langhrefs.length) {
      const enHref = new URL(url, site.url).href;
      langhrefs.push(`<link rel="alternate" hreflang="en" href="${enHref}" />`);
    }
    return langhrefs.join('\n');
  }

  function renderCanonicalMeta() {
    return html` <link rel="canonical" href="${canonical}" />`;
  }

  function renderRSS() {
    const feed = pageData.rss || '/feed.xml';
    const title = pageData.rss
      ? `${pageData.title} on web.dev`
      : 'web.dev feed';
    return html`
      <link
        rel="alternate"
        href="${feed}"
        type="application/atom+xml"
        data-title="${title}"
      />
    `;
  }

  function renderPageMeta() {
    // Ensure multiple metadata are always reported the same way.
    const sortAndDedupe = (list) => {
      return list && [...new Set(list.sort())].join();
    };

    const authors = sortAndDedupe(pageData.authors);
    const paths = sortAndDedupe(pageData.postToPaths[page.fileSlug]);
    const tags = sortAndDedupe(
      pageData.tags?.filter((t) => !['post', 'blog'].includes(t)),
    );

    return html`
      ${authors && `<meta name="authors" content="${authors}" />`}
      ${paths && `<meta name="paths" content="${paths}" />`}
      ${tags && `<meta name="tags" content="${tags}" />`}
    `;
  }

  // prettier-ignore
  return html`
    <title>${strip(pageData.title
      || (pageData.path && pageData.path.title)
      || site.title)}</title>
    <meta name="description" content="${strip(pageData.description
      || (pageData.path && pageData.path.description), forbiddenCharacters)}" />

    ${renderCanonicalMeta()}
    ${renderHreflangMeta()}
    ${renderGoogleMeta()}
    ${renderFacebookMeta()}
    ${renderTwitterMeta()}
    ${renderRSS()}
    ${renderPageMeta()}
  `;
};
