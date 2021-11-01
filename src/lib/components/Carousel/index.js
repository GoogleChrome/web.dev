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
  static get properties() {
    return {
      // Allows for the carousel to automatically transition between slides when a `interval` is set.
      interval: {type: Number},
    };
  }

  constructor() {
    super();

    /** @type {HTMLElement} */
    this._carouselTrack = undefined;
    /** @type {number} */
    this._index = 0;
    /** @type {number} */
    this.interval = 0;
    /** @type {HTMLElement[]} */
    this._items = [];
    /** @type {HTMLButtonElement} */
    this._nextButton = undefined;
    /** @type {HTMLButtonElement} */
    this._previousButton = undefined;
    /** @type {number} */
    this._timeout = undefined;

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this._onKeyup = this._onKeyup.bind(this);
    this._onScroll = this._onScroll.bind(this);
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

    this._items.forEach((e, i) =>
      e.addEventListener('focusin', () => this.moveSlide(i - this._index)),
    );

    this._carouselTrack.addEventListener('keyup', this._onKeyup);
    this._carouselTrack.addEventListener('touchmove', this._onScroll);
    this._carouselTrack.addEventListener('wheel', this._onScroll);
    this.moveSlide(0, false);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._previousButton?.removeEventListener('click', this.previous);
    this._nextButton?.removeEventListener('click', this.next);
    window.clearTimeout(this._timeout);
    this._items.forEach((e) => e.removeChild(e));
    this._carouselTrack?.removeEventListener('keyup', this._onKeyup);
    this._carouselTrack?.removeEventListener('touchmove', this._onScroll);
    this._carouselTrack?.removeEventListener('wheel', this._onScroll);
  }

  /**
   * Sets the new current slide index and scrolls to it if necessary.
   *
   * @param {number} increment How many items to move by
   * @param {boolean} scroll Whether to move the user's viewport.
   */
  moveSlide(increment, scroll = true) {
    const elementCount = this._items.length;
    let newIndex = this._index + increment;

    if (newIndex < 0) {
      newIndex = elementCount - 1;
    } else if (newIndex >= elementCount) {
      newIndex = 0;
    }

    if (newIndex === this._index) {
      return;
    }
    if (this._timeout) clearTimeout(this._timeout);

    this._items.forEach((e, i) => e.classList.toggle('active', i === newIndex));
    this._index = newIndex;
    const active = this._items[this._index];
    if (this.interval === 0) {
      active.focus({preventScroll: true});
    } else {
      this._timeout = window.setTimeout(this.next, this.interval);
    }

    if (scroll) {
      this._carouselTrack.scrollTo(active.offsetLeft, 0);
    }
  }

  next() {
    this.moveSlide(1);
  }

  previous() {
    this.moveSlide(-1);
  }

  /**
   * Event listener function that listens for key presses to see if user is switching elements.
   *
   * @param {KeyboardEvent} e The keyboard event.
   */
  _onKeyup(e) {
    switch (e.key) {
      case 'ArrowLeft':
        return this.previous();
      case 'ArrowRight':
        return this.next();
      default:
        break;
    }
  }

  /**
   * Event listener function that determines which element a user has scrolled to.
   */
  _onScroll() {
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      const overflow =
        this._carouselTrack.parentElement.clientWidth -
        this._carouselTrack.clientWidth;
      if (
        this._carouselTrack.scrollLeft + overflow <=
        item.offsetLeft + item.offsetWidth
      ) {
        return this.moveSlide(i - this._index, false);
      }
    }
  }
}

customElements.define('web-carousel', Carousel);
