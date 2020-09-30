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
 * @fileoverview A responsive header that can trigger a side-nav.
 *
 * This does not inherit from BaseStateElement as it is not a LitElement.
 */

import {store} from '../../store';
import {expandSideNav} from '../../actions';

export class Header extends HTMLElement {
  constructor() {
    super();

    this.onStateChanged = this.onStateChanged.bind(this);
  }

  connectedCallback() {
    /** @type HTMLButtonElement */
    this.hamburgerBtn = this.querySelector('.web-header__hamburger-btn');
    this.hamburgerBtn.classList.remove('unresolved');
    this.hamburgerBtn.addEventListener('click', expandSideNav);

    store.subscribe(this.onStateChanged);
  }

  disconnectedCallback() {
    this.hamburgerBtn.removeEventListener('click', expandSideNav);

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
   * This is called by the SideNav to return focus to this control when the
   * user closes the SideNav.
   * This is important for accessibility.
   */
  manageFocus() {
    this.hamburgerBtn.focus();
  }
}

customElements.define('web-header', Header);
