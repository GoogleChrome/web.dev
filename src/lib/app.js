import "./components/Assessment";
import "./components/AssessmentFeedbackContainer";
import "./components/AssessmentFeedbackForm";
import "./components/AssessmentQuestion";
import "./components/ProfileSwitcherContainer";
import "./components/Header";
import "./components/ResponseMultipleChoice";
import "./components/ResponseThinkAndCheck";
import "./components/SelectGroup";
import "./components/SideNav";
import "./components/SnackbarContainer";
import "./components/Search";
import "./components/Tabs";
import "./components/TextField";
import "./components/CopyCode";
import {store} from "./store";
import "focus-visible";
import "./analytics";

// Configures global page state
function onGlobalStateChanged({isSignedIn, isPageLoading}) {
  document.body.classList.toggle("lh-signedin", isSignedIn);

  const progress = document.querySelector(".w-loading-progress");
  progress.hidden = !isPageLoading;

  const main = document.querySelector("main");
  if (isPageLoading) {
    main.setAttribute("aria-busy", "true");
  } else {
    main.removeAttribute("aria-busy");
  }
}
store.subscribe(onGlobalStateChanged);
onGlobalStateChanged(store.getState());
