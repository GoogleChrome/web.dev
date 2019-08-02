
export const CI_HOST = "https://lighthouse-dot-webdotdevsite.appspot.com";

export async function fetchMedians() {
  const resp = await window.fetch(`${CI_HOST}/lh/medians?url=all`);
  return await resp.json();
}

export async function runLighthouse(url, signedIn=false) {
  const body = {
    url,
    replace: true,
    save: signedIn,
  };

  const resp = await fetch(`${CI_HOST}/lh/newaudit`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r["errors"]);
  } else if (!r['lhrSlim']) {
    throw new Error("unexpected result, no lhrSlim key")
  }
  return r['lhrSlim'] || [];
}

export async function fetchReports(url, startDate=null) {
  const testUrl = window.encodeURIComponent(url);

  let endpointUrl = `${CI_HOST}/lh/reports?url=${testUrl}`;
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

