document.addEventListener('DOMContentLoaded', () => {
  const projectStages = {
    tfinder: {
      bg: '#f9efe8',
      key: '1',
      prompt: 'tf "kill whatever is running on port 8080 and start api"',
      chips: [
        {
          bar: '#e8604c',
          fill: '#fce4de',
          ink: '#962d1e',
          title: 'Generated Shell Command',
          sub: 'lsof -ti tcp:8080 | xargs kill -15 && go run ./cmd/server'
        },
        {
          bar: '#2e9b5f',
          fill: '#dff2e6',
          ink: '#1d5e3a',
          title: 'Pre-Execution Safety Check',
          sub: 'AST verified in 14ms · Safe to execute [Enter / Esc]'
        }
      ],
      stack: 'Go · Python · OpenAI SDK',
      linkText: 'View Tfinder on Peerlist ↗',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    tenvilo: {
      bg: '#eef3fb',
      key: '2',
      prompt: 'Workspace: Payment Service Release (5 tabs)',
      chips: [
        {
          bar: '#3b7be8',
          fill: '#dfe9fb',
          ink: '#1f4a94',
          title: 'Instant Context Restore',
          sub: 'localhost:3000, Swagger Docs & GitHub PR opened in 1 click'
        },
        {
          bar: '#8b5cf6',
          fill: '#ede7fb',
          ink: '#4c2896',
          title: 'Deep-Work Focus Mode',
          sub: 'Social feeds & non-work domains paused while preset is active'
        }
      ],
      stack: 'JavaScript · Chrome Manifest V3 · IndexedDB',
      linkText: 'View Tenvilo on Peerlist ↗',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    notation: {
      bg: '#eef6f1',
      key: '3',
      prompt: '/notes/system-design.md',
      chips: [
        {
          bar: '#2e9b5f',
          fill: '#dff2e6',
          ink: '#1d5e3a',
          title: 'Automatic Graph Linking',
          sub: 'Typing [[Worker Pool]] links related architecture notes'
        },
        {
          bar: '#d98b1a',
          fill: '#fbecd2',
          ink: '#7a4b08',
          title: 'Keyboard-First Block Editor',
          sub: 'Instant slash commands & clean local Markdown export'
        }
      ],
      stack: 'TypeScript · Python · Markdown AST',
      linkText: 'View Notation on Peerlist ↗',
      linkUrl: 'https://peerlist.io/wilsonwizard'
    },
    fleetdaemon: {
      bg: '#f7f3e6',
      key: '4',
      prompt: 'fleetctl ingest --target=internal-api --workers=250 --tls=ja4',
      chips: [
        {
          bar: '#d98b1a',
          fill: '#fbecd2',
          ink: '#7a4b08',
          title: 'High-Volume Payload Streaming',
          sub: '1.8M daily records processed on an 8GB VPS at 38ms median latency'
        },
        {
          bar: '#3b7be8',
          fill: '#dfe9fb',
          ink: '#1f4a94',
          title: 'Stealth & Resilience Layer',
          sub: 'Pooled residential proxy rotation with automated token renewal pipeline'
        }
      ],
      stack: 'Go · Python · Redis · ClickHouse',
      linkText: 'Discuss High-Scale Pipelines ↗',
      linkUrl: 'https://x.com/WilsonWizard'
    }
  };

  // Alias for backward compatibility
  projectStages.automation = projectStages.fleetdaemon;

  const stageEl = document.getElementById('project-stage');
  const tabs = document.querySelectorAll('.feature-tab');
  let activeKey = null;
  let currentAnim = null;

  // Mount persistent stage card once to avoid DOM destruction & layout thrashing
  if (stageEl) {
    stageEl.innerHTML = `
      <div class="stage-card" id="stage-card">
        <div class="stage-search-bar">
          <kbd class="keycap" id="stage-key"></kbd>
          <span class="mono" id="stage-prompt" style="font-size:12.5px;"></span>
        </div>
        <div class="stage-rows" id="stage-rows"></div>
        <div class="stage-link-row">
          <span class="mono" id="stage-stack"></span>
          <a href="#" target="_blank" rel="noopener noreferrer" class="stage-ext-link" id="stage-link"></a>
        </div>
      </div>
    `;
  }

  const stageCard = document.getElementById('stage-card');
  const stageKey = document.getElementById('stage-key');
  const stagePrompt = document.getElementById('stage-prompt');
  const stageRows = document.getElementById('stage-rows');
  const stageStack = document.getElementById('stage-stack');
  const stageLink = document.getElementById('stage-link');

  const selectProject = (key, animate = true) => {
    if (key === activeKey) return;
    activeKey = key;
    const data = projectStages[key] || projectStages.tfinder;

    tabs.forEach((tab) => {
      const isMatch = tab.getAttribute('data-proj') === key;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    if (!stageEl || !stageCard) return;
    stageEl.style.backgroundColor = data.bg;

    stageKey.textContent = data.key;
    stagePrompt.textContent = data.prompt;
    stageRows.innerHTML = data.chips
      .map(
        (c) => `
        <div class="event-chip" style="--bar:${c.bar}; --fill:${c.fill}; --ink:${c.ink};">
          <p class="chip-title">${c.title}</p>
          <p class="chip-sub mono" style="font-size:11.5px;">${c.sub}</p>
        </div>
      `
      )
      .join('');
    stageStack.textContent = data.stack;
    stageLink.textContent = data.linkText;
    stageLink.href = data.linkUrl;

    if (animate && typeof stageCard.animate === 'function') {
      if (currentAnim) currentAnim.cancel();
      currentAnim = stageCard.animate(
        [
          { opacity: 0.4, transform: 'translate3d(0, 6px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ],
        {
          duration: 240,
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

  // Make Services & Deliverables cards (.pillar-card) and Pipeline chips clickable
  const contactSection = document.getElementById('contact');
  document.querySelectorAll('.pillar-card').forEach((card) => {
    card.addEventListener('click', () => {
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

  // Smooth Compositor-Only Scroll Reveal (IntersectionObserver)
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
