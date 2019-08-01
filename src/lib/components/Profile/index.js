/**
 * @fileoverview An element which wraps behavior of the Profile.
 */

import rawData from "./data";

/* eslint-disable require-jsdoc */
class Profile extends HTMLElement {
  constructor() {
    super();
    this.firstUpdated = false;
  }

  connectedCallback() {
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

customElements.define("web-profile", Profile);
