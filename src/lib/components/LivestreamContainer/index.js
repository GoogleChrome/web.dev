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
    /* eslint-disable indent */
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
        ${this.isChatEnabled ?
          html`
            <iframe
              class="w-youtube-chat"
              src="https://www.youtube.com/live_chat?v=${this.videoId}&amp;embed_domain=${location.hostname}"
              frameborder="0"
            ></iframe>
          ` :
          html`
            <div class="w-youtube-disabled-chat">
              <div class="w-youtube-disabled-chat__container">
                <div>
                  Live Chat is disabled as the Premiere has ended. Please head to
                  YouTube and ask your questions in the comments on the video.
                </div>
                <div>
                  <a href="https://www.youtube.com/watch?v=${this.videoId}">
                    Go to YouTube
                  </a>
                </div>
              </div>
            </div>
          `
        }
      </div>
    `;
  }

  /**
   * @param {!Object<string, *>} state
   */
  onStateChanged({activeEventDay}) {
    if (!activeEventDay) {
      return;
    }

    const {videoId, isChatEnabled} = activeEventDay;
    this.videoId = videoId;
    this.isChatEnabled = isChatEnabled;
  }
}

customElements.define('web-livestream-container', LivestreamContainer);
