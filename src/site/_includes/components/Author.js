const {html} = require('common-tags');
const AuthorInfo = require('./AuthorInfo');

module.exports = ({
  post,
  author,
  avatar,
  showSocialMedia = false,
  small = false,
}) => {
  if (!author) {
    throw new Error(`
      Can't create Author component without an author argument.
      author was null or undefined.
    `);
  }

  if (!author.name) {
    throw new Error(
      `Can't create Author with missing author.name. author object: ${author}`
    );
  }

  const fullName = `${author.name.given} ${author.name.family}`;
  return html`
    <div class="w-author">
      <img
        class="w-author__image ${small && `w-author__image--small`}"
        src="/images/authors/${avatar}.jpg"
        alt="${fullName}"
      />
      ${AuthorInfo({post, author, showSocialMedia})}
    </div>
  `;
};
