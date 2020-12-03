import {html} from 'lit-element';
import {BaseStateElement} from '../BaseStateElement';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class LivestreamContainer extends BaseStateElement {
  static get properties() {
    return {
      videoId: {type: String},
      isChatActive: {type: Boolean},
      chatClosed: {type: Boolean, reflect: true, attribute: 'chat-closed'},
    };
  }

  constructor() {
    super();
    this.videoId = null;
    this.isChatActive = true;
    this.chatClosed = false;
    this.isSignedIn = undefined;
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
            title="web.dev YouTube livestream"
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
              title="web.dev YouTube live chat"
              class="w-youtube-chat"
              src="https://www.youtube.com/live_chat?v=${this.videoId}&amp;embed_domain=${location.hostname}"
              frameborder="0"
            ></iframe>
          ` :
          html`
            <div class="w-youtube-disabled-chat">
              <div class="w-youtube-disabled-chat__text">
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
      <button class="web-livestream-container__chat-toggle" @click="${() => {this.chatClosed = !this.chatClosed}}">
        ${this.chatClosed ?
          html`<i class="material-icons">chevron_left</i> <span>Open live chat</span>` :
          html`<i class="material-icons">chevron_right</i> <span>Close live chat</span>`
        }
      </button>
    `;
  }

  /**
   * @param {!Object<string, *>} state
   */
  onStateChanged({activeEventDay, isSignedIn}) {
    const {videoId, isChatActive} = activeEventDay || {
      videoId: null,
      isChatActive: false,
    };
    this.videoId = videoId;
    this.isChatActive = isChatActive;

    // If there was a signed-in state change, reload all our frames as YouTube won't otherwise
    // reconfigure them automatically. This can technically force a double-reload, if videoId also
    // changes in the same update, but in practice they're updated separately.
    // Note that signed-in state might change for one of two reasons:
    //  1) the user is signed into Google but signs in/out of web.dev (and reload is needless)
    //  2) the user signs in or out of Google as part of web.dev (reload is required)
    if (this.isSignedIn !== isSignedIn) {
      const frames = this.renderRoot.querySelectorAll('iframe');
      frames.forEach((frame) => {
        frame.src = '' + frame.src;
      });
      this.isSignedIn = isSignedIn;
    }
  }
}

customElements.define('web-livestream-container', LivestreamContainer);
