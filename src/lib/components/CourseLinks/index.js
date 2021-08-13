/*
 * Copyright 2021 Google LLC
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
 * @fileoverview A custom element to track the user's progress using
 * localstorage, and report progress using analytics.
 *
 * We inline this element into the head of the document to avoid FOUC because
 * it needs to read from localstorage and then modify its children.
 */

/**
 * @typedef {object} Course
 * @property {string[]} pages
 * @property {string} percent
 */

/** @type {Course} */
const initialCourse = {pages: [], percent: '0'};

class CourseLinks extends HTMLElement {
  constructor() {
    super();

    // Add a slot that is basically a cheap MutationObserver
    // We use this to listen for when children are added or removed.
    this.attachShadow({mode: 'open'});
    const slot = document.createElement('slot');
    this.shadowRoot.appendChild(slot);
    slot.addEventListener('slotchange', this.onSlotChange);
  }

  /**
   * Get the user's overall course progress from localstorage.
   * This returns an object where each string key represents a different course.
   * Example: {css: {pages: ['intro', ...], percent: 10}, pwa: {...}}
   * @returns {Object.<string, Course>}
   */
  getProgress = () => {
    let progress;
    try {
      progress = JSON.parse(localStorage['webdev_course_progress']);
    } catch (e) {
      progress = {};
    }
    return progress;
  };

  /**
   * Called when the element's children are first parsed.
   * This will set attributes on the children so they render correctly
   * and will track the user's progress in GA.
   */
  onSlotChange = () => {
    const children = Array.from(this.children);
    const currentUrl = this.getAttribute('data-current');
    const courseKey = this.getAttribute('data-course-key');

    // Get the user's progress from localstorage and update it.
    const progress = this.getProgress();
    const course = progress[courseKey] || {...initialCourse};
    // Find every anchor that the user has already visited and set an attribute
    // on it so it renders a checkmark.
    children.forEach((child) => {
      if (course.pages && course.pages.includes(child.getAttribute('href'))) {
        child.setAttribute('data-complete', 'true');
      }
      return child;
    });

    this.trackProgress(children, currentUrl, course, courseKey);
  };

  /**
   * Update the user's progress in localstorage and fire analytics.
   * @param {Element[]} children
   * @param {string} currentUrl
   * @param {Course} course
   * @param {string} courseKey
   */
  trackProgress = (children, currentUrl, course, courseKey) => {
    // Add the user's current page to the set of pages already visited.
    // We use a Set here to avoid duplicate pages.
    // We'll compare newPages to oldPages to figure out how far they
    // have progressed.
    const oldPages = new Set(course.pages);
    oldPages.add(currentUrl);
    const newPages = Array.from(oldPages);

    // Bucket the user's progress into increments of 10.
    // For each 10%+ bucket jump, fire an analytics event.
    // e.g. If there are 21 modules, and the user is on the 10th module, and
    // clicks three more modules, the events will look like
    // this:
    // Math.floor((10/21) * 10) * 10 == 40
    // Math.floor((11/21) * 10) * 10 == 50 (fire analytics event)
    // Math.floor((12/21) * 10) * 10 == 50
    // Math.floor((13/21) * 10) * 10 == 60 (fire analytics event)
    // Note we're using integers to represent percents instead of decimals to
    // avoid issues with floating point arithmetic.
    const oldPercent = parseInt(course.percent, 10);
    const newPercent =
      Math.floor((newPages.length / children.length) * 10) * 10;

    // Fire analytics if there's been a 10%+ bucket jump.
    if (ga && newPercent - oldPercent >= 10) {
      ga('send', 'event', {
        eventCategory: 'Course Events',
        eventAction: `course: ${courseKey} progress`,
        eventLabel: newPercent.toString(),
      });
    }

    // Write everything back to localstorage using the data-course-key
    // to identify which course it came from.
    //
    // If a user has visited multiple courses, then we need to preserve
    // their progress, so we merge the new progress with their saved state.
    let updatedProgress = this.getProgress();
    updatedProgress = Object.assign({}, updatedProgress, {
      [courseKey]: {
        pages: newPages,
        percent: newPercent,
      },
    });

    try {
      localStorage['webdev_course_progress'] = JSON.stringify(updatedProgress);
    } catch (e) {
      // Fail gracefully with a console log.
      // We don't want to cause a runtime error here and possibly disrupt
      // the rest of the JS on the page since tracking progress isn't a
      // critical feature.
      console.warn(`Failed to write course status to localstorage.`);
    }
  };
}

customElements.define('course-links', CourseLinks);
