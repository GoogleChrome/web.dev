/**
 * @fileoverview Shows meta information about a Lighthouse run, including an optional error.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {LH_HOST} from "../../lighthouse-service";

/* eslint-disable require-jsdoc */
class LighthouseScoresMeta extends BaseElement {
  static get properties() {
    return {
      errorMessage: {type: String},
      url: {type: String},
      auditedOn: {type: Date},
    };
  }

  firstUpdated() {
    this.setAttribute("aria-label", "Lighthouse meta information");
  }

  render() {
    const hidden = !this.url || this.errorMessage || !this.auditedOn;

    let auditedOnText = "\u2014"; // em dash
    if (!hidden && this.auditedOn) {
      try {
        const opts = {
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "numeric",
        };
        auditedOnText = new Intl.DateTimeFormat("en-US", opts).format(
          this.auditedOn,
        );
      } catch (err) {
        auditedOnText = auditedOn.toLocaleString();
      }
    }

    return html`
      <div class="lh-report-meta">
        <span class="lh-report-meta__links" ?hidden="${hidden}">
          <span class="lh-report-meta__lastaudit">
            <span>Last audit:</span> <span>${auditedOnText}</span>
          </span>
          <a
            href="${LH_HOST}/lh/html?url=${this.url}"
            title="View latest Lighthouse report"
            class="viewreport lh-report-link gc-analytics-event"
            data-category="web.dev"
            data-label="view lighthouse report"
            data-action="click"
            target="_blank"
            rel="noopener"
            >View Report</a
          >
          |
          <a
            href="${LH_HOST}/lh/html?url=${this.url}&download"
            download
            class="downloadreport lh-report-link gc-analytics-event"
            data-category="web.dev"
            data-label="download lighthouse report"
            data-action="click"
            title="Download latest Lighthouse report"
            >Download Report</a
          >
        </span>
        <span class="lh-error-msg">${this.errorMessage}</span>
      </div>
    `;
  }
}

customElements.define("web-lighthouse-scores-meta", LighthouseScoresMeta);
