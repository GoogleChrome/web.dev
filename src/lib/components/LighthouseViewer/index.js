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
    // Classes lh-root, lh-vars come from 'lighthouse-viewer' package.
    return html`
      <div>
        <div class="lh-error-msg">${this.lighthouseError}</div>
        <div class="lh-root lh-vars">
          <div class="lighthouse-viewer"></div>
        </div>
      </div>
    `;
  }

  generateReport = (lighthouseReport, container) => {
    const dom = new DOM(document);
    const renderer = new ReportRenderer(dom);
    renderer.renderReport(lighthouseReport, container);
    const features = new ReportUIFeatures(dom);
    features.initFeatures(lighthouseReport);
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
  }
}

customElements.define('web-lighthouse-viewer', LighthouseViewer);
