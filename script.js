/* ══════════════════════════════════════════════════════════════
   Graci Parente · script principal
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────
     1) CONFIGURAÇÃO DO WHATSAPP
     Troque o número abaixo pelo número real (com DDI 55).
     As mensagens são pré-preenchidas por origem do clique,
     o que ajuda a Graci a saber de qual botão veio o contato.
     ──────────────────────────────────────────────── */
  const WHATSAPP = {
    numero: '5500000000000', // ← TROCAR pelo número real, ex: '5543999999999'
    mensagens: {
      header:        'Olá, Graci! Vim pelo site e gostaria de agendar minha consulta.',
      hero:          'Olá, Graci! Vim pelo site e quero agendar minha consulta.',
      processo:      'Olá, Graci! Quero dar o primeiro passo no acompanhamento. Pode me ajudar?',
      'cta-final':   'Olá, Graci! Quero começar meu acompanhamento nutricional.',
      'barra-mobile':'Olá, Graci! Vim pelo site e gostaria de agendar minha consulta.',
      float:         'Olá, Graci! Vim pelo site e tenho uma dúvida.',
      footer:        'Olá, Graci! Vim pelo site e gostaria de mais informações.',
      default:       'Olá, Graci! Vim pelo site e gostaria de mais informações.'
    }
  };

  function montarLink(origem) {
    const texto = WHATSAPP.mensagens[origem] || WHATSAPP.mensagens.default;
    return 'https://wa.me/' + WHATSAPP.numero + '?text=' + encodeURIComponent(texto);
  }

  // Aplica o href correto em todos os elementos com data-wha
  document.querySelectorAll('[data-wha]').forEach(function (el) {
    el.setAttribute('href', montarLink(el.dataset.wha));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ────────────────────────────────────────────────
     2) SCROLL REVEAL (com fallback)
     ──────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || prefersReduced) {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  } else {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const parent = entry.target.parentElement;
        const siblings = [].slice.call(parent.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(function () { entry.target.classList.add('visible'); }, idx * 80);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* ────────────────────────────────────────────────
     3) HEADER STICKY + BARRA MOBILE
     Aparecem depois que o usuário rola para fora do hero.
     ──────────────────────────────────────────────── */
  const header = document.getElementById('siteHeader');
  const mobileCta = document.getElementById('mobileCta');
  const gatilho = window.innerHeight * 0.6;
  let ticking = false;

  function aoRolar() {
    const passou = window.scrollY > gatilho;
    if (header)    header.classList.toggle('visible', passou);
    if (mobileCta) mobileCta.classList.toggle('visible', passou);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(aoRolar);
      ticking = true;
    }
  }, { passive: true });
  aoRolar();

  /* ────────────────────────────────────────────────
     4) FAQ — fecha as demais ao abrir uma (acordeão)
     ──────────────────────────────────────────────── */
  const faqItens = document.querySelectorAll('.faq-item');
  faqItens.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItens.forEach(function (outro) {
        if (outro !== item) outro.open = false;
      });
    });
  });

  /* ────────────────────────────────────────────────
     5) ANO DINÂMICO NO RODAPÉ
     ──────────────────────────────────────────────── */
  const anoEl = document.getElementById('year');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

})();