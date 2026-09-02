(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  // Header and small motion details
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const nav = $('.main-nav');

  function updatePresentationDate() {
    const now = new Date();
    $('#dynamicDateDay').textContent = String(now.getDate()).padStart(2, '0');
    $('#dynamicDateMonth').textContent = now.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
    $('#dynamicDateYear').textContent = String(now.getFullYear());
  }
  updatePresentationDate();
  // Keeps the displayed date correct if the page remains open across midnight.
  window.setInterval(updatePresentationDate, 60 * 1000);

  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 18), { passive: true });
  window.dispatchEvent(new Event('scroll'));

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('.main-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));
  $('#backToBeginning')?.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  });

  // Scroll-in animation
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  // Development stage explorer
  const stages = {
    infancy: {
      age: '0–2', faceClass: 'face-early', kicker: 'THE FIRST CONNECTION',
      title: 'Infancy: feelings begin in the body.',
      description: 'Infants express basic emotions before they can use words. A responsive caregiver helps the baby move from distress toward calm — the foundation of regulation and secure attachment.',
      milestones: [['0–3 mo', 'Interest, distress, and social smiling emerge.'], ['6–12 mo', 'Joy, anger, fear; stranger and separation anxiety may appear.'], ['18–24 mo', 'Self-conscious feelings begin; toddlers seek autonomy.']],
      theory: '<span>◆</span><strong>Attachment lens:</strong> consistent comfort supports trust and emotional security.',
      orbits: ['social smile', 'attachment', 'first words'],
      visual: { background: '#e3f5ed', sun: '#f9c869', bar: '#ff806a' }
    },
    early: {
      age: '2–6', faceClass: 'face-infant', kicker: 'BIG FEELINGS, NEW WORDS',
      title: 'Early childhood: “I do it myself.”',
      description: 'Preschoolers experience intense feelings and are learning to name them. Play, routines, and a calm adult give them practice with waiting, sharing, and recovering after disappointment.',
      milestones: [['2–3 y', 'Pride, shame, and simple emotion words become more visible.'], ['3–4 y', 'Pretend play rehearses caring, fear, and conflict.'], ['4–6 y', 'Children start using basic strategies such as distraction or asking for help.']],
      theory: '<span>◆</span><strong>Erikson’s lens:</strong> autonomy and initiative grow when adults guide without shaming.',
      orbits: ['autonomy', 'pretend play', 'feeling words'],
      visual: { background: '#fff0d2', sun: '#ff9e80', bar: '#1c8c78' }
    },
    middle: {
      age: '6–12', faceClass: 'face-middle', kicker: 'SEEING ANOTHER VIEWPOINT',
      title: 'Middle childhood: feelings get more complex.',
      description: 'School-age children can compare, conceal, and discuss emotions with increasing detail. Friendships, achievement, rules, and social comparison shape confidence, empathy, and self-worth.',
      milestones: [['6–8 y', 'Better understanding of why people feel differently.'], ['8–10 y', 'Rule-based games and friendships invite empathy and fairness.'], ['10–12 y', 'More complex emotions such as guilt, embarrassment, and mixed feelings.']],
      theory: '<span>◆</span><strong>Cognitive lens:</strong> perspective-taking helps children reframe events and solve social problems.',
      orbits: ['friendships', 'empathy', 'fairness'],
      visual: { background: '#ebe4fa', sun: '#9edcc9', bar: '#8064c7' }
    },
    adolescent: {
      age: '12–18', faceClass: 'face-adolescent', kicker: 'IDENTITY, BELONGING & REGULATION',
      title: 'Adolescence: feelings meet identity.',
      description: 'Emotion can feel heightened as body changes, peer relationships, independence, and identity develop. Adolescents benefit from privacy, respect, practical coping skills, and trusted connection.',
      milestones: [['12–14 y', 'Self-consciousness and peer influence often intensify.'], ['15–16 y', 'Abstract thinking supports reflection on values and identity.'], ['17–18 y', 'More independent regulation and mature intimacy can emerge.']],
      theory: '<span>◆</span><strong>Social context lens:</strong> peers, family, culture, and online worlds all influence emotional expression.',
      orbits: ['identity', 'peer bonds', 'coping skills'],
      visual: { background: '#dceaf8', sun: '#ffb8a7', bar: '#315a91' }
    }
  };

  const stageElements = {
    age: $('#stageAge'), icon: $('#stageIcon'), kicker: $('#stageKicker'), title: $('#stageTitle'),
    description: $('#stageDescription'), milestones: $('#stageMilestones'), theory: $('#stageTheory'), orbits: $('#orbitLabels'), visual: $('.stage-visual'), iconBox: $('.stage-icon')
  };

  $$('.stage-tab').forEach(button => button.addEventListener('click', () => {
    const stage = stages[button.dataset.stage];
    $$('.stage-tab').forEach(tab => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-selected', String(tab === button));
    });
    stageElements.age.textContent = stage.age;
    stageElements.icon.className = `stage-icon ${stage.faceClass}`;
    stageElements.kicker.textContent = stage.kicker;
    stageElements.title.textContent = stage.title;
    stageElements.description.textContent = stage.description;
    stageElements.milestones.innerHTML = stage.milestones.map(item => `<div><b>${item[0]}</b><span>${item[1]}</span></div>`).join('');
    stageElements.theory.innerHTML = stage.theory;
    stageElements.orbits.innerHTML = stage.orbits.map((label, index) => `<span class="orbit-label orbit-label-${['one', 'two', 'three'][index]}">${label.replace(' ', '<br />')}</span>`).join('');
    stageElements.visual.style.background = stage.visual.background;
    stageElements.iconBox.style.background = stage.visual.sun;
    $$('.wave-bars i').forEach(bar => bar.style.background = stage.visual.bar);
    $('#stageContent').animate([{ opacity: .48, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
  }));

  // Age growth map
  const ageFacts = {
    0: { title: 'Comfort is communication.', copy: 'Newborns signal distress through crying and body movement. A calm, responsive adult helps meet physical needs and begins the rhythm of co-regulation.', tags: ['comfort', 'bonding', 'basic cues'], stat: 'Early care teaches that distress can be noticed and answered.' },
    1: { title: 'Attachment becomes visible.', copy: 'Many infants show stronger preferences for familiar people and may react to separation. Predictable routines and sensitive responses build a sense of security.', tags: ['attachment', 'stranger anxiety', 'trust'], stat: 'By the first year, familiar faces often become an important source of emotional safety.' },
    2: { title: 'Naming begins to help.', copy: 'Tantrums can occur as strong wishes meet limited language and impulse control. Adults can co-regulate: name the feeling, keep limits calm, and offer a simple choice.', tags: ['autonomy', 'big feelings', 'co-regulation'], stat: 'By this age, children often begin to use simple feeling words like “happy” and “sad.”' },
    3: { title: 'Play becomes emotional practice.', copy: 'Through pretend play, children rehearse being a parent, a hero, or a worried patient. They learn that feelings can be acted out safely and talked about later.', tags: ['pretend play', 'language', 'initiative'], stat: 'At 3, imaginative play often gives adults clues about a child’s emotional world.' },
    4: { title: 'Empathy starts to bloom.', copy: 'Preschoolers may comfort someone who is hurt and begin to understand simple causes of emotions. Their regulation still relies on adult modelling and structure.', tags: ['empathy', 'modelling', 'routines'], stat: 'At 4, children may recognise when someone else is sad and try to help.' },
    5: { title: 'Rules can feel very important.', copy: 'A growing sense of fairness appears. Children may be proud after mastering a task, or very disappointed when a rule or expectation changes.', tags: ['fairness', 'pride', 'limits'], stat: 'At 5, clear, kind explanations help turn disappointment into a learning moment.' },
    6: { title: 'Friendships add new feelings.', copy: 'School brings teamwork, comparison, and belonging. Children become more able to hide a feeling, follow social rules, and discuss another person’s point of view.', tags: ['friendship', 'perspective', 'belonging'], stat: 'At 6, social experiences begin to strongly shape emotion regulation practice.' },
    8: { title: 'Feelings can be mixed.', copy: 'A child may feel proud of trying and disappointed with the result at the same time. Talking through these mixed states strengthens emotional literacy.', tags: ['mixed feelings', 'skills', 'self-worth'], stat: 'Around 8, children increasingly understand that one situation can create more than one feeling.' },
    10: { title: 'Self-evaluation grows louder.', copy: 'Achievement, peer acceptance, and comparison can influence confidence. Encourage effort, offer specific feedback, and make room for private conversation.', tags: ['competence', 'comparison', 'confidence'], stat: 'Around 10, supportive feedback can protect motivation when children compare themselves with peers.' },
    12: { title: 'The inner world expands.', copy: 'Puberty and new social demands can make emotions feel intense. Pre-teens benefit from accurate information, coping tools, and adults who listen without quick judgement.', tags: ['change', 'privacy', 'coping'], stat: 'At 12, being heard respectfully can matter as much as being given advice.' },
    14: { title: 'Identity asks big questions.', copy: 'Adolescents may explore who they are, where they belong, and how others see them. Offer dignity, confidentiality within safety limits, and genuine collaboration.', tags: ['identity', 'peers', 'respect'], stat: 'At 14, a non-judgemental relationship can make help-seeking feel safer.' },
    16: { title: 'Reflection supports regulation.', copy: 'More advanced thinking makes it easier to anticipate consequences, examine values, and choose strategies. Stress can still overwhelm these skills, especially in difficult contexts.', tags: ['reflection', 'values', 'resilience'], stat: 'At 16, coping skills are strengthened through practice, not simply instruction.' },
    18: { title: 'Independence with connection.', copy: 'Young adults continue refining emotional regulation, intimacy, and decision-making. Supportive networks and healthy help-seeking remain protective throughout life.', tags: ['independence', 'intimacy', 'support'], stat: 'At 18, emotional growth continues — development is lifelong.' }
  };
  const ageRange = $('#ageRange');
  function nearestFact(age) {
    return ageFacts[age] || ageFacts[Object.keys(ageFacts).map(Number).reduce((closest, current) => Math.abs(current - age) < Math.abs(closest - age) ? current : closest)];
  }
  function updateAgeMap() {
    const age = Number(ageRange.value);
    const fact = nearestFact(age);
    const percent = (age / 18) * 100;
    ageRange.style.setProperty('--range-progress', `${percent}%`);
    $('#ageValue').textContent = age === 0 ? '0' : age;
    $('#mapStatNumber').textContent = age === 0 ? '0' : age;
    $('#mapStatText').textContent = fact.stat;
    $('#mapResult').innerHTML = `<p class="map-result-label">AT AROUND ${age === 0 ? 'BIRTH' : `AGE ${age}`}</p><h3>${fact.title}</h3><p>${fact.copy}</p><div class="map-chip-row">${fact.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`;
  }
  ageRange?.addEventListener('input', updateAgeMap);
  updateAgeMap();

  // Emotion lab
  const emotions = {
    joy: { overline: 'SIGNAL OF SAFETY & CONNECTION', title: 'Joy says: “I feel safe enough to engage.”', mark: '✦', orbClass: 'joy-orb', notice: 'Bright eyes, smiling, energetic movement, shared attention, and playful vocalisations.', support: 'Join the positive moment, mirror the feeling, and offer warm, specific acknowledgement: “You are proud of that tower!”', nursing: 'Positive affect can be an entry point for rapport, play-based assessment, and health teaching.' },
    fear: { overline: 'SIGNAL OF POSSIBLE THREAT OR UNCERTAINTY', title: 'Fear says: “I need safety before I can cope.”', mark: '⌁', orbClass: 'fear-orb', notice: 'Clinging, silence, rapid speech, avoidance, tears, a tense body, or repeated questions about what will happen.', support: 'Acknowledge the feeling, explain in simple truthful steps, invite a trusted person close, and offer a small choice where possible.', nursing: 'Before a procedure, prepare the child at their level. Do not dismiss fear or promise that something will not hurt.' },
    anger: { overline: 'SIGNAL OF A BLOCKED NEED, LIMIT, OR OVERLOAD', title: 'Anger says: “Something feels too much or unfair.”', mark: '↯', orbClass: 'anger-orb', notice: 'Shouting, throwing, refusing, a clenched jaw, stamping, hitting, or sharp words — sometimes after hunger, fatigue, or fear.', support: 'Stay regulated. Set a clear safety limit, name the emotion without approving harmful behaviour, and offer a reset after the peak.', nursing: 'Ask what came before the behaviour. Protect safety, reduce stimulation, and avoid turning a power struggle into care.' },
    sadness: { overline: 'SIGNAL OF LOSS, DISCONNECTION, OR DISAPPOINTMENT', title: 'Sadness says: “I need space to feel, and someone beside me.”', mark: '◒', orbClass: 'sadness-orb', notice: 'Tears, withdrawal, quietness, low energy, changes in play, slower speech, or saying “I don’t care.”', support: 'Be present without rushing to fix it. Offer a gentle invitation: “I notice this is hard. Would you like to tell me or sit together?”', nursing: 'Observe duration, intensity, functioning, and support systems. Persistent or concerning changes warrant sensitive assessment and referral.' }
  };
  const emotionOrb = $('#emotionOrb');
  $$('.emotion-option').forEach(button => button.addEventListener('click', () => {
    const emotion = emotions[button.dataset.emotion];
    $$('.emotion-option').forEach(option => {
      option.classList.toggle('active', option === button);
      option.setAttribute('aria-selected', String(option === button));
    });
    $('#emotionOverline').textContent = emotion.overline;
    $('#emotionTitle').textContent = emotion.title;
    $('#emotionNotice').textContent = emotion.notice;
    $('#emotionSupport').textContent = emotion.support;
    $('#emotionNursing').textContent = emotion.nursing;
    emotionOrb.className = `emotion-orb ${emotion.orbClass}`;
    emotionOrb.textContent = emotion.mark;
    $('#emotionCard').animate([{ opacity: .45, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 230, easing: 'ease-out' });
  }));

  // Nursing scenarios
  const scenarios = [
    {
      question: 'A 4-year-old becomes tearful and refuses to enter the vaccination room. What is the most helpful first response?',
      options: [
        ['“There is nothing to cry about. Be brave.”', false],
        ['“This feels scary. You can stay close to your parent while I explain what will happen.”', true],
        ['“If you do not stop crying, we cannot start.”', false]
      ],
      feedback: 'Correct. It names the emotion, offers proximity to a trusted adult, and gives honest preparation — all supports for co-regulation.'
    },
    {
      question: 'An 8-year-old is quiet and reports a stomach ache just before a procedure. What response best explores the emotional cue?',
      options: [
        ['“You are old enough to manage this without fuss.”', false],
        ['“Sometimes worries can make our tummy feel uncomfortable. What are you thinking about the procedure?”', true],
        ['“Let us skip questions and finish as quickly as possible.”', false]
      ],
      feedback: 'Correct. This gently links body and emotion without assuming, then opens a developmentally appropriate conversation.'
    },
    {
      question: 'A 14-year-old avoids eye contact and says, “Whatever,” during health teaching. What is the most therapeutic next step?',
      options: [
        ['Speak only to the parent because the adolescent seems uninterested.', false],
        ['Calmly offer privacy where appropriate: “You do not have to talk now. Would it help if I check back after you have a few minutes?”', true],
        ['Tell the adolescent that cooperation is mandatory.', false]
      ],
      feedback: 'Correct. Respect, choice, and a non-judgemental invitation preserve dignity and can rebuild engagement.'
    }
  ];
  let activeScenario = 0;
  let caseAnswered = false;
  const caseOptions = $('#caseOptions');
  function renderScenario() {
    const scenario = scenarios[activeScenario];
    caseAnswered = false;
    $('#caseStepNumber').textContent = activeScenario + 1;
    $('#caseQuestion').textContent = scenario.question;
    caseOptions.innerHTML = scenario.options.map((option, index) => `<button class="case-option" data-correct="${option[1]}"><span>${String.fromCharCode(65 + index)}</span>${option[0]}</button>`).join('');
    const feedback = $('#caseFeedback');
    feedback.className = 'case-feedback';
    feedback.textContent = 'Choose a response to reveal the clinical reasoning.';
    $('#nextCase').disabled = true;
    $('#nextCase').textContent = activeScenario === scenarios.length - 1 ? 'Replay scenarios ↻' : 'Next scenario →';
    $('#caseProgress').style.width = `${((activeScenario + 1) / scenarios.length) * 100}%`;
    $$('.case-option', caseOptions).forEach(option => option.addEventListener('click', answerCase));
  }
  function answerCase(event) {
    if (caseAnswered) return;
    caseAnswered = true;
    const selected = event.currentTarget;
    const correct = selected.dataset.correct === 'true';
    $$('.case-option', caseOptions).forEach(option => {
      option.disabled = true;
      if (option.dataset.correct === 'true') option.classList.add('correct');
    });
    if (!correct) selected.classList.add('incorrect');
    const feedback = $('#caseFeedback');
    feedback.textContent = correct ? scenarios[activeScenario].feedback : 'Try again mentally: the most helpful response validates the emotion, preserves dignity, and offers safety or choice. ' + scenarios[activeScenario].feedback;
    feedback.classList.add(correct ? 'good' : 'try');
    $('#nextCase').disabled = false;
  }
  $('#nextCase')?.addEventListener('click', () => {
    activeScenario = activeScenario === scenarios.length - 1 ? 0 : activeScenario + 1;
    renderScenario();
  });
  renderScenario();

  // Theory lenses
  const theories = {
    attachment: { mark: '⌇⌇', label: 'ATTACHMENT THEORY · BOWLBY & AINSWORTH', title: 'A secure base makes exploration possible.', text: 'When a caregiver responds sensitively and predictably, a child learns that distress can be met with comfort. This does not remove every difficult emotion; it builds confidence that feelings can be survived and shared.', practice: 'Invite a familiar caregiver into care, use consistent routines, and respond calmly to distress.' },
    erikson: { mark: '⊹', label: 'ERIKSON · PSYCHOSOCIAL DEVELOPMENT', title: 'Each stage asks: “Can I do this, and still belong?”', text: 'Trust, autonomy, initiative, industry, and identity each involve an emotional task. Support works best when it fits the child’s growing wish for agency while maintaining a safe relationship.', practice: 'Offer meaningful, age-appropriate choices: which arm first, who sits nearby, or how the child would like information explained.' },
    social: { mark: '◒', label: 'BANDURA · SOCIAL LEARNING', title: 'Children watch how adults handle feelings.', text: 'Emotional habits are learned through observation, imitation, and consequences. A child who sees an adult pause, name frustration, and repair after conflict gains a practical model for regulation.', practice: 'Model the behaviour you hope to teach: speak calmly, narrate coping, and acknowledge your own mistakes without shame.' },
    cognitive: { mark: '◈', label: 'COGNITIVE-DEVELOPMENTAL LENS', title: 'New ways of thinking create new ways of feeling.', text: 'As language, memory, perspective-taking, and abstract thinking develop, children can interpret situations differently. They gradually understand hidden feelings, mixed feelings, and another person’s viewpoint.', practice: 'Ask open, concrete questions: “What do you think happened?” “What might your friend be feeling?” and “What could help next?”' }
  };
  $$('.theory-card').forEach(card => card.addEventListener('click', () => {
    const theory = theories[card.dataset.theory];
    $$('.theory-card').forEach(item => item.classList.toggle('active', item === card));
    $('.detail-mark').textContent = theory.mark;
    $('#theoryLabel').textContent = theory.label;
    $('#theoryTitle').textContent = theory.title;
    $('#theoryText').textContent = theory.text;
    $('#theoryPractice').textContent = theory.practice;
    $('#theoryDetail').animate([{ opacity: .4, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
  }));

  // Knowledge check — instant feedback, matching the clinical-scenario interaction
  const questions = [
    {
      question: 'Which adult response best supports a toddler who is overwhelmed by frustration?',
      options: ['“Stop crying right now.”', '“You are upset because the block tower fell. I am here; let us take one breath and try again.”', '“Big children do not have tantrums.”'],
      answer: 1,
      explanation: 'Yes. It names the emotion, communicates presence, and models a simple regulation strategy without shaming.'
    },
    {
      question: 'Which observation could suggest fear in a young child before a procedure?',
      options: ['Clinging to a caregiver and repeatedly asking what will happen', 'Wanting to choose a sticker after the procedure', 'Smiling when a familiar nurse enters'],
      answer: 0,
      explanation: 'Correct. Fear can appear as clinginess, reassurance-seeking, avoidance, tears, or a tense body — not only as a child saying “I am scared.”'
    },
    {
      question: 'What is the most accurate statement about emotional development?',
      options: ['All children reach emotional milestones at exactly the same age.', 'Emotional growth depends only on personality.', 'Maturation, relationships, learning, culture, and life experiences all shape it.'],
      answer: 2,
      explanation: 'Correct. Development is influenced by many interacting biological, relational, social, and cultural factors.'
    }
  ];
  let questionIndex = 0;
  let quizAnswered = false;
  const quizOptions = $('#quizOptions');
  const quizNext = $('#quizNext');

  function renderQuestion() {
    const question = questions[questionIndex];
    quizAnswered = false;
    $('#quizLabel').textContent = `QUESTION 0${questionIndex + 1}`;
    $('#quizQuestion').textContent = question.question;
    $('#quizCurrent').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    $('#quizFeedback').className = 'quiz-feedback';
    $('#quizFeedback').textContent = 'Tap an answer to reveal the reasoning.';
    quizOptions.innerHTML = question.options.map((option, index) => `<button class="quiz-option" data-index="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join('');
    $$('.quiz-option', quizOptions).forEach(button => button.addEventListener('click', () => answerQuiz(button)));
    $$('#quizDots i').forEach((dot, index) => dot.classList.toggle('active', index === questionIndex));
    quizNext.disabled = true;
    quizNext.innerHTML = questionIndex === questions.length - 1 ? 'Replay check <span>↻</span>' : 'Next question <span>→</span>';
  }

  function answerQuiz(button) {
    if (quizAnswered) return;
    quizAnswered = true;
    const selectedAnswer = Number(button.dataset.index);
    const question = questions[questionIndex];
    const correct = selectedAnswer === question.answer;
    $$('.quiz-option', quizOptions).forEach(option => {
      option.disabled = true;
      const index = Number(option.dataset.index);
      if (index === question.answer) option.classList.add('correct');
    });
    if (!correct) button.classList.add('wrong');
    const feedback = $('#quizFeedback');
    feedback.className = `quiz-feedback ${correct ? 'correct' : 'wrong'}`;
    feedback.textContent = correct ? question.explanation : `Try again mentally: ${question.explanation}`;
    quizNext.disabled = false;
  }

  quizNext?.addEventListener('click', () => {
    if (!quizAnswered) return;
    questionIndex = questionIndex === questions.length - 1 ? 0 : questionIndex + 1;
    renderQuestion();
  });
  renderQuestion();


})();
