import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import "../SelectGroup";

/* eslint-disable require-jsdoc */
class ResponseMultipleChoice extends BaseElement {
  static get properties() {
    return {
      cardinality: {type: String},
      columns: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.options = null;
  }

  render() {
    const cardinality = this.cardinality.trim();
    let selectType = "radio";
    let min = 1;
    let max = null;

    // TODO: move to separate function
    // TODO: add max and min select
    if (cardinality === "1") {
    } else if (/^\d+$/.test(cardinality)) {
      selectType = "checkbox";
      min = parseInt(cardinality);
      max = min;
    } else if (/^\d+\+$/.test(cardinality)) {
      selectType = "checkbox";
      min = parseInt(cardinality);
    } else if (/^\d-\d+$/.test(cardinality)) {
      selectType = "checkbox";
      [min, max] = cardinality.split("-"); // TODO: Check this works
      [min, max] = [parseInt(min), parseInt(max)]; // TODO: Check this works
    }

    if (!this.prerenderedChildren) {
      this.options = [];

      for (const child of this.children) {
        if (child.getAttribute("data-role") === "option") {
          this.options.push(child);
        }
      }
    }

    return html`
      <web-select-group
        type="${selectType}"
        prefix="web-response-mc"
        ?columns="${this.columns}"
        >${this.options}</web-select-group
      >
    `;
  }
}

customElements.define("web-response-mc", ResponseMultipleChoice);
