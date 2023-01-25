import {html} from 'lit';
import {BaseStateElement} from '../BaseStateElement';
import {renderReport} from 'lighthouse/dist/report/bundle.esm.js';
import './_styles.scss';

/**
 * Element for displaying Lighthouse results using LH Report Renderer.
 */
class LighthouseViewer extends BaseStateElement {
  static get properties() {
    return {
      lighthouseError: {type: String},
      auditedOn: {type: String},
      encodedUrl: {type: String},
      metaHidden: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.metaHidden = true;
    this.auditedOn = '';
    this.aencodedUrl = '';
  }

  render() {
    const errorIcon = this.lighthouseError
      ? html`<svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z"
          />
        </svg>`
      : '';
    return html`
      <div class="text-size-0">
        <span ?hidden="${this.metaHidden}">
          <span>Audited on:</span> <span>${this.auditedOn}</span>
          <a
            title="View latest Lighthouse report"
            href="#"
            class="gap-inline-size-1 gc-analytics-event"
            data-category="web.dev"
            data-label="view lighthouse report"
            data-action="click"
            target="_blank"
            role="button"
            @click="${this.onOpenViewer}""
            >View Report</a
          >
        </span>
        <span class="lh-error-msg">${errorIcon}${this.lighthouseError}</span>
      </div>
      <div class="lh-root lh-vars">
        <div class="lighthouse-viewer region"></div>
      </div>
    `;
  }

  /**
   * @param {Object} lighthouseReport
   * @param {Element} container Html element where the report will be rendered.
   */
  generateReport = (lighthouseReport, container) => {
    for (const child of container.children) child.remove();
    const reportRootEl = renderReport(lighthouseReport, {
      disableAutoDarkModeAndFireworks: true,
      omitTopbar: true,
    });
    container.append(reportRootEl);
    window.applyThemeSetting();
  };

  onStateChanged({lighthouseResult, lighthouseError}) {
    if (
      lighthouseResult &&
      lighthouseResult.run &&
      lighthouseResult !== this.lighthouseResult
    ) {
      this.lighthouseResult = lighthouseResult;
      this.encodedUrl = encodeURIComponent(lighthouseResult.run.requestedUrl);
      const auditedOn = new Date(lighthouseResult.run.fetchTime);
      const opts = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
      };
      this.auditedOn = new Intl.DateTimeFormat('en-US', opts).format(auditedOn);
      this.generateReport(lighthouseResult.run, this.container);
    } else {
      this.lighthouseResult = null;
      this.encodedUrl = '';
      this.auditedOn = '';
      this.container && (this.container.innerHTML = '');
    }
    this.metaHidden = !(this.auditedOn && this.encodedUrl);
    this.lighthouseError = lighthouseError;
    return;
  }

  firstUpdated() {
    this.container = this.querySelector('.lighthouse-viewer');
    this.varsEl = this.querySelector('.lh-vars');
  }

  onOpenViewer(e) {
    e.preventDefault();
    this.openTabAndSendData({lhr: this.lighthouseResult.run});
  }

  openTabAndSendData(data) {
    const url = 'https://googlechrome.github.io/lighthouse/viewer/';
    const origin = new URL(url).origin;
    const windowName = `Lighhouse-Viewer-${data.lhr.fetchTime}`;
    // Chrome doesn't allow us to immediately postMessage to a popup right
    // after it's created. Normally, we could also listen for the popup window's
    // load event, however it is cross-domain and won't fire. Instead, listen
    // for a message from the target app saying "I'm open".
    window.addEventListener('message', function msgHandler(messageEvent) {
      if (messageEvent.origin !== origin) {
        return;
      }
      if (popup && messageEvent.data.opened) {
        popup.postMessage(data, origin);
        window.removeEventListener('message', msgHandler);
      }
    });
    const popup = window.open(url, windowName);
  }
}

customElements.define('web-lighthouse-viewer', LighthouseViewer);
