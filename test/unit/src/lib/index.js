require('./urls');
// FIXME: In the new setup this always fails with:
// TypeError: loadFirebase$1 is not a function
// I think it's a rollup issue but I suck at debugging wack bundler shiz. halp.
// require('./utils/firebase-loader');
require('./components/LighthouseGauge');
require('./components/LivestreamContainer');
require('./components/ProgressBar');
