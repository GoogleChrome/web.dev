/**
 * @fileoverview An element which shows a friendly list of failing audits and related guides.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {getAuditGuideMapping} from '../../lighthouse/mapping';
import {
  computeWeightForAuditResult,
  filterAuditResult,
  sortOnWeights,
  getAuditReferenceDocLink,
} from '../../lighthouse';
import './_styles.scss';

const NUM_AUDITS_TO_SHOW = 10;

/**
 * Renders a table for the passed Lighthouse report.
 *
 * @param {!LighthouseLastRunDetail} lhr The lighthouse report to render a table for.
 * @param {!CombinedAuditAndAuditRef} category
 * @return {!TODO}
 */
function createRowForAuditCategory(lhr, category) {
  let relevantGuides = ['Guide coming soon'];
  const audit = lhr.audits[category.ref.id];

  const auditGuideMapping = getAuditGuideMapping();
  if (auditGuideMapping) {
    const guidesForAudit = auditGuideMapping[category.ref.id];
    if (guidesForAudit) {
      relevantGuides = guidesForAudit.map((guide) => {
        return html`
          <a
            href="${guide.url}"
            class="lh-audit-list-row__link internal gc-analytics-event"
            data-category="web.dev"
            data-label="audit todos, internal link"
            data-action="click"
            >${guide.title}</a
          >
        `;
      });
    } else {
      const docLink = getAuditReferenceDocLink(audit.description);
      if (docLink) {
        relevantGuides = html`
          <a
            href="${docLink}"
            class="lh-audit-list-row__link external gc-analytics-event"
            target="_blank"
            data-category="web.dev"
            data-label="audit todos, external link"
            data-action="click"
            >${audit.title}</a
          >
        `;
      }
    }
  }

  return html`
    <div class="lh-audit-list-row" role="row">
      <span
        class="lh-audit-list-row__impact lh-audit-list-row__item
                lh-audit-list-row__impact--${category.impact.toLowerCase()}"
        role="cell"
        >${category.impact}</span
      >
      <span
        class="lh-audit-list-row__item lh-audit-list-row__category"
        role="cell"
        >${category.ref.cat}</span
      >
      <span
        class="lh-audit-list-row__item lh-audit-list-row__recommendation"
        role="cell"
        >${audit.title}</span
      >
      <span class="lh-audit-list-row__item lh-audit-list-row__guide" role="cell"
        >${relevantGuides}</span
      >
    </div>
  `;
}

/* eslint-disable require-jsdoc */
class LighthouseScoresAudits extends BaseElement {
  static get properties() {
    return {
      timesExpanded: {type: Number}, // number of times a user has asked for more help
      inverted: {type: Boolean}, // whether to sort by low impact first
      filteringOn: {type: String}, // the Lighthouse category to filter to
      lhr: {type: Object}, // contains the raw Lighthouse results data
    };
  }

  constructor() {
    super();
    this.timesExpanded = 0;
    this.inverted = false;
  }

  set lhr(value) {
    if (this._lhr === value) {
      return; // don't reset, same results
    }

    // setting lhr resets most properties of this element
    this.timesExpanded = 1;
    this.inverted = false;
    this.filteringOn = null;

    const oldValue = this._lhr;
    this._lhr = value;
    this.requestUpdate('lhr', oldValue);
  }

  get lhr() {
    return this._lhr;
  }

  firstUpdated() {
    this.setAttribute('role', 'table');
    this.setAttribute('aria-label', 'Lighthouse audits and suggested guides');
  }

  /**
   * @private
   * @param {!LighthouseLastRunDetail} lhr The lighthouse report to render a
   *     table for.
   * @return {!Array<!CombinedAuditAndAuditRef>} The audits and refs, sorted
   *     on performance improvement or ref weight.
   */
  getHighestImpactScores(lhr) {
    const sortedValues = Object.values(lhr.categories)
      // First filter on selected category.
      .filter((cat) => (this.filteringOn ? cat.id === this.filteringOn : true))
      // Flatmap all audits with their corresponding category.
      .map((cat) => {
        return cat.auditRefs.map((ref) => Object.assign({cat: cat.title}, ref));
      })
      .reduce((one, other) => one.concat(other), [])
      .map((ref) => ({ref, audit: lhr.audits[ref.id]}))
      .filter(filterAuditResult)
      .map(computeWeightForAuditResult)
      .sort(sortOnWeights);

    if (this.inverted) {
      sortedValues.reverse();
    }
    return sortedValues;
  }

  render() {
    const lhr = this.lhr;
    let rows = html``;
    let allRowsShown = false;

    if (lhr) {
      const scores = this.getHighestImpactScores(lhr);
      allRowsShown = scores.length <= NUM_AUDITS_TO_SHOW * this.timesExpanded;

      rows = scores
        .slice(0, NUM_AUDITS_TO_SHOW * this.timesExpanded)
        .map((category) => createRowForAuditCategory(lhr, category));
    } else {
      // Render placeholder rows for hydrating.
      const dummyArray = Array(NUM_AUDITS_TO_SHOW * this.timesExpanded).keys();
      rows = Array.from(dummyArray).map(() => {
        return html`
          <div class="lh-audit-list-row" role="row">
            <span
              class="lh-audit-list-row__impact lh-audit-list-row__item"
              role="cell"
            ></span>
          </div>
        `;
      });
    }

    return html`
      <div class="lh-audit-list-headers" role="row">
        <span
          class="lh-audit-list-row__impact lh-audit-list-row__item"
          role="columnheader"
        >
          <button
            class="lh-audit-list-row__impact-arrow"
            @click="${this.onInvert}"
            ?data-inverted="${this.inverted}"
          >
            Impact
          </button>
        </span>
        <span
          class="lh-audit-list-row__category lh-audit-list-row__item"
          role="columnheader"
          >Category</span
        >
        <span
          class="lh-audit-list-row__recommendation lh-audit-list-row__item"
          role="columnheader"
          >Audit</span
        >
        <span
          class="lh-audit-list-row__guide lh-audit-list-row__item"
          role="columnheader"
          >Guide</span
        >
      </div>
      <div class="lh-audit-list-rows" role="rowgroup">
        ${rows}
      </div>
      <div class="lh-audit-list-see-more__container">
        <button
          @click="${this.onIncreaseAuditsShown}"
          ?disabled="${!lhr || allRowsShown}"
          class="w-button lh-audit-list-see-more__button gc-analytics-event"
          data-category="web.dev"
          data-label="audit todos, see more"
          data-action="click"
        >
          See more
        </button>
      </div>
    `;
  }

  onInvert(e) {
    e.preventDefault();
    this.inverted = !this.inverted;
  }

  onIncreaseAuditsShown(e) {
    e.preventDefault();
    this.timesExpanded++;
  }

  /**
   * Toggles filtering of the audit list.
   * @param {?string} cat Category id to filter on. Passing null or the same
   *     name clears the filter.
   * @export
   */
  filter(cat) {
    // Reset filter if same category is passed, otherwise set new filter.
    this.filteringOn = cat === this.filteringOn ? null : cat;
  }
}

customElements.define('web-lighthouse-scores-audits', LighthouseScoresAudits);
