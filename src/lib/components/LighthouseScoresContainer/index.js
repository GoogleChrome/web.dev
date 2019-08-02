import {store} from "../../store";

/**
 * @fileoverview Container element for displaying Lighthouse results.
 */

/* eslint-disable require-jsdoc */
class LighthouseScoresContainer extends HTMLElement {
  constructor() {
    super();

    this.statsElement = null;
    this.metricsElement = null;
    this.auditsElement = null;

    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();

    this.onCategoryChanged = (ev) => {
      this.auditsElement.filteringOn = ev.detail;
    };
  }

  onStateChanged() {
    const {lighthouseResult, activeLighthouseUrl} = store.getState();
    if (!lighthouseResult) {
      // TODO: clear data?
      return;
    }
    const lastRun = lighthouseResult.runs.slice(-1)[0];
    const lastLhr = lastRun ? lastRun.lhr : null;

    if (this.statsElement) {
      this.statsElement.lhrRuns = lighthouseResult.runs;
      this.statsElement.disabled = Boolean(activeLighthouseUrl);
    }
    if (this.metricsElement) {
      this.metricsElement.lhr = lastLhr;
    }
    if (this.auditsElement) {
      this.auditsElement.lhr = lastLhr;
    }

  }

  connectedCallback() {
    this.statsElement = this.querySelector("web-lighthouse-scores-stats");
    this.metricsElement = this.querySelector("web-lighthouse-scores-metrics");
    this.auditsElement = this.querySelector("web-lighthouse-scores-audits");

    if (this.statsElement && this.auditsElement) {
      this.statsElement.addEventListener("category", this.onCategoryChanged);
    }
  }

  disconnectedCallback() {
    if (this.statsElement) {
      this.statsElement.removeEventListener("category", this.onCategoryChanged);
    }
  }
}

customElements.define(
  "web-lighthouse-scores-container",
  LighthouseScoresContainer,
);
