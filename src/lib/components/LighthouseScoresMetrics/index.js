/**
 * @fileoverview An element which shows key metrics for a Lighthouse run.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {metrics} from "../../lighthouse";

/* eslint-disable require-jsdoc */
class LighthouseScoresMetrics extends BaseElement {
  static get properties() {
    return {
      lhr: {type: Object}, // the single Lighthouse run being shown
    };
  }

  firstUpdated() {
    this.setAttribute("role", "table");
    this.setAttribute("aria-label", "Lighthouse key metrics");
  }

  render() {
    let inner = "";

    if (this.lhr) {
      const metricToHtml = (metric) => {
        const audit = this.lhr.audits[metric.id];

        let label = null;
        if (audit.score >= 0.9) {
          label = "pass";
        } else if (audit.score >= 0.5) {
          label = "average";
        } else {
          label = "fail";
        }

        return html`
          <div class="lh-metrics-table__metric">
            <span>${metric.title}</span>
            <span
              class="lh-metrics-table__score lh-score--${label}"
              aria-label="${label} score: ${audit.displayValue}"
              role="group"
            >
              ${audit.displayValue}
              <span class="lh-metrics-table__icon"></span>
            </span>
          </div>
        `;
      };
      inner = metrics.map(metricToHtml);
    }

    return html`
      <div class="lh-metrics-table">${inner}</div>
    `;
  }
}

customElements.define("web-lighthouse-scores-metrics", LighthouseScoresMetrics);
