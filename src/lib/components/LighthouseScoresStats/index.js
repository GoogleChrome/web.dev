/**
 * @fileoverview An element which shows a friendly list of failing audits and related guides.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {categories, metrics} from "../LighthouseScoresAudits/lighthouse";
import lhrRuns from "./data";

/* eslint-disable require-jsdoc */
class LighthouseScoresStats extends BaseElement {
  static get properties() {
    return {
      lhrRuns: {type: Array}, // all the Lighthouse runs being shown
      category: {type: String}, // the current chosen category
      disabled: {type: Boolean}, // fades out UI elements for LH run
      demo: {type: Boolean},
    };
  }

  firstUpdated() {
    this.setAttribute("role", "table");
    this.setAttribute("aria-label", "Lighthouse results");
  }

  constructor() {
    super();

    // FIXME: remove before submit
    this.lhrRuns = JSON.parse(lhrRuns);
  }

  /**
   * @param {!Event} e
   * @private
   */
  onCardClick_(e) {
    if (this.category === e.target.value) {
      // clicking on card again clears filter
      this.category = null;
    } else {
      this.category = e.target.value;
    }
    const event = new CustomEvent("category", {
      detail: this.category,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * @param {string} catId
   * @return {!Array<!LighthouseScore>}
   * @export
   */
  getScoresForCategory(catId) {
    const runs = this.lhrRuns || [];
    return runs
      .map((run) => {
        const items = run.lhrSlim;
        const item = (items || []).find((item) => item.id === catId);
        if (!item) {
          return null;
        }
        return {
          date: run.auditedOn,
          score: item.score * 100,
        };
      })
      .filter(Boolean);
  }

  /**
   * @return {!Array<!TemplateResult>}
   */
  generateCards_() {
    /**
     * @param {string} id
     * @param {!Array<!LighthouseScore>} scores
     * @return {!TemplateResult}
     */
    const generateGraphs = (id, scores) => {
      if (!scores.length) {
        return html``;
      }
      const medians = []; // FIXME: pass through
      return html`
        <web-sparkline
          id="${id}-score-line"
          class="score-line"
          fill
          showlast
          .values="${scores}"
          .medians="${medians}"
        ></web-sparkline>
      `;
    };

    return categories.map(({id, title}) => {
      const scores = this.getScoresForCategory(id);
      if (!scores.length) {
        scores.push({score: 0, date: new Date().toISOString()});
      }
      const lastScore = scores.slice(-1)[0] || {score: 0};

      return html`
        <label class="lh-score-card">
          <input
            type="radio"
            name="lh-score-category"
            value="${id}"
            .checked=${this.category === id}
            @click=${this.onCardClick_}
          />
          <div class="lh-score-card__header">
            <span
              id="${id}-score-gauge-title"
              class="lh-score-card__title"
              aria-hidden="true"
              >${title}</span
            >
            <web-lighthouse-gauge
              id="${id}-score-gauge"
              aria-labelledby="${id}-score-gauge-title"
              score="${lastScore.score / 100}"
            ></web-lighthouse-gauge>
          </div>
          <div class="lh-score-card__data">
            ${generateGraphs(id, scores)}
          </div>
        </div>
      `;
    });
  }

  scoreLegend_(inline = true) {
    const className = inline ? "lh-score-card" : "";

    return html`
      <div class="${className} lh-score__label">
        <div class="lh-score-card__legend">
          <span>Score scale:</span>
          <span class="lh-score-card__range lh-score--fail" data-first>
            0-49
          </span>
          <span class="lh-score-card__range lh-score--average">50-89</span>
          <span class="lh-score-card__range lh-score--pass">90-100</span>
        </div>
      </div>
    `;
  }

  /**
   * @private
   * @param {?LighthouseLastRunDetail} lhr
   * @return {!TemplateResult}
   */
  generateMetricsTable_(lhr) {
    if (!lhr) {
      return html``;
    }

    const metricToHtml = (metric) => {
      const audit = lhr.audits[metric.id];

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
    return html`
      <div class="lh-metrics-table">${metrics.map(metricToHtml)}</div>
    `;
  }

  render() {
    const lastRun = this.lhrRuns && this.lhrRuns.slice(-1)[0];
    const lhr = lastRun ? lastRun.lhr : null;

    return html`
      <div class="${this.disabled ? "lh-audit-running" : ""}">
        <div class="lh-score-cards ${!lhr ? "lh-score-cards--fade" : ""}">
          <web-progress-bar></web-progress-bar>
          ${this.generateCards_()} ${this.scoreLegend_(true)}
        </div>
        ${this.scoreLegend_(false)} ${this.generateMetricsTable_(lhr)}
      </div>
    `;
  }
}

customElements.define("web-lighthouse-scores-stats", LighthouseScoresStats);
