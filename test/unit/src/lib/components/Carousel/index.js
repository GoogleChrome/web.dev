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
 * Causes 600ms delay to allow UI changes, such as smooth scroll, to occur.
 *
 * @returns Promise<void>
 */
const sleep = () => new Promise((res) => setTimeout(res, 600));

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
  backButton.setAttribute('data-direction', 'prev');
  divCarousel.append(backButton);

  const divCarouselTrack = document.createElement('div');
  divCarouselTrack.classList.add('carousel__track', 'reel');
  divCarouselTrack.style.scrollBehavior = 'auto';
  divCarouselTrack.setAttribute('data-scroll', 'snap');

  for (let i = 0; i < cardCount; i++) {
    const cardDiv = document.createElement('div');
    divCarouselTrack.append(cardDiv);
  }

  divCarousel.append(divCarouselTrack);

  const nextButton = document.createElement('button');
  nextButton.setAttribute('data-direction', 'next');
  divCarousel.append(nextButton);

  webCarousel.append(divCarousel);
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

  it('clicking on arrow scrolls carousel', async function () {
    const webCarousel = await setup();

    const carouselTrack = webCarousel._carouselTrack;
    const overflow =
      carouselTrack.parentElement.clientWidth - carouselTrack.clientWidth;

    let previousScrollLeft = carouselTrack.scrollLeft + overflow;
    const nextButton = webCarousel._nextButton;
    const previousButton = webCarousel._previousButton;
    console.log('BARRY1', carouselTrack.parentElement.clientWidth);
    console.log('BARRY2', nextButton);

    // Check if next moves forward
    nextButton.click();
    await sleep();
    console.log('BARRY3', carouselTrack.scrollLeft, previousScrollLeft);
    expect(carouselTrack.scrollLeft).to.be.above(previousScrollLeft);
    previousScrollLeft = carouselTrack.scrollLeft + overflow; // Account for overflow

    // Check if back moves backward
    previousButton.click();
    await sleep();
    expect(carouselTrack.scrollLeft).to.be.below(previousScrollLeft);
    previousScrollLeft = carouselTrack.scrollLeft;

    // Check if back at beginning doesn't move
    previousButton.click();
    await sleep();
    expect(carouselTrack.scrollLeft).to.be.equal(previousScrollLeft);
  });

  it('updates tracked index when element is clicked', async function () {
    const webCarousel = await setup();
    const index = Math.floor(cardCount / 2);
    const items = webCarousel._items;
    items[index].click();
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
