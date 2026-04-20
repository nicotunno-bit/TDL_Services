/* TDL Services — Landing Page JS */

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.service-card, .feature, .step, .contact__method, .visual-card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.07}s`;
  revealObserver.observe(el);
});

// Contact form
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.querySelectorAll(':invalid').forEach(field => {
      field.style.borderColor = '#ef4444';
    });
    return;
  }

  const btn = form.querySelector('.btn');
  const btnText = btn.querySelector('.btn__text');
  btnText.textContent = 'Envoi en cours…';
  btn.disabled = true;

  const payload = {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
    phone:   document.getElementById('phone').value.trim(),
    type:    document.getElementById('type').value,
  };

  fetch('contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => res.json())
    .then(data => {
      btn.disabled = false;
      btnText.textContent = 'Envoyer ma demande';
      if (data.success) {
        form.reset();
        successMsg.classList.add('visible');
        setTimeout(() => successMsg.classList.remove('visible'), 5000);
      } else {
        alert(data.error || 'Une erreur est survenue, veuillez réessayer.');
      }
    })
    .catch(() => {
      btn.disabled = false;
      btnText.textContent = 'Envoyer ma demande';
      alert('Impossible de contacter le serveur. Vérifiez votre connexion.');
    });
});

// Remove red border on input
form.querySelectorAll('.form__input').forEach(input => {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
  });
});

// Smooth active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav__link:not(.nav__link--cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));
