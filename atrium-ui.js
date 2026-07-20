const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const panel = document.querySelector('.contact-panel');

document.documentElement.classList.add('has-reveal');
const revealItems = document.querySelectorAll('.timeline-item');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

if (panel && !reducedMotion && matchMedia('(pointer:fine)').matches) {
  panel.addEventListener('pointermove', event => {
    const rect = panel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    panel.style.setProperty('--light-x', `${x * 100}%`);
    panel.style.setProperty('--light-y', `${y * 100}%`);
    panel.style.setProperty('--tilt-x', `${(0.5 - y) * 3.2}deg`);
    panel.style.setProperty('--tilt-y', `${(x - 0.5) * 4.2}deg`);
  });
  panel.addEventListener('pointerleave', () => {
    panel.style.setProperty('--tilt-x', '0deg');
    panel.style.setProperty('--tilt-y', '0deg');
  });
}
