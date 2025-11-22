// =========================
// EMAILJS - SEND MESSAGE
// =========================

// Attach listener to the form
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Prepare template fields for EmailJS
    const params = {
        from_name: name,
        from_email: email,
        message: message
    };

    // Your EmailJS IDs (PUT YOURS HERE)
    const serviceID = "service_g55pxb8";
    const templateID = "template_c3lg6yj";

    // Send email using EmailJS
    emailjs.send(serviceID, templateID, params)
        .then(function () {
            alert("Your message has been sent successfully! ✨");
            document.getElementById("contact-form").reset();
        })
        .catch(function (error) {
            console.error("EmailJS Error:", error);
            alert("Oops! Something went wrong. Try again later.");
        });
});


// =========================
// SKILL CARD ACCESSIBILITY
// =========================
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach(card => {
    card.addEventListener('focus', () => card.classList.add('hover'));
    card.addEventListener('blur', () => card.classList.remove('hover'));
});


// =========================
// THEME SWITCHER
// =========================
const toggleSwitch = document.getElementById('theme-switch');
const body = document.body;

// Load user's saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    toggleSwitch.checked = true;
}

// Change theme on toggle
toggleSwitch.addEventListener('change', () => {
    body.classList.toggle('light-mode');

    // Save preference
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});
