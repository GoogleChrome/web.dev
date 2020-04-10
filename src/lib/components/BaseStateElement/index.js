import {store} from '../../store';
import {BaseElement} from '../BaseElement';

/**
 * Base element which subscribes to global state.
 *
 * @extends {BaseElement}
 */
export class BaseStateElement extends BaseElement {
  constructor() {
    super();
    this.onStateChanged = this.onStateChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStateChanged);
    this.onStateChanged(store.getState());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
  }

  /**
   * @param {!Object<string, *>} state
   */
  onStateChanged(state) {}
}
