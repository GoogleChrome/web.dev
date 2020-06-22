import {html} from 'lit-element';
import {BaseStateElement} from '../BaseStateElement';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class LivestreamContainer extends BaseStateElement {
  static get properties() {
    return {
      videoId: {type: String},
      isChatActive: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.videoId = null;
    this.isChatActive = true;
    this._isSignedIn = undefined;
  }

  render() {
    if (!this.videoId) {
      return html``;
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
        ${this.isChatActive ?
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
                  Live Chat is currently disabled. Please head to YouTube and
                  ask your questions in the comments on the video.
                </div>
                <a
                  class="w-youtube-disabled-chat__link" 
                  href="https://www.youtube.com/watch?v=${this.videoId}">
                  Go to YouTube
                </a>
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
  onStateChanged({activeEventDay, isSignedIn}) {
    if (!activeEventDay) {
      return;
    }

    const {videoId, isChatActive} = activeEventDay;
    this.videoId = videoId;
    this.isChatActive = isChatActive;

    // If there was a signed-in state change, reload all our frames as YouTube won't otherwise
    // reconfigure them automatically.
    // Note that signed-in state might change for one of two reasons:
    //  1) the user is signed into Google but signs in/out of web.dev (and reload is needless)
    //  2) the user signs in or out of Google as part of web.dev (reload is required)
    if (this._isSignedIn !== isSignedIn) {
      const frames = this.renderRoot.querySelectorAll('iframe');
      frames.forEach((frame) => {
        frame.src = '' + frame.src;
      });
      this._isSignedIn = isSignedIn;
    }
  }
}

customElements.define('web-livestream-container', LivestreamContainer);
