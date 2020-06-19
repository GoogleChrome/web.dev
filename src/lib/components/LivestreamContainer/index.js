import {html} from 'lit-element';
import {BaseStateElement} from '../BaseStateElement';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class LivestreamContainer extends BaseStateElement {
  static get properties() {
    return {
      videoId: {type: String},
      isChatEnabled: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.videoId = null;
    this.isChatEnabled = true;
  }

  render() {
    if (!this.videoId) {
      return;
    }

    // prettier-ignore
    return html`
      <div class="web-livestream-container__col-yt">
        <div class="w-youtube">
          <iframe
            class="w-youtube__embed"
            src="https://www.youtube.com/embed/${this.videoId}"
            frameborder="0"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div class="web-livestream-container__col-chat">
        <iframe
          class="w-youtube-chat"
          src="https://www.youtube.com/live_chat?v=${this.videoId}&amp;embed_domain=${location.hostname}"
          frameborder="0"
        ></iframe>
      </div>
    `;
  }

  /**
   * @param {!Object<string, *>} state
   */
  onStateChanged() {
    // Example implementation depending on what we end up putting in our
    // state object:
    // const {videoId, isChatEnabled} = state;
    // this.videoId = videoId;
    // this.isChatEnabled = isChatEnabled;
  }
}

customElements.define('web-livestream-container', LivestreamContainer);
