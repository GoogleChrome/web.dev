/**
 * @fileoverview Element that renders newsletter subscription form.
 */

import {BaseElement} from '../BaseElement';
import {trackError, trackEvent} from '../../analytics';
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
    /** @type {HTMLFormElement} */
    this.form = this.querySelector('.w-subscribe__form');
    /** @type HTMLElement */
    this.subscribeError = this.querySelector('.w-subscribe__error');
    this.subscribeMessage = this.querySelector('.w-subscribe__message');
    this.submissionUrl = this.form?.action;
    this.form?.addEventListener('submit', this.onSubmit);
  }

  detachedCallback() {
    this.form?.removeEventListener('submit', this.onSubmit);
  }

  /**
   * @param {FormData} form
   * @return {FormData}
   */
  cleanForm(form) {
    const doubleOptIn = this.needsDoubleOptIn.includes(
      String(form.get('Country')),
    );
    this.checkboxes.forEach((checkbox) =>
      form.set(checkbox, doubleOptIn ? 'Unconfirmed' : 'True'),
    );
    form.delete(this.robotName);
    return form;
  }

  postForm(body) {
    return fetch(this.submissionUrl || '', {
      method: 'POST',
      body,
    }).then((r) => r.json());
  }

  /**
   *
   * @param {Error} error
   * @param {boolean} useDefault
   */
  onError(error, useDefault = false) {
    if (!this.subscribeError) {
      return;
    }

    const pTag = document.createElement('p');
    const defaultError = new Error('Could not submit, please try again.');
    this.subscribeError.textContent = '';

    pTag.textContent = useDefault
      ? defaultError.message
      : (error || defaultError).message;

    this.subscribeError.appendChild(pTag);

    trackError(error, 'Email form failed to submit because');
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.processing || this.submitted) {
      return;
    }
    this.processing = true;
    const form = new FormData(e.target);
    const formIsRobot = String(form.get(this.robotName)).length !== 0;

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
          const errorMessage = Object.values(response.errors).join(' ');
          this.onError(new Error(errorMessage));
        } else {
          this.onError(new Error(response.result), true);
        }
      })
      .catch((e) => this.onError(e, true))
      .finally(() => (this.processing = false));
  }

  onSuccess(isRobot = false) {
    this.submitted = true;
    this.subscribeError.textContent = '';
    this.subscribeMessage.textContent = `Thank you! You're all signed up.`;
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
