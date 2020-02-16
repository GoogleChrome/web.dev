import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";
import "../SelectGroup";

/* eslint-disable require-jsdoc */
class ResponseMultipleChoice extends BaseResponseElement {
  static get properties() {
    return {
      cardinality: {type: String},
      columns: {type: Boolean},
      correct: {type: String},
    };
  }

  constructor() {
    super();
    this.prerenderedChildren = null;
    this.optionContents = null;
    this.rationales = null;
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

    return content;
  }

  render() {
    const options = [];
    const correctArr = this.correct.split(",").map(Number);
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
        type="${selectType}"
        prefix="web-response-mc"
        ?columns="${this.columns}"
      >
        ${options}
      </web-select-group>
    `;
  }
}

customElements.define("web-response-mc", ResponseMultipleChoice);
