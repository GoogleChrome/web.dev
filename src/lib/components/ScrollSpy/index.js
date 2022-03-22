/*
 * Copyright 2020 Google LLC
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
 * limitations under the Licenspe.
 */

import {BaseElement} from '../BaseElement';

/**
 * Element that fires a 'viewport-entry' event when user scrolls
 * an observed element into a focus area. The ibserved elements can be
 * configured by passing a css selector as an element's param.
 * @extends {BaseElement}
 */
export class ScrollSpy extends BaseElement {
  static get properties() {
    return {
      // CSS selector for selecting items to observe.
      selector: {type: String, reflect: true},
    };
  }

  constructor() {
    super();
    this.scrollSpy = this.scrollSpy.bind(this);
    this.selector = '[data-scrollspy]';
  }

  connectedCallback() {
    super.connectedCallback();
    this.articleContent = document.querySelector('main');

    if (!this.articleContent) {
      return;
    }
    this.items = this.articleContent.querySelectorAll(this.selector);
    this.observer = new IntersectionObserver(this.scrollSpy, {
      // Observe the upper parth of the viewport (user's focus area)
      rootMargin: '0px 0px -80% 0px',
    });
    this.items.forEach((item) => this.observer.observe(item));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  scrollSpy(items) {
    const event = new CustomEvent('viewport-entry', {
      detail: {
        target: items[0].target,
        isIntersecting: items[0].isIntersecting,
      },
    });
    document.dispatchEvent(event);
  }
}

customElements.define('scroll-spy', ScrollSpy);
