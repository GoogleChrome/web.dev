// export const LH_HOST = "https://lighthouse-dot-webdotdevsite.appspot.com";
export const LH_HOST = 'https://lighthouse-dot-webdotdevsite.appspot.com/';

/**
 * Fetches recent median values for various Lighthouse categories. This is used as a baseline for
 * site authors to compare to.
 *
 * @return {Promise<Object<string, Array<!Object>>>} mapping from category to recent median scores
 */
export async function fetchMedians() {
  // TODO(robdodson): As of July 2019, this call always returns empty/invalid JSON.
  const resp = await window.fetch(`${LH_HOST}/lh/medians?url=all`);
  return await resp.json();
}

/**
 * Causes the service to run Lighthouse on the given URL. Returns the raw JSON from this run only,
 * or throws an Error if there was a problem.
 *
 * @param {string} url to request a Lighthouse run
 * @param {boolean} signedIn whether the user is signed in
 * @return {Promise<Object>} a single lighthouse run
 */
export async function runLighthouse(url, signedIn = false) {
  const body = {
    url,
    replace: true, // TODO(robdodson): This was from the old codebase, what does it do?
    save: signedIn,
  };

  const resp = await fetch(`${LH_HOST}/lh/newaudit`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r['errors']);
  } else if (!r['lhrSlim']) {
    throw new Error('unexpected result, no lhrSlim key');
  }
  return r;
}

/**
 * Requests recent Lighthouse reports for the given URL. Without a valid startDate, this may only
 * return a single report—the startDate should be drawn from a signed-in user's first scan of their
 * desired URL.
 *
 * @param {string} url to request reports for
 * @param {?Date=} startDate when reports should start from
 * @return {Promise<Array<!Object>>} recent runs
 */
export async function fetchReports(url, startDate = null) {
  const testUrl = window.encodeURIComponent(url);

  let endpointUrl = `${LH_HOST}/lh/reports?url=${testUrl}`;
  if (startDate) {
    endpointUrl += `&since=${startDate.getTime()}`;
  }

  const resp = await window.fetch(endpointUrl);
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r['errors']);
  }
  return r;
}
