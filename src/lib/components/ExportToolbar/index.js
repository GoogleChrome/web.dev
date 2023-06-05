/*
 * Copyright 2023 Google LLC
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

/**
 * @fileoverview A small flag on the bottom left or center right of
 * the viewport, depending on screen size, messaging that this page
 * is built by Chrome DevRel. Hides on scroll.
 */

import {html} from 'lit';

import {BaseElement} from '../BaseElement';

/**
 * @extends {BaseElement}
 * @final
 */
class ExportToolbar extends BaseElement {
  static get properties() {
    return {
      view: {type: String, reflect: true, attribute: 'view'},
    };
  }

  constructor() {
    super();

    this.$main = document.querySelector('main');
    // The transformed view is below the footer area, as it's just forced into
    // the template. We need to rearrange it to be in the main area.
    this.$transformed = document.querySelector('#exported-markdown');
    document.body.insertBefore(this.$transformed, this.$main);

    this.view =
      localStorage.getItem('web-dev-export-toolbar-view') || 'original';

    this._insertMarkdown();
  }

  /**
   * Plucks the transformed markdown from the template element (where it is
   * to not get rendered) and inserts it in the code element, ready to copy
   */
  _insertMarkdown() {
    const $markdown = this.$transformed.querySelector('template');

    const $code = this.$transformed.querySelector('code');
    console.log($code, $markdown);
    $code.innerText = $markdown.innerHTML;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  detachedCallback() {}

  updated(changedProps) {
    if (changedProps.has('view')) {
      this.$main.hidden = this.view === 'transformed';
      this.$transformed.hidden = this.view === 'original';
    }
  }

  onClickViewToggle(e) {
    const $button = e.target;
    this.view = $button.dataset.view;
    localStorage.setItem('web-dev-export-toolbar-view', this.view);
  }

  render() {
    return html` <header class="export-toolbar__header">
        <div class="export-toolbar__header-container">
          <span class="export-toolbar__header-emoji">🏗️</span>
          <span class="export-toolbar__header-team">Infra</span>
          <span class="export-toolbar__header-name">Export Toolbar</span>
        </div>
      </header>
      <div class="export-toolbar__toggle">
        <div class="export-toolbar__toggle-options">
          <button
            class="export-toolbar__toggle-option ${this.view === 'original'
    ? '--active'
    : ''}"
            data-view="original"
            @click=${this.onClickViewToggle}
          >
            Original presentation
          </button>
          <button
            class="export-toolbar__toggle-option ${this.view === 'transformed'
              ? '--active'
    : ''}"
            data-view="transformed"
            @click=${this.onClickViewToggle}
          >
            Transformed Source
          </button>
        </div>
      </div>`;
  }
}

customElements.define('web-export-toolbar', ExportToolbar);
