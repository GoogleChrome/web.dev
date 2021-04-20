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

import {BaseStateElement} from '../BaseStateElement';
import {html} from 'lit-element';
import {markAsCompleted} from '../../actions';

/**
 * @fileoverview A drawer displaying the course ToC.
 */

class DrawerCourse extends BaseStateElement {
  static get properties() {
    return {
      current: {type: String},
    };
  }

  connectedCallback() {
    super.connectedCallback();

    markAsCompleted(this.current);
    this.childElements = Array.from(this.children).map((child) => {
      if (this.courseProgress.indexOf(child.getAttribute('href')) > -1) {
        child.setAttribute('data-complete', 'true');
      }
      return child;
    });
  }

  render() {
    return html`${this.childElements}`;
  }

  onStateChanged({courseProgress}) {
    this.courseProgress = courseProgress;
  }
}

customElements.define('drawer-course', DrawerCourse);
