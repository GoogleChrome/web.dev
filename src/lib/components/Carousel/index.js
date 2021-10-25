/*
 * Copyright 2021 Google LLC
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

import {BaseElement} from '../BaseElement';

class Carousel extends BaseElement {
  constructor() {
    super();

    /** @type {HTMLElement} */
    this._active = undefined;
    /** @type {HTMLElement} */
    this._carouselTrack = undefined;
    /** @type {number} */
    this._index = 0;
    /** @type {number} */
    this._interval = 10000;
    /** @type {HTMLElement[]} */
    this._items = [];
    /** @type {HTMLButtonElement} */
    this._nextButton = undefined;
    /** @type {HTMLButtonElement} */
    this._previousButton = undefined;
    /** @type {NodeJS.Timeout} */
    this._timeout = undefined;

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this._carouselTrack = this.querySelector('div.carousel__track');

    if (!this._carouselTrack.firstElementChild) {
      return;
    }

    this._items = /** @type {HTMLElement[]} */ ([
      ...this._carouselTrack.children,
    ]);

    this._previousButton = this.querySelector('button[data-direction="prev"]');
    this._previousButton.addEventListener('click', this.previous);
    this._nextButton = this.querySelector('button[data-direction="next"]');
    this._nextButton.addEventListener('click', this.next);

    this.moveSlide(0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._previousButton)
      this._previousButton.removeEventListener('click', this.previous);
    if (this._nextButton)
      this._nextButton.removeEventListener('click', this.next);
    if (this._timeout) clearTimeout(this._timeout);
  }

  next() {
    this.moveSlide(1);
  }

  previous() {
    this.moveSlide(-1);
  }

  /**
   * @param {number} increment
   */
  moveSlide(increment) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    const elementCount = this._items.length;
    let newIndex = this._index + increment;

    if (newIndex < 0) {
      newIndex = elementCount - 1;
    } else if (newIndex >= elementCount) {
      newIndex = 0;
    }

    this._items.forEach((e, i) => e.classList.toggle('active', i === newIndex));
    this._index = newIndex;
    this._active = this._items[this._index];
    this._carouselTrack.scrollTo(this._active.offsetLeft, 0);
    this._timeout = setTimeout(this.next, this._interval);
  }
}

customElements.define('web-carousel', Carousel);
