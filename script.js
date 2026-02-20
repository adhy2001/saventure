/* ========================================
   SAVENTURE - Scripts
   ======================================== */

// Dummy functions to prevent console errors
function trackEvent(category, action, label) { }
function initFooterBgScroll() { }
function initAnalytics() { }

document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initAOS();
    initCounters();
    initFormValidation();
    initParticles();
    initSliderDuplicate();
    initHeroTitleSlider();
    initEmailJS();
    initWorkSlider();
    initFooterHeroBackground();
    initChatbot();
    initHeroParallax();
    initScrollTop();
    renderBlogs(); // Dynamic blogs
    initFooterBgScroll(); // New function call
    initAnalytics(); // Interactions tracking
});

/* ... (previous functions remains same) ... */

/* Scroll to Top Button */
function initScrollTop() {
    // Create button
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    // Toggle visibility on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        trackEvent('Navigation', 'Scroll to Top');
    });
}

/* Navbar scroll effect */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const hero = document.querySelector('.hero');

    if (hero) {
        // Homepage with Hero: Transparent -> Solid on scroll
        const updateNavbar = () => {
            const threshold = hero.offsetHeight - 80; // Triggers when passing hero
            if (window.scrollY > threshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial check
    } else {
        // Internal Pages: Always Solid
        navbar.classList.add('scrolled');
    }
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
                trackEvent('Engagement', 'Counter Animation', counter.getAttribute('data-label') || 'Unnamed Counter');
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

/* Form Validation & Premium Feedback */
function initFormValidation() {
    const form = document.querySelector('form'); // General target or specific ID
    const premiumForm = document.getElementById('premiumContactForm');
    const targetForm = premiumForm || form;

    if (!targetForm) return;

    targetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        trackEvent('Conversion', 'Form Submission Attempt', targetForm.id || 'General Form');

        const btn = targetForm.querySelector('button[type="submit"]');
        const inputs = targetForm.querySelectorAll('[required]');
        let isValid = true;

        // Basic Validation
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            trackEvent('Conversion', 'Form Validation Error', 'Missing required fields');
            return;
        }

        // Simulate Submission
        const originalBtnHTML = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>SENDING...';
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            targetForm.reset();
            trackEvent('Conversion', 'Form Submission Success', targetForm.id || 'General Form');
        } catch (error) {
            trackEvent('Conversion', 'Form Submission Error', error.message);
        } finally {
            btn.innerHTML = originalBtnHTML;
            btn.disabled = false;
        }
    });

    // Real-time validation feedback
    targetForm.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('is-invalid');
            }
        });
    });
}

/* Hero particles effect */
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
        trackEvent('Engagement', 'Hero Title Slide', titles[index].textContent.trim());
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
            trackEvent('Navigation', 'Work Slider', 'Previous');
        }
    });

    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, cards.length - Math.floor(track.parentElement.offsetWidth / scrollAmount));
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
            trackEvent('Navigation', 'Work Slider', 'Next');
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
        trackEvent('Engagement', 'Work Slider Drag', 'Start');
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
        trackEvent('Engagement', 'Work Slider Drag', 'End');
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
    // data is now loaded via script tag: chatbot-data.js
    const botData = typeof LOUD_CHAT_DATA !== 'undefined' ? LOUD_CHAT_DATA : {
        config: { introMessage: "Welcome to Saventure! How can I help you today?" },
        knowledgeBase: [],
        fallback: "I'm having trouble accessing my full knowledge base. Please reach out to our team via the Contact page!"
    };

    // Prevent duplicate injection
    if (document.getElementById('loudChatWidget')) return;

    // Create Chat Widget HTML
    const chatHTML = `
        <button class="chat-widget-toggle" id="chatToggle" aria-label="Open Chat Assistant">
            <i class="fas fa-comment-dots"></i>
            <span class="chat-badge" id="chatBadge" aria-hidden="true"></span>
        </button>

        <div class="chat-widget" id="loudChatWidget">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="chat-title">
                        <h4>Sara</h4>
                        <span>AI Assistant • Online</span>
                    </div>
                </div>
                <button class="chat-close" id="chatClose" aria-label="Close Chat Assistant">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="chat-messages" id="chatMessages"></div>
            
            <div class="chat-quick-actions" id="chatQuickActions">
                <button class="quick-action-btn" data-query="Services">Services</button>
                <button class="quick-action-btn" data-query="FMCG Sector">FMCG</button>
                <button class="quick-action-btn" data-query="Medical Sector">Medical</button>
                <button class="quick-action-btn" data-query="How to contact?">Contact</button>
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

    // Update Quick Actions from JSON
    if (botData.quickActions) {
        const qaContainer = document.getElementById('chatQuickActions');
        qaContainer.innerHTML = botData.quickActions.map(action =>
            `<button class="quick-action-btn" data-query="${action.query}" aria-label="Ask about ${action.label}">${action.label}</button>`
        ).join('');
    }

    // Elements
    const toggleBtn = document.getElementById('chatToggle');
    const closeBtn = document.getElementById('chatClose');
    const widget = document.getElementById('loudChatWidget');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const messages = document.getElementById('chatMessages');
    const qaContainer = document.getElementById('chatQuickActions');
    const chatBadge = document.getElementById('chatBadge');

    // Toggle Chat
    function toggleChat() {
        widget.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');

        // Remove badge on first open
        if (chatBadge) chatBadge.remove();

        if (widget.classList.contains('active')) {
            icon.classList.remove('fa-comment-dots');
            icon.classList.add('fa-chevron-down');
            input.focus();

            // Initial greeting if empty
            if (messages.children.length === 0) {
                setTimeout(() => {
                    addMessage(botData.config.introMessage, 'bot');
                }, 500);
            }
            trackEvent('Chatbot', 'Toggle Chat', 'Open');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-comment-dots');
            trackEvent('Chatbot', 'Toggle Chat', 'Close');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);

    // Dynamic Knowledge Base Logic
    function getBotResponse(input) {
        const query = input.toLowerCase();

        // Search through knowledge base
        for (const item of botData.knowledgeBase) {
            if (item.keywords.some(key => query.includes(key))) {
                return item.response;
            }
        }

        // Return fallback
        return botData.fallback;
    }

    // Send Message Logic
    function sendMessage() {
        const text = input.value.trim();
        if (text === '') return;

        addMessage(text, 'user');
        input.value = '';

        // Show typing indicator
        const typingId = showTypingIndicator();

        // Bot Response with delay
        setTimeout(() => {
            removeTypingIndicator(typingId);
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 800 + (text.length * 10)); // Variable delay based on length
    }

    // Show/Remove Typing
    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = id;
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const indicator = document.getElementById(id);
        if (indicator) indicator.remove();
    }

    // Add Message to UI
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);

        // Add animation style
        msgDiv.style.opacity = '0';
        msgDiv.style.transform = 'translateY(10px)';

        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        messages.appendChild(msgDiv);

        // Trigger reflow for animation
        setTimeout(() => {
            msgDiv.style.transition = 'all 0.3s ease';
            msgDiv.style.opacity = '1';
            msgDiv.style.transform = 'translateY(0)';
        }, 10);

        messages.scrollTop = messages.scrollHeight;
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    closeBtn.addEventListener('click', toggleChat);

    // Quick Action Listeners
    qaContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-action-btn');
        if (btn) {
            const query = btn.getAttribute('data-query');
            input.value = query;
            sendMessage();
        }
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

/* Dynamic Blog Rendering */
function renderBlogs() {
    const container = document.getElementById('blogContainer');
    if (!container || typeof LOUD_BLOG_DATA === 'undefined') {
        console.warn('Blog container or data missing');
        return;
    }

    // Clear existing (if any)
    container.innerHTML = '';

    LOUD_BLOG_DATA.forEach(article => {
        const blogCard = `
            <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="${article.delay}">
                <div class="blog-card h-100 shadow-sm border-0">
                    <div class="blog-image-wrapper">
                        <img src="${article.image}" class="img-fluid" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover;">
                        <div class="blog-category" style="position: absolute; top: 1rem; left: 1rem; background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 600;">${article.category}</div>
                    </div>
                    <div class="blog-content p-4 bg-white">
                        <h3 class="h5 mb-3 fw-bold">${article.title}</h3>
                        <p class="text-muted small mb-4">${article.excerpt}</p>
                        <a href="${article.link}" class="blog-read-more text-decoration-none fw-bold" style="color: var(--primary);">Read More <i class="fas fa-arrow-right ms-2"></i></a>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', blogCard);
    });
}


