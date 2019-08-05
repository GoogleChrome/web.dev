import {store} from "./store";
import {updateUrl} from "./fb";
import {runLighthouse, fetchReports} from "./lighthouse-service";

/**
 * @param {!Array<!LighthouseRun>} runs to filter
 * @param {!Date} until pop runs that are after or equal to this date
 * @return {!Array<!LighthouseRun>}
 */
function sliceRunsUntil(runs, until) {
  if (!runs || !runs.length) {
    return [];
  }

  const out = runs.slice();
  while (out.length) {
    const last = out[out.length - 1];
    const when = new Date(last.auditedOn);
    if (when < until) {
      break;
    }
    out.pop();
  }
  return out;
}

class Controller {
  constructor() {
    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();

    this.pending = Promise.resolve();
  }

  onStateChanged() {
    // ???
  }

  requestRunLighthouse(url) {
    const state = store.getState();
    if (state.activeLighthouseUrl) {
      return false;
    }

    // We're writing the user's new URL choice to local state, but also kicking
    // off a Lighthouse run here. We store the active URL running through
    // Lighthouse as their preferred URL could change because of another
    // browser, and this prevents results being appropritioned to the wrong URL.
    store.setState({
      userUrl: url,
      activeLighthouseUrl: url,
      lighthouseError: null,
    });

    // TODO: Some of the Firebase logic still lives in fb.js.
    updateUrl(url);

    this.pending = this.pending
      .then(async () => {
        let state = store.getState(); // might have changed

        const additionalRun = await runLighthouse(url, state.isSignedIn);
        const lighthouseResult = {
          url,
          runs: [additionalRun],
        };

        state = store.getState(); // might have changed
        const previousLighthouseResult = state.lighthouseResult;
        if (previousLighthouseResult && previousLighthouseResult.url === url) {
          // If the previous result was for the same URL, prepend these results to our new result,
          // but replace any from the last ~24 hours.
          const replaceRunsFrom = new Date(additionalRun.auditedOn);
          replaceRunsFrom.setHours(replaceRunsFrom.getHours() - 24);
          const prepend = sliceRunsUntil(
            previousLighthouseResult.runs,
            replaceRunsFrom,
          );
          lighthouseResult.runs.unshift(...prepend);
        }

        store.setState({
          activeLighthouseUrl: null,
          lighthouseResult,
        });
      })
      .catch((err) => {
        console.warn("failed to run Lighthouse", err);
        store.setState({
          lighthouseError: err.toString(),
          activeLighthouseUrl: null,
        });
      });
  }

  requestFetchReports(url) {
    // TODO(samthor): Don't allow multiple parallel requests (possibly just for the same URL).
    this.pending = this.pending
      .then(async () => {
        const runs = await fetchReports(url);
        // This is safe to blindly set as it's not interacting with userUrl at all, and is guaranteed
        // to happen in serial due to using the core promise.
        store.setState({
          lighthouseResult: {
            url,
            runs,
          },
        });
      })
      .catch((err) => {
        console.warn("failed to fetch reports", err);
        store.setState({
          lighthouseError: err.toString(),
        });
      });
  }
}

export default new Controller();
