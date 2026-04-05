document.addEventListener('DOMContentLoaded', () => {

    // ── Canvas Particle Background ─────────────────────────────
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        const particles = Array.from({ length: 80 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.5 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.003 + 0.001,
            // teal or violet
            hue: Math.random() > 0.5 ? 280 : 190,
        }));

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.016;
            particles.forEach(p => {
                const alpha = 0.2 + 0.3 * Math.sin(t * p.speed * 60 + p.phase);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    // ── Scroll Progress & Nav State ────────────────────────────
    const prog = document.getElementById('scroll-progress');
    const nav  = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        const s = document.documentElement.scrollTop;
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (prog) prog.style.width = `${(s / h) * 100}%`;
        if (nav)  nav.classList.toggle('scrolled', s > 60);
    }, { passive: true });

    // ── Burger Menu ────────────────────────────────────────────
    const burger  = document.getElementById('burger');
    const overlay = document.getElementById('mobOverlay');

    if (burger && overlay) {
        burger.addEventListener('click', () => overlay.classList.toggle('open'));
        overlay.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => overlay.classList.remove('open'));
        });
    }

    // ── Reveal on Scroll ──────────────────────────────────────
    const reveals = document.querySelectorAll('[data-reveal]');
    const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const delay = parseInt(e.target.dataset.delay || 0);
            setTimeout(() => e.target.classList.add('visible'), delay);
            ro.unobserve(e.target);
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => ro.observe(el));

    // Hero immediate reveal
    setTimeout(() => {
        document.querySelectorAll('.hero [data-reveal]').forEach(el => el.classList.add('visible'));
    }, 80);

    // ── Counter Animation ─────────────────────────────────────
    const counters = document.querySelectorAll('.count');
    const co = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.to;
            const dur = 1800;
            const start = performance.now();
            const update = (now) => {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target).toLocaleString();
                if (p < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => co.observe(c));

    // ── FAQ Accordion ─────────────────────────────────────────
    document.querySelectorAll('.fq').forEach(fq => {
        fq.querySelector('.fq-q').addEventListener('click', () => {
            const isOpen = fq.classList.contains('open');
            document.querySelectorAll('.fq').forEach(f => {
                f.classList.remove('open');
                f.querySelector('.fq-a').style.maxHeight = null;
            });
            if (!isOpen) {
                fq.classList.add('open');
                fq.querySelector('.fq-a').style.maxHeight = fq.querySelector('.fq-a').scrollHeight + 'px';
            }
        });
    });

    // ── Water bar demo animation ──────────────────────────────
    const wb = document.querySelector('.wb-fill');
    if (wb) {
        const wbo = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { wb.style.width = '0%'; setTimeout(() => { wb.style.width = '0%'; }, 100); wbo.unobserve(e.target); }
        }, { threshold: 0.5 });
        wbo.observe(wb);
    }

    // ── Bento card spotlight ──────────────────────────────────
    document.querySelectorAll('.fb-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
    });

    // ── Smooth Scroll ─────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
            }
        });
    });

    // ── Ambient parallax ─────────────────────────────────────
    let raf = false;
    document.addEventListener('mousemove', e => {
        if (raf) return; raf = true;
        requestAnimationFrame(() => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            document.querySelectorAll('.dl-glow-1, .dl-glow-2, .mockup-glow').forEach((el, i) => {
                const mul = i % 2 === 0 ? 40 : -50;
                el.style.transform = `translate(calc(-50% + ${nx * mul}px), calc(-50% + ${ny * mul}px))`;
            });
            raf = false;
        });
    });

});
