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
const AuthorsDate = require('../../../../../../src/site/_includes/components/AuthorsDate');
/** @type AuthorsData */
const authorsDataJson = require('../../../../../../src/site/_data/authorsData.json');
const authorsDataArray = Object.entries(authorsDataJson);

const date = new Date();

/**
 * @param {number} count
 * @return {Authors}
 */
const authorsCollection = (count = 10) => {
  /** @type {Authors} */
  const authors = {};
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
    authors[id] = author;
  }
  return authors;
};

describe('AuthorDate', function () {
  it('does not throw error with correct data', async function () {
    const collection = authorsCollection();
    const authors = Object.keys(collection);
    expect(() => AuthorsDate({authors, date}, collection)).to.not.throw();
  });

  it('does not throw error when no fields are passed in', async function () {
    const collection = authorsCollection();
    expect(() => AuthorsDate({}, collection)).to.not.throw();
  });

  it('renders correct amount of authors', async function () {
    const collection = authorsCollection();
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors, date}, collection);
    const $ = cheerio.load(html);
    expect($('.card__authors').children().length).to.equal(authors.length);
  });

  it('renders no images if more than 2 authors', async function () {
    const collection = authorsCollection(3);
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors, date}, collection);
    const $ = cheerio.load(html);
    expect($('img').length).to.equal(0);
  });

  it('renders 2 images if 2 authors', async function () {
    const collection = authorsCollection(2);
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors, date}, collection);
    const $ = cheerio.load(html);
    expect($('img').length).to.equal(2);
  });

  it('renders 1 image if 1 author', async function () {
    const collection = authorsCollection(1);
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors, date}, collection);
    const $ = cheerio.load(html);
    expect($('img').length).to.equal(1);
  });

  it('renders time if date provided', async function () {
    const collection = authorsCollection();
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors, date}, collection);
    const $ = cheerio.load(html);
    expect($('time').html().length).to.not.equal(0);
  });

  it('does not render time if no date provided', async function () {
    const collection = authorsCollection();
    const authors = Object.keys(collection);
    const html = AuthorsDate({authors}, collection);
    const $ = cheerio.load(html);
    expect($('time').html().length).to.equal(0);
  });
});
