const button = document.querySelector('button');
const name = document.querySelector('.name')
const address = document.querySelector('.address')
const email = document.querySelector('.email')
const tel = document.querySelector('.tel')
const pre = document.querySelector('pre')
const autofills = document.querySelectorAll('.autofill')

if ('contacts' in navigator) {
  button.hidden = false;
  for (const autofill of autofills) {
    autofill.parentElement.style.display = 'none'
  }
  address.parentElement.style.display = 'block';
  button.addEventListener('click', async () => {
    const props = ['name', 'email', 'tel', 'address'];
    const opts = {multiple: false};
    try {
      const [contact] = await navigator.contacts.select(props, opts);
      name.value = contact.name;
      address.value = contact.address;
      tel.value = contact.tel
      email.value = contact.email;
    } catch (err) {
      pre.textContent = `${err.name}: ${err.message}`
    }
  });
}

