import {html} from 'lit-element';
import {BaseResponseElement} from '../BaseResponseElement';
import './_styles.scss';

export class ResponseThinkAndCheck extends BaseResponseElement {
  constructor() {
    super();
    this.prerenderedChildren = null;
    this.option = null;

    this.reset = this.reset.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.option = [];

      for (const child of this.children) {
        if (child.getAttribute('data-role') === 'rationale') {
          // TACs are a weird response type because they don't have any options.
          // So, to avoid complicating the site/_includes/components/Assessment.js rendering logic,
          // set the data-role here so TACs work with
          // the BaseResponseElement's showOptions() method.
          child.setAttribute('data-role', 'option');
          child.className =
            'web-response__option-rationale web-response-tac__option-rationale';
          this.option.push(child);
        } else {
          this.prerenderedChildren.push(child);
        }
      }
    }

    return html`${this.prerenderedChildren} ${this.option}`;
  }

  connectedCallback() {
    super.connectedCallback();
    // Unlike other response types,
    // Think-and-checks don't have any options,
    // so they can only be answeredCorrectly (default) or completed.
    this.state = 'answeredCorrectly';
  }

  // Override BaseResponseElement's reset() method
  // since Think-and-checks have no options
  // and so are answeredCorrectly by default.
  reset() {
    super.reset();
    this.state = 'answeredCorrectly';
  }
}

customElements.define('web-response-tac', ResponseThinkAndCheck);
