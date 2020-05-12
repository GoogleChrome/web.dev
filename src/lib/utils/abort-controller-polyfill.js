/**
 * An incredibly simple AbortController polyfill. Does not actually abort in-flight fetch()
 * requests.
 */
class AbortControllerPolyfill {
  constructor() {
    let aborted = false;
    const handlers = [];

    this.abort = () => {
      aborted = true;

      const event = new CustomEvent('AbortEvent');
      handlers.forEach((fn) => fn(event));
      handlers.splice(0, handlers.length);
    };

    this.signal = Object.freeze({
      get aborted() {
        return aborted;
      },
      addEventListener(name, fn) {
        if (!aborted && name === 'abort') {
          handlers.push(fn);
        }
      },
    });
  }
}

window.AbortController = window.AbortController || AbortControllerPolyfill;
