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
    };
  }

  constructor() {
    super();
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.scrollSpy = this.scrollSpy.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.divContent = document.querySelector('div#content');
    this.headers = this.divContent.querySelectorAll(
      'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]',
    );

    this.addTocDetails();
    this.addOpenButton();

    this.scrollSpy();
    document.addEventListener('touchmove', this.scrollSpy);
    document.addEventListener('scroll', this.scrollSpy);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.close();
    document.removeEventListener('touchmove', this.scrollSpy);
    document.removeEventListener('scroll', this.scrollSpy);
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
    tocButton.addEventListener('click', this.open);

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
    const tocTitle = document.createElement('h2');
    tocTitle.classList.add('w-toc__header');

    const tocTitleLink = document.createElement('a');
    tocTitleLink.href = `#${this.titleId}`;
    tocTitleLink.classList.add('w-toc__header--link');
    tocTitleLink.append(document.createTextNode(this.title));

    tocTitle.append(tocTitleLink);

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
    tocCloseButton.addEventListener('click', this.close);

    tocLabel.append(inThisArticle, tocCloseButton);

    this.prepend(tocLabel, tocTitle);

    this.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', this.close),
    );
  }

  close() {
    if (this.divContent) {
      this.divContent.classList.remove('w-toc-open');
    }
  }

  open() {
    if (this.divContent) {
      this.divContent.classList.add('w-toc-open');
    }
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
