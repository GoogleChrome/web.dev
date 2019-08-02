import {store} from "./store";
import {updateUrl} from "./fb";
import {runLighthouse, fetchReports} from "./ci";

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

    this.pending = this.pending.then(async () => {
      let state = store.getState();  // might have changed
      const runs = await runLighthouse(url, state.isSignedIn);

      state = store.getState();  // might have changed
      store.setState({
        activeLighthouseUrl: null,
        lighthouseResult: {
          url,
          runs,
        },
      });

      if (state.userUrl !== store.activeLighthouseUrl) {
        this.requestFetchReports(state.userUrl);
      }
    }).catch((err) => {
      console.warn("failed to run Lighthouse", err);
      store.setState({
        lighthouseError: err.toString(),
        activeLighthouseUrl: null,
      });
    });
  }

  requestFetchReports(url) {
    // TODO(samthor): Don't allow multiple parallel requests (possibly just for the same URL).
    this.pending = this.pending.then(async () => {
      const runs = await fetchReports(url);
      store.setState({
        lighthouseResult: {
          url,
          runs,
        },
      });
    }).catch((err) => {
      console.warn("failed to fetch reports", err);
    });
  }
}

export default new Controller();
