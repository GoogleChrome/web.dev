/**
 * @fileoverview Wraps fetching the global audit mapping data from HTML.
 *
 * We embed the "Guide To Audit" mapping, which tells users what guide to read to help them solve a
 * particular Lighthouse audit, on the Measure page as JSON in a hidden `<code>` block. This lazily
 * parses the JSON when it is first required.
 */

let cache = null;

/**
 * Lazily returns a parsed version of the "Guide To Audit" mapping that is injected into the
 * Measure page. If it's not on this page, returns null.
 *
 * @return {!Object}
 */
export function getAuditGuideMapping() {
  if (cache) {
    return cache;
  }

  const codeElement = document.getElementById('guide-audit-mapping');

  if (codeElement === null) {
    return null;
  }

  let guideToAudit;
  try {
    guideToAudit = JSON.parse(codeElement.textContent || '');
  } catch (err) {
    console.warn('LH id -> guide JSON was malformed. Check', codeElement);
    throw err;
  }

  const auditToGuide = {};

  for (const guide of guideToAudit.guides) {
    for (const audit of guide.lighthouse) {
      if (!(audit in auditToGuide)) {
        auditToGuide[audit] = [];
      }
      auditToGuide[audit].push(guide);
    }
  }

  cache = auditToGuide;
  return cache;
}
