/**
 * @fileoverview Element that renders newsletter subscription form.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {countries} from "./countries";

/**
 * Element that renders newsletter subscription form.
 *
 * @extends {BaseElement}
 * @final
 */
class SubscribeForm extends BaseElement {
  static get properties() {
    return {
      errors: {
        type: Object,
      },
      submitted: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.checkboxes = ["WebDevNewsletter", "collects-pii-spii-checkbox"];
    this.needsDoubleOptIn = [
      "AT: Austria",
      "DE: Germany",
      "GR: Greece",
      "LU: Luxembourg",
      "NO: Norway",
    ];
    this.robotName = "is-it-just-me-or-was-this-form-filled-out-by-a-robot";
    this.submissionUrl =
      "https://services.google.com/fb/submissions/591768a1-61a6-4f16-8e3c-adf1661539da/";
    this.processing = false;
    this.submitted = false;
    this.id = "subscribe";
  }

  /**
   * @param {FormData} form
   * @return {FormData}
   */
  cleanForm(form) {
    const country = form.get("Country");
    this.checkboxes.forEach((box) => {
      const optedIn = this.needsDoubleOptIn.includes(country)
        ? "Unconfirmed"
        : "True";
      form.set(box, optedIn);
    });

    form.append("LanguagePreference", "en-US");
    form.delete(this.robotName);

    return form;
  }

  submit(body) {
    return fetch(this.submissionUrl, {
      method: "POST",
      body,
    }).then((r) => r.json());
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.processing === false && this.submitted === false) {
      this.processing = true;
      this.errors = undefined;
      const form = new FormData(e.target);
      const formIsRobot = form.get(this.robotName).length !== 0;

      if (!formIsRobot) {
        const cleanedForm = this.cleanForm(form);
        this.submit(cleanedForm)
          .then((response) => {
            if (response && response.result === "accepted") {
              this.submitted = true;
            } else if (response && response.errors) {
              this.errors = response.errors;
            } else {
              this.errors = {any: ["Could not submit, please try again."]};
            }
          })
          .catch(
            () =>
              (this.errors = {any: ["Could not submit, please try again."]}),
          )
          .finally(() => (this.processing = false));
      } else {
        this.submitted = true;
      }
    }

    return false;
  }

  renderForm() {
    let errorMessage;

    if (this.errors) {
      const errorMessages = Object.values(this.errors).map(
        (e) =>
          html`
            <p>${typeof e === "string" ? e : e.join(" ")}</p>
          `,
      );
      errorMessage = html`
        <div class="web-subscribe-error">
          ${errorMessages}
        </div>
      `;
    }

    const countriesOptions = countries.map((country) => {
      return country[1] === "United States"
        ? html`
            <option selected value="${country[0]}">${country[1]}</option>
          `
        : html`
            <option value="${country[0]}">${country[1]}</option>
          `;
    });

    return this.submitted
      ? ""
      : html`
          <form @submit="${this.handleSubmit}">
            <div class="web-subscribe-fields">
              <div class="web-subscribe-field">
                <input
                  id="sub-firstname"
                  name="FirstName"
                  placeholder="First Name"
                  required
                  type="text"
                />
              </div>
              <div class="web-subscribe-field">
                <input
                  id="sub-lastname"
                  name="LastName"
                  placeholder="Last Name"
                  required
                  type="text"
                />
              </div>
            </div>
            <div class="web-subscribe-field">
              <input
                id="sub-email"
                name="EmailAddress"
                placeholder="Your Email"
                required
                type="email"
              />
            </div>
            <div class="web-subscribe-field">
              <div class="web-subscribe-border">
                <select id="sub-country" name="Country" required>
                  ${countriesOptions}
                </select>
              </div>
            </div>
            <div class="web-subscribe-field">
              <label for="sub-newsletter">
                <input
                  id="sub-newsletter"
                  name="WebDevNewsletter"
                  required
                  type="checkbox"
                  value="True"
                />
                <span>Add me to the web.dev mailing list.</span>
              </label>
            </div>
            <div class="web-subscribe-field">
              <label for="sub-pii-spii">
                <input
                  id="sub-pii-spii"
                  name="collects-pii-spii-checkbox"
                  required
                  type="checkbox"
                  value="True"
                />
                <span
                  >I accept Google's
                  <a
                    href="//www.google.com/intl/en/policies/terms/"
                    target="_blank"
                    >Terms and Conditions</a
                  >
                  and acknowledge that my information will be used in accordance
                  with Google's
                  <a
                    href="//www.google.com/intl/en/policies/privacy/"
                    target="_blank"
                    >Privacy Policy</a
                  >.
                </span>
              </label>
            </div>
            <div class="web-subscribe-field">
              <input
                type="text"
                name="${this.robotName}"
                style="position: absolute; left: -100vw; top: -100vh; z-index: -100;"
                tabindex="-1"
              />
              <button class="w-button w-button--primary" type="submit">
                Subscribe
              </button>
            </div>
          </form>
          ${errorMessage}
        `;
  }

  render() {
    const message = this.submitted
      ? "Thank you! You're all signed up."
      : "Stay up to date with the latest about web platform.";

    return html`
      <div>
        <h1>Become a better web developer.</h1>
        <p>${message}</p>
        <p></p>
      </div>

      ${this.renderForm()}
    `;
  }
}

customElements.define("web-subscribe-form", SubscribeForm);
