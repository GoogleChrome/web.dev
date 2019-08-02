/**
 * @fileoverview Container element for displaying Lighthouse results.
 */

import rawData from "./data";

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

    const lhrRuns = JSON.parse(rawData);
    const lastLhrRun = lhrRuns.slice(-1)[0];
    const lastLhr = lastLhrRun ? lastLhrRun.lhr : null;

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
