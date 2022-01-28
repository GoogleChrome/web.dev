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
require('../../../../../../src/lib/components/CoursesFilter/index');

const courseTags = [
  'bentley',
  'bert',
  'ernie',
  'toast',
  'deebo',
  'ziggy',
  'timo',
  'ewok',
  'anabelle',
  'shelly',
  'elroy',
  'toto',
  'rascal',
];

const setup = async () => {
  const filter =
    /** @type {import('../../../../../../src/lib/components/CoursesFilter/index').CoursesFilter} */ (
      document.createElement('web-courses-filter')
    );
  const filterFilters = courseTags.map((i) => ({id: i, title: i}));
  filter.setAttribute('filters', JSON.stringify(filterFilters));

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel__track');
  for (const collectionId of courseTags) {
    const carouselItem = document.createElement('div');
    carouselItem.setAttribute('data-tag', collectionId);
    carouselTrack.appendChild(carouselItem);
  }

  document.body.append(filter);
  // @ts-ignore
  await filter.updateComplete;
  document.body.append(carouselTrack);

  return {filter, carouselTrack};
};

describe('CoursesFilter', function () {
  before(async function () {
    await customElements.whenDefined('web-courses-filter');
    document.body.innerHTML = '';
  });

  it('clicking all should still show all elements', async function () {
    const {filter, carouselTrack} = await setup();
    try {
      let notHidden = 0;

      // @ts-ignore
      filter.selectOnChange({target: {value: courseTags[3]}});
      for (const child of carouselTrack.children) {
        notHidden += +!child.classList.contains('hidden-yes');
      }
      expect(notHidden).to.equal(1);

      notHidden = 0;
      // @ts-ignore
      filter.selectOnChange({target: {value: ''}});
      for (const child of carouselTrack.children) {
        notHidden += +!child.classList.contains('hidden-yes');
      }
      expect(notHidden).to.equal(courseTags.length);
    } finally {
      filter.remove();
      carouselTrack.remove();
    }
  });

  it('clicking a filter should only show that element', async function () {
    const {filter, carouselTrack} = await setup();
    try {
      const selectedId = courseTags[0];
      let notHidden = 0;

      // @ts-ignore
      filter.selectOnChange({target: {value: selectedId}});
      for (const child of carouselTrack.children) {
        notHidden += +!child.classList.contains('hidden-yes');
      }
      expect(notHidden).to.equal(1);

      const notHiddenDiv = Array.from(carouselTrack.children).find(
        (e) => !e.classList.contains('hidden-yes'),
      );
      expect(notHiddenDiv.getAttribute('data-tag')).to.equal(selectedId);
    } finally {
      filter.remove();
      carouselTrack.remove();
    }
  });
});
