import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class Tabs extends BaseElement {
  static get properties() {
    return {
      label: {type: String},
    };
  }

  constructor() {
    super();
    this.idSalt = BaseElement.generateIdSalt("web-tab-");

    this.prerenderedChildren = null;
    this.tabs = null;

    this.changeTab = this.changeTab.bind(this);
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
      let tabLabel;

      for (const child of this.children) {
        // Set id and aria-labelledby attributes for each panel for a11y
        // and remove hidden attribute on first tab.
        child.id = `web-tab-${this.idSalt}-${i}-panel`;
        child.setAttribute("aria-labelledby", `web-tab-${this.idSalt}-${i}`);
        if (i === 1) {
          child.removeAttribute("hidden");
        }
        this.prerenderedChildren.push(child);
        // Get tab label from panel data-label attribute
        // and render a tab for each panel.
        tabLabel = child.getAttribute("data-label");
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
    let isActive = false;
    let tabIndex = "-1";

    if (i === 1) {
      isActive = true;
      tabIndex = "0";
    }

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
    }

    return html`
      <button
        @click="${this.onClick}"
        @keydown="${this.onKeydown}"
        class="web-tabs__tab gc-analytics-event"
        role="tab"
        aria-selected="${isActive}"
        id="web-tab-${this.idSalt}-${i}"
        aria-controls="web-tab-${this.idSalt}-${i}-panel"
        tabindex=${tabIndex}
        data-category="Site-Wide Custom Events"
        data-label="tab, ${tabLabel}"
      >
        <span class="web-tabs__text-label">${tabLabel}</span>
      </button>
    `;
  }

  onClick(e) {
    this.changeTab(e.currentTarget);
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
  // If so, move focus to it.
  focusNextItem() {
    const item = document.activeElement;
    if (item.nextElementSibling) {
      this.changeTab(item.nextElementSibling);
    } else {
      this.focusFirstItem();
    }
  }

  // Figure out if the current element has a previous sibling.
  // If so, moving focus to it.
  focusPreviousItem() {
    const item = document.activeElement;
    if (item.previousElementSibling) {
      this.changeTab(item.previousElementSibling);
    } else {
      this.focusLastItem();
    }
  }

  // Focus first element in set of siblings.
  focusFirstItem() {
    const item = document.activeElement;
    this.changeTab(item.parentElement.firstElementChild);
  }

  // Focus last element in set of siblings.
  focusLastItem() {
    const item = document.activeElement;
    this.changeTab(item.parentElement.lastElementChild);
  }

  // Change state of tabs and associated panels.
  changeTab(item) {
    const tabset = item.closest("web-tabs");
    const tabs = Array.from(tabset.querySelectorAll(".web-tabs__tab"));
    const panels = Array.from(tabset.querySelectorAll(".web-tabs__panel"));
    const index = tabs.indexOf(item);

    tabs.forEach(function(tab) {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    });

    item.setAttribute("aria-selected", "true");
    item.removeAttribute("tabindex");
    item.focus();

    panels.forEach(function(element) {
      element.setAttribute("hidden", "");
    });

    panels[index].removeAttribute("hidden");
  }
}

customElements.define("web-tabs", Tabs);
