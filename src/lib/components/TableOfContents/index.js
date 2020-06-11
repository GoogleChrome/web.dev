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
    this.scrollSpy = this.scrollSpy.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.tocInnerDiv = document.createElement('div');
    this.tocInnerDiv.classList.add('w-toc__content');
    this.tocInnerDiv.innerHTML = this.innerText;
    this.innerText = '';
    this.append(this.tocInnerDiv);

    this.divContent = document.querySelector('#content');
    this.headers = this.divContent.querySelectorAll('h1[id], h2[id], h3[id]');

    this.addTocDetails();
    this.addOpenButton();
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
    tocButton.addEventListener('click', () => (this.opened = true));

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

  addTocDetails() {
    const tocLabel = document.createElement('div');
    tocLabel.classList.add('w-toc__label');
    const inThisArticle = document.createElement('span');
    inThisArticle.append(document.createTextNode('In this article'));
    const tocCloseButton = document.createElement('button');
    tocCloseButton.classList.add(
      'w-button',
      'w-button--secondary',
      'w-button--icon',
    );
    tocCloseButton.setAttribute('data-icon', 'close');
    tocCloseButton.setAttribute('aria-label', 'Close Table of Contents');
    tocCloseButton.addEventListener('click', () => (this.opened = false));
    tocLabel.append(inThisArticle, tocCloseButton);
    this.tocInnerDiv.before(tocLabel);

    const tocTitle = document.createElement('h2');
    tocTitle.classList.add('w-toc__header');
    const tocTitleLink = document.createElement('a');
    tocTitleLink.href = `#${this.titleId}`;
    tocTitleLink.classList.add('w-toc__header--link');
    tocTitleLink.append(document.createTextNode(this.title));
    tocTitle.append(tocTitleLink);
    this.tocInnerDiv.prepend(tocTitle);

    this.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => (this.opened = false)),
    );
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
