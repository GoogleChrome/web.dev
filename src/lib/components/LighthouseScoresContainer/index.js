import {html} from 'lit-element';
import {store} from '../../store';
import {requestFetchReports} from '../../actions';
import {BaseElement} from '../BaseElement';

/**
 * @fileoverview Container element for displaying Lighthouse results.
 */

/* eslint-disable require-jsdoc */
class LighthouseScoresContainer extends BaseElement {
  static get properties() {
    return {
      filteringOn: {type: String}, // the Lighthouse category to filter to, not from state

      lighthouseError: {type: String},
      activeLighthouseUrl: {type: String},
      auditedOn: {type: Date},
      lighthouseResultUrl: {type: String},
      lighthouseResultRuns: {type: Array},
      lighthouseResultLastLhr: {type: Object},
    };
  }

  constructor() {
    super();
    this.onStateChanged = this.onStateChanged.bind(this);
  }

  render() {
    return html`
      <web-lighthouse-scores-meta
        .errorMessage=${this.lighthouseError}
        .auditedOn=${this.auditedOn}
        .url=${this.lighthouseResultUrl}
      ></web-lighthouse-scores-meta>
      <web-lighthouse-scores-stats
        @category=${(e) => (this.filteringOn = e.detail)}
        .lhrRuns=${this.lighthouseResultRuns}
        .disabled=${Boolean(this.activeLighthouseUrl)}
      ></web-lighthouse-scores-stats>
      <web-lighthouse-scores-metrics
        .lhr=${this.lighthouseResultLastLhr}
        ?hidden=${!this.lighthouseResultLastLhr}
      ></web-lighthouse-scores-metrics>
      <web-lighthouse-scores-audits
        .filteringOn=${this.filteringOn}
        .lhr=${this.lighthouseResultLastLhr}
        ?hidden=${!this.lighthouseResultLastLhr}
      ></web-lighthouse-scores-audits>
    `;
  }

  onStateChanged() {
    const {
      lighthouseError,
      lighthouseResult,
      activeLighthouseUrl,
      userUrlResultsPending,
    } = store.getState();

    // Only request reports if this element is visible on the page. This prevents a user's signin
    // from fetching reports before they're needed.
    if (userUrlResultsPending) {
      const {userUrl, userUrlSeen} = store.getState();
      requestFetchReports(userUrl, userUrlSeen);
      store.setState({
        userUrlResultsPending: false,
      });
    }

    this.lighthouseError = lighthouseError;
    this.activeLighthouseUrl = activeLighthouseUrl;

    const runs = (lighthouseResult && lighthouseResult.runs) || [];
    const lastRun = runs.slice(-1)[0] || null;

    this.lighthouseResultUrl = lighthouseResult ? lighthouseResult.url : null;
    this.lighthouseResultRuns = runs;
    this.lighthouseResultLastLhr = lastRun ? lastRun.lhr : null;

    let auditedOn = null;
    if (lastRun) {
      const d = new Date(lastRun.auditedOn);
      if (d.getTime()) {
        auditedOn = d;
      }
    }
    this.auditedOn = auditedOn;
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStateChanged);
    this.onStateChanged();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
  }
}

customElements.define(
  'web-lighthouse-scores-container',
  LighthouseScoresContainer,
);
