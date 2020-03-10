import {html} from "lit-element";
import {ifDefined} from "lit-html/directives/if-defined.js";
import {BaseElement} from "../BaseElement";
import "./_styles.scss";

/**
 * Element that renders a text input or textarea.
 *
 * @extends {BaseElement}
 */
class TextField extends BaseElement {
  static get properties() {
    return {
      autocomplete: {type: String},
      helperText: {attribute: "helper-text"},
      id: {type: String},
      label: {type: String},
      maxlength: {type: Number},
      minlength: {type: Number},
      pattern: {type: String},
      required: {type: Boolean},
      size: {type: Number},
      type: {type: String},
    };
  }

  constructor() {
    super();
    this.idSalt = BaseElement.generateIdSalt("web-text-field-");
    this.id = null;

    this.updateTextFieldState = this.updateTextFieldState.bind(this);
  }

  render() {
    let textfield = {};
    this.id = "web-text-field-" + this.idSalt;

    if (this.type === "input") {
      textfield = this.inputTemplate();
    } else {
      textfield = this.textareaTemplate();
    }

    return html`
      <fieldset class="web-text-field__fieldset">
        ${textfield}
        <label class="web-text-field__label" for="${this.id}">
          ${this.label}
        </label>
        ${this.helperText && this.helperTextTemplate()}
      </fieldset>
    `;
  }

  inputTemplate() {
    /* eslint-disable indent */
    return html`
      <input
        @input="${this.onInput}"
        type="text"
        id="${this.id}"
        class="web-text-field__actual"
        name="web-text-field-${this.idSalt}-content-issue-description"
        autocomplete="${ifDefined(
          this.autocomplete ? this.autocomplete : undefined,
        )}"
        maxlength="${ifDefined(this.maxlength ? this.maxlength : undefined)}"
        minlength="${ifDefined(this.minlength ? this.minlength : undefined)}"
        pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
        size="${ifDefined(this.size ? this.size : undefined)}"
        ?required="${this.required}"
      ></input>
    `;
    /* eslint-enable indent */
  }

  textareaTemplate() {
    /* eslint-disable indent */
    return html`
      <textarea
        @input="${this.onInput}"
        id="${this.id}"
        class="web-text-field__actual web-text-field__actual--textarea"
        name="web-text-field-${this.idSalt}-content-issue-description"
        autocomplete="${ifDefined(
          this.autocomplete ? this.autocomplete : undefined,
        )}"
        maxlength="${ifDefined(this.maxlength ? this.maxlength : undefined)}"
        minlength="${ifDefined(this.minlength ? this.minlength : undefined)}"
        ?required="${this.required}"
      ></textarea>
    `;
    /* eslint-enable indent */
  }

  helperTextTemplate() {
    return html`
      <div class="web-text-field__helper-container">
        <span class="web-text-field__helper">
          ${this.helperText}
        </span>
      </div>
    `;
  }

  onInput(e) {
    this.updateTextFieldState(e);
  }

  // Update text field state based on length of value.
  updateTextFieldState(e) {
    const target = e.currentTarget;
    const charsLength = target.value.length;
    const textFieldPopulatedClass = "web-text-field__actual--populated";

    if (charsLength > 0) {
      target.classList.add(textFieldPopulatedClass);
    } else {
      target.classList.remove(textFieldPopulatedClass);
    }
  }
}

customElements.define("web-text-field", TextField);
