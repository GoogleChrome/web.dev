/**
 * @fileoverview Element that handles feedback on posts.
 */
import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * Catches feedback submission on posts to submit to Analytics.
 *
 * @extends {BaseElement}
 * @final
 */
class Feedback extends BaseElement {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const result = {};

    Array.from(form.entries()).forEach((entry) => {
      result[entry[0]] = entry[1];
    });
  }

  render() {
    return html`
      <input id="w-feedback__dropdown" type="checkbox" />
      <label class="w-feedback__label" for="w-feedback__dropdown">
        <h2 class="w-details__header">Give feedback</h2>
      </label>
      <form class="w-feedback__form" @submit=${this.submit}>
        <small>All fields optional</small>
        <div class="web-feedback__rows">
          <div class="web-feedback__row">
            <div></div>
            <div>Yes</div>
            <div>No</div>
          </div>

          <div class="web-feedback__row">
            <div id="helpful-label">
              <label>Was this page helpful?</label>
            </div>
            <label>
              <input
                type="radio"
                aria-labelledby="helpful-label yes-label"
                name="Helpfulness"
                value="yes"
              />
            </label>
            <label>
              <input
                type="radio"
                aria-labelledby="helpful-label no-label"
                name="Helpfulness"
                value="no"
              />
            </label>
          </div>

          <div class="web-feedback__row">
            <div id="effective-label">
              <label>Did this page help you complete your goal(s)?</label>
            </div>
            <label>
              <input
                type="radio"
                aria-labelledby="effective-label yes-label"
                name="Effectiveness"
                value="yes"
              />
            </label>
            <label>
              <input
                type="radio"
                aria-labelledby="effective-label no-label"
                name="Effectiveness"
                value="no"
              />
            </label>
          </div>

          <div class="web-feedback__row">
            <div id="complete-label">
              <label>Did this page have the information you needed?</label>
            </div>
            <label>
              <input
                type="radio"
                aria-labelledby="complete-label yes-label"
                name="Completeness"
                value="yes"
              />
            </label>
            <label>
              <input
                type="radio"
                aria-labelledby="complete-label no-label"
                name="Completeness"
                value="no"
              />
            </label>
          </div>

          <div class="web-feedback__row">
            <div id="accuracy-label">
              <label>Was this page's information accurate?</label>
            </div>
            <label>
              <input
                type="radio"
                aria-labelledby="accuracy-label yes-label"
                name="Accuracy"
                value="yes"
              />
            </label>
            <label>
              <input
                type="radio"
                aria-labelledby="accuracy-label no-label"
                name="Accuracy"
                value="no"
              />
            </label>
          </div>

          <div class="web-feedback__row">
            <div id="readable-label">
              <label>Was this page easy to read?</label>
            </div>
            <label>
              <input
                type="radio"
                aria-labelledby="readable-label yes-label"
                name="Readability"
                value="yes"
              />
            </label>
            <label>
              <input
                type="radio"
                aria-labelledby="readable-label no-label"
                name="Readability"
                value="no"
              />
            </label>
          </div>
        </div>

        <div class="w-text--center">
          <button class="w-button w-button--primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    `;
  }
}

customElements.define('web-feedback', Feedback);
