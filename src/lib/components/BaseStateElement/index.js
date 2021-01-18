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
   * This method will be called whenever unistore state changes,
   * you can overwrite the method to hook into the event and deconstruct the state.
   *
   * @param {!Object<string, *>} state
   */

  // @ts-ignore-start
  onStateChanged(state) {} // eslint-disable-line no-unused-vars
  // @ts-ignore-end
}
