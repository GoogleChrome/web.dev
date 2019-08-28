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

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import "../ProfileSwitcherContainer";
import {openSideNav} from "../../actions";

class Header extends BaseElement {
  constructor() {
    super();
    this.prerenderedChildren_ = null;
  }

  render() {
    if (!this.prerenderedChildren_) {
      this.prerenderedChildren_ = [];
      for (const child of this.children) {
        this.prerenderedChildren_.push(child);
      }
    }
    return html`
      <button class="web-header__hamburger-btn" aria-label="menu"></button>

      <a
        href="/"
        class="gc-analytics-event"
        data-category="Site-Wide Custom Events"
        data-label="Site logo"
      >
        <img class="web-header__logo" src="/images/lockup.svg" alt="web.dev" />
      </a>

      <div class="web-header__middle">
        <div class="web-header__links">
          ${this.prerenderedChildren_}
        </div>
      </div>

      <web-profile-switcher-container></web-profile-switcher-container>
    `;
  }

  firstUpdated() {
    this.hamburgerBtn = this.querySelector(".web-header__hamburger-btn");
    this.hamburgerBtn.addEventListener("click", openSideNav);
  }
}

customElements.define("web-header", Header);
