import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * Element that renders an assessment question shell.
 * Needs children that extend BaseResponseElement to work corectly.
 *
 * @extends {BaseElement}
 */
export class AssessmentQuestion extends BaseElement {
  static get properties() {
    return {
      id: {type: String, reflect: true},
      state: {type: String, reflect: true},
      height: {type: String, attribute: 'question-height'}, // used in CSS
    };
  }

  constructor() {
    super();
    this.state = 'unanswered';
    this.prerenderedChildren = null;
    this.ctaLabel = 'Check';

    this.responseComponentUpdated = this.responseComponentUpdated.bind(this);
    this.reset = this.reset.bind(this);
    this.height = null;
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];

      for (const child of this.children) {
        this.prerenderedChildren.push(child);
      }
    }

    const heightStyle = this.height ? 'height: ' + this.height + ';' : '';

    /* eslint-disable indent */
    return html`
      <div class="web-question__content" style="${heightStyle}">
        ${this.prerenderedChildren}
      </div>
      <div class="web-question__footer">
        <span></span>
        <button
          @click="${this.onSubmit}"
          class="w-button w-button--primary web-assessment__button web-question__cta gc-analytics-event"
          data-category="Self-assessments"
          data-label="CTA, ${this.id}"
          ?disabled="${this.state === 'unanswered'}"
        >
          ${this.ctaLabel}
        </button>
      </div>
    `;
    /* eslint-enable indent */
  }

  firstUpdated() {
    // Listen to state updates from child response components.
    this.addEventListener('response-update', this.responseComponentUpdated);

    // Listen to contained option selections.
    this.addEventListener('question-option-select', (e) => {
      const ce = /** @type {!CustomEvent} */ (e);
      const {detail: optionIndex, target} = ce;

      // This event comes from the final option that the user selects.
      // Find the index of the response that this input is contained within.
      // We could also use `target.closest("[data-role=response]")` to look _up_ from the option,
      // but we'd still need to find its index.
      let responseIndex = -1;
      /** @type {(import('../ResponseMultipleChoice').ResponseMultipleChoice|import('../ResponseThinkAndCheck').ResponseThinkAndCheck)[]} */
      const responseComponents = Array.from(
        this.querySelectorAll('[data-role=response]'),
      );
      for (let i = 0; i < responseComponents.length; ++i) {
        if (responseComponents[i].contains(/** @type {Element} */ (target))) {
          responseIndex = i;
          break;
        }
      }
      if (responseIndex === -1) {
        return;
      }

      // Send an Analytics event manually. We don't want to pipe through the IDs all the way down
      // to each individual option.
      ga('send', 'event', {
        eventCategory: 'Self-assessments',
        eventAction: 'click',
        eventLabel: `${this.id}-response-${responseIndex}-option-${optionIndex}`,
      });
    });
  }

  // Update question state based on state of response components.
  responseComponentUpdated() {
    /** @type {NodeListOf<(import('../ResponseMultipleChoice').ResponseMultipleChoice|import('../ResponseThinkAndCheck').ResponseThinkAndCheck)>} */
    const responseComponents = this.querySelectorAll('[data-role=response]');
    const stateArr = Array.from(responseComponents).map(({state}) => state);

    if (stateArr.includes('unanswered')) {
      this.state = 'unanswered';
    } else if (stateArr.includes('answeredIncorrectly')) {
      this.state = 'answeredIncorrectly';
    } else {
      this.state = 'answeredCorrectly';
    }
  }

  onSubmit() {
    switch (this.state) {
      case 'answeredCorrectly':
        this.updateResponseComponents();
        this.state = 'completed';
        this.ctaLabel = this.checkNextQuestion() ? 'Next' : 'Reset quiz';
        break;
      case 'answeredIncorrectly':
        this.updateResponseComponents();
        this.state = 'unanswered';
        this.ctaLabel = 'Recheck';

        /** @type import('../Tabs').Tabs */
        const tabs = this.closest('web-tabs');
        /** @type import('../Assessment').Assessment */
        const assessment = this.closest('web-assessment');
        if (tabs) {
          // Focus currently active tab since submit button disables
          tabs.focusTab(tabs.activeTab);
        } else if (assessment) {
          // For singleton questions, focus the parent assessment component
          assessment.focus();
        }
        break;
      case 'completed':
        const nextQuestion = this.checkNextQuestion();

        if (nextQuestion) {
          this.requestNextQuestionNav();
        } else {
          this.requestAssessmentReset();
        }
    }
  }

  updateResponseComponents() {
    /** @type {NodeListOf<(import('../ResponseMultipleChoice').ResponseMultipleChoice|import('../ResponseThinkAndCheck').ResponseThinkAndCheck)>} */
    const responseComponents = this.querySelectorAll('[data-role=response]');

    for (const responseComponent of responseComponents) {
      responseComponent.submitResponse();
    }
  }

  // TODO(samthor): This should maybe emit a custom event that the Tabs component responds to?
  checkNextQuestion() {
    const panel = this.closest('.web-tabs__panel');

    if (!panel) {
      return;
    }

    return panel.nextElementSibling;
  }

  requestNextQuestionNav() {
    const event = new Event('request-nav-to-next');

    this.dispatchEvent(event);
  }

  requestAssessmentReset() {
    const event = new Event('request-assessment-reset', {bubbles: true});

    this.dispatchEvent(event);
  }

  // Helper function to allow other components to reset the question
  // to its unanswered state.
  reset() {
    /** @type {NodeListOf<(import('../ResponseMultipleChoice').ResponseMultipleChoice|import('../ResponseThinkAndCheck').ResponseThinkAndCheck)>} */
    const responseComponents = this.querySelectorAll('[data-role=response]');
    const questionContent = this.querySelector('.web-question__content');

    for (const responseComponent of responseComponents) {
      responseComponent.reset();
    }
    this.ctaLabel = 'Check';
    questionContent.scrollTop = 0;
  }
}

customElements.define('web-question', AssessmentQuestion);
