/**
 * @fileoverview Shows meta information about a Lighthouse run, including an optional error.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {LH_HOST} from '../../lighthouse-service';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class LighthouseScoresMeta extends BaseElement {
  static get properties() {
    return {
      errorMessage: {type: String},
      url: {type: String},
      auditedOn: {type: Date},
    };
  }

  constructor() {
    super();
    this.errorMessage = null;
    this.url = null;
    this.auditedOn = null;
  }

  firstUpdated() {
    this.setAttribute('aria-label', 'Lighthouse meta information');
  }

  render() {
    const hidden = !this.url || this.errorMessage || !this.auditedOn;

    let auditedOnText = '\u2014'; // em dash
    if (!hidden && this.auditedOn) {
      try {
        const opts = {
          day: 'numeric',
          month: 'short',
          hour: 'numeric',
          minute: 'numeric',
        };
        auditedOnText = new Intl.DateTimeFormat('en-US', opts).format(
          this.auditedOn,
        );
      } catch (err) {
        auditedOnText = this.auditedOn.toLocaleString();
      }
    }

    const encodedUrl = encodeURIComponent(this.url);

    return html`
      <div class="lh-report-meta">
        <span class="lh-report-meta__links" ?hidden="${hidden}">
          <span class="lh-report-meta__lastaudit">
            <span>Last audit:</span> <span>${auditedOnText}</span>
          </span>
          <span>
            <a
              href="${LH_HOST}/lh/html?url=${encodedUrl}"
              title="View latest Lighthouse report"
              class="viewreport lh-report-link gc-analytics-event"
              data-category="web.dev"
              data-label="view lighthouse report"
              data-action="click"
              target="_blank"
              rel="noopener"
              >View Report</a
            >
          </span>
        </span>
        <span class="lh-error-msg">${this.errorMessage}</span>
      </div>
    `;
  }
}

customElements.define('web-lighthouse-scores-meta', LighthouseScoresMeta);
