document.addEventListener('DOMContentLoaded', () => {
  const GH = 'https://github.com/Code-Wizard-Wilson';

  const projectStages = {
    tfinder: {
      bg: '#fce4de',
      title: 'tf — zsh',
      prompt: '$',
      cmd: 'tf why is my Mac slow',
      arrow: '→',
      res: 'Top processes by CPU · 377  WindowServer  16.8%  121 MiB',
      check: '✓',
      verify: 'typed action · the model cannot emit shell code',
      caption: 'Plain English in, a registered action out.',
      captionColor: '#962d1e',
      linkLabel: 'Open repository',
      linkUrl: GH + '/tfinder'
    },
    screenshots: {
      bg: '#f9efe8',
      title: 'Screenshot Manager — capture',
      prompt: '⌘',
      cmd: 'capture area → annotate → recognize text',
      arrow: '→',
      res: 'text recognized and copied · saved to local library',
      check: '✓',
      verify: 'Apple Vision on-device · no telemetry',
      caption: 'Native capture, annotation and OCR in one window.',
      captionColor: '#7c4a33',
      linkLabel: 'Open repository',
      linkUrl: GH + '/Mac-Screenshot-Manager'
    },
    notation: {
      bg: '#eef6f1',
      title: 'notation — ~/Documents/Notation Data',
      prompt: '>',
      cmd: 'new note "resilient-scraping"',
      arrow: '→',
      res: 'mirrored → Notes/resilient-scraping.md · 2 backlinks linked',
      check: '✓',
      verify: 'local-first · served on 127.0.0.1 · nothing uploaded',
      caption: 'Every note is a real Markdown file on your own disk.',
      captionColor: '#225939',
      linkLabel: 'Open notation.is-a.dev',
      linkUrl: 'https://notation.is-a.dev/'
    },
    slopfinder: {
      bg: '#eef3fb',
      title: 'slop-finder — side panel',
      prompt: '$',
      cmd: 'scan feed --threshold=65',
      arrow: '→',
      res: 'style scored locally · strong matches taped · short posts abstained',
      check: '✓',
      verify: 'MLX on Apple Silicon · no cloud API call',
      caption: 'Heuristic style scoring that abstains instead of guessing.',
      captionColor: '#2b4c7e',
      linkLabel: 'Open repository',
      linkUrl: GH + '/slop-finder'
    },
    rainy75: {
      bg: '#f7f3e6',
      title: 'rainy75 studio — localhost',
      prompt: '$',
      cmd: 'stream github-heatmap --rows=5',
      arrow: '→',
      res: '83-key RGB framebuffer streaming over the management channel',
      check: '✓',
      verify: 'MCUboot test image · revert to stock available',
      caption: 'Open ZMK firmware with a local macOS control panel.',
      captionColor: '#6d531a',
      linkLabel: 'Open repository',
      linkUrl: GH + '/rainy75-studio'
    },
    private: {
      bg: '#ede7fb',
      title: 'ingest — production host',
      prompt: '$',
      cmd: 'systemctl status ingest@worker',
      arrow: '→',
      res: 'active (running) · proxy pool healthy · queue drained',
      check: '✓',
      verify: 'closed source · architecture walked through on request',
      caption: 'Client automation. I can describe the design, not the client.',
      captionColor: '#4c2896',
      linkLabel: 'Ask me about it',
      linkUrl: '#contact'
    }
  };

  const projectOrder = ['tfinder', 'screenshots', 'notation', 'slopfinder', 'rainy75', 'private'];

  const stageEl = document.getElementById('project-stage');
  const tabs = document.querySelectorAll('.feature-tab');
  let activeKey = null;
  let currentAnim = null;

  // Mount persistent terminal window
  if (stageEl) {
    stageEl.innerHTML = `
      <div class="terminal-window" id="terminal-window">
        <div class="terminal-titlebar">
          <div class="terminal-dots" aria-hidden="true">
            <span class="tdot red"></span>
            <span class="tdot yellow"></span>
            <span class="tdot green"></span>
          </div>
          <div class="terminal-title" id="terminal-title"></div>
          <div class="terminal-dots-balance" aria-hidden="true"></div>
        </div>
        <div class="terminal-body">
          <div class="term-row input-row">
            <span class="term-prompt" id="term-prompt">$</span>
            <span class="term-cmd" id="term-cmd"></span>
          </div>
          <div class="term-row output-row">
            <span class="term-arrow" id="term-arrow">→</span>
            <span class="term-res" id="term-res"></span>
          </div>
          <div class="term-row verify-row">
            <span class="term-check" id="term-check">✓</span>
            <span class="term-verify-text" id="term-verify"></span>
          </div>
          <div class="term-actions">
            <a class="term-btn term-btn-primary" id="term-open-link" href="#" target="_blank" rel="noopener noreferrer"></a>
            <button class="term-btn term-btn-ghost" type="button" id="term-copy-btn">Copy command</button>
          </div>
        </div>
      </div>
      <p class="terminal-caption" id="terminal-caption"></p>
    `;
  }

  const termWindow = document.getElementById('terminal-window');
  const termTitle = document.getElementById('terminal-title');
  const termPrompt = document.getElementById('term-prompt');
  const termCmd = document.getElementById('term-cmd');
  const termArrow = document.getElementById('term-arrow');
  const termRes = document.getElementById('term-res');
  const termCheck = document.getElementById('term-check');
  const termVerify = document.getElementById('term-verify');
  const termCaption = document.getElementById('terminal-caption');
  const termCopyBtn = document.getElementById('term-copy-btn');
  const termOpenLink = document.getElementById('term-open-link');

  if (termCopyBtn) {
    termCopyBtn.addEventListener('click', async () => {
      const text = termCmd ? termCmd.textContent : '';
      try {
        await navigator.clipboard.writeText(text);
        termCopyBtn.textContent = 'Copied';
      } catch {
        termCopyBtn.textContent = 'Copy failed';
      }
      setTimeout(() => {
        termCopyBtn.textContent = 'Copy command';
      }, 1400);
    });
  }

  const selectProject = (key, animate = true) => {
    if (!projectStages[key] || key === activeKey) return;
    activeKey = key;
    const data = projectStages[key];

    tabs.forEach((tab) => {
      const isMatch = tab.getAttribute('data-proj') === key;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (!stageEl || !termWindow) return;
    stageEl.style.backgroundColor = data.bg;

    if (termTitle) termTitle.textContent = data.title;
    if (termPrompt) termPrompt.textContent = data.prompt;
    if (termCmd) termCmd.textContent = data.cmd;
    if (termArrow) termArrow.textContent = data.arrow;
    if (termRes) termRes.textContent = data.res;
    if (termCheck) termCheck.textContent = data.check;
    if (termVerify) termVerify.textContent = data.verify;

    if (termOpenLink) {
      termOpenLink.textContent = data.linkLabel;
      termOpenLink.setAttribute('href', data.linkUrl);
      const isAnchor = data.linkUrl.startsWith('#');
      if (isAnchor) {
        termOpenLink.removeAttribute('target');
        termOpenLink.removeAttribute('rel');
      } else {
        termOpenLink.setAttribute('target', '_blank');
        termOpenLink.setAttribute('rel', 'noopener noreferrer');
      }
    }

    if (termCaption) {
      termCaption.textContent = data.caption;
      termCaption.style.color = data.captionColor;
    }

    if (animate && typeof termWindow.animate === 'function') {
      if (currentAnim) currentAnim.cancel();
      currentAnim = termWindow.animate(
        [
          { opacity: 0.45, transform: 'translate3d(0, 6px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ],
        {
          duration: 220,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        }
      );
    }
  };

  selectProject('tfinder', false);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectProject(tab.getAttribute('data-proj'), true);
    });
  });

  document.querySelectorAll('[data-select-proj]').forEach((link) => {
    link.addEventListener('click', () => {
      selectProject(link.getAttribute('data-select-proj'), true);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
    const idx = parseInt(e.key, 10) - 1;
    if (!Number.isNaN(idx) && projectOrder[idx]) {
      selectProject(projectOrder[idx], true);
    }
  });

  // Method board pills (01 Reverse / 02 Execute / 03 Operate)
  const boardPills = document.querySelectorAll('.board-pill');
  const boardCols = document.querySelectorAll('.board-col');

  const highlightCol = (idx) => {
    boardPills.forEach((pill, i) => pill.classList.toggle('active', i === idx));
    boardCols.forEach((col, i) => {
      col.classList.toggle('highlighted', i === idx);
      col.classList.toggle('dimmed', idx !== null && i !== idx);
    });
  };

  boardPills.forEach((pill, idx) => {
    pill.addEventListener('mouseenter', () => highlightCol(idx));
    pill.addEventListener('mouseleave', () => highlightCol(null));
    pill.addEventListener('click', () => {
      highlightCol(pill.classList.contains('active') ? null : idx);
    });
  });

  // Smooth scroll reveal
  const revealTargets = document.querySelectorAll(
    '.section-header-center, .split-feature-grid, .stack-card, .fact-strip, .cta-block'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('in-view');
          el.addEventListener(
            'transitionend',
            () => {
              el.classList.remove('reveal-ready', 'in-view');
              el.style.transitionDelay = '';
            },
            { once: true }
          );
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    revealTargets.forEach((el) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;
      if (el.classList.contains('stack-card')) {
        const idx = Array.from(el.parentElement.children).indexOf(el);
        el.style.transitionDelay = `${(idx % 3) * 70}ms`;
      }
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  }
});
