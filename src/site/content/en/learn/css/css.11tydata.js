module.exports = function () {
  return {
    layout: 'course',
    // The key is used to look up the data for the course in _data.
    // e.g. A course with a key of 'a11y' would have a corresponding
    // _data/courses/a11y directory.
    projectKey: 'css',
    // Exclude course content from the /tags/ pages.
    excludeFromTags: true,
    // Exclude course content from the /authors/ pages.
    excludeFromAuthors: true,
    eleventyComputed: {
      thumbnail: (data) => {
        const {projectKey} = data;
        // Use thumbnail defined in the frontmatter or in the meta.yml file.
        return data.thumbnail || data?.courses?.[projectKey]?.meta?.thumbnail;
      },
    },
  };
};
