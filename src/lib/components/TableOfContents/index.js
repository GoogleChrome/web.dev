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
 * limitations under the License.
 */

import {html} from 'lit-element';
import {BaseStateElement} from '../BaseStateElement';
import {openToC, closeToC} from '../../actions';

/**
 * Element that renders table of contents.
 * @extends {BaseStateElement}
 * @final
 */
class TableOfContents extends BaseStateElement {
  static get properties() {
    return {
      opened: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.scrollSpy = this.scrollSpy.bind(this);
    this.tocActiveClass = 'w-toc__active';
    this.tocBorderClass = 'w-toc__border';
    this.tocVisibleClass = 'w-toc__visible';
  }

  connectedCallback() {
    // This sets initial global state before subscribing to the store.
    // If we didn't do this then `this.opened` would always be set to false
    // because onStateChanged runs synchronously after we call
    // super.connectedCallback();
    if (this.hasAttribute('opened')) {
      openToC();
    }

    super.connectedCallback();
    this.tocHTML = this.innerHTML;
    this.articleContent = this.closest('main');

    if (!this.articleContent) {
      console.warn(`Article container not found.`);
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

  render() {
    const content = /** @type TemplateStringsArray */ (
      /** @type ReadonlyArray<string> */ ([this.tocHTML])
    );
    return html`
      <div class="w-toc__label">
        <span>In this article</span>
        <button
          class="w-button w-button--secondary w-button--icon"
          data-icon="close"
          aria-label="Close Table of Contents"
          @click="${closeToC}"
        ></button>
      </div>
      <div class="w-toc__content">${html(content)}</div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    closeToC();
    this.observer.disconnect();
  }

  onStateChanged({isTocOpened}) {
    this.opened = isTocOpened;
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
        link.parentElement.classList.remove(this.tocBorderClass);
      });

      if (firstVisibleLink) {
        firstVisibleLink.classList.add(this.tocActiveClass);
        firstVisibleLink.parentElement.classList.add(this.tocBorderClass);
      }

      if (!firstVisibleLink && this.previouslyActiveHeading) {
        const last = this.querySelector(
          `a[href="#${this.previouslyActiveHeading}"]`,
        );
        last.classList.add(this.tocActiveClass);
        last.parentElement.classList.add(this.tocBorderClass);
      }
    }
  }
}

customElements.define('web-table-of-contents', TableOfContents);
