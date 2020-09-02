/**
 * @fileoverview Element that handles feedback on posts.
 */
import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {trackEvent} from '../../analytics';
import './_styles.scss';

/**
 * Element that handles feedback on posts to submit to Analytics.
 *
 * @extends {BaseElement}
 * @final
 */
class Feedback extends BaseElement {
  constructor() {
    super();
    this.robotName = 'is-it-just-me-or-was-this-form-filled-out-by-a-robot';
    this.submitted = false;
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const formIsRobot = String(form.get(this.robotName)).length !== 0;
    form.delete(this.robotName);
    const formIterable = Array.from(form.entries());

    if (formIterable.length === 0 || this.submitted) {
      return;
    }

    this.submitted = true;
    this.requestUpdate();

    if (formIsRobot) {
      return;
    }

    formIterable.forEach((entry) => {
      trackEvent({
        category: 'Feedback',
        action: 'submit',
        label: entry[0],
        value: Number(entry[1]),
      });
    });
  }

  updated() {
    /** @type {HTMLParagraphElement} */
    const confirmationElement = this.querySelector('.w-feedback__confirmation');
    if (this.submitted && confirmationElement) {
      confirmationElement.focus();
    }
  }

  render() {
    // Because we share CSS with the `app.css` we want this to be in the light DOM
    return html`
      <details class="w-details" open>
        <summary class="w-details__summary">
          <h2 class="w-details__header">Give feedback</h2>
        </summary>
        <div
          class="w-display--flex w-justify-content--center ${!this.submitted &&
          'hidden'}"
        >
          <p
            class="w-feedback__confirmation w-text--center w-force-focus"
            tabindex="-1"
          >
            Thank you for the feedback!
          </p>
        </div>
        <form
          class="w-feedback__form ${this.submitted && 'hidden'}"
          @submit=${this.submit}
        >
          <small>All fields optional</small>
          <div class="web-feedback__rows">
            <div class="web-feedback__row">
              <div></div>
              <div id="yes-label">Yes</div>
              <div id="no-label">No</div>
            </div>

            <div class="web-feedback__row">
              <div id="helpful-label">Was this page helpful?</div>
              <label>
                <input
                  type="radio"
                  aria-labelledby="helpful-label yes-label"
                  name="Helpfulness"
                  value="1"
                />
              </label>
              <label>
                <input
                  type="radio"
                  aria-labelledby="helpful-label no-label"
                  name="Helpfulness"
                  value="0"
                />
              </label>
            </div>

            <div class="web-feedback__row">
              <div id="effective-label">
                Did this page help you complete your goal(s)?
              </div>
              <label>
                <input
                  type="radio"
                  aria-labelledby="effective-label yes-label"
                  name="Effectiveness"
                  value="1"
                />
              </label>
              <label>
                <input
                  type="radio"
                  aria-labelledby="effective-label no-label"
                  name="Effectiveness"
                  value="0"
                />
              </label>
            </div>

            <div class="web-feedback__row">
              <div id="complete-label">
                Did this page have the information you needed?
              </div>
              <label>
                <input
                  type="radio"
                  aria-labelledby="complete-label yes-label"
                  name="Completeness"
                  value="1"
                />
              </label>
              <label>
                <input
                  type="radio"
                  aria-labelledby="complete-label no-label"
                  name="Completeness"
                  value="0"
                />
              </label>
            </div>

            <div class="web-feedback__row">
              <div id="accuracy-label">
                Was this page's information accurate?
              </div>
              <label>
                <input
                  type="radio"
                  aria-labelledby="accuracy-label yes-label"
                  name="Accuracy"
                  value="1"
                />
              </label>
              <label>
                <input
                  type="radio"
                  aria-labelledby="accuracy-label no-label"
                  name="Accuracy"
                  value="0"
                />
              </label>
            </div>

            <div class="web-feedback__row">
              <div id="readable-label">Was this page easy to read?</div>
              <label>
                <input
                  type="radio"
                  aria-labelledby="readable-label yes-label"
                  name="Readability"
                  value="1"
                />
              </label>
              <label>
                <input
                  type="radio"
                  aria-labelledby="readable-label no-label"
                  name="Readability"
                  value="0"
                />
              </label>
            </div>
          </div>

          <div class="w-visually-hidden">
            <label for="${this.robotName}"
              >Congrats on finding this field, I'd recommend you not filling it
              out though...</label
            >
            <input
              type="text"
              id="${this.robotName}"
              name="${this.robotName}"
              tabindex="-1"
            />
          </div>

          <div class="w-text--center w-mt--sm">
            <button class="w-button w-button--primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </details>
    `;
  }
}

customElements.define('web-feedback', Feedback);
