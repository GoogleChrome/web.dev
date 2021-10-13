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
      openAt: {type: Number, reflect: true},
    };
  }

  constructor() {
    super();
    this.tocActiveClass = 'w-toc__active';
    this.tocBorderClass = 'w-toc__border';
    this.tocVisibleClass = 'w-toc__visible';
    this.openAt = 0;
  }

  connectedCallback() {
    // This sets initial global state before subscribing to the store.
    // If we didn't do this then `this.opened` would always be set to false
    // because onStateChanged runs synchronously after we call
    // super.connectedCallback();
    if (this.hasAttribute('opened')) {
      openToC();
    } else if (this.hasAttribute('openAt')) {
      if (document.documentElement.clientWidth >= this.openAt) {
        openToC();
      }
    }

    super.connectedCallback();
    this.tocHTML = this.innerHTML;
    this.articleContent = this.closest('main');

    if (!this.articleContent) {
      console.warn(`Article container not found.`);
      return;
    }
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
      <web-scroll-spy>
        <div class="w-toc__content">${html(content)}</div>
      </web-scroll-spy>
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
}

customElements.define('web-table-of-contents', TableOfContents);
