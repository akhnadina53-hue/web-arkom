export function triggerParticleBurst(originElement?: HTMLElement) {
  const origin = originElement?.getBoundingClientRect();
  const x = origin ? origin.left + origin.width / 2 : window.innerWidth / 2;
  const y = origin ? origin.top + origin.height / 2 : window.innerHeight / 2;

  const colors = [
    'var(--color-smurf-300)',
    'var(--color-smurf-400)',
    'var(--color-snitch-400)',
    'var(--color-smurf-300)',
  ];

  Array.from({ length: 8 }).forEach((_, i) => {
    const particle = document.createElement('div');
    const angle = (i / 8) * Math.PI * 2;
    const distance = 24 + Math.random() * 16;

    particle.style.cssText = `
      position: fixed;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      left: ${x}px; top: ${y}px;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    `;

    document.body.appendChild(particle);

    particle.animate([
      { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
      {
        transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`,
        opacity: 0,
      },
    ], {
      duration: 400,
      easing: 'cubic-bezier(0, 0.9, 0.57, 1)',
      fill: 'forwards',
    }).onfinish = () => particle.remove();
  });
}
