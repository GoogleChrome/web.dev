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
 */

import {store} from "../../store";
import {expandSideNav} from "../../actions";

class Header extends HTMLElement {
  connectedCallback() {
    this.hamburgerBtn = this.querySelector(".web-header__hamburger-btn");
    this.hamburgerBtn.addEventListener("click", expandSideNav);

    this.onStateChanged = this.onStateChanged.bind(this);
    store.subscribe(this.onStateChanged);
  }

  disconnectedCallback() {
    store.unsubscribe(this.onStateChanged);
  }

  onStateChanged({isSearchExpanded}) {
    this.classList.toggle("web-header--has-expanded-search", isSearchExpanded);
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

customElements.define("web-header", Header);
