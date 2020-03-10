import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";
import "../SelectGroup";
import "./_styles.scss";

/* eslint-disable require-jsdoc */
class ResponseMultipleChoice extends BaseResponseElement {
  static get properties() {
    return {
      cardinality: {type: String},
      columns: {type: Boolean},
      correctAnswer: {attribute: "correct-answer"},
    };
  }

  constructor() {
    super();
    this.prerenderedChildren = null;
    this.options = null;
    this.optionContents = null;
    this.rationales = null;
    this.minSelections = null;
    this.maxSelections = null;
    this.idSalt = BaseResponseElement.generateIdSalt("web-select-group-");
    this.selectType = null;

    this.onOptionInput = this.onOptionInput.bind(this);
    this.deselectOption = this.deselectOption.bind(this);
    this.updateSelections = this.updateSelections.bind(this);
  }

  render() {
    const correctArr = this.correctAnswer.split(",").map(Number);
    this.selectType = this.cardinality === "1" ? "radio" : "checkbox";
    const selectionRange = BaseResponseElement.getSelectionRange(
      this.cardinality,
    );

    this.minSelections = selectionRange.min;
    this.maxSelections = selectionRange.max;

    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.options = [];
      this.optionContents = [];
      this.rationales = [];

      for (const child of this.children) {
        const role = child.getAttribute("data-role");

        switch (role) {
          case "option":
            this.optionContents.push(child);
            break;
          case "rationale":
            this.rationales.push(child);
            break;
          default:
            this.prerenderedChildren.push(child);
        }
      }

      for (let i = 0; i < this.optionContents.length; i++) {
        const isCorrect = correctArr.includes(i);

        this.options.push(
          this.optionTemplate(
            this.optionContents[i],
            this.rationales[i],
            isCorrect,
            i,
          ),
        );
      }
    }

    return html`
      ${this.prerenderedChildren}
      <fieldset
        class="web-select-group web-response-mc"
        ?columns="${this.columns}"
      >
        <div class="web-select-group__options-wrapper">
          ${this.options}
        </div>
      </fieldset>
    `;
  }

  optionTemplate(content, rationale, isCorrect, i) {
    const flag = document.createElement("div");

    flag.className = "web-response__correctness-flag";
    if (isCorrect) {
      flag.innerHTML = "Correct";
    } else {
      flag.innerHTML = "Incorrect";
    }
    content.prepend(flag);
    rationale.className = "web-response__option-rationale";
    content.append(rationale);

    // Remove data-role since it's being handled by the SelectGroup component.
    content.removeAttribute("data-role");

    return html`
      <label
        class="web-select-group__option web-response-mc__option"
        data-role="option"
        data-category="Site-Wide Custom Events"
        data-label="${this.selectType}, web-select-group-${this.idSalt}-${i}"
      >
        <input
          class="web-select-group__input web-response-mc__input gc-analytics-event"
          type="${this.selectType}"
          name="web-select-group-${this.idSalt}"
          value="${i}"
          data-category="Self-assessments"
          data-label="option ${i}, question"
        />
        <span
          class="web-select-group__selector web-response-mc__selector"
        ></span>
        <span class="web-select-group__option-content">
          ${content}
        </span>
      </label>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    // Wait for the SelectGroup component to be upgraded
    // and then add a click event listener to each option.
    // Source: https://github.com/kenchris/lit-element#element-upgrading
    customElements.whenDefined("web-select-group").then(() => {
      const options = this.querySelectorAll("input");

      for (const option of options) {
        option.addEventListener("input", this.onOptionInput);
      }
    });
  }

  onOptionInput(e) {
    this.updateSelections(e);
    this.enforceCardinality(e);
  }

  updateSelections(e) {
    const options = this.querySelectorAll("[data-role=option]");
    const currentOption = e.target.closest("[data-role=option]");

    if (e.target.checked) {
      if (this.cardinality === "1") {
        for (const option of options) {
          option.removeAttribute("data-selected");
        }
      }
      currentOption.setAttribute("data-selected", "");
    } else {
      currentOption.removeAttribute("data-selected");
    }
  }

  // Helper function to allow BaseResponseElement to deselect options as needed.
  deselectOption(option) {
    option.removeAttribute("data-selected");
    option.querySelector("input").checked = false;
  }
}

customElements.define("web-response-mc", ResponseMultipleChoice);
