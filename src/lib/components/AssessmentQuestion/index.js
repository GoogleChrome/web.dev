import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class AssessmentQuestion extends BaseElement {
  static get properties() {
    return {
      state: {type: String, reflect: true},
    };
  }

  constructor() {
    super();
    this.state = "initial";
    this.prerenderedChildren = null;

    this.updateResponseComponents = this.updateResponseComponents.bind(this);
    this.checkNextQuestion = this.checkNextQuestion.bind(this);
    this.requestNextQuestionNav = this.requestNextQuestionNav.bind(this);
    this.requestAssessmentReset = this.requestAssessmentReset.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];

      for (const child of this.children) {
        this.prerenderedChildren.push(child);
      }
    }

    /* eslint-disable indent */
    return html`
      <div class="web-question__content">
        ${this.prerenderedChildren}
      </div>
      <div class="web-question__footer">
        <span></span>
        <button
          @click="${this.onSubmit}"
          class="w-button w-button--primary"
          ?disabled="${this.state !== "initial" && this.state !== "checked"
            ? false
            : true}"
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

  // Update question state based on state of response components.
  // Stop updating question state as soon as any response component reports
  // that it's answered incorrectly.
  // (If any part of the question is wrong, the whole question is wrong.)
  get responseComponentUpdated() {
    const responseComponents = this.querySelectorAll("[data-role=response]");

    for (const component of responseComponents) {
      this.state = component.state;
      if (component.state === "answeredInCorrectly") return;
    }
  }

  onSubmit(e) {
    switch (this.state) {
      case "answeredCorrectly":
        this.updateResponseComponents();
        this.state = "completed";
        break;
      case "answeredIncorrectly":
        this.updateResponseComponents();
        this.state = "checked";
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

  // Update CTA label based on question state.
  get ctaLabel() {
    switch (this.state) {
      default:
      case "initial":
        return "Check";
      case "checked":
        return "Recheck";
      case "completed":
        const nextQuestion = this.checkNextQuestion();

        if (nextQuestion) return "Next";
        return "Reset quiz";
    }
  }

  updateResponseComponents() {
    const responseComponents = this.querySelectorAll("[data-role=response]");

    for (const component of responseComponents) {
      component.submitOptions();
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
    // TODO
  }
}

customElements.define("web-question", AssessmentQuestion);
