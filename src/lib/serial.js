export default function(store) {
  // Converts the passed async method to one which only runs in serial.
  // Passes unistore state as convenience.
  let p = Promise.resolve();

  return (method) => {
    const out = p.then(() => method(store.getState()));
    p = out.catch(() => null); // swallow error, returned to caller
    return out;
  };
}
