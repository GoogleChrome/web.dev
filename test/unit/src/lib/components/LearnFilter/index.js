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

const {assert} = require('../../assert');
require('../../../../../../src/lib/components/LearnFilter/index');

const collectionIds = [
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
  const filter = document.createElement('web-learn-filter');
  const filterFilters = collectionIds.map((i) => ({id: i, title: i}));
  filter.setAttribute('filters', JSON.stringify(filterFilters));

  const learningPathsElement = document.createElement('div');
  learningPathsElement.setAttribute('id', 'learn__collections');
  for (const collectionId of collectionIds) {
    const learningPathsElementChild = document.createElement('div');
    learningPathsElementChild.setAttribute('id', collectionId);
    learningPathsElement.appendChild(learningPathsElementChild);
  }

  document.body.append(filter);
  // @ts-ignore
  await filter.updateComplete;
  document.body.append(learningPathsElement);

  return [filter, learningPathsElement];
};

describe('LearnFilter', function () {
  before(async function () {
    await customElements.whenDefined('web-learn-filter');
  });

  it('clicking all should still show all elements', async function () {
    const [filter, learningPathsElement] = await setup();
    try {
      /** @type {HTMLButtonElement} */
      const allButton = filter.querySelector('button.pill');
      allButton.click();

      let notHidden = 0;

      for (const child of learningPathsElement.children) {
        notHidden += +!child.classList.contains('hidden-yes');
      }
      assert(notHidden === collectionIds.length, 'no element should be hidden');
    } finally {
      filter.remove();
      learningPathsElement.remove();
    }
  });

  it('clicking a filter should only show that element', async function () {
    const [filter, learningPathsElement] = await setup();
    try {
      /** @type {NodeListOf<HTMLButtonElement>} */
      const buttons = filter.querySelectorAll('button.pill');
      const button = buttons.item(2);
      button.click();

      let notHidden = 0;

      for (const child of learningPathsElement.children) {
        notHidden += +!child.classList.contains('hidden-yes');
      }

      assert(notHidden === 1, 'only one element should be shown');
    } finally {
      filter.remove();
      learningPathsElement.remove();
    }
  });
});
