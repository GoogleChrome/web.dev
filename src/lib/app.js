import '../styles/all.scss';
import {router} from './router';
import './components/ProfileSwitcherContainer';

// Run as long-lived router w/ history & "<a>" bindings
// Also immediately calls `run()` handler for current location
router.listen();
