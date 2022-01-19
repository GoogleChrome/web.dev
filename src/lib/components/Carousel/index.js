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

export class Carousel extends BaseElement {
  constructor() {
    super();

    /** @type {HTMLElement} */
    this._carouselTrack = undefined;
    /** @type {number} */
    this.index = 0;
    /** @type {HTMLElement[]} */
    this._items = [];
    /** @type {HTMLButtonElement} */
    this._nextButton = undefined;
    /** @type {HTMLButtonElement} */
    this._previousButton = undefined;

    this._next = this._next.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onKeyup = this._onKeyup.bind(this);
    this._previous = this._previous.bind(this);
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
    this._previousButton.addEventListener('click', this._previous);

    this._nextButton = this.querySelector('button[data-direction="next"]');
    this._nextButton.addEventListener('click', this._next);

    this._carouselTrack.addEventListener('click', this._onClick);
    this._carouselTrack.addEventListener('keyup', this._onKeyup);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._previousButton?.removeEventListener('click', this._previous);
    this._nextButton?.removeEventListener('click', this._next);
    this._carouselTrack?.addEventListener('click', this._onClick);
    this._carouselTrack?.removeEventListener('keyup', this._onKeyup);
  }

  /**
   * Event listener function for next button.
   */
  _next() {
    this._scroll(true);
  }

  /**
   * Event listener function that listens for click to see if user is selecting element in carousel.
   *
   * @param {MouseEvent} e The click event.
   */
  _onClick(e) {
    let target = /** @type {HTMLElement} */ (e.target);
    let searchForElement = true;

    do {
      if (target.tagName === 'A') {
        return;
      }

      searchForElement = !(target.parentElement === this._carouselTrack);
      if (searchForElement) {
        target = target.parentElement;
      }
    } while (searchForElement);

    const index = this._items.findIndex((e) => e === target);
    this._setIndex(index - this.index);
  }

  /**
   * Event listener function that listens for key presses to see if user is switching elements.
   *
   * @param {KeyboardEvent} e The keyboard event.
   */
  _onKeyup(e) {
    switch (e.key) {
      case 'ArrowLeft':
        return this._setIndex(-1);
      case 'ArrowRight':
        return this._setIndex(1);
      default:
        break;
    }
  }

  /**
   * Event listener function for previous button.
   */
  _previous() {
    this._scroll(false);
  }

  _scroll(forward = true) {
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      const overflow =
        this._carouselTrack.parentElement.clientWidth -
        this._carouselTrack.clientWidth;
      if (
        this._carouselTrack.scrollLeft + overflow <=
        item.offsetLeft + item.offsetWidth
      ) {
        let index = i + (forward ? 1 : -1);

        if (index < 0) {
          index = 0;
        } else if (index >= this._items.length) {
          index = this._items.length - 1;
        }

        const scrollTo = this._items[index];
        return this._carouselTrack.scrollTo(scrollTo.offsetLeft, 0);
      }
    }
  }

  /**
   * Sets the new current slide index and scrolls to it.
   *
   * @param {number} increment How many items to move by.
   */
  _setIndex(increment) {
    this.index = this.index + increment;

    if (this.index < 0) {
      this.index = 0;
    } else if (this.index >= this._items.length) {
      this.index = this._items.length - 1;
    }

    const active = this._items[this.index];
    active.focus({preventScroll: true});
    this._carouselTrack.scrollTo(active.offsetLeft, 0);
  }
}

customElements.define('web-carousel', Carousel);
