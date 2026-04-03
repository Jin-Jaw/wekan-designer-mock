(function () {
  const currentUserId = 'u1';
  const defaultCover = './assets/attachments/69cec8eb734acdbd0cad9697.png';

  const members = [
    {
      id: 'u1',
      name: 'nacho',
      username: 'nacho',
      initials: 'N',
      tone: 'hsl(337, 74%, 70%)',
      text: '#000',
      role: 'Product lead',
    },
    {
      id: 'u2',
      name: 'Sofia Costa',
      username: 'scosta',
      initials: 'S',
      tone: 'hsl(205, 72%, 68%)',
      text: '#0b1320',
      role: 'Design lead',
    },
    {
      id: 'u3',
      name: 'Matias Ruiz',
      username: 'mruiz',
      initials: 'M',
      tone: 'hsl(145, 55%, 63%)',
      text: '#0c2318',
      role: 'Frontend engineer',
    },
    {
      id: 'u4',
      name: 'Julieta Perez',
      username: 'jperez',
      initials: 'J',
      tone: 'hsl(46, 96%, 73%)',
      text: '#231700',
      role: 'QA lead',
    },
    {
      id: 'u5',
      name: 'Camila Sosa',
      username: 'csosa',
      initials: 'C',
      tone: 'hsl(271, 68%, 73%)',
      text: '#1a0b2d',
      role: 'Brand designer',
    },
    {
      id: 'u6',
      name: 'Diego Alvarez',
      username: 'dalvarez',
      initials: 'D',
      tone: 'hsl(18, 86%, 70%)',
      text: '#341307',
      role: 'Data analyst',
    },
    {
      id: 'u7',
      name: 'Valen Ortega',
      username: 'vortega',
      initials: 'V',
      tone: 'hsl(188, 74%, 67%)',
      text: '#06232a',
      role: 'Platform ops',
    },
    {
      id: 'u8',
      name: 'Lucas Ferrer',
      username: 'lferrer',
      initials: 'L',
      tone: 'hsl(355, 67%, 73%)',
      text: '#2b0910',
      role: 'Backend engineer',
    },
  ];

  const PRIORITY_META = {
    critical: { label: 'Critical', className: 'minicard-priority-critical', icon: 'fa-fire' },
    high: { label: 'High', className: 'minicard-priority-high', icon: 'fa-exclamation-circle' },
    medium: { label: 'Medium', className: 'minicard-priority-medium', icon: 'fa-info-circle' },
    low: { label: 'Low', className: 'minicard-priority-low', icon: 'fa-arrow-down' },
    lowest: { label: 'Lowest', className: 'minicard-priority-lowest', icon: 'fa-angle-double-down' },
  };

  const WATCH_META = {
    watching: { label: 'Vigilando', icon: 'fa-bell' },
    tracking: { label: 'Siguiendo', icon: 'fa-eye' },
    muted: { label: 'Silenciado', icon: 'fa-bell-slash' },
  };

  const BOARD_VIEW_META = {
    'board-view-swimlanes': { label: 'Carriles', icon: 'fa-th-large' },
    'board-view-lists': { label: 'Listas', icon: 'fa-trello' },
    'board-view-cal': { label: 'Calendario', icon: 'fa-calendar' },
    'board-view-gantt': { label: 'Gantt', icon: 'fa-bar-chart' },
  };

  const AUTO_COMMENT_LIBRARY = [
    'Keep this aligned with release scope and push any stretch items to the follow-up board.',
    'Please include a short rollout note for support once this is ready.',
    'If edge cases appear in QA, document them here before changing scope.',
    'Customer success asked for screenshots before this moves to launch.',
    'Flag anything that changes copy, analytics names, or legal wording.',
  ];

  const AUTO_ACTIVITY_LIBRARY = [
    'updated acceptance criteria',
    'reviewed latest handoff with design',
    'syncd implementation notes with engineering',
    'confirmed release scope with product',
    'triaged risk and next steps',
  ];

  const AUTO_TIME_LIBRARY = [
    'Hace 18 min',
    'Hace 42 min',
    'Hace 1 h',
    'Hace 2 h',
    'Hace 3 h',
  ];

  function seedFrom(value) {
    return String(value || '')
      .split('')
      .reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);
  }

  function pickFrom(list, seed, offset) {
    return list[(seed + offset) % list.length];
  }

  function comment(id, author, text, time) {
    return { id, author, text, time };
  }

  function activity(id, author, text, time) {
    return { id, author, text, time };
  }

  function attachment(id, name, meta) {
    return { id, name, meta };
  }

  function checklist(title, items) {
    return {
      title,
      items: items.map((item, index) => ({
        id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
        text: item.text,
        done: !!item.done,
      })),
    };
  }

  function makeAutoComments(card) {
    const seed = seedFrom(card.id);
    const primaryAuthor = card.assignees[0] || currentUserId;
    return [
      comment(
        `${card.id}-comment-auto-1`,
        primaryAuthor,
        pickFrom(AUTO_COMMENT_LIBRARY, seed, 0),
        pickFrom(AUTO_TIME_LIBRARY, seed, 1),
      ),
      comment(
        `${card.id}-comment-auto-2`,
        currentUserId,
        pickFrom(AUTO_COMMENT_LIBRARY, seed, 2),
        pickFrom(AUTO_TIME_LIBRARY, seed, 3),
      ),
    ];
  }

  function makeAutoActivity(card) {
    const seed = seedFrom(card.id);
    const primaryAuthor = card.assignees[0] || currentUserId;
    const secondaryAuthor = card.assignees[1] || currentUserId;
    return [
      activity(
        `${card.id}-activity-auto-1`,
        primaryAuthor,
        pickFrom(AUTO_ACTIVITY_LIBRARY, seed, 0),
        `2026-04-02 ${String((seed % 8) + 9).padStart(2, '0')}:${String((seed % 50) + 10).padStart(2, '0')}`,
      ),
      activity(
        `${card.id}-activity-auto-2`,
        secondaryAuthor,
        pickFrom(AUTO_ACTIVITY_LIBRARY, seed, 2),
        `2026-04-01 ${String((seed % 7) + 11).padStart(2, '0')}:${String((seed % 40) + 15).padStart(2, '0')}`,
      ),
    ];
  }

  function makeCard(data) {
    const card = Object.assign(
      {
        labels: [],
        members: [],
        assignees: [],
        comments: [],
        attachments: [],
        activity: [],
        description: '',
        checklist: null,
        priority: 'medium',
        cover: '',
        watching: false,
      },
      data,
    );

    if (!card.description) {
      card.description = `${card.title} is part of the current release scope. Capture implementation notes, QA feedback, and any rollout dependencies here.`;
    }

    if (!card.comments.length) {
      card.comments = makeAutoComments(card);
    }

    if (!card.activity.length) {
      card.activity = makeAutoActivity(card);
    }

    return card;
  }

  const initialState = {
    board: {
      title: 'Client Portal Release',
      swimlaneTitle: 'Release Candidate',
      colorClass: 'board-color-belize',
      watchLevel: 'tracking',
      starred: true,
      starCount: 14,
      labels: [
        { color: 'purple', name: 'Needs design' },
        { color: 'blue', name: 'Ready for dev' },
        { color: 'red', name: 'Bug' },
        { color: 'black', name: 'Blocked' },
        { color: 'gold', name: 'VIP account' },
        { color: 'green', name: 'Analytics' },
        { color: 'orange', name: 'Content' },
        { color: 'crimson', name: 'Legal review' },
        { color: 'sky', name: 'Mobile' },
        { color: 'lime', name: 'QA passed' },
      ],
      members,
    },
    ui: {
      sidebarOpen: true,
      detailsCardId: null,
      composerListId: null,
      addingList: false,
      expandedMinicardLabels: {},
      boardView: 'board-view-lists',
      showDesktopDragHandles: false,
      keyboardShortcuts: false,
      cardMaximized: true,
      cardCollapsed: false,
      zoom: 100,
      mobile: false,
    },
    lists: [
      {
        id: 'list-intake',
        title: 'Intake',
        surfaceColor: '#000000',
        collapsed: false,
        cards: [
          makeCard({
            id: 'MpwbT8ND8BboiMeNo',
            title: 'Scope pricing calculator localization',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'orange', name: 'Content' },
            ],
            assignees: ['u1', 'u2'],
            priority: 'medium',
            description:
              'Localize the pricing calculator for AR, BR, and MX. This includes headline copy, legal note variants, and format differences in tax labels.',
            comments: [
              comment('comment-1', 'u2', 'Design is ready once copy signs off on the long-form disclaimer.', 'Hace 32 min'),
              comment('comment-2', 'u1', 'Keep calculator spacing close to the current production density.', 'Hace 1 h'),
            ],
            activity: [
              activity('activity-1', 'u2', 'updated acceptance criteria', '2026-04-02 19:56'),
              activity('activity-2', 'u1', 'added rollout notes for regional pricing copy', '2026-04-02 18:21'),
              activity('activity-3', 'u1', 'joined as assignee', '2026-04-02 16:23'),
            ],
            checklist: checklist('Launch checklist', [
              { text: 'Approve long-form legal copy', done: true },
              { text: 'Validate localized field labels', done: false },
              { text: 'Check mobile wrapping on 320px width', done: false },
            ]),
          }),
          makeCard({
            id: 'xSawNyZYpwwWHawhK',
            title: 'Redesign onboarding hero for enterprise accounts',
            labels: [
              { color: 'purple', name: 'Needs design' },
              { color: 'gold', name: 'VIP account' },
            ],
            assignees: ['u2', 'u5'],
            priority: 'critical',
            cover: defaultCover,
            description:
              'Refresh the onboarding hero used by enterprise workspaces without drifting from the current production shell. The mock should help visual review before code rollout.',
            attachments: [
              attachment('att-1', 'hero-v3.png', 'Final visual proposal'),
              attachment('att-2', 'hero-copy.docx', 'Draft narrative and CTA variants'),
            ],
            comments: [
              comment('comment-3', 'u5', 'Keep the current hierarchy of title, proof points, and CTA.', 'Hace 19 min'),
              comment('comment-4', 'u2', 'Need one alternate crop for mobile before approval.', 'Hace 43 min'),
            ],
            activity: [
              activity('activity-4', 'u2', 'uploaded latest hero visual direction', '2026-04-02 19:52'),
              activity('activity-5', 'u5', 'updated brand guidance for illustration treatment', '2026-04-02 17:11'),
              activity('activity-6', 'u2', 'added label "VIP account"', '2026-04-02 14:34'),
            ],
            checklist: checklist('Review pass', [
              { text: 'Approve desktop crop', done: true },
              { text: 'Approve mobile crop', done: false },
              { text: 'Replace temporary CTA copy', done: false },
            ]),
          }),
          makeCard({
            id: 'card-safari-sso',
            title: 'Investigate repeated SSO token expirations on Safari',
            labels: [
              { color: 'red', name: 'Bug' },
              { color: 'black', name: 'Blocked' },
              { color: 'sky', name: 'Mobile' },
            ],
            assignees: ['u3', 'u7'],
            priority: 'high',
          }),
          makeCard({
            id: 'card-legal-copy-map',
            title: 'Map missing legal copy for regional signup screens',
            labels: [
              { color: 'crimson', name: 'Legal review' },
              { color: 'orange', name: 'Content' },
            ],
            assignees: ['u5', 'u1'],
            priority: 'medium',
          }),
        ],
      },
      {
        id: 'list-design-review',
        title: 'Design review',
        surfaceColor: '#000000',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-nav-density',
            title: 'Finalize navigation density options for settings area',
            labels: [
              { color: 'purple', name: 'Needs design' },
              { color: 'sky', name: 'Mobile' },
            ],
            assignees: ['u2', 'u5'],
            priority: 'high',
            checklist: checklist('Decision points', [
              { text: 'Compare compact vs comfortable density', done: true },
              { text: 'Validate icon spacing at 1366px', done: false },
              { text: 'Lock mobile header height', done: false },
            ]),
          }),
          makeCard({
            id: 'card-invoice-typography',
            title: 'Review invoice PDF typography with finance',
            labels: [
              { color: 'purple', name: 'Needs design' },
              { color: 'gold', name: 'VIP account' },
            ],
            assignees: ['u2', 'u6'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-density-comparison',
            title: 'Prepare comparison of compact vs comfortable board spacing',
            labels: [
              { color: 'purple', name: 'Needs design' },
              { color: 'blue', name: 'Ready for dev' },
            ],
            assignees: ['u2', 'u1'],
            priority: 'low',
          }),
          makeCard({
            id: 'card-empty-states',
            title: 'Approve empty state illustrations for help center',
            labels: [
              { color: 'orange', name: 'Content' },
              { color: 'purple', name: 'Needs design' },
            ],
            assignees: ['u5'],
            priority: 'low',
            cover: defaultCover,
          }),
        ],
      },
      {
        id: 'list-build',
        title: 'In build',
        surfaceColor: '#000000',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-workspace-switcher',
            title: 'Implement workspace switcher with org memory',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'sky', name: 'Mobile' },
            ],
            assignees: ['u3', 'u8'],
            priority: 'high',
            checklist: checklist('Implementation', [
              { text: 'Persist last active workspace', done: true },
              { text: 'Support keyboard navigation', done: false },
              { text: 'Mirror behavior on mobile drawer', done: false },
            ]),
          }),
          makeCard({
            id: 'card-audit-timeline',
            title: 'Add audit event timeline to customer settings',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'green', name: 'Analytics' },
            ],
            assignees: ['u8', 'u6'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-grouped-notifications',
            title: 'Refactor notification center to support grouped events',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'red', name: 'Bug' },
            ],
            assignees: ['u3', 'u8'],
            priority: 'critical',
          }),
          makeCard({
            id: 'card-permissions-matrix',
            title: 'Ship billing contact permissions matrix',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'crimson', name: 'Legal review' },
            ],
            assignees: ['u8', 'u1'],
            priority: 'high',
          }),
          makeCard({
            id: 'card-export-chunking',
            title: 'Support CSV export chunking for 250k rows',
            labels: [
              { color: 'blue', name: 'Ready for dev' },
              { color: 'green', name: 'Analytics' },
              { color: 'black', name: 'Blocked' },
            ],
            assignees: ['u6', 'u7'],
            priority: 'high',
          }),
        ],
      },
      {
        id: 'list-qa',
        title: 'QA and UAT',
        surfaceColor: '#000000',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-invite-regression',
            title: 'Regression pass for workspace invite flow',
            labels: [
              { color: 'lime', name: 'QA passed' },
              { color: 'sky', name: 'Mobile' },
            ],
            assignees: ['u4'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-prorated-billing',
            title: 'Validate edge cases on prorated billing updates',
            labels: [
              { color: 'lime', name: 'QA passed' },
              { color: 'gold', name: 'VIP account' },
            ],
            assignees: ['u4', 'u6'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-logo-treatment',
            title: 'Confirm dark logo treatment in white-label header',
            labels: [
              { color: 'lime', name: 'QA passed' },
              { color: 'purple', name: 'Needs design' },
            ],
            assignees: ['u4', 'u5'],
            priority: 'low',
          }),
          makeCard({
            id: 'card-safari-upload-retest',
            title: 'Retest Safari upload progress after retry patch',
            labels: [
              { color: 'red', name: 'Bug' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u4', 'u7'],
            priority: 'high',
          }),
        ],
      },
      {
        id: 'list-blockers',
        title: 'Blockers',
        surfaceColor: '#7f1d1d',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-webhook-sla',
            title: 'Awaiting vendor webhook retry SLA confirmation',
            labels: [
              { color: 'black', name: 'Blocked' },
              { color: 'red', name: 'Bug' },
            ],
            assignees: ['u7'],
            priority: 'critical',
          }),
          makeCard({
            id: 'card-migration-window',
            title: 'Customer success needs migration window from infra',
            labels: [
              { color: 'black', name: 'Blocked' },
              { color: 'gold', name: 'VIP account' },
            ],
            assignees: ['u1', 'u7'],
            priority: 'high',
          }),
          makeCard({
            id: 'card-data-warehouse-access',
            title: 'Access review pending for staging data warehouse',
            labels: [
              { color: 'black', name: 'Blocked' },
              { color: 'green', name: 'Analytics' },
            ],
            assignees: ['u6', 'u7'],
            priority: 'medium',
          }),
        ],
      },
      {
        id: 'list-ready',
        title: 'Ready for launch',
        surfaceColor: '#000000',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-consent-banner',
            title: 'Localized consent banner copy approved',
            labels: [
              { color: 'crimson', name: 'Legal review' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u5', 'u1'],
            priority: 'low',
          }),
          makeCard({
            id: 'card-analytics-dashboard',
            title: 'New workspace analytics dashboard signed off',
            labels: [
              { color: 'green', name: 'Analytics' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u6', 'u1'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-enterprise-assets',
            title: 'Enterprise onboarding hero final assets delivered',
            labels: [
              { color: 'purple', name: 'Needs design' },
              { color: 'lime', name: 'QA passed' },
              { color: 'gold', name: 'VIP account' },
            ],
            assignees: ['u2', 'u5'],
            priority: 'low',
            cover: defaultCover,
          }),
        ],
      },
      {
        id: 'list-done',
        title: 'Done this week',
        surfaceColor: '#166534',
        collapsed: false,
        cards: [
          makeCard({
            id: 'card-password-reset',
            title: 'Fix broken password reset deeplink in email template',
            labels: [
              { color: 'red', name: 'Bug' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u3', 'u4'],
            priority: 'medium',
          }),
          makeCard({
            id: 'card-image-compression',
            title: 'Compress dashboard hero images for mobile bundles',
            labels: [
              { color: 'sky', name: 'Mobile' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u3', 'u5'],
            priority: 'low',
          }),
          makeCard({
            id: 'card-support-playbook',
            title: 'Document launch playbook for support rotation',
            labels: [
              { color: 'orange', name: 'Content' },
              { color: 'lime', name: 'QA passed' },
            ],
            assignees: ['u1', 'u7'],
            priority: 'low',
          }),
        ],
      },
    ],
  };

  const dom = {};
  const templates = {};
  let state = hydrateFromUrl(cloneState());
  let toastTimer = null;
  let dragState = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheDom();
    if (!dom.listsContainer) {
      return;
    }

    stripLiveArtifacts();
    captureTemplates();
    installStaticActions();
    render();

    document.addEventListener('click', handleClick);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('keydown', handleKeyDown);
  }

  function cacheDom() {
    dom.body = document.body;
    dom.content = document.getElementById('content');
    dom.quickAccess = document.getElementById('header-quick-access');
    dom.header = document.getElementById('header');
    dom.boardTitleViewer = document.querySelector('.header-board-menu .viewer');
    dom.zoomDisplay = document.querySelector('.zoom-display');
    dom.zoomLevel = document.querySelector('.zoom-level');
    dom.quickAccessDragHandle = document.querySelector('.js-toggle-desktop-drag-handles');
    dom.watchBoardButton = document.querySelector('.js-watch-board');
    dom.starBoardButton = document.querySelector('.js-star-board');
    dom.boardViewButton = document.querySelector('.js-toggle-board-view');
    dom.sidebarToggleButton = document.querySelector('.js-toggle-sidebar');
    dom.boardCanvas = document.querySelector('.board-canvas');
    dom.boardWrapper = document.querySelector('.board-wrapper');
    dom.swimlaneHeaderWrap = document.querySelector('.js-swimlane-header');
    dom.swimlaneHeader = document.querySelector('.swimlane-header');
    dom.sidebar = document.querySelector('.board-sidebar.sidebar');
    dom.sidebarContent = document.querySelector('.js-board-sidebar-content');
    dom.keyboardButton = document.querySelector('.js-keyboard-shortcuts-toggle');
    dom.listsContainer = document.querySelector('.js-lists');
    dom.swimlaneResizeHandle = dom.listsContainer
      ? dom.listsContainer.querySelector('.js-swimlane-resize-handle')
      : null;
  }

  function stripLiveArtifacts() {
    document.querySelectorAll('.board-conversion-overlay').forEach((element) => {
      element.remove();
    });
  }

  function captureTemplates() {
    const firstList = dom.listsContainer.querySelector('.js-list');

    if (!firstList) {
      throw new Error('Snapshot templates are missing expected board elements.');
    }

    templates.list = firstList.cloneNode(true);
  }

  function installStaticActions() {
    setAction('.home-icon a', 'show-toast', 'El mock es local y permanece en este tablero.');
    setAction('.notifications-drawer-toggle', 'show-toast', 'Las notificaciones no estan conectadas en este mock.');
    setAction('.header-user-bar-name', 'show-toast', 'El menu de usuario no forma parte del mock.');
    setAction('.js-edit-board-title', 'show-toast', 'La edicion del titulo del tablero no esta conectada.');
    setAction('.js-change-visibility', 'show-toast', 'La visibilidad se mantiene fija en este mock.');
    setAction('.js-sort-cards', 'show-toast', 'La ordenacion avanzada no esta conectada.');
    setAction('.js-open-filter-view', 'show-toast', 'Los filtros no estan conectados en este mock.');
    setAction('.js-open-search-view', 'show-toast', 'La busqueda no esta conectada en este mock.');
    setAction('.js-multiselection-activate', 'show-toast', 'La seleccion multiple no esta conectada.');
    setAction('.zoom-level', 'cycle-zoom');
    setAction('.js-toggle-desktop-drag-handles', 'toggle-desktop-drag-handles');
    setAction('.js-watch-board', 'toggle-watch-board');
    setAction('.js-star-board', 'toggle-star-board');
    setAction('.js-toggle-board-view', 'toggle-board-view');
    setAction('.js-toggle-sidebar', 'toggle-sidebar');
    setAction('.js-shortcuts', 'show-toast', 'El panel de atajos no esta incluido.');
    setAction('.js-keyboard-shortcuts-toggle', 'toggle-keyboard-shortcuts');
    setAction('.js-close-sidebar', 'toggle-sidebar');
  }

  function setAction(selector, action, toast) {
    const element = document.querySelector(selector);
    if (!element) {
      return;
    }
    element.dataset.action = action;
    if (toast) {
      element.dataset.toast = toast;
    }
  }

  function cloneState() {
    return JSON.parse(JSON.stringify(initialState));
  }

  function hydrateFromUrl(baseState) {
    const params = new URLSearchParams(window.location.search);
    const requestedCard = params.get('card');
    const requestedMobile = params.get('mobile');
    const requestedSidebar = params.get('sidebar');
    const requestedZoom = Number(params.get('zoom'));
    const requestedView = params.get('view');
    const requestedExpandedLabels = (params.get('expandLabels') || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (requestedMobile === '1') {
      baseState.ui.mobile = true;
    }
    if (requestedSidebar === '0') {
      baseState.ui.sidebarOpen = false;
    }
    if (Number.isFinite(requestedZoom) && requestedZoom >= 70 && requestedZoom <= 160) {
      baseState.ui.zoom = requestedZoom;
    }
    if (requestedView && BOARD_VIEW_META[requestedView]) {
      baseState.ui.boardView = requestedView;
    }
    if (requestedCard) {
      const exists = baseState.lists.some((list) => list.cards.some((card) => card.id === requestedCard));
      if (exists) {
        baseState.ui.detailsCardId = requestedCard;
      }
    }
    for (const cardId of requestedExpandedLabels) {
      baseState.ui.expandedMinicardLabels[cardId] = true;
    }
    return baseState;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function viewer(text) {
    return `<div class="viewer" dir="auto"><p>${escapeHtml(text)}</p></div>`;
  }

  function renderAvatar(member) {
    return `
      <span class="avatar avatar-initials" style="background-color: ${escapeHtml(member.tone)}; color: ${escapeHtml(member.text)};">
        <span class="avatar-initials-text">${escapeHtml(member.initials)}</span>
      </span>
    `;
  }

  function renderMemberLink(memberId) {
    const member = getMember(memberId);
    return `
      <a class="member js-member" href="#" title=" (${escapeHtml(member.username)}) ${escapeHtml(member.role)}" aria-label=" (${escapeHtml(member.username)}) ${escapeHtml(member.role)}" data-action="show-toast" data-toast="Los perfiles no estan conectados en este mock.">
        ${renderAvatar(member)}
      </a>
    `;
  }

  function createLabelPillHtml(label) {
    return `
      <span class="js-card-label card-label minicard-label-pill card-label-${escapeHtml(label.color)}" aria-expanded="false" title="${escapeHtml(label.name)}">
        ${viewer(label.name)}
      </span>
    `;
  }

  function setViewerText(target, text) {
    if (!target) {
      return;
    }
    target.innerHTML = viewer(text);
  }

  function getMember(memberId) {
    return state.board.members.find((member) => member.id === memberId) || state.board.members[0];
  }

  function getWatchMeta() {
    return WATCH_META[state.board.watchLevel] || WATCH_META.muted;
  }

  function getBoardViewMeta() {
    return BOARD_VIEW_META[state.ui.boardView] || BOARD_VIEW_META['board-view-swimlanes'];
  }

  function getCardContext(cardId) {
    for (const list of state.lists) {
      const card = list.cards.find((item) => item.id === cardId);
      if (card) {
        return { card, list };
      }
    }
    return null;
  }

  function getChecklistStats(card) {
    if (!card.checklist) {
      return { total: 0, done: 0, percent: 0 };
    }
    const total = card.checklist.items.length;
    const done = card.checklist.items.filter((item) => item.done).length;
    return {
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  }

  function isMinicardLabelsExpanded(cardId) {
    return !!(state.ui.expandedMinicardLabels && state.ui.expandedMinicardLabels[cardId]);
  }

  function render() {
    renderBodyState();
    renderQuickAccessState();
    renderHeaderState();
    renderBoardViewState();
    renderDashboardSummary();
    renderSidebarState();
    renderLists();
    renderCardDetails();
    syncUrl();
    focusOpenForms();
  }

  function renderDashboardSummary() {
    if (!dom.boardCanvas || state.ui.mobile) {
      const existing = document.querySelector('.dashboard-summary');
      if (existing) existing.remove();
      return;
    }

    let summaryEl = document.querySelector('.dashboard-summary');
    if (!summaryEl) {
      summaryEl = document.createElement('div');
      summaryEl.className = 'dashboard-summary';
      dom.boardCanvas.prepend(summaryEl);
    }

    summaryEl.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-label">OWNER</div>
        <div class="summary-card-value">Design Team</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">SPRINT</div>
        <div class="summary-card-value">Q2 - Wave 4</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-label">GOAL</div>
        <div class="summary-card-value">Client Portal MVP</div>
      </div>
    `;
  }

  function renderBodyState() {
    dom.body.classList.toggle('mobile-mode', state.ui.mobile);
    dom.body.classList.toggle('desktop-mode', !state.ui.mobile);

    if (dom.boardWrapper) {
      const scale = state.ui.mobile ? 1 : state.ui.zoom / 100;
      dom.boardWrapper.style.transform = `scale(${scale})`;
      dom.boardWrapper.style.transformOrigin = 'left top';
      dom.boardWrapper.style.width = state.ui.mobile ? '' : `${100 / scale}%`;
    }
  }

  function renderQuickAccessState() {
    if (dom.zoomDisplay) {
      dom.zoomDisplay.textContent = `${state.ui.zoom}%`;
    }
    if (dom.quickAccessDragHandle) {
      const icons = dom.quickAccessDragHandle.querySelectorAll('i.fa');
      if (icons[1]) {
        icons[1].className = `fa ${state.ui.showDesktopDragHandles ? 'fa-check' : 'fa-ban'}`;
      }
      dom.quickAccessDragHandle.title = state.ui.showDesktopDragHandles
        ? 'Ocultar los controles de arrastre del escritorio'
        : 'Mostrar los controles de arrastre del escritorio';
      dom.quickAccessDragHandle.setAttribute('aria-label', dom.quickAccessDragHandle.title);
    }
  }

  function renderHeaderState() {
    if (!dom.headerMainBar) {
      dom.headerMainBar = document.getElementById('header-main-bar');
    }

    if (dom.headerMainBar && !dom.headerMainBar.querySelector('.hero-brand-area')) {
      dom.headerMainBar.innerHTML = `
        <div class="hero-brand-area">
          <div class="brand-pill">Wekan</div>
          <div class="mockup-badge">Mockup</div>
        </div>
        <div class="header-board-menu">
          <span class="viewer"></span>
        </div>
        <div class="hero-actions-area">
          <button class="action-pill">Share View</button>
          <div class="avatar-cluster">
            ${state.board.members.slice(0, 3).map(m => renderAvatar(m)).join('')}
          </div>
        </div>
      `;
      dom.boardTitleViewer = dom.headerMainBar.querySelector('.header-board-menu .viewer');
    }

    setViewerText(dom.boardTitleViewer, state.board.title);
    document.title = `${state.board.title} - Wekan`;
  }

  function renderSidebarState() {
    if (!dom.sidebar) {
      return;
    }

    dom.sidebar.hidden = !state.ui.sidebarOpen;
    if (dom.boardCanvas) {
      dom.boardCanvas.classList.toggle('is-sibling-sidebar-open', state.ui.sidebarOpen);
    }

    if (dom.keyboardButton) {
      const icon = dom.keyboardButton.querySelector('i.fa');
      if (icon) {
        icon.className = `fa ${state.ui.keyboardShortcuts ? 'fa-check' : 'fa-ban'}`;
      }
      const title = state.ui.keyboardShortcuts
        ? 'Atajos de teclado habilitados. Haz clic para deshabilitarlos.'
        : 'Atajos de teclado deshabilitados. Haz clic para habilitarlos.';
      dom.keyboardButton.title = title;
      dom.keyboardButton.setAttribute('aria-label', title);
    }

    if (dom.sidebarContent) {
      dom.sidebarContent.innerHTML = renderSidebarContent();
    }
  }

  function renderBoardViewState() {
    if (!dom.listsContainer) {
      return;
    }

    const isListMode = state.ui.boardView === 'board-view-lists';

    dom.listsContainer.classList.toggle('list-group', isListMode);
    dom.listsContainer.classList.toggle('js-swimlane', !isListMode);

    if (dom.swimlaneHeaderWrap) {
      dom.swimlaneHeaderWrap.style.display = isListMode ? 'none' : '';
    }

    if (dom.swimlaneResizeHandle) {
      dom.swimlaneResizeHandle.style.display = isListMode ? 'none' : '';
    }
  }

  function getBoardStats() {
    const cards = state.lists.flatMap((list) => list.cards);
    return {
      cards: cards.length,
      lists: state.lists.length,
      members: state.board.members.length,
      blocked: cards.filter((card) => card.labels.some((label) => label.color === 'black')).length,
      critical: cards.filter((card) => card.priority === 'critical').length,
    };
  }

  function renderSidebarContent() {
    const stats = getBoardStats();
    return `
      <div class="board-widget">
        <h3>
          <i class="fa fa-folder-open-o"></i>
          Release context
        </h3>
        <p class="quiet">Standalone snapshot with fake production data for design review only.</p>
      </div>
      <hr>
      <div class="board-widget">
        <h3>
          <i class="fa fa-bar-chart"></i>
          Snapshot metrics
        </h3>
        <div class="board-widget-content">
          <p><strong>${stats.cards}</strong> cards across <strong>${stats.lists}</strong> lists</p>
          <p><strong>${stats.members}</strong> active contributors</p>
          <p><strong>${stats.blocked}</strong> blocked items and <strong>${stats.critical}</strong> critical tickets</p>
        </div>
      </div>
      <hr>
      <div class="board-widget board-widget-members">
        <h3>
          <i class="fa fa-users"></i>
          Team
        </h3>
        <div class="board-widget-content">
          ${state.board.members.map((member) => renderMemberLink(member.id)).join('')}
        </div>
      </div>
      <hr>
      <div class="board-widget board-widget-labels">
        <h3>
          <i class="fa fa-tag"></i>
          Labels
        </h3>
        <div class="board-widget-content">
          ${state.board.labels
            .map(
              (label) => `
                <span class="card-label card-label-${escapeHtml(label.color)}">
                  ${viewer(label.name)}
                </span>
              `,
            )
            .join('')}
        </div>
      </div>
      <hr>
      <a class="sidebar-btn" href="#" data-action="reset-demo">
        <i class="fa fa-undo"></i>
        Reset fake data
      </a>
    `;
  }

  function renderLists() {
    const staleChildren = Array.from(dom.listsContainer.children).filter((child) => {
      return child.classList.contains('js-list') || child.classList.contains('swimlane-add-list');
    });

    staleChildren.forEach((child) => child.remove());

    for (const list of state.lists) {
      dom.listsContainer.insertBefore(createListElement(list), dom.swimlaneResizeHandle);
    }

    dom.listsContainer.insertBefore(createAddListComposer(), dom.swimlaneResizeHandle);
  }

  function createListElement(list) {
    const listEl = templates.list.cloneNode(true);
    listEl.id = `js-list-${list.id}`;
    listEl.dataset.listId = list.id;
    listEl.classList.toggle('list-collapsed', !!list.collapsed);
    listEl.classList.toggle('has-open-composer', state.ui.composerListId === list.id);
    const surfaceColor = list.surfaceColor || '#000000';
    // Removed inline styles to allow mock.css premium skin to take over
    listEl.style.setProperty('--list-accent-color', surfaceColor);

    // Surgical fix: remove dark inline properties surviving from template
    listEl.style.removeProperty('background');
    listEl.style.removeProperty('background-color');
    listEl.style.removeProperty('background-image');
    listEl.style.removeProperty('border-left-color');

    const collapseToggle = listEl.querySelector('.js-collapse');
    const listMenu = listEl.querySelector('.js-open-list-menu');

    setViewerText(listEl.querySelector('.list-header-name .viewer'), list.title);

    const header = listEl.querySelector('.list-header');
    const headerWrapper = header ? header.querySelector('.js-inlined-form-wrapper') : null;
    const titleWrapper = listEl.querySelector('.list-header-name')?.parentElement;
    if (headerWrapper) {
      headerWrapper.classList.add('list-header-row');
      headerWrapper.style.removeProperty('display');
    }
    if (titleWrapper) {
      titleWrapper.classList.add('list-header-title-wrap');
    }

    const collapseIcon = collapseToggle ? collapseToggle.querySelector('i.fa') : null;
    if (collapseToggle) {
      collapseToggle.href = '#';
      collapseToggle.dataset.action = 'toggle-list-collapse';
      collapseToggle.dataset.listId = list.id;
      collapseToggle.title = list.collapsed ? 'Expandir' : 'Contraer';
      collapseToggle.setAttribute('aria-label', collapseToggle.title);
    }
    if (collapseIcon) {
      collapseIcon.className = `fa ${list.collapsed ? 'fa-caret-right' : 'fa-caret-down'}`;
    }
    if (listMenu) {
      listMenu.href = '#';
      listMenu.dataset.action = 'show-toast';
      listMenu.dataset.toast = 'Las acciones avanzadas de listas no estan conectadas.';
    }

    const listMenuWrapper = listMenu ? listMenu.closest('.list-header-menu') : null;
    if (listMenuWrapper) {
      listMenuWrapper.classList.add('list-header-controls');
      if (collapseToggle && headerWrapper) {
        if (list.collapsed) {
          if (collapseToggle.parentElement !== headerWrapper) {
            headerWrapper.insertBefore(collapseToggle, headerWrapper.firstChild);
          }
        } else if (collapseToggle.parentElement !== listMenuWrapper) {
          listMenuWrapper.insertBefore(collapseToggle, listMenuWrapper.firstChild);
        }
      }
      if (!list.collapsed && headerWrapper && listMenuWrapper.parentElement === headerWrapper) {
        headerWrapper.appendChild(listMenuWrapper);
      }
    }

    const listBody = listEl.querySelector('.list-body');
    if (listBody && !listEl.querySelector('.list-header-plus')) {
      const plus = document.createElement('a');
      plus.className = 'list-header-plus';
      plus.href = '#';
      plus.innerHTML = '<i class="fa fa-plus"></i><span>Add a card</span>';
      plus.dataset.action = 'open-add-card';
      plus.dataset.listId = list.id;
      listEl.appendChild(plus);
    }

    const count = listEl.querySelector('.cardCount');
    if (count) {
      count.textContent = `${list.cards.length}/${list.cards.length}`;
    }

    const addToTop = listEl.querySelector('.js-add-card');
    if (addToTop) {
      addToTop.remove();
    }

    const body = listEl.querySelector('.list-body');
    const footerWrapper = listEl.querySelector('.js-inlined-form-wrapper[data-position="bottom"]');
    if (body) {
      body.style.display = list.collapsed ? 'none' : '';
    }
    if (footerWrapper) {
      footerWrapper.style.display =
        list.collapsed || state.ui.composerListId === list.id ? 'none' : 'block';
      footerWrapper.innerHTML = '';
      if (!list.collapsed && state.ui.composerListId !== list.id) {
        footerWrapper.appendChild(createAddCardTrigger(list.id));
      }
    }

    const minicards = listEl.querySelector('.js-minicards');
    if (minicards) {
      minicards.innerHTML = '';

      const topWrapper = document.createElement('div');
      topWrapper.className = 'js-inlined-form-wrapper';
      topWrapper.dataset.position = 'top';
      topWrapper.style.display = 'contents';
      minicards.appendChild(topWrapper);

      const sidebarList = document.createElement('ul');
      sidebarList.className = 'sidebar-list';
      minicards.appendChild(sidebarList);

      for (const card of list.cards) {
        minicards.appendChild(createCardElement(card, list.id));
      }

      if (!list.collapsed && state.ui.composerListId === list.id) {
        minicards.appendChild(createAddCardComposer(list.id));
      }
    }

    return listEl;
  }

  function createCardElement(card, listId) {
    const priorityMeta = PRIORITY_META[card.priority] || PRIORITY_META.medium;
    const labelsExpanded = isMinicardLabelsExpanded(card.id);
    const labelsMarkup = card.labels.length
      ? `
          <div class="minicard-labels ${labelsExpanded ? 'is-expanded' : ''}">
            ${card.labels
              .map(
                (label) => `
                  <span class="js-card-label card-label minicard-label-pill card-label-${escapeHtml(label.color)}" aria-expanded="${labelsExpanded ? 'true' : 'false'}" title="${escapeHtml(label.name)}" data-action="toggle-minicard-labels" data-card-id="${escapeHtml(card.id)}">
                    ${viewer(label.name)}
                  </span>
                `,
              )
              .join('')}
          </div>
        `
      : '';
    return createElement(`
      <div class="minicard-wrapper js-minicard ui-droppable" data-card-id="${escapeHtml(card.id)}" data-list-id="${escapeHtml(listId)}" draggable="true">
        <div class="minicard nodragscroll ${card.cover ? 'has-cover' : 'no-cover'}">
          ${
            card.cover
              ? `
          <img class="js-minicard-cover-image-probe minicard-cover-image-probe" data-cover-id="${escapeHtml(card.id)}" src="${escapeHtml(card.cover)}" alt="">
          <div class="minicard-cover" style="background-image: url(&quot;${escapeHtml(card.cover)}&quot;);"></div>
              `
              : ''
          }
          <div class="minicard-body">
          <a class="minicard-details-menu-with-handle js-open-minicard-details-menu ${escapeHtml(priorityMeta.className)}" href="#" title="Acciones de la tarjeta" aria-label="Acciones de la tarjeta" data-action="show-toast" data-toast="Las acciones rapidas de la tarjeta no estan conectadas.">
            <i class="fa ${escapeHtml(priorityMeta.icon)}" title="${escapeHtml(priorityMeta.label)}" aria-label="${escapeHtml(priorityMeta.label)}"></i>
            <i class="fa fa-bars"></i>
          </a>
          <div class="dates"></div>
          ${labelsMarkup}
          <div class="minicard-title">
            ${viewer(card.title)}
          </div>
          <div class="minicard-custom-fields"></div>
          <div class="minicard-assignees js-minicard-assignees">
            ${card.assignees.map(renderMemberLink).join('')}
          </div>
          <div class="badges"></div>
          </div>
        </div>
      </div>
    `);
  }

  function createAddCardTrigger(listId) {
    const trigger = createElement(`
      <a class="open-minicard-composer list-footer-add-card js-card-composer js-open-inlined-form nodragscroll" href="#" title="Bajar la tarjeta al final de la lista" data-action="open-add-card" data-list-id="${escapeHtml(listId)}">
        <i class="fa fa-plus"></i>
        Anadir una tarjeta
      </a>
    `);
    return trigger;
  }

  function createAddCardComposer(listId) {
    return createElement(`
      <form class="mock-add-card-form" data-form="add-card" data-list-id="${escapeHtml(listId)}">
        <div class="minicard minicard-composer js-composer nodragscroll">
          <textarea class="minicard-composer-textarea js-card-title" name="title" autofocus dir="auto"></textarea>
        </div>
        <div class="add-controls clearfix">
          <button class="primary confirm" type="submit">Anadir</button>
          <a href="#" data-action="close-composer" data-list-id="${escapeHtml(listId)}">
            <i class="fa fa-times-thin"></i>
          </a>
        </div>
      </form>
    `);
  }

  function createAddListComposer() {
    if (state.ui.addingList) {
      return createElement(`
        <div class="swimlane-add-list">
          <form class="mock-list-composer js-add-list-form" data-form="add-list">
            <input class="list-name-input full-line" type="text" name="title" placeholder="Anadir lista" autocomplete="off" autofocus>
            <div class="edit-controls clearfix">
              <button class="primary confirm js-submit-add-list" type="submit">Guardar</button>
              <a href="#" data-action="close-add-list">
                <i class="fa fa-times-thin"></i>
              </a>
            </div>
          </form>
        </div>
      `);
    }

    return createElement(`
      <div class="swimlane-add-list">
        <a class="open-list-composer js-open-inlined-form" href="#" title="Anadir lista" data-action="open-add-list">
          <i class="fa fa-plus"></i>
          <span class="add-list-label">Anadir lista</span>
        </a>
      </div>
    `);
  }

  function renderCardDetails() {
    const existing = document.querySelector('.mock-card-details-host');
    if (existing) {
      existing.remove();
    }

    if (!state.ui.detailsCardId) {
      return;
    }

    const context = getCardContext(state.ui.detailsCardId);
    if (!context) {
      return;
    }

    const host = document.createElement('div');
    host.className = 'mock-card-details-host';
    host.innerHTML = renderCardDetailsHtml(context.card, context.list);
    dom.body.appendChild(host);
  }

  function renderCardDetailsHtml(card, list) {
    const detailsCoverMarkup = card.cover
      ? `
          <div class="card-details-cover" style="background-image: url(&quot;${escapeHtml(card.cover)}&quot;);"></div>
        `
      : '';
    return `
      <section class="card-details js-card-details nodragscroll ${state.ui.cardMaximized ? 'card-details-maximized' : ''} ${state.ui.cardCollapsed ? 'card-details-collapsed' : ''}">
        <div class="card-details-canvas">
          <div class="card-details-header ${card.cover ? 'has-cover' : 'no-cover'}" style="background: transparent !important; background-color: transparent !important; background-image: none !important; box-shadow: none !important; border: none !important;">
            ${detailsCoverMarkup}
            <span class="card-collapse-toggle js-card-collapse-toggle" data-action="toggle-card-collapse" title="Contraer tarjeta">
              <i class="fa ${state.ui.cardCollapsed ? 'fa-caret-right' : 'fa-caret-down'}"></i>
            </span>
            <a class="close-card-details js-close-card-details" href="#" data-action="close-card" title="Cerrar tarjeta">
              <i class="fa fa-times-thin"></i>
            </a>
            <a class="fa ${state.ui.cardMaximized ? 'fa-window-minimize minimize-card-details' : 'fa-window-maximize maximize-card-details'}" href="#" data-action="toggle-card-maximized" title="${state.ui.cardMaximized ? 'Minimizar tarjeta' : 'Maximizar tarjeta'}"></a>
            <a class="card-details-menu js-open-card-details-menu" href="#" data-action="show-toast" data-toast="Las acciones avanzadas de la tarjeta no estan conectadas.">
              <i class="fa fa-bars"></i>
            </a>
            <a class="card-copy-button js-copy-link" href="#" data-action="copy-link" data-card-id="${escapeHtml(card.id)}" title="Copiar enlace de la tarjeta">
              <span class="emoji-icon">
                <i class="fa fa-link"></i>
              </span>
            </a>
            <span class="card-drag-handle" title="Arrastrar tarjeta">
              <i class="fa fa-arrows"></i>
            </span>
            <span class="copied-tooltip">Copiado</span>
            <h2 class="card-details-title js-card-title" contenteditable="true" spellcheck="false" data-card-id="${escapeHtml(card.id)}" data-role="card-title-editor">
              ${escapeHtml(card.title)}
            </h2>
            <div class="card-details-path">&nbsp; &gt; &nbsp; ${escapeHtml(list.title)}</div>
          </div>
          <div class="card-details-left">
            <div class="card-details-items">
              <div class="card-details-item card-details-item-labels">
                <h3 class="card-details-item-title">
                  <i class="fa fa-tags"></i>
                  Etiquetas
                </h3>
                <a class="is-disabled">
                  ${card.labels
                    .map((label) => `<span class="card-label card-label-${escapeHtml(label.color)}">${viewer(label.name)}</span>`)
                    .join('')}
                </a>
              </div>
              <hr>
              <div class="card-details-item card-details-item-assignees">
                <h3 class="card-details-item-title">
                  <i class="fa fa-user"></i>
                  Asignado
                </h3>
                <div>${card.assignees.map(renderMemberLink).join('')}</div>
              </div>
              <div class="card-details-item card-details-item-priority">
                <h3 class="card-details-item-title">
                  <i class="fa fa-flag"></i>
                  Prioridad
                </h3>
                <select class="full-line" data-change="change-card-priority" data-card-id="${escapeHtml(card.id)}">
                  ${Object.keys(PRIORITY_META)
                    .map(
                      (level) => `
                        <option value="${escapeHtml(level)}" ${level === card.priority ? 'selected' : ''}>
                          ${escapeHtml(PRIORITY_META[level].label)}
                        </option>
                      `,
                    )
                    .join('')}
                </select>
              </div>
              <div class="card-details-item card-details-show-lists">
                <h3 class="card-details-item-title">
                  <i class="fa fa-list"></i>
                  Lista
                </h3>
                <select class="full-line" data-change="move-card-list" data-card-id="${escapeHtml(card.id)}">
                  ${state.lists
                    .map(
                      (item) => `
                        <option value="${escapeHtml(item.id)}" ${item.id === list.id ? 'selected' : ''}>
                          ${escapeHtml(item.title)}
                        </option>
                      `,
                    )
                    .join('')}
                </select>
              </div>
            </div>
            <hr>
            <div class="card-details-item card-description">
              <h3 class="card-details-item-title">
                <i class="fa fa-file-text-o"></i>
                Detalles
              </h3>
              <form class="mock-card-form" data-form="update-card" data-card-id="${escapeHtml(card.id)}">
                <textarea class="full-line" name="description" rows="6" placeholder="Anade una descripcion mas detallada...">${escapeHtml(card.description)}</textarea>
                <div class="mock-inline-actions">
                  <button class="primary confirm" type="submit">Guardar</button>
                  <span class="quiet">Los cambios no se guardan fuera del navegador.</span>
                </div>
              </form>
            </div>
            ${renderChecklistSection(card)}
            <hr>
            <div class="card-details-item">
              <h3 class="card-details-item-title">
                <i class="fa fa-paperclip"></i>
                Adjuntos
              </h3>
              ${
                card.attachments.length
                  ? `
                    <div class="mock-attachments">
                      ${card.attachments
                        .map(
                          (attachment) => `
                            <div class="mock-attachment-row">
                              <span><i class="fa fa-file-text-o"></i> ${escapeHtml(attachment.name)}</span>
                              <span class="quiet">${escapeHtml(attachment.meta)}</span>
                            </div>
                          `,
                        )
                        .join('')}
                    </div>
                  `
                  : '<p class="quiet">Sin adjuntos.</p>'
              }
            </div>
            <hr>
            <div class="card-details-item">
              <h3 class="card-details-item-title">
                <i class="fa fa-comment-o"></i>
                Comentarios
              </h3>
              <form class="new-comment is-open" data-form="new-comment" data-card-id="${escapeHtml(card.id)}">
                ${renderMemberLink(currentUserId)}
                <textarea class="full-line" name="text" rows="3" placeholder="Escribe un comentario..."></textarea>
                <div class="mock-inline-actions">
                  <button class="primary confirm" type="submit">Guardar comentario</button>
                </div>
              </form>
              <div class="comments">
                ${
                  card.comments.length
                    ? card.comments
                        .map((comment) => {
                          const author = getMember(comment.author);
                          return `
                            <div class="comment">
                              ${renderMemberLink(author.id)}
                              <div class="comment-desc">
                                <div class="comment-member">${escapeHtml(author.name)}</div>
                                <div class="comment-meta">${escapeHtml(comment.time)}</div>
                                <div class="comment-text">${viewer(comment.text)}</div>
                              </div>
                            </div>
                          `;
                        })
                        .join('')
                    : '<p class="quiet">Sin comentarios.</p>'
                }
              </div>
            </div>
          </div>
          <div class="card-details-right">
            <div class="activity-title">
              <h3>Actividad reciente</h3>
            </div>
            <div class="activities">
              ${
                card.activity.length
                  ? card.activity
                      .map((entry) => {
                        const author = getMember(entry.author);
                        return `
                          <div class="activity">
                            ${renderMemberLink(author.id)}
                            <div class="activity-desc">
                              <div>
                                <span class="activity-member">${escapeHtml(author.name)}</span>
                              </div>
                              <div class="activity-comment">${viewer(entry.text)}</div>
                              <div class="activity-meta">${escapeHtml(entry.time)}</div>
                            </div>
                          </div>
                        `;
                      })
                      .join('')
                  : '<p class="quiet">Sin actividad.</p>'
              }
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderChecklistSection(card) {
    if (!card.checklist) {
      return '';
    }

    const stats = getChecklistStats(card);

    return `
      <hr>
      <div class="checklists-title">
        <h3 class="card-details-item-title">
          <i class="fa fa-check"></i>
          Checklists
        </h3>
      </div>
      <div class="card-checklist-items">
        <div class="js-checklist checklist nodragscroll">
          <div class="checklist-title">
            <span></span>
            <a class="fa fa-navicon checklist-details-menu js-open-checklist-details-menu" href="#" title="Acciones del checklist" data-action="show-toast" data-toast="Las acciones del checklist no estan conectadas."></a>
            <h4 class="title js-open-inlined-form is-editable">
              ${viewer(card.checklist.title)}
            </h4>
          </div>
          ${
            stats.percent > 0
              ? `
                <div class="checklist-progress-bar-container">
                  <div class="checklist-progress-text">${stats.percent}%</div>
                  <div class="checklist-progress-bar">
                    <div class="checklist-progress" style="width:${stats.percent}%"></div>
                  </div>
                </div>
              `
              : ''
          }
          <div class="checklist-items js-checklist-items">
            ${card.checklist.items
              .map(
                (item) => `
                  <div class="js-checklist-item checklist-item ${item.done ? 'is-checked' : ''}" role="checkbox" aria-checked="${item.done ? 'true' : 'false'}" tabindex="0">
                    <div class="check-box-container">
                      <div class="check-box materialCheckBox ${item.done ? 'is-checked' : ''}" data-action="toggle-checklist-item" data-card-id="${escapeHtml(card.id)}" data-item-id="${escapeHtml(item.id)}"></div>
                    </div>
                    <div class="item-title js-open-inlined-form is-editable ${item.done ? 'is-checked' : ''}">
                      ${viewer(item.text)}
                    </div>
                  </div>
                `,
              )
              .join('')}
          </div>
          <form class="mock-inline-form js-add-checklist-item" data-form="add-checklist-item" data-card-id="${escapeHtml(card.id)}">
            <a class="fa fa-copy" href="#" data-action="show-toast" data-toast="Copiado al portapapeles no esta conectado en este mock." title="Copiar texto al portapapeles"></a>
            <span class="copied-tooltip">Copiado</span>
            <textarea class="js-add-checklist-item full-line" name="text" rows="1" placeholder="Anadir item"></textarea>
            <div class="edit-controls clearfix">
              <button class="primary confirm js-submit-add-checklist-item-form" type="submit">Guardar</button>
              <a class="fa fa-times-thin" href="#" data-action="show-toast" data-toast="El formulario del checklist se mantiene siempre abierto en este mock." title="Cerrar"></a>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) {
      return;
    }

    const url = new URL(window.location.href);

    if (state.ui.detailsCardId) {
      url.searchParams.set('card', state.ui.detailsCardId);
    } else {
      url.searchParams.delete('card');
    }

    if (state.ui.mobile) {
      url.searchParams.set('mobile', '1');
    } else {
      url.searchParams.delete('mobile');
    }

    if (!state.ui.sidebarOpen) {
      url.searchParams.set('sidebar', '0');
    } else {
      url.searchParams.delete('sidebar');
    }

    if (state.ui.zoom !== 100) {
      url.searchParams.set('zoom', String(state.ui.zoom));
    } else {
      url.searchParams.delete('zoom');
    }

    if (state.ui.boardView !== 'board-view-lists') {
      url.searchParams.set('view', state.ui.boardView);
    } else {
      url.searchParams.delete('view');
    }

    window.history.replaceState({}, '', url);
  }

  function focusOpenForms() {
    if (state.ui.composerListId) {
      const field = document.querySelector(
        `[data-form="add-card"][data-list-id="${state.ui.composerListId}"] textarea`,
      );
      if (field) {
        field.focus();
      }
    }

    if (state.ui.addingList) {
      const field = document.querySelector('[data-form="add-list"] input[name="title"]');
      if (field) {
        field.focus();
      }
    }
  }

  function setToast(message) {
    const existing = document.querySelector('.mock-toast');
    if (existing) {
      existing.remove();
    }

    const toast = createElement(`<div class="mock-toast">${escapeHtml(message)}</div>`);
    dom.body.appendChild(toast);

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
      toast.remove();
    }, 1800);
  }

  function cycleWatchLevel() {
    if (state.board.watchLevel === 'muted') {
      state.board.watchLevel = 'tracking';
      return;
    }
    if (state.board.watchLevel === 'tracking') {
      state.board.watchLevel = 'watching';
      return;
    }
    state.board.watchLevel = 'muted';
  }

  function cycleBoardView() {
    if (state.ui.boardView === 'board-view-swimlanes') {
      state.ui.boardView = 'board-view-lists';
      return;
    }
    if (state.ui.boardView === 'board-view-lists') {
      state.ui.boardView = 'board-view-cal';
      return;
    }
    if (state.ui.boardView === 'board-view-cal') {
      state.ui.boardView = 'board-view-gantt';
      return;
    }
    state.ui.boardView = 'board-view-swimlanes';
  }

  function addCardToList(listId, title) {
    const list = state.lists.find((item) => item.id === listId);
    if (!list) {
      return;
    }

    const cardId = `card-${Date.now()}`;
    list.cards.push(
      makeCard({
        id: cardId,
        title,
        assignees: [currentUserId],
        activity: [{ id: `activity-${cardId}`, author: currentUserId, text: 'created this card', time: 'Hace un momento' }],
      }),
    );
  }

  function addList(title) {
    state.lists.push({
      id: `list-${Date.now()}`,
      title,
      collapsed: false,
      cards: [],
    });
  }

  function moveCard(cardId, targetListId, beforeCardId) {
    let sourceList = null;
    let sourceIndex = -1;

    for (const list of state.lists) {
      const index = list.cards.findIndex((card) => card.id === cardId);
      if (index !== -1) {
        sourceList = list;
        sourceIndex = index;
        break;
      }
    }

    const targetList = state.lists.find((list) => list.id === targetListId);
    if (!sourceList || !targetList || sourceIndex === -1) {
      return;
    }

    const [card] = sourceList.cards.splice(sourceIndex, 1);
    if (!beforeCardId) {
      targetList.cards.push(card);
      return;
    }

    const targetIndex = targetList.cards.findIndex((item) => item.id === beforeCardId);
    if (targetIndex === -1) {
      targetList.cards.push(card);
      return;
    }

    targetList.cards.splice(targetIndex, 0, card);
  }

  function copyCardLink(cardId) {
    const url = new URL(window.location.href);
    url.searchParams.set('card', cardId);
    const link = url.toString();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => setToast('Enlace copiado.'))
        .catch(() => setToast(link));
      return;
    }

    setToast(link);
  }

  function handleClick(event) {
    const anchor = event.target.closest('a[href]');
    if (anchor && anchor.getAttribute('href') === '#') {
      event.preventDefault();
    }

    const detailsHost = event.target.closest('.mock-card-details-host');
    if (detailsHost && !event.target.closest('.js-card-details')) {
      state.ui.detailsCardId = null;
      render();
      return;
    }

    const actionEl = event.target.closest('[data-action]');
    if (actionEl) {
      event.preventDefault();
      const action = actionEl.dataset.action;

      if (action === 'open-add-card') {
        state.ui.composerListId = actionEl.dataset.listId;
        render();
        return;
      }

      if (action === 'toggle-minicard-labels') {
        const cardId = actionEl.dataset.cardId;
        state.ui.expandedMinicardLabels[cardId] = !state.ui.expandedMinicardLabels[cardId];
        render();
        return;
      }

      if (action === 'close-composer') {
        state.ui.composerListId = null;
        render();
        return;
      }

      if (action === 'open-add-list') {
        state.ui.addingList = true;
        render();
        return;
      }

      if (action === 'close-add-list') {
        state.ui.addingList = false;
        render();
        return;
      }

      if (action === 'toggle-sidebar') {
        state.ui.sidebarOpen = !state.ui.sidebarOpen;
        render();
        return;
      }

      if (action === 'toggle-watch-board') {
        cycleWatchLevel();
        render();
        return;
      }

      if (action === 'toggle-star-board') {
        state.board.starred = !state.board.starred;
        state.board.starCount = Math.max(0, state.board.starCount + (state.board.starred ? 1 : -1));
        render();
        return;
      }

      if (action === 'toggle-board-view') {
        cycleBoardView();
        render();
        return;
      }

      if (action === 'toggle-desktop-drag-handles') {
        state.ui.showDesktopDragHandles = !state.ui.showDesktopDragHandles;
        render();
        return;
      }

      if (action === 'toggle-keyboard-shortcuts') {
        state.ui.keyboardShortcuts = !state.ui.keyboardShortcuts;
        render();
        return;
      }

      if (action === 'cycle-zoom') {
        const levels = [80, 100, 120, 140];
        const currentIndex = levels.indexOf(state.ui.zoom);
        state.ui.zoom = levels[(currentIndex + 1) % levels.length];
        render();
        return;
      }

      if (action === 'toggle-list-collapse') {
        const list = state.lists.find((item) => item.id === actionEl.dataset.listId);
        if (list) {
          list.collapsed = !list.collapsed;
          render();
        }
        return;
      }

      if (action === 'close-card') {
        state.ui.detailsCardId = null;
        render();
        return;
      }

      if (action === 'toggle-card-maximized') {
        state.ui.cardMaximized = !state.ui.cardMaximized;
        render();
        return;
      }

      if (action === 'toggle-card-collapse') {
        state.ui.cardCollapsed = !state.ui.cardCollapsed;
        render();
        return;
      }

      if (action === 'toggle-checklist-item') {
        const context = getCardContext(actionEl.dataset.cardId);
        if (!context || !context.card.checklist) {
          return;
        }
        const item = context.card.checklist.items.find((entry) => entry.id === actionEl.dataset.itemId);
        if (!item) {
          return;
        }
        item.done = !item.done;
        context.card.activity.unshift({
          id: `activity-${Date.now()}`,
          author: currentUserId,
          text: `${item.done ? 'completed' : 'reopened'} checklist item "${item.text}"`,
          time: 'Hace un momento',
        });
        render();
        return;
      }

      if (action === 'reset-demo') {
        state = hydrateFromUrl(cloneState());
        render();
        setToast('Fake data reset.');
        return;
      }

      if (action === 'copy-link') {
        copyCardLink(actionEl.dataset.cardId);
        return;
      }

      if (action === 'show-toast') {
        setToast(actionEl.dataset.toast || 'Accion solo visual dentro del mock.');
        return;
      }
    }

    const cardEl = event.target.closest('.minicard-wrapper');
    if (!cardEl) {
      return;
    }

    if (
      event.target.closest('.js-open-minicard-details-menu') ||
      event.target.closest('.js-member') ||
      event.target.closest('.check-box')
    ) {
      return;
    }

    event.preventDefault();
    state.ui.detailsCardId = cardEl.dataset.cardId;
    state.ui.cardCollapsed = false;
    render();
  }

  function handleChange(event) {
    const listSelect = event.target.closest('[data-change="move-card-list"]');
    if (listSelect) {
      moveCard(listSelect.dataset.cardId, listSelect.value);
      render();
      setToast('Tarjeta movida.');
      return;
    }

    const prioritySelect = event.target.closest('[data-change="change-card-priority"]');
    if (!prioritySelect) {
      return;
    }

    const context = getCardContext(prioritySelect.dataset.cardId);
    if (!context) {
      return;
    }

    context.card.priority = prioritySelect.value;
    context.card.activity.unshift({
      id: `activity-${Date.now()}`,
      author: currentUserId,
      text: `changed priority to ${PRIORITY_META[prioritySelect.value].label.toLowerCase()}`,
      time: 'Hace un momento',
    });
    render();
    setToast('Prioridad actualizada.');
  }

  function handleSubmit(event) {
    const form = event.target.closest('[data-form]');
    if (!form) {
      return;
    }

    event.preventDefault();
    const formType = form.dataset.form;

    if (formType === 'add-card') {
      const title = (form.elements.title.value || '').trim();
      if (!title) {
        return;
      }
      addCardToList(form.dataset.listId, title);
      state.ui.composerListId = null;
      render();
      setToast('Tarjeta anadida.');
      return;
    }

    if (formType === 'add-list') {
      const title = (form.elements.title.value || '').trim();
      if (!title) {
        return;
      }
      addList(title);
      state.ui.addingList = false;
      render();
      setToast('Lista anadida.');
      return;
    }

    if (formType === 'update-card') {
      const context = getCardContext(form.dataset.cardId);
      if (!context) {
        return;
      }
      const titleEditor = document.querySelector(`.card-details-title[data-card-id="${form.dataset.cardId}"]`);
      const editedTitle = (titleEditor?.textContent || '').trim();
      context.card.title = editedTitle || context.card.title;
      context.card.description = (form.elements.description.value || '').trim();
      context.card.activity.unshift({
        id: `activity-${Date.now()}`,
        author: currentUserId,
        text: 'updated the card details',
        time: 'Hace un momento',
      });
      render();
      setToast('Tarjeta actualizada.');
      return;
    }

    if (formType === 'new-comment') {
      const context = getCardContext(form.dataset.cardId);
      const text = (form.elements.text.value || '').trim();
      if (!context || !text) {
        return;
      }
      context.card.comments.unshift({
        id: `comment-${Date.now()}`,
        author: currentUserId,
        text,
        time: 'Hace un momento',
      });
      context.card.activity.unshift({
        id: `activity-${Date.now()}`,
        author: currentUserId,
        text: 'left a comment',
        time: 'Hace un momento',
      });
      render();
      setToast('Comentario anadido.');
      return;
    }

    if (formType === 'add-checklist-item') {
      const context = getCardContext(form.dataset.cardId);
      const text = (form.elements.text.value || '').trim();
      if (!context || !context.card.checklist || !text) {
        return;
      }
      context.card.checklist.items.push({
        id: `check-${Date.now()}`,
        text,
        done: false,
      });
      context.card.activity.unshift({
        id: `activity-${Date.now()}`,
        author: currentUserId,
        text: `added checklist item "${text}"`,
        time: 'Hace un momento',
      });
      render();
      setToast('Item anadido.');
    }
  }

  function handleDragStart(event) {
    const cardEl = event.target.closest('.minicard-wrapper');
    if (!cardEl) {
      return;
    }

    dragState = {
      cardId: cardEl.dataset.cardId,
      fromListId: cardEl.dataset.listId,
    };

    cardEl.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', dragState.cardId);
  }

  function handleDragOver(event) {
    if (!dragState) {
      return;
    }

    const listEl = event.target.closest('.js-list');
    if (!listEl) {
      return;
    }

    event.preventDefault();
    document.querySelectorAll('.js-list.is-drop-target').forEach((element) => {
      element.classList.remove('is-drop-target');
    });
    listEl.classList.add('is-drop-target');
  }

  function handleDrop(event) {
    if (!dragState) {
      return;
    }

    const listEl = event.target.closest('.js-list');
    if (!listEl) {
      return;
    }

    event.preventDefault();

    const targetCard = event.target.closest('.minicard-wrapper');
    moveCard(dragState.cardId, listEl.dataset.listId, targetCard ? targetCard.dataset.cardId : null);

    dragState = null;
    document.querySelectorAll('.js-list.is-drop-target').forEach((element) => {
      element.classList.remove('is-drop-target');
    });

    render();
    setToast('Tarjeta movida.');
  }

  function handleDragEnd() {
    dragState = null;
    document.querySelectorAll('.js-list.is-drop-target').forEach((element) => {
      element.classList.remove('is-drop-target');
    });
    document.querySelectorAll('.minicard-wrapper.is-dragging').forEach((element) => {
      element.classList.remove('is-dragging');
    });
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && state.ui.detailsCardId) {
      state.ui.detailsCardId = null;
      render();
    }
  }
})();
