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

import {BaseElement} from '../BaseElement';
import {trackEvent} from '../../analytics';

/**
 * @fileoverview A drawer displaying the course ToC.
 */

class DrawerCourse extends BaseElement {
  static get properties() {
    return {
      current: {type: String},
    };
  }

  constructor() {
    super();
    this.current = '';
  }

  get courseProgress() {
    let courseProgress;
    try {
      courseProgress = JSON.parse(localStorage['webdev_course_progress']);
    } catch (e) {
      courseProgress = [];
    }
    return courseProgress;
  }

  markAsCompleted(url) {
    trackEvent({
      category: 'Course Events',
      action: 'completed',
      label: url,
    });
    const completed = new Set(this.courseProgress);
    completed.add(url);
    localStorage['webdev_course_progress'] = JSON.stringify(
      Array.from(completed),
    );
  }

  connectedCallback() {
    super.connectedCallback();

    this.childElements = Array.from(this.children).map((child) => {
      if (this.courseProgress.indexOf(child.getAttribute('href')) > -1) {
        child.setAttribute('data-complete', 'true');
      }
      return child;
    });
    this.markAsCompleted(this.current);
  }
}

customElements.define('web-drawer-course', DrawerCourse);
