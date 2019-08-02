/**
 * @fileoverview Container element for displaying Lighthouse results.
 */

/* eslint-disable require-jsdoc */
class LighthouseScoresContainer extends HTMLElement {
  constructor() {
    super();
    this.firstUpdated = false;
  }

  connectedCallback() {
    // LighthouseScoresContainer expects to find children elements which it manages. It's not a
    // LitElement, so wire things up once it's connected, and keep track of whether it's done.
    if (this.firstUpdated) {
      return;
    }
    this.firstUpdated = true;

    // TODO: There's no data included as of yet.
    const lhrRuns = [];
    const lastLhr = null;

    const stats = this.querySelector("web-lighthouse-scores-stats");
    if (stats) {
      stats.lhrRuns = lhrRuns;
    }

    const metrics = this.querySelector("web-lighthouse-scores-metrics");
    if (metrics) {
      metrics.lhr = lastLhr;
    }

    const audits = this.querySelector("web-lighthouse-scores-audits");
    if (audits) {
      audits.lhr = lastLhr;
    }

    stats.addEventListener("category", (ev) => {
      audits.filteringOn = ev.detail;
    });
  }
}

customElements.define("web-lighthouse-scores-container", LighthouseScoresContainer);
