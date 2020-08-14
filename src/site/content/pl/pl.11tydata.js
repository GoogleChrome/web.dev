// =============================================================================
// HOME OVERVIEW
//
// This is the context object for the homepage.
// It helps layout cards featured on the homepage, and their ordering.
//
// =============================================================================

module.exports = function () {
  const lang = 'pl';
  const translated = 'none'; // Default translation status.
  const locale = 'pl_PL';

  return {
    lang,
    locale,
    translated,
  };
};
