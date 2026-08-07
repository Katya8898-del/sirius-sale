(() => {
  const preventHangingWords = () => {
    const shortWords = /(^|[\s(«])((?:и|а|но|в|во|на|по|к|ко|с|со|у|о|об|от|до|за|из|для|при|без|под|над))\s+(?=[А-Яа-яЁёA-Za-z0-9«])/giu;
    document.querySelectorAll('h1,h2,h3,p,span,figcaption,a').forEach((element) => {
      element.childNodes.forEach((node) => {
        if (node.nodeType !== Node.TEXT_NODE) return;
        node.textContent = node.textContent
          .replace(shortWords, '$1$2\u00a0')
          .replace(/(\d)\s+(?=(?:млн|тыс|₽))/giu, '$1\u00a0');
      });
    });
  };
  preventHangingWords();

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const projectGrid = document.querySelector('.project-grid');
  const projectCards = [...document.querySelectorAll('.project-grid .project')];
  const projectDots = [...document.querySelectorAll('[data-project-dot]')];

  const closeMenu = () => {
    header?.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Открыть меню');
  };

  menuToggle?.addEventListener('click', () => {
    const willOpen = !header?.classList.contains('menu-open');
    header?.classList.toggle('menu-open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    menuToggle.setAttribute('aria-label', willOpen ? 'Закрыть меню' : 'Открыть меню');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });

  const getCurrentProject = () => {
    if (!projectGrid || !projectCards.length) return 0;
    return projectCards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - projectGrid.offsetLeft - projectGrid.scrollLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Infinity }).index;
  };

  const showProject = (index) => {
    if (!projectGrid || !projectCards.length) return;
    const target = Math.max(0, Math.min(index, projectCards.length - 1));
    projectGrid.scrollTo({ left: projectCards[target].offsetLeft - projectGrid.offsetLeft, behavior: 'smooth' });
    projectDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === target));
  };

  document.querySelector('[data-project-prev]')?.addEventListener('click', () => showProject(getCurrentProject() - 1));
  document.querySelector('[data-project-next]')?.addEventListener('click', () => showProject(getCurrentProject() + 1));
  projectDots.forEach((dot, index) => dot.addEventListener('click', () => showProject(index)));
  projectGrid?.addEventListener('scroll', () => {
    const current = getCurrentProject();
    projectDots.forEach((dot, index) => dot.classList.toggle('is-active', index === current));
  }, { passive: true });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 20);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  navLinks.forEach((link) => link.addEventListener('click', () => {
    closeMenu();
    navLinks.forEach((item) => item.classList.remove('is-active'));
    link.classList.add('is-active');
  }));
})();
