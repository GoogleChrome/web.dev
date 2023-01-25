const PSI_API =
  'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';
// This is referrer-restricted key, safe to be stored on the client.
const API_KEY = 'AIzaSyCWNar-IbOaQT1WX_zfAjUxG01x7xErbSc';

/**
 * Queries the Pagespeed Insights API on the given URL. Returns the run's JSON,
 * or throws an Error if there was a problem.
 *
 * @param {string} url to request a Lighthouse run (via PSI)
 * @return {Promise<Object>} a single lighthouse run
 */
export async function runPsi(url) {
  const categories = [
    'ACCESSIBILITY',
    'BEST_PRACTICES',
    'PERFORMANCE',
    // 'PWA', // Disable until installability results are correct. https://crbug.com/1267022#c7
    'SEO',
  ];
  const params = new URLSearchParams();
  params.append('strategy', 'MOBILE');
  params.append('url', url);
  params.append('key', API_KEY);
  for (const category of categories) {
    params.append('category', category);
  }
  const requestUrl = `${PSI_API}?${params.toString()}`;
  const resp = await fetch(requestUrl, {
    method: 'GET',
  });
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r['errors']);
  } else if (!r.lighthouseResult) {
    throw new Error('Unexpected result, no lighthouseResult key');
  }
  return r.lighthouseResult;
}
