const {html} = require('common-tags');
const AuthorInfo = require('./AuthorInfo');

module.exports = ({author, avatar, showSocialMedia=false, small=false}) => {
  const fullName = `${author.name.given} ${author.name.family}`;
  return html`
    <div class="w-author">
      <img
        class="w-author__image ${small && `w-author__image--small`}"
        src="/images/authors/${avatar}.jpg"
        alt="${fullName}"
      />
      ${AuthorInfo(author, showSocialMedia)}
    </div>
  `;
};
