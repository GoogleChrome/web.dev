import {store} from "../../store";

/**
 * @fileoverview Container element for displaying Lighthouse results.
 */

/* eslint-disable require-jsdoc */
class LighthouseScoresContainer extends HTMLElement {
  constructor() {
    super();

    this.metaElement = null;
    this.statsElement = null;
    this.metricsElement = null;
    this.auditsElement = null;

    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();

    this.onCategoryChanged = (e) => {
      this.auditsElement.filteringOn = e.detail;
    };
  }

  onStateChanged() {
    const {
      lighthouseError,
      lighthouseResult,
      activeLighthouseUrl,
    } = store.getState();

    if (!lighthouseResult) {
      // If there's no result, _don't_ explicitly clear all container elements, and just retain
      // whatever was previously displayed. This lets our users change URLs but not immediately
      // invalidate previous results, which only occurs when Lighthouse is finished running.
      if (this.metaElement) {
        // if lighthouseError is null, no error is displayed
        this.metaElement.errorMessage = lighthouseError;
      }
      return;
    }
    const lastRun = lighthouseResult.runs.slice(-1)[0];
    const lastLhr = lastRun ? lastRun.lhr : null;

    if (this.metaElement) {
      let auditedOn = null;
      if (lastRun) {
        const d = new Date(lastRun.auditedOn);
        if (d.getTime()) {
          auditedOn = d;
        }
      }

      this.metaElement.errorMessage = lighthouseError;
      this.metaElement.auditedOn = auditedOn;
      this.metaElement.url = lighthouseResult.url;
    }
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
    // Unlike other elements, this Container does not inherit from LitElement. We assume that
    // measure/index.njk contains this element wrapping a number of related elements.

    this.metaElement = this.querySelector("web-lighthouse-scores-meta");
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
