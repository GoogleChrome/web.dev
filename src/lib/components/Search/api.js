const applicationId = '2JPAZHQ6K7';
const hostname = applicationId + '-dsn.algolia.net';
const key = '5386630ad06ff91f41cadef0d976760d';

export async function search(query) {
  const headers = new Headers();
  headers.set('X-Algolia-API-Key', key);
  headers.set('X-Algolia-Application-Id', applicationId);
  headers.set('Content-Type', 'application/json; charset=UTF-8');

  const body = {'query': query};

  const init = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };

  const r = await window.fetch(`https://${hostname}/1/indexes/webdev/query`, init);
  const json = await r.json();

  const results = json['hits'].map((hit) => {
    // TODO: something
    return hit;
  });
  return {query, results};
}

export function searchDelayer(callback, delay=750) {
  let activeSearch = Promise.resolve();
  let pendingQuery = null;

  return async (query) => {
    if (!query) {
      return;
    }

    const hadPending = pendingQuery !== null;
    pendingQuery = query;
    if (hadPending) {
      // FIXME: includes ~delay
      return activeSearch;
    }
    activeSearch = activeSearch.then(() => {
      const ret = search(pendingQuery);
      pendingQuery = null;
      return ret;
    });

    const ret = activeSearch;
    ret.then(({query, results}) => callback(query, results));

    // Swallow error and delay any further searches by ~delay.
    activeSearch = activeSearch.catch((err) => {
      console.warn('search error', err);
    }).then(() => {
      return new Promise((r) => window.setTimeout(r, delay));
    });

    return ret;
  };
}