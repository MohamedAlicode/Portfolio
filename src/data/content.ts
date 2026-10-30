// Tout le contenu du site est ici : textes FR/EN, projets, liens.
// Pour modifier un texte, change-le dans `fr` et dans `en`.

export type Lang = 'fr' | 'en'
export type Localized<T = string> = Record<Lang, T>

export const site = {
  name: 'Mohamed Ali Ouachani',
  email: 'o.mohamedpro@gmail.com',
  github: 'https://github.com/MohamedAlicode',
  linkedin: 'https://www.linkedin.com/in/mohamed-ouachani-7934a2284/',
  cv: 'cv/CV_Mohamed_Ali_Ouachani.pdf',
  // Adresse publique du site, à mettre à jour après le déploiement
  url: 'https://mohamedalicode.github.io/Portfolio/',
  sourceCode: 'https://github.com/MohamedAlicode/Portfolio',
}

// Titre et description de la page (onglet, Google, partage sur les réseaux)
export const seo = {
  title: {
    fr: 'Mohamed Ali Ouachani · Développeur web full-stack',
    en: 'Mohamed Ali Ouachani · Full-stack web developer',
  },
  description: {
    fr: 'Portfolio de Mohamed Ali Ouachani, développeur web full-stack à Paris (React, Next.js, TypeScript, Node.js, PostgreSQL). Trois projets à découvrir\u00a0: Maison Cadran, Altaïr, Quiz Live.',
    en: 'Portfolio of Mohamed Ali Ouachani, full-stack web developer in Paris (React, Next.js, TypeScript, Node.js, PostgreSQL). Three projects to explore: Maison Cadran, Altaïr, Quiz Live.',
  },
}

export const ui = {
  skip: { fr: 'Aller au contenu', en: 'Skip to content' },
  nav: {
    projects: { fr: 'Projets', en: 'Projects' },
    skills: { fr: 'Compétences', en: 'Skills' },
    path: { fr: 'Parcours', en: 'Background' },
    contact: { fr: 'Contact', en: 'Contact' },
  },
  themeToLight: { fr: 'Clair', en: 'Light' },
  themeToDark: { fr: 'Sombre', en: 'Dark' },
  themeLabel: { fr: 'Changer de thème', en: 'Switch theme' },
  langLabel: { fr: 'Changer de langue', en: 'Switch language' },
  loading: { fr: 'Chargement', en: 'Loading' },
  scroll: { fr: 'Défiler', en: 'Scroll' },
} satisfies Record<string, unknown>

export const hero = {
  eyebrow: {
    fr: ['Développeur web full-stack', 'Paris', 'Anglais C2'],
    en: ['Full-stack web developer', 'Paris', 'English C2'],
  },
  status: { fr: 'Disponible pour un CDI ou un CDD', en: 'Open to permanent or fixed-term roles' },
  // Chaque ligne du titre ; le mot entre * * passe en italique bronze
  title: {
    fr: ['Des interfaces', 'qui *bougent*,', 'un code qui tient.'],
    en: ['Interfaces', 'that *move*,', 'code that holds.'],
  },
  intro: {
    fr: "Je m'appelle Mohamed Ali Ouachani. Je conçois et je code des sites complets, de la base de données jusqu'à l'animation : une boutique en ligne, un quiz en temps réel, une page qui se raconte au scroll.",
    en: "I'm Mohamed Ali Ouachani. I design and build complete websites, from the database to the animation: an online shop, a real-time quiz, a page that tells its story as you scroll.",
  },
  ctaProjects: { fr: 'Voir mes projets', en: 'See my projects' },
  ctaContact: { fr: 'Me contacter', en: 'Contact me' },
  // Cartouche façon plan technique, à côté du titre du hero (grand écran)
  sheet: {
    title: { fr: 'Fiche technique', en: 'Spec sheet' },
    rows: [
      { k: { fr: 'Rôle', en: 'Role' }, v: { fr: 'Développeur web full-stack', en: 'Full-stack web developer' } },
      { k: { fr: 'Stack', en: 'Stack' }, v: { fr: 'React · Next.js · TypeScript · Node.js', en: 'React · Next.js · TypeScript · Node.js' } },
      { k: { fr: 'Formation', en: 'Education' }, v: { fr: 'Bachelor informatique, 2024', en: 'Bachelor’s in computing, 2024' } },
      { k: { fr: 'Langues', en: 'Languages' }, v: { fr: 'Français · Anglais C2', en: 'French · English C2' } },
      { k: { fr: 'Basé à', en: 'Based in' }, v: { fr: 'Paris', en: 'Paris' } },
      { k: { fr: 'Recherche', en: 'Looking for' }, v: { fr: 'CDI ou CDD', en: 'Permanent or fixed-term role' } },
    ],
  },
  portalKicker: { fr: 'Projets', en: 'Projects' },
  portalTitle: {
    fr: 'Trois projets, conçus et codés de A à Z.',
    en: 'Three projects, designed and built end to end.',
  },
  portalText: {
    fr: 'Les projets défilent tout seuls\u00a0: glissez ou utilisez les flèches, et cliquez sur une démo pour ouvrir le site en vrai.',
    en: 'The projects scroll on their own: swipe or use the arrows, and click a demo to open the real site.',
  },
}

// Noms affichés par l'indicateur de chapitre (en bas à gauche)
export const chapters: Record<string, Localized> = {
  'maison-cadran': { fr: 'Maison Cadran', en: 'Maison Cadran' },
  altair: { fr: 'Altaïr', en: 'Altaïr' },
  'quiz-live': { fr: 'Quiz Live', en: 'Quiz Live' },
  competences: { fr: 'Compétences', en: 'Skills' },
  parcours: { fr: 'Parcours', en: 'Background' },
  'a-propos': { fr: 'À propos', en: 'About' },
  contact: { fr: 'Contact', en: 'Contact' },
}

export const projectsUi = {
  kicker: { fr: 'Projets', en: 'Projects' },
  title: { fr: 'Trois projets, conçus et codés de A à Z.', en: 'Three projects, designed and built end to end.' },
  openDemo: { fr: 'Voir la démo', en: 'Live demo' },
  newTab: { fr: 'nouvel onglet', en: 'new tab' },
  play: { fr: 'Lecture', en: 'Play' },
  pause: { fr: 'Pause', en: 'Pause' },
  demoOf: { fr: 'démo de', en: 'demo of' },
  honest: { fr: 'À savoir', en: 'Note' },
  role: { fr: 'Mon rôle', en: 'My role' },
  stack: { fr: 'Stack', en: 'Stack' },
  demo: { fr: 'Voir la démo', en: 'Live demo' },
  code: { fr: 'Voir le code', en: 'Source code' },
  // Carrousel
  carousel: { fr: 'Carrousel des projets', en: 'Project carousel' },
  slide: { fr: 'projet', en: 'project' },
  of: { fr: 'sur', en: 'of' },
  prev: { fr: 'Projet précédent', en: 'Previous project' },
  next: { fr: 'Projet suivant', en: 'Next project' },
  show: { fr: 'Afficher', en: 'Show' },
  autoPause: { fr: 'Arrêter le défilement automatique', en: 'Stop automatic scrolling' },
  autoPlay: { fr: 'Lancer le défilement automatique', en: 'Start automatic scrolling' },
}

// Bandeau défilant entre les projets et les compétences (décoratif)
export const marquee = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.IO', 'GSAP', 'Prisma', 'Tailwind CSS']

// Où une compétence a servi : un projet (ancre de son chapitre) ou un poste du parcours
// (un projet ouvre le carrousel sur sa carte)
export const proofs: Record<string, { name: string; href: string; project?: string }> = {
  'maison-cadran': { name: 'Maison Cadran', href: '#projets', project: 'maison-cadran' },
  altair: { name: 'Altaïr', href: '#projets', project: 'altair' },
  'quiz-live': { name: 'Quiz Live', href: '#projets', project: 'quiz-live' },
  laptopcstore: { name: 'Laptopcstore', href: '#parcours-laptopcstore' },
  certideal: { name: 'Certideal', href: '#parcours-certideal' },
}

export type SkillGroup = { name: Localized; items: (string | Localized)[]; proof: (keyof typeof proofs)[] }

export const skills = {
  kicker: { fr: 'Compétences', en: 'Skills' },
  title: {
    fr: ['Ce que j’utilise,', 'et *où* je m’en', 'suis servi.'],
    en: ['What I use,', 'and *where*', 'I used it.'],
  },
  intro: {
    fr: 'Pas de barres de pourcentage : chaque domaine renvoie aux projets ou aux postes où je l’ai mis en pratique. Les cartes défilent toutes seules, ou à la main.',
    en: 'No percentage bars: each area points to the projects or jobs where I put it into practice. The cards scroll on their own, or by hand.',
  },
  proofLabel: { fr: 'Vu dans', en: 'Used in' },
  // Carrousel
  carousel: { fr: 'Carrousel des compétences', en: 'Skills carousel' },
  slide: { fr: 'domaine', en: 'area' },
  prev: { fr: 'Domaine précédent', en: 'Previous area' },
  next: { fr: 'Domaine suivant', en: 'Next area' },
  groups: [
    {
      name: { fr: 'Front-end', en: 'Front-end' },
      items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Zustand', 'GSAP', 'Lenis', 'Framer Motion'],
      proof: ['maison-cadran', 'altair', 'quiz-live'],
    },
    {
      name: { fr: 'Back-end', en: 'Back-end' },
      items: ['Node.js', 'Express', 'Socket.IO', 'PHP', 'Python', 'Auth.js', { fr: 'Stripe (mode test)', en: 'Stripe (test mode)' }, 'Zod', 'OpenAPI'],
      proof: ['maison-cadran', 'quiz-live', 'laptopcstore'],
    },
    {
      name: { fr: 'Données', en: 'Data' },
      items: ['SQL', 'PostgreSQL', 'Prisma', 'MongoDB'],
      proof: ['maison-cadran', 'quiz-live', 'laptopcstore'],
    },
    {
      name: { fr: 'Qualité et outils', en: 'Quality and tooling' },
      items: ['Git', 'GitHub', 'GitHub Actions', 'Vitest', 'Supertest', 'Docker', 'VS Code', 'Claude Code'],
      proof: ['maison-cadran', 'quiz-live'],
    },
    {
      name: { fr: 'Jeu vidéo et autres langages', en: 'Games and other languages' },
      items: ['Unreal Engine (Blueprints, C++)', 'Java', 'C', 'C++'],
      proof: [],
    },
    {
      name: { fr: 'Matériel et systèmes', en: 'Hardware and systems' },
      items: [
        { fr: 'Montage, optimisation et réparation de PC', en: 'Building, tuning and repairing PCs' },
        { fr: 'Installation et maintenance de postes', en: 'Workstation setup and maintenance' },
        { fr: 'Diagnostic et remise en état de téléphones', en: 'Phone diagnostics and refurbishing' },
      ],
      proof: ['laptopcstore', 'certideal'],
    },
  ] satisfies SkillGroup[],
}

export type PathEntry = {
  id: string
  /** Repère affiché en grand pendant la lecture (grand écran) */
  mark: string | Localized
  when: Localized
  kind: 'work' | 'school' | 'next'
  title: Localized
  place: Localized
  text?: Localized
  /** Ce que cette expérience apporte à une équipe */
  assets?: Localized<string[]>
}

export const path = {
  kicker: { fr: 'Parcours', en: 'Background' },
  title: {
    fr: ['Coder, et savoir', 'l’*expliquer*.'],
    en: ['Writing code,', 'and *explaining* it.'],
  },
  intro: {
    fr: 'Un BTS, un Bachelor, deux expériences de développeur web, puis plus d’un an et demi à animer des ateliers numériques pour des enfants. Ce dernier poste m’a appris ce qu’une équipe attend aussi d’un développeur : expliquer clairement et garder son calme.',
    en: 'A two-year degree, a bachelor’s, two web developer roles, then over a year and a half running digital workshops for children. That last job taught me what a team also needs from a developer: clear explanations and a calm head.',
  },
  kinds: {
    work: { fr: 'Expérience', en: 'Experience' },
    school: { fr: 'Formation', en: 'Education' },
    next: { fr: 'Recherche', en: 'Looking for' },
  },
  assetsLabel: { fr: 'Ce que j’en garde pour une équipe', en: 'What I bring from it to a team' },
  nextCta: { fr: 'Me contacter', en: 'Contact me' },
  entries: [
    {
      id: 'uncom',
      mark: '2022',
      when: { fr: 'Janv. – mars 2022', en: 'Jan – Mar 2022' },
      kind: 'work',
      title: { fr: 'Développeur web, stage', en: 'Web developer, internship' },
      place: { fr: 'UNCOM, Paris', en: 'UNCOM, Paris' },
      text: {
        fr: 'Intégration de la page de connexion de l’intranet en HTML et CSS, adaptée à tous les écrans, et tests de solutions pour faire évoluer l’intranet.',
        en: 'Built the intranet login page in HTML and CSS, responsive on every screen, and tested options to move the intranet forward.',
      },
    },
    {
      id: 'laptopcstore',
      mark: '2023',
      when: { fr: 'Janv. 2023 – janv. 2024', en: 'Jan 2023 – Jan 2024' },
      kind: 'work',
      title: { fr: 'Développeur web', en: 'Web developer' },
      place: { fr: 'Laptopcstore, Fontenay-sous-Bois', en: 'Laptopcstore, Fontenay-sous-Bois' },
      text: {
        fr: 'Le site e-commerce de l’entreprise en PHP, Python, HTML et CSS, avec sa base SQL : le catalogue et les fiches produits sont alimentés par la base. Maintenance informatique et suivi du matériel.',
        en: 'The company’s e-commerce site in PHP, Python, HTML and CSS, with its SQL database: the catalogue and product pages are driven by the database. IT maintenance and hardware follow-up.',
      },
    },
    {
      id: 'bts',
      mark: '2023',
      when: { fr: '2023', en: '2023' },
      kind: 'school',
      title: { fr: 'BTS Systèmes Numériques', en: 'BTS in Digital Systems' },
      place: { fr: 'Lycée Dorian, Paris', en: 'Lycée Dorian, Paris' },
      text: { fr: 'Option Électronique et Communications.', en: 'Two-year degree, Electronics and Communications track.' },
    },
    {
      id: 'bachelor',
      mark: '2024',
      when: { fr: '2024', en: '2024' },
      kind: 'school',
      title: { fr: 'Bachelor Informatique', en: 'Bachelor’s in Computing' },
      place: { fr: 'H3 Hitema, Issy-les-Moulineaux', en: 'H3 Hitema, Issy-les-Moulineaux' },
      text: {
        fr: 'Administrateur des systèmes d’information, option développement web, logiciel et mobile.',
        en: 'Information systems administration, with a web, software and mobile development track.',
      },
    },
    {
      id: 'certideal',
      mark: '2025',
      when: { fr: 'Janv. – mars 2025', en: 'Jan – Mar 2025' },
      kind: 'work',
      title: { fr: 'Préparateur de commandes', en: 'Order picker' },
      place: { fr: 'Certideal, Levallois-Perret', en: 'Certideal, Levallois-Perret' },
      text: {
        fr: 'Diagnostic, tests et remise en état de téléphones ; gestion du stock.',
        en: 'Diagnosed, tested and refurbished phones; managed stock.',
      },
    },
    {
      id: 'animateur',
      mark: '2025',
      when: { fr: 'Févr. 2025 – oct. 2026', en: 'Feb 2025 – Oct 2026' },
      kind: 'work',
      title: { fr: 'Animateur enfance', en: 'Children’s activity leader' },
      place: { fr: 'Écoles des Morillons et Brancion, Paris', en: 'Morillons and Brancion schools, Paris' },
      text: {
        fr: 'Ateliers de découverte de l’ordinateur (souris, clavier, jeux éducatifs) et petits projets numériques avec des groupes de 3 à 11 ans. Travail en équipe et échanges avec les parents.',
        en: 'Computer discovery workshops (mouse, keyboard, educational games) and small digital projects with groups aged 3 to 11. Teamwork and regular contact with parents.',
      },
      assets: {
        fr: ['Pédagogie', 'Clarté', 'Gestion de groupe', 'Patience'],
        en: ['Teaching', 'Clarity', 'Group management', 'Patience'],
      },
    },
    {
      id: 'bafa',
      mark: '2026',
      when: { fr: '2026', en: '2026' },
      kind: 'school',
      title: { fr: 'BAFA', en: 'BAFA' },
      place: { fr: 'Brevet d’aptitude aux fonctions d’animateur', en: 'French certificate for youth activity leaders' },
    },
    {
      id: 'suite',
      mark: { fr: 'Et après', en: 'Next' },
      when: { fr: 'Maintenant', en: 'Now' },
      kind: 'next',
      title: { fr: 'Développeur web, en CDI ou en CDD', en: 'Web developer, permanent or fixed-term' },
      place: { fr: 'Paris', en: 'Paris' },
      text: {
        fr: 'Le prochain chapitre. Si votre équipe recrute, parlons-en.',
        en: 'The next chapter. If your team is hiring, let’s talk.',
      },
    },
  ] satisfies PathEntry[],
}

export const about = {
  kicker: { fr: 'À propos', en: 'About' },
  // Révélé mot à mot au scroll ; les mots entre * * passent en italique bronze
  text: {
    fr: 'En dehors du code, je monte, j’optimise et je répare des *PC*. Je joue surtout à des FPS et à des jeux de rôle tactiques, et je développe aussi sur *Unreal Engine*, en Blueprints et en C++. J’ai *voyagé* en Espagne, en Belgique, aux Pays-Bas, en Allemagne, en Suisse, en Angleterre, en Tunisie, en Indonésie et en Arabie saoudite. Animer des ateliers pour des enfants m’a appris à *expliquer simplement*, et c’est aussi utile en équipe. Je cherche maintenant une équipe avec qui construire des produits solides, et continuer d’apprendre.',
    en: 'Away from code, I build, tune and repair *PCs*. I mostly play FPS and tactical RPGs, and I also develop in *Unreal Engine*, with Blueprints and C++. I’ve *travelled* to Spain, Belgium, the Netherlands, Germany, Switzerland, England, Tunisia, Indonesia and Saudi Arabia. Running workshops for children taught me to *explain things simply*, which helps in a team too. Now I’m looking for a team to build solid products with, and to keep learning.',
  },
  facts: [
    { k: { fr: 'Matériel', en: 'Hardware' }, v: { fr: 'Montage et réparation de PC', en: 'Building and repairing PCs' } },
    { k: { fr: 'Jeux', en: 'Games' }, v: { fr: 'FPS, jeux de rôle tactiques', en: 'FPS, tactical RPGs' } },
    { k: { fr: 'Ailleurs', en: 'Elsewhere' }, v: { fr: 'Voyages, 9 pays', en: 'Travel, 9 countries' } },
    { k: { fr: 'Permis', en: 'Licence' }, v: { fr: 'A2 et B', en: 'A2 and B' } },
  ],
}

export const contact = {
  kicker: { fr: 'Contact', en: 'Contact' },
  title: { fr: ['Vous recrutez ?', '*Parlons-en.*'], en: ['Hiring?', '*Let’s talk.*'] },
  text: {
    fr: 'Je cherche un poste de développeur web en CDI ou en CDD. Le plus simple pour me joindre : un e-mail.',
    en: 'I’m looking for a permanent or fixed-term web developer role. The easiest way to reach me is by email.',
  },
  emailLabel: { fr: 'E-mail', en: 'Email' },
  write: { fr: 'Écrire', en: 'Write' },
  copy: { fr: 'Copier', en: 'Copy' },
  copied: { fr: 'Copiée', en: 'Copied' },
  copiedLive: { fr: 'Adresse e-mail copiée', en: 'Email address copied' },
  copyLabel: { fr: 'Copier l’adresse e-mail', en: 'Copy the email address' },
  elsewhere: { fr: 'Ailleurs', en: 'Elsewhere' },
  cv: { fr: 'Télécharger mon CV', en: 'Download my CV' },
  cvMeta: { fr: 'PDF, une page, en français', en: 'PDF, one page, in French' },
}

export const footer = {
  made: { fr: 'Fait avec Vite, React, GSAP et Lenis.', en: 'Built with Vite, React, GSAP and Lenis.' },
  source: { fr: 'Code source du site', en: 'Site source code' },
  top: { fr: 'Haut de page', en: 'Back to top' },
}
