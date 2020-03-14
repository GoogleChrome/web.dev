/**
 * @fileoverview Element that renders newsletter subscription form.
 */

import {BaseElement} from "../BaseElement";
import "./_styles.scss";

/**
 * Element that renders newsletter subscription form.
 *
 * @extends {BaseElement}
 * @final
 */
class Subscribe extends BaseElement {
  constructor() {
    super();

    this.form = this.querySelector("form");
    this.subscribeError = this.querySelector("div#w-subscribe__error");
    this.subscribeMessage = this.querySelector("p#w-subscribe__message");
    this.checkboxes = ["WebDevNewsletter", "collects-pii-spii-checkbox"];
    this.needsDoubleOptIn = [
      "AT: Austria",
      "DE: Germany",
      "GR: Greece",
      "LU: Luxembourg",
      "NO: Norway",
    ];
    this.robotName = "is-it-just-me-or-was-this-form-filled-out-by-a-robot";
    this.submissionUrl = this.form.action;
    this.processing = false;
    this.submitted = false;

    this.form.addEventListener("submit", this.onSubmit.bind(this));
  }

  /**
   * @param {FormData} form
   * @return {FormData}
   */
  cleanForm(form) {
    const doubleOptIn = this.needsDoubleOptIn.includes(form.get("Country"));
    this.checkboxes.forEach((checkbox) =>
      form.set(checkbox, doubleOptIn ? "Unconfirmed" : "True"),
    );
    form.delete(this.robotName);
    return form;
  }

  postForm(body) {
    return fetch(this.submissionUrl, {
      method: "POST",
      body,
    }).then((r) => r.json());
  }

  onError(errors) {
    this.subscribeError.innerHTML = "";
    if (errors) {
      Object.values(errors).forEach((e) => {
        const pTag = document.createElement("p");
        pTag.innerText = typeof e === "string" ? e : e.join(" ");
        this.subscribeError.appendChild(pTag);
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.processing === false && this.submitted === false) {
      this.processing = true;
      const form = new FormData(e.target);
      const formIsRobot = form.get(this.robotName).length !== 0;

      if (!formIsRobot) {
        const cleanedForm = this.cleanForm(form);

        this.postForm(cleanedForm)
          .then((response) => {
            if (response && response.result === "accepted") {
              this.onSuccess();
            } else if (response && response.errors) {
              this.onError(response.errors);
            } else {
              this.onError({any: ["Could not submit, please try again."]});
            }
          })
          .catch(() =>
            this.onError({any: ["Could not submit, please try again."]}),
          )
          .finally(() => (this.processing = false));
      } else {
        this.onSuccess();
      }
    }

    return false;
  }

  onSuccess() {
    this.submitted = true;
    this.subscribeError.innerHTML = "";
    this.subscribeMessage.innerText = "Thank you! You're all signed up.";
    this.form.removeEventListener("submit", this.onSubmit.bind(this));
    this.form.parentElement.removeChild(this.form);
  }
}

customElements.define("web-subscribe", Subscribe);
