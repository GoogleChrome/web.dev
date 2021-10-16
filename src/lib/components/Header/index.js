/*
 * Copyright 2019 Google LLC
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
 * @fileoverview A responsive header that can trigger a navigation drawer.
 *
 * This does not inherit from BaseStateElement as it is not a LitElement.
 */

import {store} from '../../store';
import {openNavigationDrawer} from '../../actions';
import {BaseStateElement} from '../BaseStateElement';

export class Header extends BaseStateElement {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    /** @type HTMLButtonElement */
    this.openDrawerBtn = this.querySelector('[data-open-drawer-button]');
    if (this.openDrawerBtn) {
      this.openDrawerBtn.addEventListener('click', openNavigationDrawer);
    }
  }

  disconnectedCallback() {
    if (this.openDrawerBtn) {
      this.openDrawerBtn.removeEventListener('click', openNavigationDrawer);
    }

    store.unsubscribe(this.onStateChanged);
  }

  onStateChanged({isSearchExpanded, currentUrl}) {
    this.classList.toggle('web-header--has-expanded-search', isSearchExpanded);

    // Ensure that the "active" attribute is applied to any matching header
    // link, or to none (for random subpages or articles).
    currentUrl = currentUrl.replace(/"/g, '\\"');
    currentUrl = (currentUrl.match(/^\/\w+\//) || [''])[0];

    const active = this.querySelector('[active]');
    const updated = this.querySelector(`[href="${currentUrl}"]`);

    if (active === updated) {
      return;
    }

    if (active) {
      active.removeAttribute('active');
      active.removeAttribute('aria-current');
    }

    if (updated) {
      updated.setAttribute('active', '');
      updated.setAttribute('aria-current', 'page');
    }
  }

  /**
   * This is called by the NavigationDrawer to return focus to this control when
   * the user closes the NavigationDrawer.
   * This is important for accessibility.
   */
  manageFocus() {
    if (this.openDrawerBtn) {
      this.openDrawerBtn.focus();
    }
  }
}

customElements.define('web-header', Header);
