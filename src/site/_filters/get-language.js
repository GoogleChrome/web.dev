module.exports = (inputPath) => {
  const languageRegex = /content\/(?<language>[a-z]+)\//;
  const match = inputPath.match(languageRegex);
  if (!match || !match.groups) {
    throw new Error(`Could not find language for file: ${inputPath}`);
  }
  return match.groups.language;
};
