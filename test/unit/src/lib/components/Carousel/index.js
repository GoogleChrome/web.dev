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

const {expect, assert} = require('chai');
require('../../../../../../src/lib/components/Carousel/index');

const cardCount = 10;

/**
 * @returns {Promise<import('../../../../../../src/lib/components/Carousel/index').Carousel>}
 */
const setup = async () => {
  const webCarousel =
    /** @type {import('../../../../../../src/lib/components/Carousel/index').Carousel} */ (
      document.createElement('web-carousel')
    );

  const divCarousel = document.createElement('div');
  divCarousel.classList.add('carousel');

  const backButton = document.createElement('button');
  backButton.classList.add('icon-button');
  backButton.setAttribute('data-direction', 'prev');
  backButton.setAttribute('aria-label', 'back');
  divCarousel.appendChild(backButton);

  const divCarouselTrack = document.createElement('div');
  divCarouselTrack.classList.add('carousel__track', 'reel');
  divCarouselTrack.setAttribute('data-scroll', 'snap');

  for (let i = 0; i < cardCount; i++) {
    const cardDiv = document.createElement('div');
    divCarouselTrack.appendChild(cardDiv);
  }

  divCarousel.appendChild(divCarouselTrack);

  const nextButton = document.createElement('button');
  nextButton.classList.add('icon-button');
  nextButton.setAttribute('data-direction', 'next');
  nextButton.setAttribute('aria-label', 'forward');
  divCarousel.appendChild(nextButton);

  webCarousel.appendChild(divCarousel);
  document.body.append(webCarousel);
  // @ts-ignore
  await webCarousel.updateComplete;

  return webCarousel;
};

describe('Carousel', function () {
  before(async function () {
    await customElements.whenDefined('web-carousel');
  });

  it('constructor sets initial values', async function () {
    const webCarousel = await setup();
    expect(webCarousel._carouselTrack).to.be.instanceOf(HTMLElement);
    assert.isNumber(webCarousel.index);
    expect(webCarousel.index).to.equal(0);
    expect(webCarousel._items.length).to.equal(cardCount);
    expect(webCarousel._nextButton).to.be.instanceOf(HTMLButtonElement);
    expect(webCarousel._previousButton).to.be.instanceOf(HTMLButtonElement);
  });

  // /**
  //  * @TODO
  //  *
  //  * Acting funny, I think that's cause of missing CSS.
  //  */
  // it('clicking on arrow scrolls carousel', async function () {
  //   const webCarousel = await setup();
  //   const carouselTrack = webCarousel._carouselTrack;
  //   const initialScrollLeft = carouselTrack.scrollLeft;
  //   const nextButton = webCarousel._nextButton;
  //   const previousButton = webCarousel._previousButton;

  //   nextButton.click();
  //   expect(carouselTrack.scrollLeft).to.not.equal(initialScrollLeft);

  //   previousButton.click();
  //   expect(carouselTrack.scrollLeft).to.equal(initialScrollLeft);

  //   previousButton.click();
  //   expect(carouselTrack.scrollLeft).to.equal(initialScrollLeft);
  // });

  it('updates tracked index when element is focused in', async function () {
    const webCarousel = await setup();
    const index = Math.floor(cardCount / 2);
    const items = webCarousel._items;
    items[index].dispatchEvent(new Event('focusin'));
    expect(webCarousel.index).to.equal(index);
  });

  it('updates tracked index when arrow keys are pressed', async function () {
    const webCarousel = await setup();
    const track = webCarousel._carouselTrack;
    track.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowRight'}));
    expect(webCarousel.index).to.equal(1);
    track.dispatchEvent(new KeyboardEvent('keyup', {key: 'ArrowLeft'}));
    expect(webCarousel.index).to.equal(0);
  });
});
