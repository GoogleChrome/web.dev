/**
 * @fileoverview An element which shows a friendly list of failing audits and related guides.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {categories} from "../LighthouseScoresAudits/lighthouse";
import lhrRuns from "./data";

/* eslint-disable require-jsdoc */
class LighthouseScoresStats extends BaseElement {
  static get properties() {
    return {
      lhrRuns: {type: Array}, // all the Lighthouse runs being shown
      demo: {type: Boolean},
    };
  }

  firstUpdated() {
    this.setAttribute("role", "table");
    this.setAttribute("aria-label", "Lighthouse audit results");
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
    // let target = event.target;
    // while (target && target.classList) {
    //   if (target.classList.contains("lh-score-card")) {
    //     this.selectNewCard_(target);
    //     break;
    //   }
    //   target = target.parentNode;
    // }
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
          console.warn(`No Lighthouse reports for "${this.url}".`);
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
        <div
          class="lh-score-card"
          @click="${this.onCardClick_}"
          data-category="${id}"
        >
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

  render() {
    const auditRunning = false;
    const lastRun = this.lhrRuns && this.lhrRuns.slice(-1)[0];
    const lhr = lastRun ? lastRun.lhr : null;

    return html`
      <div class="${auditRunning ? "lh-audit-running" : ""}">
        <div class="lh-score-cards ${!lhr ? "lh-score-cards--fade" : ""}">
          <web-progress-bar></web-progress-bar>
          ${this.generateCards_()} ${this.scoreLegend_(true)}
        </div>
        ${this.scoreLegend_(false)}
        <div class="lh-metrics-table"></div>
      </div>
    `;
  }
}

customElements.define("web-lighthouse-scores-stats", LighthouseScoresStats);
