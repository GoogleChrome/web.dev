const {html} = require('common-tags');

/**
 * A YouTube video embed.
 *
 * The method allows a list of arguments or an object with named props.
 * This makes it possible to declare the video id and the start time as
 * named or anonymous parameters while using the shortcode.
 *
 * Be sure to import custom element from `web-components/YouTube.js`
 * in order to use this shortcode.
 *
 * @this {{env: Environment, ctx: Object}}
 * @return {string}
 */
function YouTube(...options) {
  let id, startTime;

  if (typeof options[0] === 'string') {
    [id, startTime] = options;
  } else {
    id = options[0].id;
    startTime = options[0].startTime;
  }

  if (!id) {
    throw new Error('No `id` provided to YouTube shortcode.');
  }

  if (this.ctx.export) {
    return `<devsite-video video-id="${id}"></devsite-video>`;
  }

  return html`
    <div class="youtube">
      <lite-youtube
        videoid="${id}"
        ${startTime ? `videoStartAt="${startTime}"` : ''}
      >
      </lite-youtube>
    </div>
  `.replace(/\n/g, '');
}

module.exports = {YouTube};
