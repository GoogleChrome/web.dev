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

/* eslint lit-a11y/click-events-have-key-events: 0 */

import {BaseStateElement} from '../BaseStateElement';
import 'wicg-inert';
import {closeNavigationDrawer} from '../../actions';

export const NAVIGATION_DRAWER_TYPE = {
  standard: 'standard',
  modal: 'modal',
};

export class NavigationDrawer extends BaseStateElement {
  static get properties() {
    return {
      type: {type: String, reflect: true},
      open: {type: Boolean, reflect: true},
      animating: {type: Boolean, reflect: true},
    };
  }

  set open(val) {
    if (this._open === val) {
      return;
    }

    const oldVal = this._open;
    this._open = val;
    this.animating = true;
    if (this._open) {
      document.addEventListener('keyup', this.onKeyUp);
    }
    this.addEventListener('transitionend', this.onTransitionEnd);
    this.requestUpdate('open', oldVal);
  }

  get open() {
    return this._open;
  }

  constructor() {
    super();

    this.type = null;
    this._open = false;
    this.animating = false;
    this.startX_ = 0;
    this.currentX_ = 0;
    this.touchingSideNav_ = false;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.drag = this.drag.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  connectedCallback() {
    this.tabIndex = -1;

    if (this.type === NAVIGATION_DRAWER_TYPE.modal) {
      this.inert = true;
    }

    /** @type HTMLElement */
    this.drawerContainer = this.querySelector('[data-drawer-container]');
    /** @type HTMLElement */
    this.closeBtn = this.querySelector('[data-drawer-close-button]');

    this.addEventListeners();
    super.connectedCallback();
  }

  addEventListeners() {
    this.drawerContainer.addEventListener('click', this.onBlockClicks);
    this.closeBtn.addEventListener('click', closeNavigationDrawer);
    this.addEventListener('click', closeNavigationDrawer);
    this.addEventListener('touchstart', this.onTouchStart, {passive: true});
    this.addEventListener('touchmove', this.onTouchMove, {passive: true});
    this.addEventListener('touchend', this.onTouchEnd);
  }

  onStateChanged({isNavigationDrawerOpen, currentUrl}) {
    this.open = isNavigationDrawerOpen;

    if (currentUrl) {
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
  }

  onTouchStart(e) {
    if (!this.open || this.animating) {
      return;
    }

    this.startX_ = e.touches[0].pageX;
    this.currentX_ = this.startX_;

    this.touchingSideNav_ = true;
    requestAnimationFrame(this.drag);
  }

  onTouchMove(e) {
    if (!this.touchingSideNav_) {
      return;
    }

    this.currentX_ = e.touches[0].pageX;
  }

  onTouchEnd() {
    if (!this.touchingSideNav_) {
      return;
    }

    this.touchingSideNav_ = false;

    const translateX = Math.min(0, this.currentX_ - this.startX_);
    this.drawerContainer.style.transform = '';

    if (translateX < 0) {
      closeNavigationDrawer();
    }
  }

  drag() {
    if (!this.touchingSideNav_) {
      return;
    }

    requestAnimationFrame(this.drag);

    const translateX = Math.min(0, this.currentX_ - this.startX_);
    this.drawerContainer.style.transform = `translateX(${translateX}px)`;
  }

  onBlockClicks(e) {
    // When the NavigationDrawer is expanded we use a ::before element to render
    // the overlay. Because the ::before element is a child of NavigationDrawer,
    // and covers the entire page, we add a listener to NavigationDrawer to see
    // if it was clicked on.
    // If a link within the NavigationDrawer was clicked, we allow the click to
    // happen so the router can know about it.
    // If the NavigationDrawer's container was clicked, we block the click so
    // the NavigationDrawer won't collapse.
    // If the click was outside of the container/on the overlay, we close the
    // NavigationDrawer.
    const link = e.target.closest('a');
    if (!link) {
      e.stopPropagation();
    }
  }

  onTransitionEnd(e) {
    if (e.target !== this) {
      return;
    }

    this.animating = false;
    // If the NavigationDrawer is expanded we need to move focus into the element so
    // folks using a screen reader or switch can access it.
    if (this.open) {
      this.focus();
    } else {
      // When the NavigationDrawer is collapsed, we need to restore focus to the
      // hamburger button in the header. It might be more techincally pure to
      // use a unistore action for this, but it feels like a lot of ceremony
      // for a small behavior.
      /** @type {import('../Header').Header} */
      const webHeader = document.querySelector('web-header');
      if (webHeader) {
        webHeader.manageFocus();
      }
    }
    this.inert = !this.open;
    this.removeEventListener('transitionend', this.onTransitionEnd);
  }

  onKeyUp(e) {
    if (e.key === 'Escape') {
      closeNavigationDrawer();
      document.removeEventListener('keyup', this.onKeyUp);
    }
  }
}

customElements.define('web-navigation-drawer', NavigationDrawer);
