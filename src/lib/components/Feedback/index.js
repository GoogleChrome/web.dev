/**
 * @fileoverview Element that handles feedback on posts.
 */
import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {trackEvent} from '../../analytics';
import './_styles.scss';

/** @types {WebFeedback.Question[]} */
const questions = [
  {text: 'Was this page helpful?', label: 'helpful', name: 'Helpfulness'},
  {
    text: 'Did this page help you complete your goal(s)?',
    label: 'effective',
    name: 'Effectiveness',
  },
  {
    text: 'Did this page have the information you needed?',
    label: 'complete',
    name: 'Completeness',
  },
  {
    text: "Was this page's information accurate?",
    label: 'accuracy',
    name: 'Accuracy',
  },
  {text: 'Was this page easy to read?', label: 'readable', name: 'Readability'},
];

/** @types {WebFeedback.Question[]} */
const conditionalQuestions = [
  {text: 'Does this API meet your needs?', label: 'api', name: 'API'},
];

/**
 * Element that handles feedback on posts to submit to Analytics.
 *
 * @extends {BaseElement}
 * @final
 */
class Feedback extends BaseElement {
  static get properties() {
    return {
      conditionals: {type: String},
    };
  }

  constructor() {
    super();
    this.robotName = 'is-it-just-me-or-was-this-form-filled-out-by-a-robot';
    this.submitted = false;
    this.submit = this.submit.bind(this);
    this.conditionals = '';
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

  /**
   * @param {WebFeedback.Question[]} questions
   * @returns {TemplateResult[]}
   */
  renderQuestions(questions) {
    return questions.map(
      (q) => html`<div class="web-feedback__row">
        <div id="${q.label}-label">${q.text}</div>
        <label>
          <input
            type="radio"
            aria-labelledby="${q.label}-label yes-label"
            name="${q.name}"
            value="1"
          />
        </label>
        <label>
          <input
            type="radio"
            aria-labelledby="${q.label}-label no-label"
            name="${q.name}"
            value="0"
          />
        </label>
      </div>`,
    );
  }

  render() {
    const conditionalLabels = new Set(
      this.conditionals.toLocaleLowerCase().split(','),
    );
    const conditionalQuestionsToDisplay = conditionalLabels.has('all')
      ? conditionalQuestions
      : conditionalQuestions.filter((q) => conditionalLabels.has(q.label));

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
            ${this.renderQuestions(conditionalQuestionsToDisplay)}
            ${this.renderQuestions(questions)}
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
