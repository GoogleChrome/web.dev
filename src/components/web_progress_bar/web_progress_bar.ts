// Import the LitElement base class and html helper function
import {html, property, customElement} from 'lit-element';
import {BaseElement} from '../base_element/base_element';
import './web_progress_bar.scss';

/**
 * Progress bar element.
 * Uses TypeScript decorator to register custom element.
 */
@customElement('web-progress-bar')
export class WebProgressBar extends BaseElement {
  // Example TypeScript decorator for defining properties
  @property({type: Boolean}) isAwesome = true;

  // eslint-disable-next-line require-jsdoc
  render() {
    return html`
      <div class="web-progress-bar-wrapper">
        <div class="web-progress-bar-indeterminate"></div>
      </div>
    `;
  }
}
