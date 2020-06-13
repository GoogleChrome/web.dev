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
import {closeToC} from '../../actions';

/**
 * Element that renders table of contents.
 * @extends {BaseStateElement}
 * @final
 */
class TableOfContents extends BaseStateElement {
  static get properties() {
    return {
      title: {type: String},
      titleId: {type: String, attribute: 'title-id'},
      opened: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.scrollSpy = this.scrollSpy.bind(this);
    this.openedToFalse = this.openedToFalse.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.tocHTML = this.innerHTML;
    this.divContent =
      document.querySelector('#content') || document.createElement('div');
    this.headings = this.divContent.querySelectorAll('h1[id], h2[id], h3[id]');

    this.observer = new IntersectionObserver(this.scrollSpy);
    this.headings.forEach((heading) => this.observer.observe(heading));
  }

  render() {
    return html`
      <div class="w-toc__label">
        <span>In this article</span>
        <button
          class="w-button w-button--secondary w-button--icon"
          data-icon="close"
          aria-close="Close Table of Contents"
          @click="${this.openedToFalse}"
        ></button>
      </div>
      <div class="w-toc__content">
        <h2 class="w-toc__header">
          <a href="#${this.titleId}" class="w-toc__header--link">
            ${this.title}
          </a>
        </h2>
        ${html([this.tocHTML])}
      </div>
    `;
  }

  updated(changedProperties) {
    if (
      changedProperties.has('opened') &&
      changedProperties.get('opened') !== this.opened
    ) {
      if (this.opened) {
        this.divContent.classList.add('w-toc-open');
      } else {
        this.divContent.classList.remove('w-toc-open');
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    closeToC();
    this.divContent.classList.remove('w-toc-open');
    this.observer.disconnect();
  }

  onStateChanged({tocOpened}) {
    this.opened = tocOpened;
  }

  highlightActiveLink() {
    const activeLink = 'w-toc__active--link';
    const activeBorder = 'w-toc__active--border';
    const firstVisibleLink = this.querySelector('.w-toc__visible--link');
    const links = [...this.querySelectorAll('a')];

    links.forEach((link) => {
      link.classList.remove(activeLink, 'w-toc__visible--link');
      link.parentElement.classList.remove(activeBorder);
    });

    if (firstVisibleLink) {
      firstVisibleLink.classList.add(activeLink);
      firstVisibleLink.parentElement.classList.add(activeBorder);
    }

    if (!firstVisibleLink && this.previouslyActiveHeading) {
      const last = this.querySelector(
        `a[href="#${this.previouslyActiveHeading}"]`,
      );
      last.classList.add(activeLink);
      last.parentElement.classList.add(activeBorder);
    }
  }

  openedToFalse() {
    closeToC();
  }

  scrollSpy(headings) {
    const links = [...this.querySelectorAll('a')];
    for (const heading of headings) {
      const href = `#${heading.target.getAttribute('id')}`;
      const link = links.find((l) => l.getAttribute('href') === href);
      if (heading.intersectionRatio > 0) {
        link.classList.add('w-toc__visible--link');
        this.previouslyActiveHeading = heading.target.getAttribute('id');
      } else {
        link.classList.remove('w-toc__visible--link');
      }

      this.highlightActiveLink();
    }
  }
}

customElements.define('web-table-of-contents', TableOfContents);
