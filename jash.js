// -------------------- CONTACT FORM EMAILJS --------------------
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // 🚀 Replace these two with your actual EmailJS values
    const serviceID = "service_g55pxb8";      // YOUR SERVICE ID
    const templateID = "template_c3lg6yj";    // YOUR TEMPLATE ID

    const params = {
        from_name: this.from_name.value,
        from_email: this.from_email.value,
        message: this.message.value
    };

    emailjs.send(serviceID, templateID, params)
        .then(() => {
            alert("Your message has been sent successfully!");
            this.reset();
        })
        .catch((err) => {
            console.error("EmailJS Error:", err);
            alert("Failed to send message. Check console.");
        });
});


// -------------------- SKILL CARD ACCESSIBILITY --------------------
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('focus', () => card.classList.add('hover'));
    card.addEventListener('blur', () => card.classList.remove('hover'));
});


// -------------------- THEME TOGGLE --------------------
const toggleSwitch = document.getElementById('theme-switch');
const body = document.body;

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    toggleSwitch.checked = true;
}

toggleSwitch.addEventListener('change', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});
