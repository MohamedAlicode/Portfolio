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
    fr: "Je m'appelle Mohamed Ali Ouachani. Je conçois et je code des sites complets, de la base de données jusqu'à l'animation : une boutique en ligne, un quiz en temps réel, une page qui se raconte au scroll.",
    en: "I'm Mohamed Ali Ouachani. I design and build complete websites, from the database to the animation: an online shop, a real-time quiz, a page that tells its story as you scroll.",
  },
  ctaProjects: { fr: 'Voir mes projets', en: 'See my projects' },
  ctaContact: { fr: 'Me contacter', en: 'Contact me' },
  // Cartouche façon plan technique, en bas à droite du hero (grand écran)
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
    fr: 'Faites défiler : chaque démo se rejoue image par image.',
    en: 'Keep scrolling: each demo replays frame by frame.',
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
