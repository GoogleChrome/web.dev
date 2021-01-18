import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {checkOverflow} from '../../utils/check-overflow';
import {generateIdSalt} from '../../utils/generate-salt';
import 'focus-visible';
import './_styles.scss';

/**
 * Element that wraps each child element in a tab panel
 * and renders a tab for each panel.
 * @extends {BaseElement}
 */
export class Tabs extends BaseElement {
  static get properties() {
    return {
      label: {type: String},
      activeTab: {type: Number, reflect: true},
      overflow: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.label = '';
    this.activeTab = 0;
    this.overflow = false;
    this.prerenderedChildren = null;
    this.tabs = null;
    this.idSalt = generateIdSalt('web-tab-');

    this.onResize = this.onResize.bind(this);
    this._changeTab = this._changeTab.bind(this);
    this.focusTab = this.focusTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.nextTab = this.nextTab.bind(this);
    this.firstTab = this.firstTab.bind(this);
    this.lastTab = this.lastTab.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.tabs = [];
      let i = 1;

      for (const child of this.children) {
        // Set id and aria-labelledby attributes for each panel for a11y.
        this.prerenderedChildren.push(this.panelTemplate(i, child));
        // Get tab label from child data-label attribute
        // and render a tab for each panel.
        const tabLabel = child.getAttribute('data-label');
        this.tabs.push(this.tabTemplate(i, tabLabel));
        i++;
      }
    }

    return html`
      <div
        class="web-tabs__tablist"
        role="tablist"
        aria-label="${this.label || 'tabs'}"
      >
        ${this.tabs}
      </div>
      ${this.prerenderedChildren}
    `;
  }

  tabTemplate(i, tabLabel) {
    switch (tabLabel) {
      case 'question':
        tabLabel = 'Question ' + i;
        break;
      case 'sample':
        tabLabel = 'Sample ' + i;
        break;
      case '':
      case null:
      case 'bare':
        tabLabel = i;
        break;
      default:
        break;
    }

    // Need @click so tabs work on iOS Safari
    return html`
      <button
        @click=${this.onFocus}
        @focus=${this.onFocus}
        @keydown=${this.onKeydown}
        class="web-tabs__tab gc-analytics-event"
        role="tab"
        aria-selected="false"
        id="web-tab-${this.idSalt}-${i}"
        aria-controls="web-tab-${this.idSalt}-${i}-panel"
        tabindex="-1"
        data-category="Site-Wide Custom Events"
        data-label="tab, ${tabLabel}"
      >
        <span class="web-tabs__text-label">${tabLabel}</span>
      </button>
    `;
  }

  panelTemplate(i, child) {
    const index = i - 1; // i is 1-indexed
    return html`
      <div
        data-index=${index}
        id="web-tab-${this.idSalt}-${i}-panel"
        class="web-tabs__panel"
        role="tabpanel"
        aria-labelledby="web-tab-${this.idSalt}-${i}"
        hidden
      >
        ${child}
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    this.activeTab = 0;
    this.onResize();

    // If Tabs component contains AssessmentQuestion components,
    // listen for requests to navigate to the next tab.
    const questions = this.querySelectorAll('web-question');

    if (!questions) {
      return;
    }

    for (const question of questions) {
      question.addEventListener('request-nav-to-next', this.nextTab);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.onResize);
  }

  updated(changedProperties) {
    if (changedProperties.has('activeTab')) {
      this._changeTab();
    }
  }

  // Update state of tabs and associated panels.
  _changeTab() {
    /** @type NodeListOf<HTMLButtonElement> */
    const tabs = this.querySelectorAll('.web-tabs__tab');
    /** @type NodeListOf<HTMLDivElement> */
    const panels = this.querySelectorAll('.web-tabs__panel');
    const activeTab = tabs[this.activeTab];
    const activePanel = panels[this.activeTab];

    if (activeTab) {
      for (const tab of tabs) {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }

      activeTab.setAttribute('aria-selected', 'true');
      activeTab.removeAttribute('tabindex');
    }

    if (activePanel) {
      for (const panel of panels) {
        panel.hidden = true;
      }

      activePanel.hidden = false;
    }
  }

  onResize() {
    const tabs = this.querySelector('.web-tabs__tablist');

    this.overflow = checkOverflow(tabs, 'width');
  }

  onFocus(e) {
    const tab = e.currentTarget;
    const tabs = this.querySelectorAll('.web-tabs__tab');
    const index = Array.from(tabs).indexOf(tab);

    // Match behavior specified for Material scrollable tabs:
    // https://material.io/components/tabs/#scrollable-tabs
    tab.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
    this.activeTab = index;
  }

  onKeydown(e) {
    /** @type NodeListOf<HTMLButtonElement> */
    const tabs = this.querySelectorAll('.web-tabs__tab');
    const KEYCODE = {
      END: 35,
      HOME: 36,
      LEFT: 37,
      RIGHT: 39,
    };

    switch (e.keyCode) {
      case KEYCODE.RIGHT:
        e.preventDefault();
        this.nextTab();
        break;
      case KEYCODE.LEFT:
        e.preventDefault();
        this.previousTab();
        break;
      case KEYCODE.HOME:
        e.preventDefault();
        this.firstTab();
        break;
      case KEYCODE.END:
        e.preventDefault();
        this.lastTab();
        break;
    }
    tabs[this.activeTab].focus();
  }

  // Helper method to allow other components to focus an arbitrary tab.
  focusTab(index) {
    /** @type NodeListOf<HTMLButtonElement> */
    const tabs = this.querySelectorAll('.web-tabs__tab');

    if (tabs[index]) {
      tabs[index].focus();
    }
  }

  // If previous tab exists, make it active. If not, make last tab active.
  previousTab() {
    const tabs = this.querySelectorAll('.web-tabs__tab');

    if (tabs[this.activeTab - 1]) {
      this.activeTab = this.activeTab - 1;
    } else {
      this.activeTab = tabs.length - 1;
    }
  }

  // If next tab exists, make it active. If not, make first tab active.
  nextTab() {
    const tabs = this.querySelectorAll('.web-tabs__tab');

    this.activeTab = (this.activeTab + 1) % tabs.length || 0;
  }

  // Make first tab active.
  firstTab() {
    this.activeTab = 0;
  }

  // Make last tab active.
  lastTab() {
    const tabs = this.querySelectorAll('.web-tabs__tab');

    this.activeTab = tabs.length - 1;
  }

  /**
   * @param {HTMLElement} node to check
   * @return {number} the index of the tab containing this node, or -1 for none
   */
  indexOfTabByChild(node) {
    /** @type HTMLElement */
    const panel = node.closest('[class="web-tabs__panel"]');
    if (!this.contains(panel)) {
      return -1;
    }
    const index = parseInt(panel.getAttribute('data-index'));
    return isNaN(index) ? -1 : index;
  }
}

customElements.define('web-tabs', Tabs);
