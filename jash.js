
  // Form submit handler - just prevents default for demo
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
  });

  // Optional: Make skill cards keyboard accessible (flip on focus/blur)
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('focus', () => card.classList.add('hover'));
    card.addEventListener('blur', () => card.classList.remove('hover'));
  });


  const toggleSwitch = document.getElementById('theme-switch');
  const body = document.body;

  // Load saved theme from localStorage
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    toggleSwitch.checked = true;
  }

  toggleSwitch.addEventListener('change', () => {
    body.classList.toggle('light-mode');
    // Save preference
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  });
