/**
 * @fileoverview This is a generator for course data.
 */

/**
 * @param {string} projectKey This is used to look up the data for the course
 * in _data. e.g., a course with a key of 'a11y' would have a corresponding
 * "_data/courses/a11y" directory.
 */
module.exports = (projectKey) => {
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
      noindex: (data) => {
        // If the course is marked as draft, don't allow it to be indexed accidentally.
        // In the chain below, `true` wins, so if we're draft or a specific page is marked
        // draft, the noindex meta tags will be added.
        const meta = data?.courses?.[projectKey]?.meta;
        return meta?.draft || data.noindex || false;
      },
    },
  };
};
