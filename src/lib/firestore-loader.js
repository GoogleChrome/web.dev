let firestorePromise;

export default function() {
  if (firestorePromise) {
    return firestorePromise;
  }

  const p = new Promise((resolve, reject) => {
    const el = document.getElementById("firebase-firestore");
    if (!el) {
      return reject("missing firebase-firestore");
    }

    const s = document.createElement("script");
    s.src = el.getAttribute("value");

    s.onerror = reject;
    s.onload = () => {
      resolve(firebase.firestore());
    };

    document.head.appendChild(s);
  });

  firestorePromise = p;
  return p;
}
