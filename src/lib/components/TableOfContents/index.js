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
    this.openedToFalse = this.openedToFalse.bind(this);
    this.scrollSpy = this.scrollSpy.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.tocHTML = this.innerHTML;
    this.divContent =
      document.querySelector('#content') || document.createElement('div');
    this.headers = this.divContent.querySelectorAll('h1[id], h2[id], h3[id]');
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
    if (changedProperties.has('opened')) {
      if (!changedProperties.get('opened')) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.close();
  }

  onStateChanged({tocOpened}) {
    this.opened = tocOpened;
  }

  scrollSpy() {
    for (const header of this.headers) {
      const rect = header.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        this.setActive(header.id);
      }
    }
  }

  close() {
    this.divContent.classList.remove('w-toc-open');
    document.removeEventListener('touchmove', this.scrollSpy);
    document.removeEventListener('scroll', this.scrollSpy);
  }

  open() {
    this.divContent.classList.add('w-toc-open');
    this.scrollSpy();
    document.addEventListener('touchmove', this.scrollSpy, {passive: true});
    document.addEventListener('scroll', this.scrollSpy, {passive: true});
  }

  openedToFalse() {
    closeToC();
  }

  setActive(id) {
    const activeLink = 'w-toc__active--link';
    const activeBorder = 'w-toc__active--border';
    this.querySelectorAll('a').forEach((e) => {
      if (e.href.endsWith('/#' + id)) {
        e.classList.add(activeLink);
        e.parentElement.classList.add(activeBorder);
      } else {
        e.classList.remove(activeLink);
        e.parentElement.classList.remove(activeBorder);
      }
    });
  }
}

customElements.define('web-table-of-contents', TableOfContents);
