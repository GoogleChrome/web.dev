module.exports = function () {
  // The key is used to look up the data for the course in _data.
  // e.g. A course with a key of 'a11y' would have a corresponding
  // _data/courses/a11y directory.
  const projectKey = 'css';

  return {
    layout: 'course',
    projectKey,
    searchTag: `course-${projectKey}`,
    // Exclude course content from the /tags/ pages.
    excludeFromTags: true,
    // Exclude course content from the /authors/ pages.
    excludeFromAuthors: true,
    eleventyComputed: {
      tags: (data) => {
        const {searchTag} = data;
        let tags = data?.courses?.[projectKey]?.meta?.tags || [];
        tags = [...tags, ...data.tags];
        if (!tags.includes(searchTag)) {
          tags.push(searchTag);
        }
        return tags;
      },
      thumbnail: (data) => {
        // Use thumbnail defined in the frontmatter or in the meta.yml file.
        return data.thumbnail || data?.courses?.[projectKey]?.meta?.thumbnail;
      },
    },
  };
};
