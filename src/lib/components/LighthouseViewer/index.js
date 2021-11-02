import {html} from 'lit-element';
import {store} from '../../store';
import {BaseStateElement} from '../BaseStateElement';
import {DOM, ReportRenderer, ReportUIFeatures} from 'lighthouse-viewer';
import './_styles.scss';

/**
 * Element for displaying Lighthouse results using LH Viewer.
 */
class LighthouseViewer extends BaseStateElement {
  static get properties() {
    return {
      lighthouseError: {type: String},
    };
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
    // Classes lh-root, lh-vars come from 'lighthouse-viewer' package.
    return html`
      <div class="lh-error-msg text-size-0">
        ${errorIcon}${this.lighthouseError}
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
    const dom = new DOM(document);
    const renderer = new ReportRenderer(dom);
    renderer.renderReport(lighthouseReport, container);
    const features = new ReportUIFeatures(dom);
    features.initFeatures(lighthouseReport);
    // Force remove dark theme support untill whole of web.dev supports it.
    this.varsEl.classList.remove('dark');
  };

  onStateChanged() {
    const {lighthouseResult, lighthouseError} = store.getState();
    if (lighthouseResult && lighthouseResult.run) {
      this.generateReport(lighthouseResult.run, this.container);
    }
    this.lighthouseError = lighthouseError;
    return;
  }

  firstUpdated() {
    this.container = this.querySelector('.lighthouse-viewer');
    this.varsEl = this.querySelector('.lh-vars');
  }
}

customElements.define('web-lighthouse-viewer', LighthouseViewer);
