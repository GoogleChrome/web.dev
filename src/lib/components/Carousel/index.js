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
      interval: {type: Number},
    };
  }

  constructor() {
    super();

    /** @type {HTMLElement} */
    this._active = undefined;
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
    /** @type {NodeJS.Timeout} */
    this._timeout = undefined;

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this._scroll = this._scroll.bind(this);
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

    this._items.forEach((v, i) => v.setAttribute('data-index', '' + i));

    this._previousButton = this.querySelector('button[data-direction="prev"]');
    this._previousButton.addEventListener('click', this.previous);
    this._nextButton = this.querySelector('button[data-direction="next"]');
    this._nextButton.addEventListener('click', this.next);

    this._items.forEach((e, i) =>
      e.addEventListener('focusin', () => this.moveSlide(i - this._index)),
    );

    this._carouselTrack.addEventListener('scroll', this._scroll);

    this.moveSlide(0, false);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._previousButton)
      this._previousButton.removeEventListener('click', this.previous);
    if (this._nextButton)
      this._nextButton.removeEventListener('click', this.next);
    if (this._timeout) clearTimeout(this._timeout);
    this._items.forEach((e) => e.parentElement.removeChild(e));
    if (this._carouselTrack)
      this._carouselTrack.removeEventListener('scroll', this._scroll);
  }

  moveSlide(increment, scroll = true) {
    const elementCount = this._items.length;
    let newIndex = this._index + increment;

    if (newIndex < 0) {
      newIndex = elementCount - 1;
    } else if (newIndex >= elementCount) {
      newIndex = 0;
    }

    if (newIndex === this._index) return;
    if (this._timeout) clearTimeout(this._timeout);

    this._items.forEach((e, i) => e.classList.toggle('active', i === newIndex));
    this._index = newIndex;
    this._active = this._items[this._index];
    if (this.interval === 0) this._active.focus({preventScroll: true});
    if (scroll) this._carouselTrack.scrollTo(this._active.offsetLeft, 0);

    this._setTimeout();
  }

  next() {
    this.moveSlide(1);
  }

  previous() {
    this.moveSlide(-1);
  }

  _scroll() {
    for (const item of this._items) {
      const overflow =
        (this._carouselTrack.parentElement.clientWidth -
          this._carouselTrack.clientWidth) /
        2;

      if (
        this._carouselTrack.scrollLeft + overflow <=
        item.offsetLeft + item.offsetWidth
      ) {
        const index = parseInt(item.getAttribute('data-index'), 10);
        return this.moveSlide(index - this._index, false);
      }
    }
  }

  _setTimeout() {
    if (this.interval > 0) {
      this._timeout = setTimeout(this.next, this.interval);
    }
  }
}

customElements.define('web-carousel', Carousel);
