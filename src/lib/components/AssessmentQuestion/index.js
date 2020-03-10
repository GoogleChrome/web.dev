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
      state: {type: String, reflect: true},
      height: {attribute: "question-height"},
    };
  }

  constructor() {
    super();
    this.state = "unanswered";
    this.prerenderedChildren = null;
    this.ctaLabel = "Check";
    this.idSalt = BaseElement.generateIdSalt("web-question-");

    this.updateResponseComponents = this.updateResponseComponents.bind(this);
    this.checkNextQuestion = this.checkNextQuestion.bind(this);
    this.requestNextQuestionNav = this.requestNextQuestionNav.bind(this);
    this.requestAssessmentReset = this.requestAssessmentReset.bind(this);
    this.responseComponentUpdated = this.responseComponentUpdated.bind(this);
    this.reset = this.reset.bind(this);
    this.toggleFooterButtons = this.toggleFooterButtons.bind(this);
    this.onFeedbackModalClosed = this.onFeedbackModalClosed.bind(this);
    this.onFeedbackDrawerClosed = this.onFeedbackDrawerClosed.bind(this);
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
        <button
          @click="${this.onFeedbackModalOpen}"
          class="w-button web-assessment__button web-assessment-feedback-container__open-modal gc-analytics-event"
          data-category="Self-assessments"
          data-label="feedbackOpen, web-question-${this.idSalt}"
        >
          Report issue
        </button>
        <button
          @click="${this.onFeedbackDrawerOpen}"
          class="w-button web-assessment__button web-assessment-feedback-container__open-drawer gc-analytics-event"
          data-category="Self-assessments"
          data-label="feedbackOpen, web-question-${this.idSalt}"
        >
          Report issue
        </button>
        <button
          @click="${this.onSubmit}"
          class="w-button w-button--primary web-assessment__button web-question__cta gc-analytics-event"
          data-category="Self-assessments"
          data-label="CTA, web-question-${this.idSalt}"
          ?disabled="${this.state !== "unanswered" ? false : true}"
        >
          ${this.ctaLabel}
        </button>
        <web-assessment-feedback-container
          class="web-modal"
          aria-label="Question feedback form"
          parent-modal="web-assessment"
        ></web-assessment-feedback-container>
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

    // Listen for close event from child feedback form to reenable footer buttons
    const feedbackForm = this.querySelector(
      "web-assessment-feedback-container",
    );
    feedbackForm.addEventListener("close-modal", this.onFeedbackModalClosed);
    feedbackForm.addEventListener("close-drawer", this.onFeedbackDrawerClosed);
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

  // Open question feedback form
  onFeedbackModalOpen(e) {
    const feedbackForm = this.querySelector(
      "web-assessment-feedback-container",
    );

    this.toggleFooterButtons(true);
    feedbackForm.open = true;
  }

  // Re-enable question footer buttons when feedback form is closed
  onFeedbackModalClosed() {
    const openFormButton = this.querySelector(
      ".web-assessment-feedback-container__open-modal",
    );

    this.toggleFooterButtons(false);
    openFormButton.focus();
  }

  onFeedbackDrawerOpen(e) {
    const feedbackForm = this.querySelector(
      "web-assessment-feedback-container",
    );

    this.toggleFooterButtons(true);
    feedbackForm.openDrawer = true;
  }

  onFeedbackDrawerClosed() {
    const openFormButton = this.querySelector(
      ".web-assessment-feedback-container__open-drawer",
    );

    this.toggleFooterButtons(false);
    openFormButton.focus();
  }

  toggleFooterButtons(state) {
    const footerButtons = this.querySelectorAll(
      ".web-question__footer > button",
    );

    for (const button of footerButtons) {
      button.disabled = state;
    }
  }

  updateResponseComponents() {
    const responseComponents = this.querySelectorAll("[data-role=response]");

    for (const responseComponent of responseComponents) {
      responseComponent.submitResponse();
    }
  }

  // This should probably emit a custom event that the Tabs component responds to.
  checkNextQuestion() {
    const panel = this.closest(".web-tabs__panel");

    if (!panel) return;

    const nextPanel = panel.nextElementSibling;

    return nextPanel;
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
