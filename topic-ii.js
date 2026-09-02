(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Shared header behaviour
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 18), { passive: true });
  window.dispatchEvent(new Event('scroll'));

  function updatePresentationDate() {
    const now = new Date();
    $('#dynamicDateDay').textContent = String(now.getDate()).padStart(2, '0');
    $('#dynamicDateMonth').textContent = now.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    $('#dynamicDateYear').textContent = String(now.getFullYear());
  }
  updatePresentationDate();
  window.setInterval(updatePresentationDate, 60 * 1000);

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
  $('#backToBeginning').addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  });

  // Reveal animations
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  // Lifespan stage explorer
  const lifeStages = {
    'early-years': {
      age: '0–6', unit: 'YEARS', kicker: 'SAFETY, TRUST & AUTONOMY',
      title: 'Early years: connection becomes a blueprint.',
      description: 'Responsive relationships help young children recognise emotions, borrow calm from adults, and begin to name what they feel. Secure attachment supports exploration and resilience.',
      task: 'Trust & early regulation', strength: 'Attachment & expression',
      nursing: 'Use predictable routines, a calm voice, play, and caregiver involvement to create emotional safety.',
      faceClass: 'life-face-child', faceColor: '#f9c869', orbits: ['trust', 'attachment', 'autonomy'],
      caption: 'EARLY YEARS · 0–6 YEARS', accent: '#74d8bf', background: '#ebf5f0'
    },
    'school-years': {
      age: '6–12', unit: 'YEARS', kicker: 'COMPETENCE, EMPATHY & BELONGING',
      title: 'School years: feelings gain perspective.',
      description: 'Friendships, games, learning, and social comparison give children daily practice with fairness, confidence, disappointment, and empathy. Language makes reflection more possible.',
      task: 'Competence & social belonging', strength: 'Perspective-taking & empathy',
      nursing: 'Invite the child to explain their viewpoint, offer concrete choices, and recognise effort as well as achievement.',
      faceClass: 'life-face-school', faceColor: '#9edcc9', orbits: ['friendship', 'empathy', 'fairness'],
      caption: 'SCHOOL YEARS · 6–12 YEARS', accent: '#f9c869', background: '#fff4da'
    },
    adolescence: {
      age: '12–18', unit: 'YEARS', kicker: 'IDENTITY, PEERS & INDEPENDENCE',
      title: 'Adolescence: emotion meets identity.',
      description: 'Body changes, peer relationships, values, and a growing wish for independence can intensify emotion. Adolescents refine coping through reflection, trusted connection, and real-world practice.',
      task: 'Identity & independent regulation', strength: 'Values, insight & intimacy',
      nursing: 'Preserve dignity, clarify confidentiality limits, and collaborate rather than lecture whenever possible.',
      faceClass: 'life-face-teen', faceColor: '#bfafea', orbits: ['identity', 'peer bonds', 'coping'],
      caption: 'ADOLESCENCE · 12–18 YEARS', accent: '#bfafea', background: '#f0ebfb'
    },
    adulthood: {
      age: '18–65', unit: 'YEARS', kicker: 'INTIMACY, PURPOSE & FLEXIBILITY',
      title: 'Adulthood: regulation adapts to many roles.',
      description: 'Adults continue learning through work, relationships, parenting, loss, culture, and changing responsibilities. Emotional maturity includes flexibility, empathy, boundaries, and asking for help.',
      task: 'Connection, purpose & resilience', strength: 'Reflection & flexible coping',
      nursing: 'Assess stressors, support networks, role demands, and coping strategies — never assume an adult is coping simply because they appear capable.',
      faceClass: 'life-face-adult', faceColor: '#ffb19f', orbits: ['intimacy', 'purpose', 'resilience'],
      caption: 'ADULTHOOD · 18–65 YEARS', accent: '#ff806a', background: '#fff0eb'
    },
    'later-life': {
      age: '65+', unit: 'YEARS', kicker: 'MEANING, ADAPTATION & LEGACY',
      title: 'Later life: experience can deepen emotional wisdom.',
      description: 'Life review, changing health, retirement, grief, and shifting social roles can bring both challenge and insight. Connection, autonomy, and a sense of meaning remain emotionally protective.',
      task: 'Meaning-making & adaptation', strength: 'Perspective & emotional wisdom',
      nursing: 'Support dignity, choice, communication, and social connection. Assess grief and mood sensitively without treating normal emotion as weakness.',
      faceClass: 'life-face-older', faceColor: '#bfe0f4', orbits: ['meaning', 'adaptation', 'legacy'],
      caption: 'LATER LIFE · 65+ YEARS', accent: '#86bfe5', background: '#e8f4fb'
    }
  };

  const lifeElements = {
    orbit: $('#lifeOrbit'), face: $('#lifeFace'), orbits: $('#lifeOrbitLabels'), caption: $('#lifeOrbitCaption'), kicker: $('#lifeKicker'),
    title: $('#lifeTitle'), description: $('#lifeDescription'), task: $('#lifeTask'), strength: $('#lifeStrength'),
    nursing: $('#lifeNursing'), content: $('#lifeCourseContent')
  };

  function renderLifeStage(stageKey) {
    const stage = lifeStages[stageKey];
    if (!stage) return;
    $$('.life-stage-tab').forEach(tab => {
      const active = tab.dataset.lifeStage === stageKey;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    lifeElements.face.className = `life-face ${stage.faceClass}`;
    lifeElements.face.style.background = stage.faceColor;
    lifeElements.orbits.innerHTML = stage.orbits.map((label, index) => `<span class="life-orbit-label life-orbit-label-${['one', 'two', 'three'][index]}">${label.replace(' ', '<br />')}</span>`).join('');
    lifeElements.caption.textContent = stage.caption;
    lifeElements.kicker.textContent = stage.kicker;
    lifeElements.title.textContent = stage.title;
    lifeElements.description.textContent = stage.description;
    lifeElements.task.textContent = stage.task;
    lifeElements.strength.textContent = stage.strength;
    lifeElements.nursing.textContent = stage.nursing;
    lifeElements.orbit.style.setProperty('--life-accent', stage.accent);
    lifeElements.orbit.style.background = stage.background;
    lifeElements.content.animate([{ opacity: .58, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 130, easing: 'ease-out' });
  }
  $$('.life-stage-tab').forEach(tab => tab.addEventListener('click', () => renderLifeStage(tab.dataset.lifeStage)));

  // Nursing communication guide
  const careGuides = {
    child: {
      label: 'CHILD · THERAPEUTIC STARTER', icon: '◕', title: '“Show me what feels worrying.”',
      description: 'Children often communicate emotion through play, behaviour, body complaints, or a caregiver. Simple words, choices, visual preparation, and play reduce uncertainty.',
      notice: 'Clinginess, silence, regression, restlessness, refusal, or changes in play.',
      support: 'Involve a trusted adult, keep language concrete, and offer a small safe choice.'
    },
    teen: {
      label: 'ADOLESCENT · THERAPEUTIC STARTER', icon: '◌', title: '“Would you prefer a few minutes of privacy before we talk?”',
      description: 'Adolescents may protect themselves through silence, humour, irritability, or withdrawal. Respectful collaboration and clear confidentiality boundaries make care safer.',
      notice: 'Changes in engagement, sleep, peers, risk-taking, body language, or statements of hopelessness.',
      support: 'Speak directly to the adolescent, preserve dignity, and invite their goals into the care plan.'
    },
    adult: {
      label: 'ADULT · THERAPEUTIC STARTER', icon: '◇', title: '“What has this change been like for you?”',
      description: 'Adults balance emotions with work, family, identity, and practical demands. Stress may appear as sleep changes, pain, irritability, over-control, or missed care.',
      notice: 'Role overload, isolation, caregiver strain, substance use, changes in functioning, or health anxiety.',
      support: 'Ask about strengths and support networks. Offer realistic options rather than assuming one coping style fits all.'
    },
    older: {
      label: 'OLDER ADULT · THERAPEUTIC STARTER', icon: '✦', title: '“What matters most to you as we plan your care?”',
      description: 'Later adulthood can bring grief, adaptation, and emotional wisdom. Hearing, vision, mobility, cognitive changes, and social loss may influence how feelings are expressed.',
      notice: 'Withdrawal, grief, loneliness, delirium risk, changes in appetite or sleep, and shifts in usual functioning.',
      support: 'Allow time, support autonomy, check communication needs, and connect the person with familiar people and meaningful routines.'
    }
  };
  const careGuide = {
    label: $('#careGuideLabel'), icon: $('#careGuideIcon'), title: $('#careGuideTitle'), description: $('#careGuideDescription'),
    notice: $('#careGuideNotice'), support: $('#careGuideSupport'), card: $('#careGuideCard')
  };
  function renderCareGuide(key) {
    const guide = careGuides[key];
    if (!guide) return;
    $$('.care-stage').forEach(tab => {
      const active = tab.dataset.careStage === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    careGuide.label.textContent = guide.label;
    careGuide.icon.textContent = guide.icon;
    careGuide.title.textContent = guide.title;
    careGuide.description.textContent = guide.description;
    careGuide.notice.textContent = guide.notice;
    careGuide.support.textContent = guide.support;
    careGuide.card.animate([{ opacity: .58, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 130, easing: 'ease-out' });
  }
  $$('.care-stage').forEach(tab => tab.addEventListener('click', () => renderCareGuide(tab.dataset.careStage)));
})();
