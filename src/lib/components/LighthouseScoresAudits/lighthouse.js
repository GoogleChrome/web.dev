const descriptionRegex = /^(.+) \[Learn more\]\((.+)\)\.$/;

/**
 * @const {!Object<string, function({weight: number, overallSavingsMs:
 * ?number}): string>}
 */
const CATEGORY_TO_IMPACT_MAPPING = {
  Accessibility: ({weight}) => {
    if (weight <= 4) {
      return "Low";
    }
    if (weight <= 7) {
      return "Medium";
    }
    return "High";
  },
  "Best Practices": () => {
    return "Medium";
  },
  Performance: ({overallSavingsMs}) => {
    if (!overallSavingsMs) {
      return "Low";
    }
    if (overallSavingsMs <= 50) {
      return "Low";
    }
    if (overallSavingsMs <= 250) {
      return "Medium";
    }
    return "High";
  },
  "Progressive Web App": ({weight}) => {
    if (weight <= 3) {
      return "Low";
    }
    if (weight <= 6) {
      return "Medium";
    }
    return "High";
  },
  SEO: () => {
    return "Medium";
  },
};

/**
 * @const {!Object<string, number>}
 */
const IMPACT_TO_SCORE_MAPPING = {
  Low: 1,
  Medium: 2,
  High: 3,
};

/**
 * @param {!CombinedAuditAndAuditRef} category
 * @return {!CombinedAuditAndAuditRef}
 */
export function computeWeightForAuditResult(category) {
  category.impact = CATEGORY_TO_IMPACT_MAPPING[category.ref.cat]({
    weight: category.ref.weight,
    overallSavingsMs:
      category.audit.details && category.audit.details.overallSavingsMs,
  });

  return category;
}

/**
 * @param {!CombinedAuditAndAuditRef} category
 * @return {boolean}
 */
export function filterAuditResult(category) {
  // TODO(b/119501689): remove pwa audits for now.
  if (category.ref.cat === "Progressive Web App") {
    return false;
  }

  // Some performance audits (for example "First Contentful Paint") provide
  // raw numbers. They do not actually contain "overallSavingsMs".
  if (category.ref.cat === "Performance") {
    if (!category.audit.details) {
      return false;
    }

    const overallSavingsMs = category.audit.details.overallSavingsMs;

    if (overallSavingsMs === undefined || overallSavingsMs <= 0) {
      return false;
    }

    return true;
  }

  // Remove all categories that either have no score or already have a perfect
  // score
  if (
    category.audit.score === null ||
    category.audit.score === undefined ||
    category.audit.score === 1
  ) {
    return false;
  }

  return true;
}

/**
 * @param {!CombinedAuditAndAuditRef} one
 * @param {!CombinedAuditAndAuditRef} other
 * @return {number}
 */
export function sortOnWeights(one, other) {
  return (
    IMPACT_TO_SCORE_MAPPING[other.impact] - IMPACT_TO_SCORE_MAPPING[one.impact]
  );
}

/**
 * @param {string} description
 * @return {?string}
 */
export function getAuditReferenceDocLink(description) {
  const match = descriptionRegex.exec(description);
  if (match) {
    return match[2];
  }
  return null;
}
