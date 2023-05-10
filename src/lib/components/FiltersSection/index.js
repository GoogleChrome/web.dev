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
 * @fileoverview handles the events for a modal containing filters
 */
import {BaseElement} from '../BaseElement';

import {clearFilters} from '../../actions';

export class FiltersSection extends BaseElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    const target = event.target;

    // Filters reset
    if (target.hasAttribute('clear-filters')) {
      this.resetFilters();
    }
  }

  resetFilters() {
    clearFilters();
  }
}

customElements.define('filters-section', FiltersSection);
