import {BaseElement} from "../BaseElement";

/**
 * Base element used by all self-assessment response components.
 *
 * @extends {BaseElement}
 */
export class BaseResponseElement extends BaseElement {
  constructor() {
    super();
  }

  /**
   * Returns an object containing the minimum and maximum allowed selections
   * for a response component based on the passed cardinality string.
   * @param {string} cardinality A string indicating the cardinality of the response.
   *                 May be in the format n, n+, or n-m.
   * @return {Object} An object containing the min and max allowed selections.
   */
  static getSelectionRange(cardinality) {
    let min = 1;
    let max = null;

    if (cardinality === "1") {
      // noop
    } else if (/^\d+$/.test(cardinality)) {
      min = parseInt(cardinality);
      max = min;
    } else if (/^\d+\+$/.test(cardinality)) {
      min = parseInt(cardinality);
      max = 0;
    } else if (/^\d-\d+$/.test(cardinality)) {
      [min, max] = cardinality.split("-");
      [min, max] = [parseInt(min), parseInt(max)];
    }

    return {
      min: min,
      max: max,
    };
  }
}
