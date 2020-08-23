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

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {store} from '../../store';
import 'wicg-inert';
import {collapseSideNav} from '../../actions';
import './_styles.scss';

class SideNav extends BaseElement {
  static get properties() {
    return {
      animatable: {type: Boolean, reflect: true},
      expanded: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();

    this.inert = true;
    this.animatable = false;
    this.expanded_ = false;
    this.startX_ = 0;
    this.currentX_ = 0;
    this.touchingSideNav_ = false;
    this.prerenderedChildren_ = null;

    this.onCloseSideNav = this.onCloseSideNav.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.drag = this.drag.bind(this);
    this.onStateChanged = this.onStateChanged.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  render() {
    if (!this.prerenderedChildren_) {
      this.prerenderedChildren_ = [];
      for (const child of this.children) {
        this.prerenderedChildren_.push(child);
      }
    }
    return html`
      <nav @click="${this.onBlockClicks}" class="web-side-nav__container">
        <div class="web-side-nav__header">
          <button
            @click="${this.onCloseSideNav}"
            data-icon="close"
            class="w-button--icon w-button--round web-side-nav__hide"
            aria-label="Close"
          >
            <span class="w-tooltip">Close</span>
          </button>
          <a
            href="/"
            class="gc-analytics-event"
            data-category="Site-Wide Custom Events"
            data-label="Site logo"
          >
            <img
              class="web-side-nav__logo"
              src="/images/lockup.svg"
              alt="web.dev"
            />
          </a>
        </div>
        ${this.prerenderedChildren_}
      </nav>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.tabIndex = -1;
    store.subscribe(this.onStateChanged);
  }

  firstUpdated() {
    /** @type HTMLElement */
    this.sideNavContainerEl = this.querySelector('.web-side-nav__container');
    this.addEventListeners();
    this.onStateChanged();
    this.classList.remove('unresolved');
  }

  addEventListeners() {
    this.addEventListener('click', this.onCloseSideNav);
    this.addEventListener('touchstart', this.onTouchStart, {passive: true});
    this.addEventListener('touchmove', this.onTouchMove, {passive: true});
    this.addEventListener('touchend', this.onTouchEnd);
  }

  onStateChanged({currentUrl} = {currentUrl: null}) {
    const {isSideNavExpanded} = store.getState();
    if (isSideNavExpanded === this.expanded) {
      return;
    }

    this.expanded = isSideNavExpanded;
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
    if (!this.expanded) {
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
    this.sideNavContainerEl.style.transform = '';

    if (translateX < 0) {
      this.onCloseSideNav();
    }
  }

  drag() {
    if (!this.touchingSideNav_) {
      return;
    }

    requestAnimationFrame(this.drag);

    const translateX = Math.min(0, this.currentX_ - this.startX_);
    this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
  }

  onBlockClicks(e) {
    // When the SideNav is expanded we use a ::before element to render the
    // overlay. Because the ::before element is a child of SideNav, and covers
    // the entire page, we add a listener to SideNav to see if it was clicked
    // on.
    // If a link within the SideNav was clicked, we allow the click to happen so
    // the router can know about it.
    // If the SideNav's .web-side-nav__container was clicked, we block the click
    // so the SideNav won't collapse.
    // If the click was outside of the container/on the overlay, we close the
    // SideNav.
    const link = e.target.closest('a');
    if (!link) {
      e.stopPropagation();
    }
  }

  onTransitionEnd() {
    this.animatable = false;
    // If the SideNav is expanded we need to move focus into the element so
    // folks using a screen reader or switch can access it.
    if (this.expanded_) {
      this.focus();
    } else {
      // When the SideNav is collapsed, we need to restore focus to the
      // hamburger button in the header. It might be more techincally pure to
      // use a unistore action for this, but it feels like a lot of ceremony
      // for a small behavior.
      /** @type {import('../Header').Header} */
      const webHeader = document.querySelector('web-header');
      webHeader.manageFocus();
    }
    this.inert = !this.expanded_;
  }

  onCloseSideNav() {
    // It's important to call the closeSideNav() action here instead of just
    // setting expanded = false.
    // The closeSideNav() action will inform other page elements that they
    // should un-inert themselves.
    collapseSideNav();
  }

  onKeyUp(e) {
    if (e.key === 'Escape') {
      collapseSideNav();
      document.removeEventListener('keyup', this.onKeyUp);
    }
  }

  set expanded(val) {
    if (this.expanded_ === val) {
      return;
    }

    const oldVal = this.expanded_;
    this.expanded_ = val;
    this.animatable = true;
    if (this.expanded_) {
      document.addEventListener('keyup', this.onKeyUp);
    }
    this.addEventListener('transitionend', this.onTransitionEnd, {once: true});
    this.requestUpdate('expanded', oldVal);
  }

  get expanded() {
    return this.expanded_;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
  }
}

customElements.define('web-side-nav', SideNav);
