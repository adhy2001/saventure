/* ========================================
   LOUD IMC - Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initAOS();
    initCounters();
    initContactForm();
    initParticles();
    initSliderDuplicate();
    initHeroTitleSlider();
    initEmailJS();
    initWorkSlider();
    initFooterHeroBackground();
    initChatbot();
    initHeroParallax();
});

/* Navbar scroll effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* AOS (Animate On Scroll) */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            offset: 50,
            once: true
        });
    }
}

/* Counter animation */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || 0;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(updateCounter);
}

/* Contact form */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(form);

        sendEmail(formData)
            .then(() => {
                btn.textContent = 'Message Sent!';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            })
            .catch((error) => {
                console.error('Email send failed:', error);
                btn.textContent = 'Error! Try again.';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 2000);
            });
    });
}

/* Hero particles effect */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(245, 158, 11, ${Math.random() * 0.4 + 0.15});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 15}s linear infinite;
        `;
        container.appendChild(particle);
        particles.push(particle);
    }

    // Add keyframes if not present
    if (!document.getElementById('particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                25% { transform: translate(20px, -30px) scale(1.1); opacity: 0.8; }
                50% { transform: translate(-15px, 20px) scale(0.9); opacity: 0.5; }
                75% { transform: translate(10px, 10px) scale(1.05); opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* Hero title slide / fade between two titles */
function initHeroTitleSlider() {
    const titles = document.querySelectorAll('.hero-title-slider .hero-title');
    if (!titles.length) return;

    let index = 0;
    const interval = 5000;

    function showNext() {
        titles[index].classList.remove('hero-title-active');
        index = (index + 1) % titles.length;
        titles[index].classList.add('hero-title-active');
    }

    setInterval(showNext, interval);
}

/* Duplicate slider items for seamless loop */
function initSliderDuplicate() {
    const track = document.querySelector('.logo-slider');
    if (!track) return;

    const items = track.innerHTML;
    track.innerHTML = items + items;
}

/* Initialize EmailJS */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('ccfQDRGlwLw9SQUgK'); // Public Key
    }
}

/* Send email via EmailJS */
function sendEmail(formData) {
    const templateParams = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    return emailjs.send('service_3tsy1wk', 'template_6vy4lo5', templateParams);
}

/* Work Slider - Horizontal Scrolling */
function initWorkSlider() {
    const track = document.querySelector('.work-slider-track');
    const prevBtn = document.querySelector('.work-slider-prev');
    const nextBtn = document.querySelector('.work-slider-next');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.work-card');
    if (!cards.length) return;

    let currentIndex = 0;
    const cardWidth = 350; // Match the flex-basis in CSS
    const gap = 24; // 1.5rem = 24px
    const scrollAmount = cardWidth + gap;

    function updateSlider() {
        const maxScroll = (cards.length - 1) * scrollAmount;
        const scrollPosition = Math.min(currentIndex * scrollAmount, maxScroll);
        track.style.transform = `translateX(-${scrollPosition}px)`;

        // Update button states
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';

        const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / scrollAmount));
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / scrollAmount));
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    // Touch/drag support
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag);
    track.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        track.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50 && currentIndex < cards.length - 1) {
            currentIndex++;
        }

        if (movedBy > 50 && currentIndex > 0) {
            currentIndex--;
        }

        updateSlider();
        prevTranslate = currentIndex * scrollAmount * -1;
    }

    // Initialize
    updateSlider();
    track.style.cursor = 'grab';

    // Update on window resize
    window.addEventListener('resize', updateSlider);
}

/* Dynamic Footer Background from Hero Image */
function initFooterHeroBackground() {
    // Only apply to home page which has .hero-bg-image
    const heroBg = document.querySelector('.hero-bg-image');
    const footer = document.querySelector('.footer');

    if (!footer || !heroBg) return;

    const style = window.getComputedStyle(heroBg);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== 'none') {
        // Use background shorthand to ensure override
        footer.style.background = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), ${bgImage} center / cover no-repeat`;
        footer.classList.add('footer-has-bg');
    }
}

/* AI Chatbot "Sara" Logic */
function initChatbot() {
    // Prevent duplicate injection
    if (document.getElementById('loudChatWidget')) return;

    // Create Chat Widget HTML
    const chatHTML = `
        <button class="chat-widget-toggle" id="chatToggle" aria-label="Open Chat">
            <i class="fas fa-comment-dots"></i>
        </button>

        <div class="chat-widget" id="loudChatWidget">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-title">
                        <h4>Sara</h4>
                        <span>AI Assistant • Online</span>
                    </div>
                </div>
                <button class="chat-close" id="chatClose" aria-label="Close Chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    Hello! I'm Sara, your virtual assistant. How can I help you elevate your brand today?
                </div>
            </div>
            
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type a message...">
                <button class="chat-send" id="chatSend" aria-label="Send Message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;

    // Inject into body
    const div = document.createElement('div');
    div.innerHTML = chatHTML;
    document.body.appendChild(div);

    // Elements
    const toggleBtn = document.getElementById('chatToggle');
    const closeBtn = document.getElementById('chatClose');
    const widget = document.getElementById('loudChatWidget');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const messages = document.getElementById('chatMessages');

    // Toggle Chat
    function toggleChat() {
        widget.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (widget.classList.contains('active')) {
            icon.classList.remove('fa-comment-dots');
            icon.classList.add('fa-chevron-down');
            input.focus();
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-comment-dots');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Send Message Logic
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        input.value = '';

        // Simulate Bot Typing/Response
        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 1000);
    }

    // Add Message to UI
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        messages.appendChild(msgDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // Basic Response Logic
    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hi there! Welcome to Loud IMC. What brings you here?";
        } else if (lowerInput.includes('service') || lowerInput.includes('help')) {
            return "We offer a range of services from comprehensive branding to digital transformation. Check out our Capabilities section!";
        } else if (lowerInput.includes('contact') || lowerInput.includes('email')) {
            return "You can reach us directly via the contact form below or email at hello@loudimc.com.";
        } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
            return "Our pricing is tailored to each project's unique needs. We'd love to discuss your requirements!";
        } else {
            return "That's interesting! While I'm still learning, our team would love to hear more. Please fill out the contact form!";
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

/* Hero 3D Object Mouse Interaction */
function initHeroInteraction() {
    const hero = document.querySelector('.hero');
    const cubeWrapper = document.querySelector('.cube-wrapper');

    if (!hero || !cubeWrapper) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left; // Mouse X within hero
        const y = e.clientY - rect.top;  // Mouse Y within hero

        // Calculate positions relative to center (-1 to 1)
        const xPos = (x / rect.width - 0.5) * 2;
        const yPos = (y / rect.height - 0.5) * 2;

        // Rotation intensity
        const rotateX = yPos * -15; // Invert Y for natural feel
        const rotateY = xPos * 15;

        // Apply transform (Preserve floating animation via wrapper nesting if needed, 
        // but here we are rotating the wrapper itself. 
        // Note: The wrapper has 'floatingObj' animation. 
        // Transforming it directly might override the animation unless we are careful.
        // CSS Animation affects 'transform'. JS setting 'transform' overrides it.
        // Better Strategy: Apply mouse rotation to the .hero-3d-object container 
        // which surrounds the wrapper, OR use a separate container.
        // Let's verify existing structure: .hero-3d-object -> .cube-wrapper -> .cube
        // .hero-3d-object is absolute positioned.
        // .cube-wrapper has floating animation.
        // .cube has rotating animation.
        // Let's select .hero-3d-object for the mouse interaction to avoid conflicts.
    });
}

/* REVISED Mouse Interaction - Targeting .hero-3d-object to avoid animation conflict */
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const container = document.querySelector('.hero-3d-object');

    if (!hero || !container) return;

    // Add transition for smoothness via JS or CSS check
    container.style.transition = 'transform 0.1s ease-out';
    container.style.transformStyle = 'preserve-3d'; // Ensure 3D context

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        // Tilt effect
        const rotateX = y * -15;
        const rotateY = x * 15;

        // Apply to container
        container.style.transform = `translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(-50%) rotateX(0deg) rotateY(0deg)';
    });
}

