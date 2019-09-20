const firebaseVersion = "6.6.1";
const loaded = {};

export function loadAll(...parts) {
  return Promise.all(parts.map(load));
}

export function load(part) {
  if (part in loaded) {
    return loaded[part];
  }

  const p = new Promise((resolve, reject) => {
    const src = `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-${part}.js`;
    const s = document.createElement("script");
    s.src = src;

    s.onerror = reject;
    s.onload = () => resolve();

    document.head.appendChild(s);
  });

  loaded[part] = p;
  return p;
}
