module.exports = (results) => {
  const out = {};
  for (result of results) {
    const {passes, failures, warnings} = result;
    const existing = out[result.file] || {
      passes: [],
      failures: [],
      warnings: [],
    };
    out[result.file] = {
      passes: [...existing.passes, ...passes],
      failures: [...existing.failures, ...failures],
      warnings: [...existing.warnings, ...warnings],
    };
  }
  return out;
};
