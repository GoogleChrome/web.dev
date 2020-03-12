let firebasePromise;

export default function() {
  if (firebasePromise) {
    return firebasePromise;
  }

  const ids = ["firebase-app", "firebase-auth", "firebase-performance"];

  const promises = ids.map((id) => {
    return new Promise((resolve, reject) => {
      const el = document.getElementById(id);
      if (!el) {
        return reject(`missing ${id}`);
      }

      const s = document.createElement("script");
      s.src = el.getAttribute("value");

      s.onerror = reject;
      s.onload = resolve;

      document.head.appendChild(s);
    });
  });

  firebasePromise = Promise.all(promises);
  return firebasePromise;
}
