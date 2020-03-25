import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import "./_styles.scss";

/**
 * Element that renders an assessment question shell.
 * Needs children that extend BaseResponseElement to work corectly.
 *
 * @extends {BaseElement}
 */
class AssessmentQuestion extends BaseElement {
  static get properties() {
    return {
      id: {type: String, reflect: true},
      state: {type: String, reflect: true},
      height: {attribute: "question-height"},
    };
  }

  constructor() {
    super();
    this.state = "unanswered";
    this.prerenderedChildren = null;
    this.ctaLabel = "Check";

    this.responseComponentUpdated = this.responseComponentUpdated.bind(this);
    this.reset = this.reset.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];

      for (const child of this.children) {
        this.prerenderedChildren.push(child);
      }
    }

    const heightStyle = this.height ? "height: " + this.height + ";" : "";

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
          ?disabled="${this.state !== "unanswered" ? false : true}"
        >
          ${this.ctaLabel}
        </button>
      </div>
    `;
    /* eslint-enable indent */
  }

  firstUpdated() {
    // Listen to state updates from child response components.
    const responseComponents = this.querySelectorAll("[data-role=response]");
    for (const component of responseComponents) {
      component.addEventListener(
        "response-update",
        this.responseComponentUpdated,
      );
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    const parentAssessment = this.closest("web-assessment");
    // Fetch all elements that are not yet defined.
    const undefinedElements = document.querySelectorAll(":not(:defined)");

    const promises = [...undefinedElements].map((el) =>
      customElements.whenDefined(el.localName),
    );

    // Wait for all elements to be upgraded.
    // Then get the index of the question and set its id.
    await Promise.all(promises);
    const questions = parentAssessment.querySelectorAll("web-question");
    const idx = [...questions].indexOf(this);

    this.id = parentAssessment.id + "-question-" + idx;
  }

  // Update question state based on state of response components.
  responseComponentUpdated() {
    const responseComponents = this.querySelectorAll("[data-role=response]");
    const stateArr = [];

    for (const component of responseComponents) {
      stateArr.push(component.state);
    }
    if (stateArr.includes("unanswered")) {
      this.state = "unanswered";
    } else if (stateArr.includes("answeredIncorrectly")) {
      this.state = "answeredIncorrectly";
    } else {
      this.state = "answeredCorrectly";
    }
  }

  onSubmit(e) {
    switch (this.state) {
      case "answeredCorrectly":
        this.updateResponseComponents();
        this.state = "completed";
        this.ctaLabel = this.checkNextQuestion() ? "Next" : "Reset quiz";
        break;
      case "answeredIncorrectly":
        this.updateResponseComponents();
        this.state = "unanswered";
        this.ctaLabel = "Recheck";
        break;
      case "completed":
        const nextQuestion = this.checkNextQuestion();

        if (nextQuestion) {
          this.requestNextQuestionNav();
        } else {
          this.requestAssessmentReset();
        }
    }
  }

  updateResponseComponents() {
    const responseComponents = this.querySelectorAll("[data-role=response]");

    for (const responseComponent of responseComponents) {
      responseComponent.submitResponse();
    }
  }

  // This should maybe emit a custom event that the Tabs component responds to?
  checkNextQuestion() {
    const panel = this.closest(".web-tabs__panel");

    if (!panel) {
      return;
    }

    return panel.nextElementSibling;
  }

  requestNextQuestionNav() {
    const event = new Event("request-nav-to-next");

    this.dispatchEvent(event);
  }

  requestAssessmentReset() {
    const event = new Event("request-assessment-reset");

    this.dispatchEvent(event);
  }

  // Helper function to allow other components to reset the question
  // to its unanswered state.
  reset() {
    const responseComponents = this.querySelectorAll("[data-role=response]");
    const questionContent = this.querySelector(".web-question__content");

    for (const responseComponent of responseComponents) {
      responseComponent.reset();
    }
    this.ctaLabel = "Check";
    questionContent.scrollTop = 0;
  }
}

customElements.define("web-question", AssessmentQuestion);
