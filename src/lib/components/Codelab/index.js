/**
 * @fileoverview Element that renders codelab expandable/collapsible codelab
 * instructions and an embedded Glitch iframe.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

/**
 * Render codelab instructions and Glitch
 * @extends {BaseElement}
 * @final
 */
class Codelab extends BaseElement {
  static get properties() {
    return {
      // Name of the glitch to render in the iframe.
      glitch: {type: String},
      // The file to show when the Glitch renders.
      path: {type: String},
      // Wether to show iframe or not because of a snapshot test.
      snapshot: {type: Boolean},
      // Whether we are a desktop-sized browser or not.
      _isDesktop: {type: Boolean},
    };
  }

  constructor() {
    super();

    this.glitch = '';
    this.path = 'index.html';
    // _isDesktop has no default value as it's only correctly set between connected/disconnected
    // callbacks via the MediaQueryList's listener.

    this._mql = window.matchMedia('(min-width: 865px)');
    this._toggleDesktop = () => (this._isDesktop = this._mql.matches);
    this.snapshot = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._mql.addEventListener('change', this._toggleDesktop);
    this._toggleDesktop();
  }

  disconnectedCallback() {
    super.connectedCallback();
    this._mql.removeEventListener('change', this._toggleDesktop);
  }

  /**
   * Normally LitElement will remove any light DOM children that are not
   * slotted when we call render().
   * Because we don't use slots, and we _do_ want to preserve this element's
   * light DOM children (they hold the codelab instructions) we create a new
   * renderRoot for LitElement.
   * https://lit-element.polymer-project.org/guide/templates#renderroot
   * This will render the glitch element as a sibling to the existing light
   * DOM children.
   */
  createRenderRoot() {
    const container = /** @type this */ (
      /** @type Element */ (document.createElement('div'))
    );
    container.className = 'web-codelab__glitch';
    this.appendChild(container);
    return container;
  }

  glitchSrc(embed) {
    let url = 'https://glitch.com/embed/?attributionHidden=true';

    if (this.path) {
      url += `&path=${encodeURI(this.path)}`;
    }

    if (embed) {
      url += `#!/embed/${encodeURI(this.glitch)}`;
    }

    return url;
  }

  render() {
    if (!this.glitch) {
      return html``;
    }

    if (!this._isDesktop) {
      return html`
        <div>
          <div class="w-aside w-aside--warning">
            <p>
              <strong>Warning:</strong> This Glitch isn't available on small
              screens,
              <a target="_blank" rel="noopener" href=${this.glitchSrc(false)}>
                open it in a new tab.</a
              >
            </p>
          </div>
        </div>
      `;
    }

    const iframe = this.snapshot
      ? html`<div
          class="web-codelab__glitch-iframe web-codelab__glitch-snapshot"
        ></div>`
      : html`<iframe
          allow="geolocation; microphone; camera; midi; encrypted-media"
          alt="Embedded glitch ${this.glitch}"
          class="web-codelab__glitch-iframe"
          title="Embedded glitch ${this.glitch}"
          src="${this.glitchSrc(true)}"
        >
        </iframe>`;

    return html` <div class="web-codelab__glitch-container">${iframe}</div> `;
  }
}

customElements.define('web-codelab', Codelab);
