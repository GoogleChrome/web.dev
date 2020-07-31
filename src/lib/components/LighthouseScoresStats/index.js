/**
 * @fileoverview An element which shows a number of sparklines and gauges.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {categories} from '../../lighthouse';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class LighthouseScoresStats extends BaseElement {
  static get properties() {
    return {
      lhrRuns: {type: Array}, // all the Lighthouse runs being shown
      category: {type: String}, // the current chosen category
      disabled: {type: Boolean}, // fades out UI elements for LH run
      medians: {type: Array},
    };
  }

  constructor() {
    super();

    this.lhrRuns = [];
    this.disabled = false;
    this.medians = [];
  }

  firstUpdated() {
    this.setAttribute('role', 'table');
    this.setAttribute('aria-label', 'Lighthouse performance over time');
  }

  /**
   * @param {!Event} e
   * @private
   */
  onCardClick(e) {
    if (this.category === e.target.value) {
      // clicking on card again clears filter
      this.category = null;
    } else {
      this.category = e.target.value;
    }
    const event = new CustomEvent('category', {
      detail: this.category,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  /**
   * @param {string} catId
   * @return {!Array<TODO>}
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
   * @return {!Array<!TODO>}
   */
  generateCards() {
    /**
     * @param {string} id
     * @param {!Array<TODO>} scores
     * @return {!TODO}
     */
    const generateGraphs = (id, scores) => {
      if (!scores.length) {
        return html``;
      }
      return html`
        <web-sparkline-chart
          class="score-line"
          fill
          showlast
          .values="${scores}"
          .medians="${this.medians}"
        ></web-sparkline>
      `;
    };

    return categories.map(({id, title}) => {
      const scores = this.getScoresForCategory(id);
      const lastScore = scores.slice(-1)[0] || {score: 0};

      return html`
        <label class="lh-score-card">
          <input
            type="radio"
            name="lh-score-category"
            value="${id}"
            .checked=${this.category === id}
            @click=${this.onCardClick}
          />
          <div class="lh-score-card__header">
            <span
              class="lh-score-card__title"
              aria-hidden="true"
              >${title}</span
            >
            <web-lighthouse-gauge
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

  scoreLegend(inline = true) {
    const className = inline ? 'lh-score-card' : '';

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
    const lastRun = this.lhrRuns && this.lhrRuns.slice(-1)[0];
    const lhr = lastRun ? lastRun.lhr : null;

    return html`
      <div class="${this.disabled ? 'lh-audit-running' : ''}">
        <div class="lh-score-cards ${!lhr ? 'lh-score-cards--fade' : ''}">
          <web-progress-bar></web-progress-bar>
          ${this.generateCards()} ${this.scoreLegend(true)}
        </div>
        ${this.scoreLegend(false)}
      </div>
    `;
  }
}

customElements.define('web-lighthouse-scores-stats', LighthouseScoresStats);
