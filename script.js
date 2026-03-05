// ===== Header scroll effect =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== Mobile menu =====
const menuBtn = document.querySelector('.mobile-menu-btn');
let mobileNav = document.querySelector('.mobile-nav');

if (!mobileNav) {
    mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
        <a href="#beneficios">Beneficios</a>
        <a href="#proceso">Proceso</a>
        <a href="#faq">Preguntas</a>
        <a href="#contacto">Cotizar Gratis</a>
    `;
    header.after(mobileNav);
}

menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
    const spans = menuBtn.querySelectorAll('span');
    if (mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== Phone formatting (Chile: +56 9 XXXX XXXX) =====
const phoneInput = document.getElementById('telefono');
phoneInput.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, '');
    // If user didn't start with 56, prepend it
    if (digits.length > 0 && !digits.startsWith('56')) {
        // If starts with 9 and 8 digits, assume mobile without country code
        if (digits.startsWith('9') && digits.length <= 9) {
            digits = '56' + digits;
        }
    }
    // Limit to 11 digits (56 + 9 + 8 digits)
    digits = digits.slice(0, 11);
    // Format: +56 9 XXXX XXXX
    let formatted = '';
    if (digits.length > 0) formatted = '+' + digits.slice(0, 2);
    if (digits.length > 2) formatted += ' ' + digits.slice(2, 3);
    if (digits.length > 3) formatted += ' ' + digits.slice(3, 7);
    if (digits.length > 7) formatted += ' ' + digits.slice(7, 11);
    phoneInput.value = formatted;
});

// ===== Form handling =====
const form = document.getElementById('leadForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Build WhatsApp message
    let message = `Hola, me interesa el revestimiento de fibra de vidrio para mi piscina.\n\n`;
    message += `*Nombre:* ${data.nombre}\n`;
    message += `*Teléfono:* ${data.telefono}\n`;
    if (data.email) message += `*Correo:* ${data.email}\n`;
    if (data.comuna) message += `*Comuna:* ${data.comuna}\n`;
    if (data.medidas) message += `*Medidas (Largo x Ancho):* ${data.medidas}\n`;
    if (data.profundidad_min) message += `*Profundidad Mínima:* ${data.profundidad_min}\n`;
    if (data.profundidad_max) message += `*Profundidad Máxima:* ${data.profundidad_max}\n`;

    const whatsappUrl = `https://wa.me/56982256792?text=${encodeURIComponent(message)}`;

    // Show success state
    const wrapper = document.querySelector('.contact-form-wrapper');
    form.style.display = 'none';

    const success = document.createElement('div');
    success.className = 'form-success active';
    success.innerHTML = `
        <div class="form-success-icon">✓</div>
        <h3>¡Datos enviados!</h3>
        <p>Serás redirigido a WhatsApp para confirmar tu solicitud. Si no se abre automáticamente, haz clic en el botón.</p>
        <br>
        <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-lg" style="background:#25D366">Abrir WhatsApp</a>
    `;
    wrapper.appendChild(success);

    // Track form conversion
    trackEvent('generate_lead', {
        event_category: 'form',
        event_label: 'cotizacion_whatsapp',
        comuna: data.comuna || 'no especificada'
    });

    // Open WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
});

// ===== Gallery Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryItems = document.querySelectorAll('.gallery-item img');
let currentIndex = 0;

galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentIndex = index;
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
});

document.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
});

document.querySelector('.lightbox-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') { document.querySelector('.lightbox-prev').click(); }
    if (e.key === 'ArrowRight') { document.querySelector('.lightbox-next').click(); }
});

// ===== Scroll animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in to sections
document.querySelectorAll('.problem-card, .benefit-card, .process-step, .testimonial-card, .stat, .faq-item, .financing-card, .gallery-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Mobile Sticky CTA - ocultar al llegar al formulario =====
const mobileCta = document.getElementById('mobileCta');
const contactSection = document.getElementById('contacto');

if (mobileCta && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                mobileCta.classList.add('hidden');
            } else {
                mobileCta.classList.remove('hidden');
            }
        });
    }, { threshold: 0.2 });

    ctaObserver.observe(contactSection);
}

// ===== Analytics Helper =====
function trackEvent(eventName, params = {}) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
    // Meta Pixel
    if (typeof fbq === 'function') {
        fbq('track', eventName, params);
    }
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.className || 'header'
        });
    });
});

// Track WhatsApp clicks
const waFloat = document.querySelector('.whatsapp-float');
if (waFloat) {
    waFloat.addEventListener('click', () => {
        trackEvent('whatsapp_click', { source: 'floating_button' });
    });
}
