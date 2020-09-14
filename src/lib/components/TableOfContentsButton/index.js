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
import {openToC} from '../../actions';
import {trackEvent} from '../../analytics';

/**
 * Element that renders table of contents open button.
 * @extends {BaseStateElement}
 * @final
 */
class TableOfContentsButton extends BaseStateElement {
  static get properties() {
    return {
      opened: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <button
        class="w-toc__button--open w-button w-button--secondary w-button--icon"
        data-icon="list_alt"
        aria-label="Open Table of Contents"
        @click="${openToC}"
      ></button>
    `;
  }

  onStateChanged({isTocOpened}) {
    this.opened = isTocOpened;
    trackEvent({
      category: 'Site-Wide Custom Events',
      action: 'click',
      label: 'ToC',
      value: isTocOpened ? 1 : 0,
    });
  }
}

customElements.define('web-table-of-contents-button', TableOfContentsButton);
