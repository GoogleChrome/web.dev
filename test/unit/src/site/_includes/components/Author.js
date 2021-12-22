/**
 * @license
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {expect} = require('chai');
const cheerio = require('cheerio');
const {defaultLocale} = require('../../../../../../src/site/_data/site');
const Author = require('../../../../../../src/site/_includes/components/Author');
/** @type AuthorsData */
const authorsDataJson = require('../../../../../../src/site/_data/authorsData.json');
const authorsDataArray = Object.entries(authorsDataJson);

/**
 * @param {number} count
 * @return {[string, AuthorsItem][]}
 */
const getAuthorsData = (count) => {
  /** @type {[string, AuthorsItem][]} */
  const authors = [];
  for (let i = 0; i < count; i++) {
    const [id, authorData] = authorsDataArray[i];
    /** @type {AuthorsItem} */
    const author = {
      ...authorData,
      description: `i18n.authors.${id}.description`,
      elements: [],
      href: `/authors/${id}/`,
      key: id,
      title: `i18n.authors.${id}.title`,
      url: `/authors/${id}/`,
    };
    authors.push([id, author]);
  }
  return authors;
};

describe('Author', function () {
  it('does not throw error with correct data', async function () {
    const [id, author] = getAuthorsData(1)[0];
    expect(() => Author({id, author, locale: defaultLocale})).to.not.throw();
  });

  it('does not throw error when author is missing', async function () {
    const [id] = getAuthorsData(1)[0];
    // @ts-ignore
    expect(() => Author({id, locale: defaultLocale})).to.not.throw();
  });

  it('returns `undefined` when author is missing', async function () {
    const [id] = getAuthorsData(1)[0];
    // @ts-ignore
    const html = Author({id, locale: defaultLocale});
    expect(html).to.equal(undefined);
  });

  it('does throw error when author is missing a valid title', async function () {
    const [id, author] = getAuthorsData(1)[0];
    delete author.title;
    expect(() => Author({id, author, locale: defaultLocale})).to.throw();
  });

  it('includes link to author and name', async function () {
    const [id, author] = getAuthorsData(1)[0];
    const html = Author({id, author, locale: defaultLocale});
    const $ = cheerio.load(html);
    expect($('.author__name > a').html()).to.not.equal(null);
    expect($('a.avatar').attr('href')).to.equal(author.href);
  });

  it('does not include social media when flag not set to true', async function () {
    const [id, author] = getAuthorsData(1)[0];
    const html = Author({id, author, locale: defaultLocale});
    const $ = cheerio.load(html);
    expect($('.author__links').html()).to.equal(null);
  });

  it('includes social media when flag set to true', async function () {
    const [id, author] = getAuthorsData(1)[0];
    const html = Author({
      id,
      author,
      locale: defaultLocale,
      showSocialMedia: true,
    });
    const $ = cheerio.load(html);
    expect($('.author__links').html()).to.not.equal(null);
  });
});
