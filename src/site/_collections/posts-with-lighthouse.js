// Return posts that reference a Lighthouse audit.
// These posts will be displayed in the user's TODO list on the /measure page.
module.exports = (collection) => {
  return collection.getFilteredByTag('pathItem').filter((post) => {
    const audits = post.data.web_lighthouse;
    if (typeof audits === 'string' && audits !== 'N/A') {
      return true;
    }
    return audits instanceof Array && audits.length;
  });
};
