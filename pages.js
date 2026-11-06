(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progressTrack = document.createElement("div");
    const progressBar = document.createElement("span");
    let progressFrame = 0;

    progressTrack.className = "scroll-progress";
    progressTrack.setAttribute("aria-hidden", "true");
    progressTrack.append(progressBar);
    document.body.prepend(progressTrack);

    const updateScrollEffects = () => {
        if (progressFrame) {
            return;
        }

        progressFrame = window.requestAnimationFrame(() => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

            progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
            document.querySelector(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 12);
            progressFrame = 0;
        });
    };

    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    window.addEventListener("resize", updateScrollEffects);
    updateScrollEffects();

    const revealTargets = document.querySelectorAll(
        ".home-hero .hero-copy, .home-hero .hero-art, .action-tile, .section-topline, " +
        ".story-card, .advocacy-heading, .advocacy-copy, .article-category, .article-slot, " +
        ".about-panel, .team-card, .video-project, .credits-panel, .contact-hero, " +
        ".contact-section-heading, .contact-options, .infographic-feature, .article-index-intro, " +
        ".article-index-page > .section-jump"
    );

    if (reducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -48px 0px",
        threshold: 0.08
    });

    revealTargets.forEach((target) => observer.observe(target));
})();