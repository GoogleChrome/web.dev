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
 * Element that adds active classes to its children when the user scrolls to
 * a heading this child points to.
 * @extends {BaseElement}
 * @final
 */
class ScrollSpy extends BaseElement {
  constructor() {
    super();
    this.scrollSpy = this.scrollSpy.bind(this);
    this.tocActiveClass = 'w-scroll-spy__active';
    this.tocVisibleClass = 'w-scroll-spy__visible';
  }

  connectedCallback() {
    super.connectedCallback();
    this.articleContent = document.querySelector('main');

    if (!this.articleContent) {
      return;
    }

    this.headings = this.articleContent.querySelectorAll(
      'h1[id], h2[id], h3[id]',
    );

    this.observer = new IntersectionObserver(this.scrollSpy, {
      rootMargin: '0px 0px -80% 0px',
    });
    this.headings.forEach((heading) => this.observer.observe(heading));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.observer.disconnect();
  }

  scrollSpy(headings) {
    const links = new Map(
      [...this.querySelectorAll('a')].map((l) => [l.getAttribute('href'), l]),
    );
    for (const heading of headings) {
      const href = `#${heading.target.getAttribute('id')}`;
      const link = links.get(href);

      if (link) {
        if (heading.intersectionRatio > 0) {
          link.classList.add(this.tocVisibleClass);
          this.previouslyActiveHeading = heading.target.getAttribute('id');
        } else {
          link.classList.remove(this.tocVisibleClass);
        }
      }

      const firstVisibleLink = this.querySelector(`.${this.tocVisibleClass}`);

      links.forEach((link) => {
        link.classList.remove(this.tocActiveClass, this.tocVisibleClass);
      });

      if (firstVisibleLink) {
        firstVisibleLink.classList.add(this.tocActiveClass);
      }

      if (!firstVisibleLink && this.previouslyActiveHeading) {
        const last = this.querySelector(
          `a[href="#${this.previouslyActiveHeading}"]`,
        );
        last.classList.add(this.tocActiveClass);
      }
    }
  }
}

customElements.define('web-scroll-spy', ScrollSpy);
