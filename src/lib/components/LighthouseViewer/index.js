import {html} from 'lit-element';
import {store} from '../../store';
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
    for (const child of container.children) child.remove();
    const reportRootEl = renderReport(lighthouseReport, {
      disableAutoDarkModeAndFireworks: true,
      omitTopbar: true,
    });
    container.append(reportRootEl);
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
