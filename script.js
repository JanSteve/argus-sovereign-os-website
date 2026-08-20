document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(5, 5, 10, 0.95)';
                navLinks.style.padding = '1rem';
                navLinks.style.backdropFilter = 'blur(12px)';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                
                const links = navLinks.querySelectorAll('a');
                links.forEach(link => {
                    link.style.margin = '1rem 0';
                    link.style.textAlign = 'center';
                });
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Active nav link highlighting
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });
});
