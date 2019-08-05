import {store} from "./store";
import {updateUrl} from "./fb";
import {runLighthouse, fetchReports} from "./lighthouse-service";
import serial from "./serial";

const serialLighthouseTask = serial(store);

export const requestRunLighthouse = store.action(async (state, url) => {
  if (state.activeLighthouseUrl) {
    return null;
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

  return serialLighthouseTask(async (state) => {
    const additionalRun = await runLighthouse(url, state.isSignedIn);
    const auditedOn = new Date(additionalRun.auditedOn);
    const localUserUrlSeen = await updateUrl(url, auditedOn);

    state = store.getState(); // might change during runLighthouse and Firestore update

    // Replace last run for signed out users. Don't for signed in users to avoid double rendering /
    // outdated sparkline data. Instead, call fetchReports() to repopulate the graphs with the
    // latest data.
    if (!state.isSignedIn) {
      return {
        activeLighthouseUrl: null,
        lighthouseResult: {
          url,
          runs: [additionalRun],
        },
      };
    }

    if (state.userUrl !== url) {
      return null; // something changed, don't fetch reports
    }

    // nb. use localUserUrlSeen as state.userUrlSeen is updated from a Firebase snapshot which
    // usually has not arrived by now (since it's updated in updateUrl above)
    const runs = await fetchReports(state.userUrl, localUserUrlSeen);
    return {
      activeLighthouseUrl: null,
      lighthouseResult: {
        url,
        runs,
      },
    };
  }).catch((err) => {
    console.warn("failed to run Lighthouse", err);
    return {
      lighthouseError: err.toString(),
      activeLighthouseUrl: null,
    };
  });
});

export const requestFetchReports = store.action(
  async (_, url, startDate = null) => {
    return serialLighthouseTask(async (state) => {
      const runs = await fetchReports(url, startDate);
      // This is safe to blindly set as it's not interacting with userUrl at all, and is guaranteed
      // to happen in serial due to using the core promise.
      return {
        lighthouseResult: {
          url,
          runs,
        },
      };
    }).catch((err) => {
      console.warn("failed to fetch reports", err);
      return {
        lighthouseError: err.toString(),
      };
    });
  },
);
