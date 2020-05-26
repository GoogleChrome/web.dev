/**
 * @fileoverview Element that renders newsletter subscription form.
 */

import {BaseElement} from '../BaseElement';
import {trackEvent} from '../../analytics';
import './_styles.scss';

/**
 * Element that renders newsletter subscription form.
 *
 * @extends {BaseElement}
 * @final
 */
class Subscribe extends BaseElement {
  constructor() {
    super();
    this.checkboxes = ['WebDevNewsletter', 'collects-pii-spii-checkbox'];
    this.needsDoubleOptIn = [
      'AT: Austria',
      'DE: Germany',
      'GR: Greece',
      'LU: Luxembourg',
      'NO: Norway',
    ];
    this.robotName = 'is-it-just-me-or-was-this-form-filled-out-by-a-robot';
    this.processing = false;
    this.submitted = false;
    this.onError = this.onError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.form = this.querySelector('.w-subscribe__form');
    this.subscribeError = this.querySelector('.w-subscribe__error');
    this.subscribeMessage = this.querySelector('.w-subscribe__message');
    this.submissionUrl = this.form.action;
    this.form.addEventListener('submit', this.onSubmit);
  }

  detachedCallback() {
    super.detachedCallback();
    this.form.removeEventListener('submit', this.onSubmit);
  }

  /**
   * @param {FormData} form
   * @return {FormData}
   */
  cleanForm(form) {
    const doubleOptIn = this.needsDoubleOptIn.includes(form.get('Country'));
    this.checkboxes.forEach((checkbox) =>
      form.set(checkbox, doubleOptIn ? 'Unconfirmed' : 'True'),
    );
    form.delete(this.robotName);
    return form;
  }

  postForm(body) {
    return fetch(this.submissionUrl, {
      method: 'POST',
      body,
    }).then((r) => r.json());
  }

  onError(errors) {
    this.subscribeError.textContent = '';
    if (errors) {
      Object.values(errors).forEach((e) => {
        const pTag = document.createElement('p');
        pTag.textContent = typeof e === 'string' ? e : e.join(' ');
        this.subscribeError.appendChild(pTag);
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.processing || this.submitted) {
      return;
    }
    this.processing = true;
    const form = new FormData(e.target);
    const formIsRobot = form.get(this.robotName).length !== 0;

    if (formIsRobot) {
      this.onSuccess(true);
      return;
    }
    const cleanedForm = this.cleanForm(form);

    this.postForm(cleanedForm)
      .then((response) => {
        if (response && response.result === 'accepted') {
          this.onSuccess();
        } else if (response && response.errors) {
          this.onError(response.errors);
        } else {
          this.onError({any: ['Could not submit, please try again.']});
        }
      })
      .catch(() => this.onError({any: ['Could not submit, please try again.']}))
      .finally(() => (this.processing = false));
  }

  onSuccess(isRobot = false) {
    this.submitted = true;
    this.subscribeError.textContent = '';
    this.subscribeMessage.textContent = "Thank you! You're all signed up.";
    this.form.removeEventListener('submit', this.onSubmit);
    this.form.parentElement.removeChild(this.form);
    if (isRobot) {
      return;
    }
    trackEvent({
      category: 'web.dev',
      action: 'submit',
      label: 'subscribe, newsletter',
    });
  }
}

customElements.define('web-subscribe', Subscribe);
