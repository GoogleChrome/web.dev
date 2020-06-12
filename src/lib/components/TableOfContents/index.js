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
import {BaseElement} from '../BaseElement';
import {stringToBoolean} from '../../utils/string-to-boolean';

/**
 * Element that renders table of contents.
 * @extends {BaseElement}
 * @final
 */
class TableOfContents extends BaseElement {
  static get properties() {
    return {
      title: {type: String},
      titleId: {type: String, attribute: 'title-id'},
      opened: {type: Boolean, converter: stringToBoolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.openedToFalse = this.openedToFalse.bind(this);
    this.openedToTrue = this.openedToTrue.bind(this);
    this.scrollSpy = this.scrollSpy.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.tocHTML = html([this.innerHTML]);

    this.divContent = document.querySelector('#content');
    this.headers = this.divContent.querySelectorAll('h1[id], h2[id], h3[id]');

    this.addOpenButton();
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
        ${this.tocHTML}
      </div>
    `;
  }

  updated(changedProperties) {
    if (
      changedProperties.has('opened') &&
      changedProperties.get('opened') !== this.opened
    ) {
      if (this.opened) {
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

  addOpenButton() {
    const tocWrapper = document.createElement('div');
    tocWrapper.classList.add('w-toc__button--wrapper');

    const tocButton = document.createElement('button');
    tocButton.classList.add(
      'w-toc__button--open',
      'w-button',
      'w-button--secondary',
      'w-button--icon',
    );
    tocButton.setAttribute('data-icon', 'list_alt');
    tocButton.setAttribute('aria-label', 'Open Table of Contents');
    tocButton.addEventListener('click', this.openedToTrue);

    tocWrapper.append(tocButton);
    this.after(tocWrapper);
  }

  scrollSpy() {
    if (this.divContent) {
      for (const header of this.headers) {
        const rect = header.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          this.setActive(header.id);
        }
      }
    }
  }

  close() {
    if (this.divContent) {
      this.divContent.classList.remove('w-toc-open');
    }
    document.removeEventListener('touchmove', this.scrollSpy);
    document.removeEventListener('scroll', this.scrollSpy);
  }

  open() {
    if (this.divContent) {
      this.divContent.classList.add('w-toc-open');
    }
    this.scrollSpy();
    document.addEventListener('touchmove', this.scrollSpy, {passive: true});
    document.addEventListener('scroll', this.scrollSpy, {passive: true});
  }

  openedToFalse() {
    this.opened = false;
  }

  openedToTrue() {
    this.opened = true;
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
