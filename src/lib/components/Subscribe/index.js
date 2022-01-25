/**
 * @fileoverview Element that renders newsletter subscription form.
 */

import {BaseElement} from '../BaseElement';
import {trackError, trackEvent} from '../../analytics';
import './_styles.scss';

const pTagSelector = '.subscribe__error__message';
const hiddenClass = 'hidden-yes';

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
    this.processing = false;
    this.submitted = false;
    this.onError = this.onError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    window['recaptchaSuccess'] = this.captchaCheck.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    /** @type {HTMLFormElement} */
    this.form = this.querySelector('form');
    /** @type HTMLElement */
    this.subscribeError = this.querySelector('.subscribe__error');
    this.subscribeMessage = this.querySelector('.subscribe__message');
    this.submissionUrl = this.form.action;
    if (!this.submissionUrl) {
      console.warn(`No submission URL found for subscribe element.`);
    }
    // Prevent `form.submit()` from being called as it bypasses the event listener
    this.form.submit = () =>
      this.onError(new Error('Please fill out the form'));
    this.form.addEventListener('submit', this.onSubmit);
  }

  detachedCallback() {
    this.form.removeEventListener('submit', this.onSubmit);
    window['recaptchaSuccess'] = null;
  }

  /**
   * Returns captcha passes, displays error if it doesn't.
   *
   * @returns {boolean}
   */
  captchaCheck() {
    const token = window.grecaptcha.getResponse();
    if (token.length === 0) {
      this.onError(new Error('Please complete the reCAPTCHA.'));
      return false;
    }
    return true;
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
    form.delete('g-recaptcha-response');
    return form;
  }

  postForm(body) {
    return fetch(this.submissionUrl, {
      method: 'POST',
      body,
    }).then((r) => r.json());
  }

  /**
   * @param {Error} error
   * @param {boolean} useDefault
   */
  onError(error, useDefault = false) {
    if (!this.subscribeError) {
      console.warn(
        'Could not find area to display error in subscribe element.',
      );
      return;
    }

    const defaultError = new Error('Could not submit, please try again.');
    this.subscribeError.querySelector(pTagSelector).textContent = useDefault
      ? defaultError.message
      : (error || defaultError).message;

    this.subscribeError.classList.toggle(hiddenClass, false);

    trackError(error, 'Email form failed to submit because');
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.processing || this.submitted || !this.captchaCheck()) {
      return;
    }
    this.processing = true;
    const form = new FormData(e.target);
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

  onSuccess() {
    this.submitted = true;
    this.subscribeError.classList.toggle(hiddenClass, true);
    this.subscribeError.querySelector(pTagSelector).textContent = '';
    this.subscribeMessage.textContent = `Thank you! You're all signed up.`;
    this.form.removeEventListener('submit', this.onSubmit);
    this.form.parentElement.removeChild(this.form);
    trackEvent({
      category: 'web.dev',
      action: 'submit',
      label: 'subscribe, newsletter',
    });
  }
}

customElements.define('web-subscribe', Subscribe);
