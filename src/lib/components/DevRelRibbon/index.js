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

import {BaseElement} from '../BaseElement';

/**
 * @extends {BaseElement}
 * @final
 */
class DevRelRibbon extends BaseElement {
  constructor() {
    super();
    this.onIntersection = this.onIntersection.bind(this);
  }

  onIntersection(entries) {
    for (const entry of entries) {
      this.ribbon.classList.toggle('--visible', entry.isIntersecting);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.ribbon = this.querySelector('.devrel-ribbon__ribbon');

    this.observer = new IntersectionObserver(this.onIntersection);
    this.observer.observe(this);
  }

  detachedCallback() {
    this.observer.disconnect();
    this.observer = null;
  }
}

customElements.define('web-devrel-ribbon', DevRelRibbon);
