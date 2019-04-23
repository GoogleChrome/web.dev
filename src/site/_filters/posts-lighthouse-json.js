// Generate a JSON object which links posts to their Ligthhouse audits.
module.exports = (posts) => {
  const toArray = (raw) => (raw instanceof Array ? raw : [raw]);

  if (!posts) {
    throw new Error('No posts were passed to the filter!');
  }

  const guides = posts.map((post) => {
    const out = {
      path: '',
      topic: '',
      id: post.fileSlug, // e.g. "test-post"
      lighthouse: toArray(post.data.web_lighthouse),
      title: post.data.title,
      url: post.url,
    };

    const host = post.data.postHost[out.id];
    if (!host) {
      // TODO(samthor): This guide isn't included anywhere inside
      // `_data/paths/*.js`, so it can't be given a path or topic.
      return out;
    }

    out.path = host.path;
    out.topic = host.topic;
    return out;
  });

  return {guides};
};
