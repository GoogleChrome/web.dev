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
      contentId: {type: String, attribute: 'content-id'},
      opened: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.scrollSpy = this.scrollSpy.bind(this);
    this.openedToFalse = this.openedToFalse.bind(this);
    this.tocActiveClass = 'w-toc__active';
    this.tocBorderClass = 'w-toc__border';
    this.tocVisibleClass = 'w-toc__visible';
  }

  connectedCallback() {
    super.connectedCallback();
    this.tocHTML = this.innerHTML;
    this.articleContent =
      document.querySelector(`#${this.contentId}`) ||
      document.createElement('div');

    if (!this.articleContent.id) {
      console.warn(
        `Article container with ID of '${this.contentId}' not found.`,
      );
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
        this.articleContent.classList.add('w-toc-open');
      } else {
        this.articleContent.classList.remove('w-toc-open');
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    closeToC();
    this.articleContent.classList.remove('w-toc-open');
    this.observer.disconnect();
  }

  onStateChanged({isTocOpened}) {
    this.opened = isTocOpened;
  }

  highlightActiveLink() {
    const firstVisibleLink = this.querySelector(`.${this.tocVisibleClass}`);
    const links = [...this.querySelectorAll('a')];

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

  openedToFalse() {
    closeToC();
  }

  scrollSpy(headings) {
    const links = [...this.querySelectorAll('a')];
    for (const heading of headings) {
      const href = `#${heading.target.getAttribute('id')}`;
      const link = links.find((l) => l.getAttribute('href') === href);
      if (heading.intersectionRatio > 0) {
        link.classList.add(this.tocVisibleClass);
        this.previouslyActiveHeading = heading.target.getAttribute('id');
      } else {
        link.classList.remove(this.tocVisibleClass);
      }

      this.highlightActiveLink();
    }
  }
}

customElements.define('web-table-of-contents', TableOfContents);
