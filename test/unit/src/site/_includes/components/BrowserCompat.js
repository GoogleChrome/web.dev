/**
 * @license
 * Copyright 2022 Google Inc. All rights reserved.
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
const BrowserCompat = require('../../../../../../src/site/_includes/components/BrowserCompat');

const browserCompat = BrowserCompat.bind({page: {filePathStem: '/en/blog'}});

describe('BrowserCompat', function () {
  it('Shows supported broswers with a valid feature', async function () {
    const html = browserCompat('api.console');
    const $ = cheerio.load(html);
    const compatElement = $('div');

    expect(compatElement.attr('class')).to.equal('browser-compat');
    expect(
      compatElement.children('span.browser-compat__label').length,
    ).to.equal(1);
    expect($('span.browser-compat__icon').length).to.equal(4);
    expect($('span.browser-compat__version').length).to.equal(4);
    expect(compatElement.children('span.browser-compat__link').length).to.equal(
      1,
    );

    compatElement.children('span.browser-compat__version').each((_, span) => {
      expect(span.attribs['data-compat']).to.equal('');
    });
  });

  it('Shows no broswers supported with a deprecated feature', async function () {
    const html = browserCompat('html.elements.blink');
    const $ = cheerio.load(html);
    const compatElement = $('div');

    expect(compatElement.attr('class')).to.equal('browser-compat');
    expect(
      compatElement.children('span.browser-compat__label').length,
    ).to.equal(1);
    expect($('span.browser-compat__icon').length).to.equal(4);
    expect($('span.browser-compat__version').length).to.equal(4);
    expect(compatElement.children('span.browser-compat__link').length).to.equal(
      1,
    );

    compatElement.children('span.browser-compat__version').each((_, span) => {
      expect(span.attribs['data-compat']).to.equal(undefined);
    });
  });
});
