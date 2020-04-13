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

const path = require('path');
const site = require('../../_data/site');
const stripLanguage = require('../../_filters/strip-language');
const strip = require('../../_filters/strip');
const {html} = require('common-tags');

module.exports = (locale, page, collections, renderData = {}) => {
  const pageData = {
    ...collections.all.find((item) => item.fileSlug === page.fileSlug).data,
    ...renderData,
  };
  const pageUrl = stripLanguage(page.url);

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

    const title = strip(social.title || social.path.title);
    const description = social.description || social.path.description;
    let thumbnail = social.thumbnail || social.hero;
    const alt = social.alt || site.name;

    // If the page doesn't have social media images, a hero, or a thumbnail,
    // fallback to using the site's default thumbnail.
    // Return a full path to the image using our image CDN.
    if (!thumbnail) {
      thumbnail = new URL(site.thumbnail, site.imageCdn);
    } else {
      thumbnail = new URL(path.join(pageUrl, thumbnail), site.imageCdn);
    }
    thumbnail.searchParams.set('auto', 'format');
    thumbnail.searchParams.set('fit', 'max');
    thumbnail.searchParams.set('w', 1200);
    thumbnail = thumbnail.toString();

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
    tags = tags.filter((tag) => tag !== 'pathItem' && tag !== 'post');

    // prettier-ignore
    return html`
      <meta property="og:locale" content="${locale}" />
      <meta property="og:type" content="${type}" />
      <meta property="og:url" content="${new URL(pageUrl, site.url).href}" />
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
    return html`
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${meta.title}" />
      <meta name="twitter:description" content="${meta.description}" />
      <meta name="twitter:image" content="${meta.thumbnail}" />
    `;
  }

  function renderCanonicalMeta() {
    return html`
      <link
        rel="canonical"
        href="${pageData.canonical ? pageData.canonical : site.url + pageUrl}"
      />
    `;
  }

  // prettier-ignore
  return html`
    <title>${strip(pageData.title || pageData.path.title || site.title)}</title>
    <meta name="description" content="${pageData.description || pageData.path.description}" />

    ${renderCanonicalMeta()}
    ${renderGoogleMeta()}
    ${renderFacebookMeta()}
    ${renderTwitterMeta()}
  `;
};
