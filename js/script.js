document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS Animation Library
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
    });

    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if(window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a slight delay to the outline for a fluid effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, input, select, textarea, .event-box, .service-card-3d');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    function getTranslateSelect() {
        return document.querySelector('.goog-te-combo');
    }

    function waitForTranslateSelect(maxAttempts = 20, delay = 250) {
        return new Promise(resolve => {
            const select = getTranslateSelect();
            if (select) return resolve(select);

            let attempts = 0;
            const interval = setInterval(() => {
                attempts += 1;
                const nextSelect = getTranslateSelect();
                if (nextSelect || attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(nextSelect);
                }
            }, delay);
        });
    }

    async function setTranslateLang(lang) {
        const select = await waitForTranslateSelect();
        if (!select) return false;
        select.value = lang;
        select.dispatchEvent(new Event('change'));
        return true;
    }

    function activateLangButton(lang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const lang = button.dataset.lang;
            const success = await setTranslateLang(lang);
            if (success) {
                activateLangButton(lang);
            }
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link:not(.btn-nav)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Input animation logic (if date field is interacted with)
    const dateInput = document.getElementById('event_date');
    if(dateInput) {
        dateInput.addEventListener('change', function() {
            if(this.value) {
                this.nextElementSibling.classList.add('active');
            } else {
                this.nextElementSibling.classList.remove('active');
            }
        });
    }

    // EmailJS Form Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const iconRight = submitBtn.querySelector('.icon-right');
            const spinner = submitBtn.querySelector('.spinner');
            const formAlert = document.getElementById('form-alert');

            // Form values
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                event_type: document.getElementById('event_type').value,
                event_date: document.getElementById('event_date').value,
                session: document.getElementById('session').value,
                service: document.getElementById('service').value,
                event_location: document.getElementById('event_location').value,
                num_boys: document.getElementById('num_boys').value,
                num_girls: document.getElementById('num_girls').value,
                guests: document.getElementById('guests').value,
                message: document.getElementById('message').value
            };

            // Loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending Request...';
            iconRight.style.display = 'none';
            spinner.style.display = 'inline-block';
            
            formAlert.style.display = 'none';
            formAlert.className = 'alert-message';
            formAlert.style.padding = '15px';
            formAlert.style.marginTop = '20px';
            formAlert.style.borderRadius = '8px';
            formAlert.style.fontWeight = '500';
            formAlert.style.textAlign = 'center';

            // Send Email using EmailJS
            emailjs.send('service_3htr4hv', 'template_4a7u3qf', formData)
                .then(function(response) {
                    formAlert.innerHTML = '<i class="fas fa-check-circle"></i> Booking request sent successfully! We will contact you soon.';
                    formAlert.style.backgroundColor = 'rgba(37, 211, 102, 0.1)';
                    formAlert.style.color = '#155724';
                    formAlert.style.border = '1px solid #c3e6cb';
                    formAlert.style.display = 'block';
                    bookingForm.reset();
                }, function(error) {
                    formAlert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again or call us directly.';
                    formAlert.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                    formAlert.style.color = '#800020';
                    formAlert.style.border = '1px solid rgba(128,0,32,0.3)';
                    formAlert.style.display = 'block';
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.textContent = 'Confirm Booking Request';
                    iconRight.style.display = 'inline-block';
                    spinner.style.display = 'none';
                    
                    // Hide success message after 6 seconds
                    setTimeout(() => {
                        formAlert.style.display = 'none';
                    }, 6000);
                });
        });
    }
});
