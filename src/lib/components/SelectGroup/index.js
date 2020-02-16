import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class SelectGroup extends BaseElement {
  static get properties() {
    return {
      columns: {type: Boolean},
      prefix: {type: String},
      type: {type: String},
    };
  }

  constructor() {
    super();
    this.idSalt = BaseElement.generateIdSalt("web-select-group-");

    this.selectors = null;
  }

  render() {
    let columnsClass = "";

    if (this.columns) {
      columnsClass = "web-select-group__options-wrapper--columns--2";
    }

    if (!this.prefix) this.prefix = "";

    if (!this.selectors) {
      this.selectors = [];

      for (let i = 0; i < this.children.length; i++) {
        this.selectors.push(
          this.selectorTemplate(i, this.children[i], this.type, this.prefix),
        );
      }
    }

    return html`
      <fieldset class="web-select-group ${this.prefix}">
        <div class="web-select-group__options-wrapper ${columnsClass}">
          ${this.selectors}
        </div>
      </fieldset>
    `;
  }

  selectorTemplate(i, content, type, prefix) {
    let labelClass = "";
    let inputClass = "";
    let selectorClass = "";

    if (prefix) {
      labelClass = prefix + "__option";
      inputClass = prefix + "__input";
      selectorClass = prefix + "__selector";
    }

    return html`
      <label
        class="web-select-group__option ${labelClass}"
        data-category="Site-Wide Custom Events"
        data-label="${type}, web-select-group-${this.idSalt}-${i}"
      >
        <input
          class="web-select-group__input ${inputClass}"
          type="${type}"
          name="web-select-group-${this.idSalt}"
          value="${i}"
        />
        <span class="web-select-group__selector ${selectorClass}"></span>
        <span class="web-select-group__option-content">
          ${content}
        </span>
      </label>
    `;
  }
}

customElements.define("web-select-group", SelectGroup);
