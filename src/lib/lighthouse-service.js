export const LH_HOST = "https://lighthouse-dot-webdotdevsite.appspot.com";

export async function fetchMedians() {
  // TODO(robdodson): As of July 2019, this call always returns empty/invalid JSON.
  const resp = await window.fetch(`${LH_HOST}/lh/medians?url=all`);
  return await resp.json();
}

export async function runLighthouse(url, signedIn = false) {
  const body = {
    url,
    replace: true, // TODO(robdodson): This was from the old codebase, what does it do?
    save: signedIn,
  };

  const resp = await fetch(`${LH_HOST}/lh/newaudit`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r["errors"]);
  } else if (!r["lhrSlim"]) {
    throw new Error("unexpected result, no lhrSlim key");
  }
  return r;
}

export async function fetchReports(url, startDate = null) {
  const testUrl = window.encodeURIComponent(url);

  let endpointUrl = `${LH_HOST}/lh/reports?url=${testUrl}`;
  if (startDate) {
    endpointUrl += `&since=${startDate.getTime()}`;
  }

  const resp = await window.fetch(endpointUrl);
  const r = await resp.json();

  if (!resp.ok) {
    throw new Error(r["errors"]);
  }
  return r;
}
