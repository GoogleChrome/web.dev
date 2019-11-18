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
        // Set id and aria-labelledby attributes for each pane for a11y
        // and remove hidden attribute on first tab.
        child.id = "w-tab-" + i + "-pane";
        child.setAttribute("aria-labelledby", "w-tab-" + i);
        if (i === 1) {
          child.removeAttribute("hidden");
        }
        this.prerenderedChildren.push(child);
        // Get tab label from pane data-label attribute
        // and render a tab for each pane.
        tabLabel = child.getAttribute("data-label");
        this.tabs.push(this.tabTemplate(i, tabLabel));
        i++;
      }
    }

    return html`
      <div class="w-tabset" role="tablist" aria-label="${this.label}">
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
        class="w-tabset__tab"
        role="tab"
        aria-selected="${isActive}"
        id="w-tab-${i}"
        aria-controls="w-tab-${i}-pane"
        tabindex=${tabIndex}
      >
        <span class="w-tabset__text-label">${tabLabel}</span>
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

  // Change state of tabs and associated panes.
  changeTab(item) {
    const tabset = item.closest("w-tabset");
    const tabs = Array.from(tabset.querySelectorAll(".w-tabset__tab"));
    const panes = Array.from(tabset.querySelectorAll(".w-tabset__pane"));
    const index = tabs.indexOf(item);

    tabs.forEach(function(tab) {
      tab.setAttribute("aria-selected", "false");
      tab.setAttribute("tabindex", "-1");
    });

    item.setAttribute("aria-selected", "true");
    item.removeAttribute("tabindex");
    item.focus();

    panes.forEach(function(element) {
      element.setAttribute("hidden", "");
    });

    panes[index].removeAttribute("hidden");
  }
}

customElements.define("w-tabset", Tabs);
