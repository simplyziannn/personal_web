document.querySelectorAll('.project-actions').forEach(actionGroup => {
  const actionLinks = [...actionGroup.querySelectorAll('a')];
  if (!actionLinks.length) return;

  const defaultAction = actionLinks[0];
  const moveShade = link => {
    actionLinks.forEach(item => item.classList.toggle('is-shade-active', item === link));
    actionGroup.style.setProperty('--shade-x', `${link.offsetLeft}px`);
    actionGroup.style.setProperty('--shade-y', `${link.offsetTop}px`);
    actionGroup.style.setProperty('--shade-w', `${link.offsetWidth}px`);
    actionGroup.style.setProperty('--shade-h', `${link.offsetHeight}px`);
  };

  actionGroup.classList.add('has-sliding-shade');
  actionLinks.forEach(link => {
    link.addEventListener('pointerenter', () => moveShade(link));
    link.addEventListener('focus', () => moveShade(link));
  });
  actionGroup.addEventListener('pointerleave', () => moveShade(defaultAction));
  actionGroup.addEventListener('focusout', event => {
    if (!actionGroup.contains(event.relatedTarget)) moveShade(defaultAction);
  });
  addEventListener('resize', () => moveShade(actionGroup.querySelector('.is-shade-active') || defaultAction), { passive: true });
  requestAnimationFrame(() => moveShade(defaultAction));
});
