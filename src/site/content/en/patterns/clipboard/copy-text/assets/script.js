const copy = document.querySelector('#copy');
const instructions = document.querySelector('#instructions');
const permbuttons = document.querySelectorAll('#permbuttons');
const timer = document.querySelector('#timer');
const out = document.querySelector('#out');
const toast = document.querySelector('#toast');

if (navigator.clipboard) {
  copy.addEventListener('click', () => {
    navigator.clipboard.writeText(out.value)
    .then(() => {
      log('Text copied');
    })
    .catch(log);
  });
  instructions.innerHTML = 'The current browser engine supports The Clipboard API, which is the modern way of copying text to the clipboard. To see the classic way, view this demo in a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility">non-supporting browser.</a>'
} else {
  copy.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      var success = document.execCommand('copy');
      var msg = success ? 'successful' : 'unsuccessful';
      log(`Text copy was ${msg}.`);
    } catch(err) {
      log('Failed to copy to clipboard');
    }
  });
  instructions.innerHTML = 'The current browser engine uses <code>document.execCommand()</code> because it does not support the modern Clipbard API. To see the mocern way, view this demo in a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility">supporting browser.</a>'
}

function writeInstructions(msg) {
  instructions.innerHTML = msg;
}

/** The 4 available permissions for Async Clipboard API: */
const PERMISSIONS = [
  { name: "clipboard-write" }
  //{ name: "clipboard-write", allowWithoutGesture: false },
  //{ name: "clipboard-write", allowWithoutGesture: true  }
];

/** Query for each permission's state, then watch for changes and update buttons accordingly: */
Promise.all(
	PERMISSIONS.map( descriptor => navigator.permissions.query(descriptor) )
).then( permissions => {
  permissions.forEach( (status, index) => {
    let descriptor = PERMISSIONS[index],
    	name = permissionName(descriptor),
    	btn = document.createElement('button');
    btn.title = 'Click to request permission';
    btn.textContent = name;
    // Clicking a button (re-)requests that permission:
    btn.onclick = () => {
      navigator.permissions.request(descriptor)
        .then( status => { log(`Permission ${status.state}.`); })
        .catch( err => { log(`Permission denied: ${err}`); });
    };
    // If the permission status changes, update the button to show it
    status.onchange = () => {
      btn.setAttribute('data-state', status.state);
    };
    status.onchange();
    permbuttons.append(btn);
  });
});

function permissionName(permission) {
	let name = permission.name.split('-').pop();
  if ('allowWithoutGesture' in permission) {
  	name += ' ' + (permission.allowWithoutGesture ? '(without gesture)' : '(with gesture)');
  }
  return name;
}

function log(value) {
  clearTimeout(log.timer);
  if (toast.hidden) toast.textContent = value;
  else toast.textContent += '\n' + value;
	toast.className = String(value).match(/error/i) ? 'error' : '';
  toast.hidden = false;
  log.timer = setTimeout( () => { toast.hidden = true; }, 3000);
}
