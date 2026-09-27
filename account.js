document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const password = document.getElementById('loginPassword');
  const toggle = document.querySelector('.password-toggle');
  const message = document.getElementById('loginMessage');

  if (password && toggle) {
    toggle.addEventListener('click', () => {
      const isVisible = password.type === 'password';
      password.type = isVisible ? 'text' : 'password';
      toggle.textContent = isVisible ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
      toggle.setAttribute('aria-pressed', String(isVisible));
    });
  }

  if (form && message) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      message.textContent = 'Sign-in is not connected in this demo. Your details were not sent or saved.';
      message.classList.add('is-success');
    });
  }
});
