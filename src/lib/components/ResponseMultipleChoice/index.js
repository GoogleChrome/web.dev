import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";
import "../SelectGroup";

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
    this.optionContents = null;
    this.rationales = null;
  }

  render() {
    const options = [];
    const correctArr = this.correctAnswer.split(",").map(Number);
    const selectionRange = BaseResponseElement.getSelectionRange(
      this.cardinality,
    );
    const selectType = this.cardinality === "1" ? "radio" : "checkbox";
    console.log(selectionRange.min, selectionRange.max);

    // TODO: add max and min select

    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
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

        options.push(
          this.optionTemplate(
            this.optionContents[i],
            this.rationales[i],
            isCorrect,
          ),
        );
      }
    }

    return html`
      ${this.prerenderedChildren}
      <web-select-group
        @click="${this.onClick}"
        type="${selectType}"
        prefix="web-response-mc"
        ?columns="${this.columns}"
      >
        ${options}
      </web-select-group>
    `;
  }

  optionTemplate(content, rationale, isCorrect) {
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

    // Remove the data role on the option content because the SelectGroup
    // label element serves as the option.
    content.removeAttribute("data-role");

    return content;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  onClick(e) {
    this.toggleSelection(e);
    const options = this.querySelectorAll("label");

    for (const option of options) {
      console.log("label");
      option.setAttribute("data-state", "unselected");
    }
  }

  // Allow user to deselect radio buttons.
  // (Helpful for test taking strategies.)
  toggleSelection(e) {
    const radio = e.target;
    const group = radio.closest(".web-response-mc");
    const siblings = group.querySelectorAll(
      ".web-response-mc__input[type=radio]",
    );
    const isChecked = radio.hasAttribute("checked");

    if (isChecked) {
      radio.removeAttribute("checked");
      radio.checked = false;
      // checkAnswered(e);
    } else {
      for (const sibling of siblings) sibling.removeAttribute("checked");
      radio.setAttribute("checked", "");
    }
  }
}

customElements.define("web-response-mc", ResponseMultipleChoice);
