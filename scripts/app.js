document.addEventListener('DOMContentLoaded', () => {
  const projectStages = {
    tfinder: {
      bg: '#f9efe8',
      title: 'tfinder — zsh',
      prompt: '$',
      cmd: 'tf "find files over 100MB changed this week"',
      arrow: '→',
      res: 'find . -type f -size +100M -mtime -7',
      check: '✓',
      verify: 'verified: read-only, no side effects',
      caption: 'Plain English in, verified command out.',
      captionColor: '#7c4a33',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    tenvilo: {
      bg: '#eef3fb',
      title: 'tenvilo — chrome workspace',
      prompt: '$',
      cmd: 'tenvilo switch "Payment Service Release"',
      arrow: '→',
      res: '5 tabs restored (localhost:3000, Swagger, PR #142)',
      check: '✓',
      verify: 'focus mode: non-work domains paused',
      caption: 'One-click presets, zero tab clutter.',
      captionColor: '#2b4c7e',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    notation: {
      bg: '#eef6f1',
      title: 'notation — system-design.md',
      prompt: '>',
      cmd: '/architecture/resilient-scraping.md',
      arrow: '→',
      res: 'linked 4 nodes: [[Worker Pools]], [[JA4 Matching]]',
      check: '✓',
      verify: 'markdown graph synced to local disk',
      caption: 'Connected markdown notes, local-first.',
      captionColor: '#225939',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    fleetdaemon: {
      bg: '#f7f3e6',
      title: 'fleetctl — status --live',
      prompt: '$',
      cmd: 'fleetctl ingest --workers=250 --target=api',
      arrow: '→',
      res: '1.8M payloads/day streamed · 38ms median',
      check: '✓',
      verify: '0 DOM overhead · auto proxy failover',
      caption: 'Autonomous ingestion engine for production loads.',
      captionColor: '#6d531a',
      linkUrl: 'https://x.com/WilsonWizard'
    }
  };

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
          <div class="terminal-title" id="terminal-title">tfinder — zsh</div>
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
            <button class="term-btn term-btn-primary" type="button" id="term-run-btn">Run</button>
            <button class="term-btn term-btn-ghost" type="button" id="term-edit-btn">Edit</button>
            <button class="term-btn term-btn-ghost" type="button" id="term-copy-btn">Copy</button>
          </div>
        </div>
      </div>
      <p class="terminal-caption" id="terminal-caption">Plain English in, verified command out.</p>
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
  const termRunBtn = document.getElementById('term-run-btn');

  if (termCopyBtn) {
    termCopyBtn.addEventListener('click', () => {
      const textToCopy = termRes ? termRes.textContent : '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
      }
      termCopyBtn.textContent = 'Copied!';
      setTimeout(() => {
        termCopyBtn.textContent = 'Copy';
      }, 1400);
    });
  }

  if (termRunBtn) {
    termRunBtn.addEventListener('click', () => {
      termRunBtn.textContent = 'Running...';
      setTimeout(() => {
        termRunBtn.textContent = 'Done ✓';
        setTimeout(() => {
          termRunBtn.textContent = 'Run';
        }, 1200);
      }, 500);
    });
  }

  const selectProject = (key, animate = true) => {
    if (key === activeKey) return;
    activeKey = key;
    const data = projectStages[key] || projectStages.tfinder;

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
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === '1') selectProject('tfinder', true);
    if (e.key === '2') selectProject('tenvilo', true);
    if (e.key === '3') selectProject('notation', true);
    if (e.key === '4') selectProject('fleetdaemon', true);
  });

  // Interactive Pipeline Board Pills (01 Ingestion, 02 Execution, 03 Delivery)
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
      const isAlreadyActive = pill.classList.contains('active');
      highlightCol(isAlreadyActive ? null : idx);
    });
  });

  // Pillar card clicks
  const contactSection = document.getElementById('contact');
  document.querySelectorAll('.pillar-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.mini-cta')) return;
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const workSection = document.getElementById('work');
  document.querySelectorAll('.board-col .event-chip').forEach((chip, idx) => {
    chip.addEventListener('click', () => {
      const projMap = ['fleetdaemon', 'fleetdaemon', 'fleetdaemon', 'fleetdaemon', 'tfinder', 'tenvilo'];
      selectProject(projMap[idx] || 'tfinder', true);
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Smooth Scroll Reveal
  const revealTargets = document.querySelectorAll(
    '.section-header-center, .split-feature-grid, .pillar-card, .cta-block'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    revealTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.92) {
        if (el.classList.contains('pillar-card')) {
          const idx = Array.from(el.parentElement.children).indexOf(el);
          el.style.transitionDelay = `${idx * 70}ms`;
        }
        el.classList.add('reveal-ready');
        observer.observe(el);
      }
    });
  }
});
