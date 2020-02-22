import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {handleOverflow} from "../../utils/handle-overflow";

class Tabs extends BaseElement {
  static get properties() {
    return {
      label: {type: String},
      activeTab: {type: Number, reflect: true},
    };
  }

  constructor() {
    super();
    this.activeTab_ = 0;
    this.prerenderedChildren = null;
    this.tabs = null;
    this.idSalt = BaseElement.generateIdSalt("web-tab-");

    this.onResize = this.onResize.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.focusTab = this.focusTab.bind(this);
    this.focusNextItem = this.focusNextItem.bind(this);
    this.focusPreviousItem = this.focusPreviousItem.bind(this);
    this.focusFirstItem = this.focusFirstItem.bind(this);
    this.focusLastItem = this.focusLastItem.bind(this);
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.tabs = [];
      let i = 1;

      for (const child of this.children) {
        // Set id and aria-labelledby attributes for each panel for a11y.
        child.id = `web-tab-${this.idSalt}-${i}-panel`;
        child.setAttribute("aria-labelledby", `web-tab-${this.idSalt}-${i}`);
        this.prerenderedChildren.push(child);
        // Get tab label from panel data-label attribute
        // and render a tab for each panel.
        const tabLabel = child.getAttribute("data-label");
        this.tabs.push(this.tabTemplate(i, tabLabel));
        i++;
      }
    }

    return html`
      <div class="web-tabs__tablist" role="tablist" aria-label="${this.label}">
        ${this.tabs}
      </div>
      ${this.prerenderedChildren}
    `;
  }

  tabTemplate(i, tabLabel) {
    switch (tabLabel) {
      case "question":
        tabLabel = "Question " + i;
        break;
      case "sample":
        tabLabel = "Sample " + i;
        break;
      case "bare":
        tabLabel = i;
        break;
      default:
        break;
    }

    return html`
      <button
        @click="${this.onClick}"
        @focus="${this.onClick}"
        @keydown="${this.onKeydown}"
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

  firstUpdated() {
    this.onResize();
    this.activeTab = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.onResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.onResize);
  }

  set activeTab(val) {
    const oldVal = this.activeTab_;

    this.activeTab_ = Math.floor(val);

    this.changeTab();
    this.requestUpdate("activeTab", oldVal);
  }

  get activeTab() {
    return this.activeTab_;
  }

  // Change state of tabs and associated panels.
  changeTab() {
    const tabs = this.querySelectorAll(".web-tabs__tab");
    const panels = this.querySelectorAll(".web-tabs__panel");
    const activeTab = tabs[this.activeTab];

    if (!panels[this.activeTab]) return;

    for (const tab of tabs) {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    }

    activeTab.setAttribute("aria-selected", "true");
    activeTab.removeAttribute("tabindex");

    for (const panel of panels) {
      panel.hidden = true;
    }

    panels[this.activeTab].hidden = false;
  }

  // Helper function to allow other components to focus a tab as needed
  focusTab(idx) {
    const tabs = this.querySelectorAll(".web-tabs__tab");

    tabs[idx].focus();
  }

  onResize() {
    const tabs = this.querySelector(".web-tabs__tablist");

    handleOverflow(tabs, "width", "web-tabs--overflow");
  }

  onClick(e) {
    const tab = e.currentTarget;
    const tabs = this.querySelectorAll(".web-tabs__tab");
    const index = Array.from(tabs).indexOf(tab);

    tab.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    this.activeTab = index;
  }

  onKeydown(e) {
    const KEYCODE = {
      END: 35,
      HOME: 36,
      LEFT: 37,
      RIGHT: 39,
    };

    switch (e.keyCode) {
      case KEYCODE.RIGHT:
        e.preventDefault();
        this.focusNextItem();
        break;
      case KEYCODE.LEFT:
        e.preventDefault();
        this.focusPreviousItem();
        break;
      case KEYCODE.HOME:
        e.preventDefault();
        this.focusFirstItem();
        break;
      case KEYCODE.END:
        e.preventDefault();
        this.focusLastItem();
        break;
    }
  }

  // Figure out if the current element has a next sibling.
  // If so, select it.
  focusNextItem() {
    const item = document.activeElement;
    if (item.nextElementSibling) {
      item.nextElementSibling.focus();
    } else {
      this.focusFirstItem();
    }
  }

  // Figure out if the current element has a previous sibling.
  // If so, select it.
  focusPreviousItem() {
    const item = document.activeElement;
    if (item.previousElementSibling) {
      item.previousElementSibling.focus();
    } else {
      this.focusLastItem();
    }
  }

  // Focus first element in set of siblings.
  focusFirstItem() {
    const item = document.activeElement;
    item.parentElement.firstElementChild.focus();
  }

  // Focus last element in set of siblings.
  focusLastItem() {
    const item = document.activeElement;
    item.parentElement.lastElementChild.focus();
  }
}

customElements.define("web-tabs", Tabs);
