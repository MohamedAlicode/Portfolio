import type { Localized } from './content'
import type { Zone } from '../lib/chapters'

// Les trois projets. Chaque démo (GIF du dépôt) est découpée en images
// dans public/frames/<slug>/ et rejouée au rythme du scroll.
// Les « temps » (beats) s'allument quand le film atteint leur image de départ.

export type Beat = { from: number; title: Localized; text: Localized }
export type Fact = { value: number; prefix?: string; suffix?: Localized; label: Localized }

export type Project = {
  slug: string
  name: string
  frames: number
  ratio: number // largeur / hauteur des images
  zone: Zone
  kind: Localized
  hook: Localized
  role: Localized
  notice?: Localized // projet fictif, concept non officiel…
  beats: Beat[]
  facts: Fact[]
  stack: string[]
  demo: string
  code: string
  demoNote?: Localized
  url: string // adresse affichée dans la barre du navigateur
  poster: Localized // description de la démo pour les lecteurs d'écran
}

const role: Localized = {
  fr: 'Conception et développement complets, seul.',
  en: 'Designed and built entirely on my own.',
}

export const projects: Project[] = [
  {
    slug: 'maison-cadran',
    name: 'Maison Cadran',
    frames: 116,
    ratio: 800 / 500,
    zone: 'paper',
    kind: { fr: 'E-commerce sur mesure', en: 'Custom e-commerce' },
    hook: {
      fr: 'Une boutique de montres construite sans CMS, du catalogue filtrable jusqu’à la facture PDF.',
      en: 'A watch shop built without a CMS, from the filterable catalogue to the PDF invoice.',
    },
    role,
    notice: {
      fr: 'Projet fictif : aucune montre n’est vendue, le paiement fonctionne en mode test.',
      en: 'Fictional project: no watch is sold, payment runs in Stripe test mode.',
    },
    beats: [
      {
        from: 0,
        title: { fr: 'Accueil', en: 'Home' },
        text: {
          fr: 'Pages prérendues au build avec Next.js 16, lectures en base mises en cache.',
          en: 'Pages prerendered at build time with Next.js 16, cached database reads.',
        },
      },
      {
        from: 27,
        title: { fr: 'Catalogue', en: 'Catalogue' },
        text: {
          fr: '9 filtres combinables avec le nombre de résultats sur chaque option. Tout l’état vit dans l’URL : une recherche se partage.',
          en: '9 combinable filters showing the result count on each option. All state lives in the URL, so a search can be shared.',
        },
      },
      {
        from: 54,
        title: { fr: 'Fiche produit', en: 'Product page' },
        text: {
          fr: 'Galerie avec zoom, stock et délai, caractéristiques, avis, montres similaires, données structurées pour le SEO.',
          en: 'Zoomable gallery, stock and lead time, specs, reviews, similar watches, structured data for SEO.',
        },
      },
      {
        from: 84,
        title: { fr: 'Panier et paiement', en: 'Cart and checkout' },
        text: {
          fr: 'Codes promo, Stripe Checkout, webhook idempotent, facture PDF, comptes par lien magique et back-office.',
          en: 'Promo codes, Stripe Checkout, idempotent webhook, PDF invoice, magic-link accounts and an admin back office.',
        },
      },
    ],
    facts: [
      { value: 19, label: { fr: 'montres en catalogue', en: 'watches in the catalogue' } },
      { value: 9, label: { fr: 'filtres combinables', en: 'combinable filters' } },
      {
        value: 2000,
        suffix: { fr: ' €', en: ' €' },
        label: { fr: 'prix maximum, stocké en centimes', en: 'top price, stored in cents' },
      },
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'PostgreSQL', 'Prisma 7', 'Stripe', 'Auth.js', 'Resend', 'Vitest', 'GitHub Actions'],
    demo: 'https://maison-cadran.vercel.app',
    code: 'https://github.com/MohamedAlicode/Maison-Cadran',
    url: 'maison-cadran.vercel.app',
    poster: {
      fr: 'Démo de Maison Cadran : accueil, catalogue filtré, fiche produit avec galerie, ajout au panier.',
      en: 'Maison Cadran demo: home page, filtered catalogue, product page with gallery, add to cart.',
    },
  },
  {
    slug: 'altair',
    name: 'Altaïr',
    frames: 157,
    ratio: 800 / 450,
    zone: 'paper',
    kind: { fr: 'Landing page scrollytelling', en: 'Scrollytelling landing page' },
    hook: {
      fr: 'Un film produit rejoué image par image au rythme du scroll, sans aucun outil de build.',
      en: 'A product film replayed frame by frame as you scroll, with no build step at all.',
    },
    role,
    notice: {
      fr: 'Concept personnel non officiel, sans lien avec la marque.',
      en: 'Unofficial personal concept, not affiliated with the brand.',
    },
    beats: [
      {
        from: 0,
        title: { fr: 'Écran d’intro', en: 'Intro screen' },
        text: {
          fr: 'Une nuit étoilée couvre le chargement : la page s’ouvre dès que les 24 premières images sont arrivées.',
          en: 'A starry night covers loading: the page opens as soon as the first 24 frames have arrived.',
        },
      },
      {
        from: 22,
        title: { fr: 'Le film', en: 'The film' },
        text: {
          fr: 'La vidéo est découpée en 287 images WebP, décodées hors du fil principal et dessinées sur un canvas.',
          en: 'The video is cut into 287 WebP frames, decoded off the main thread and drawn on a canvas.',
        },
      },
      {
        from: 62,
        title: { fr: 'Les chapitres', en: 'The chapters' },
        text: {
          fr: 'Chaque section a son entrée (glissé, rotation, rideau, zoom) orchestrée avec GSAP et ScrollTrigger.',
          en: 'Each section has its own entrance (slide, rotation, curtain, zoom), orchestrated with GSAP and ScrollTrigger.',
        },
      },
      {
        from: 100,
        title: { fr: 'Zones de couleur', en: 'Colour zones' },
        text: {
          fr: 'Calques cognac et nuit, compteurs animés, bascule FR / EN sans recharger ni interrompre la visite.',
          en: 'Cognac and night layers, animated counters, FR / EN switch without reloading or stopping the tour.',
        },
      },
    ],
    facts: [
      { value: 287, label: { fr: 'images rejouées sur canvas', en: 'frames replayed on canvas' } },
      { value: 48, suffix: { fr: ' i/s', en: ' fps' }, label: { fr: 'interpolées depuis 24', en: 'interpolated from 24' } },
      { value: 2, label: { fr: 'langues, sans rechargement', en: 'languages, no reload' } },
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Canvas 2D', 'GSAP', 'ScrollTrigger', 'Lenis', 'ffmpeg'],
    demo: 'https://mohamedalicode.github.io/landing-page-althaire/',
    code: 'https://github.com/MohamedAlicode/landing-page-althaire',
    url: 'mohamedalicode.github.io',
    poster: {
      fr: 'Démo d’Altaïr : écran d’intro étoilé, puis le flacon et son coffret qui s’ouvrent et se démontent au fil des chapitres.',
      en: 'Altaïr demo: starry intro screen, then the bottle and its box opening and coming apart chapter by chapter.',
    },
  },
  {
    slug: 'quiz-live',
    name: 'Quiz Live',
    frames: 112,
    ratio: 800 / 394,
    zone: 'deep',
    kind: { fr: 'Application temps réel', en: 'Real-time app' },
    hook: {
      fr: 'Un quiz multijoueur type Kahoot : l’hôte projette les questions, les joueurs répondent depuis leur téléphone.',
      en: 'A Kahoot-style multiplayer quiz: the host projects the questions, players answer from their phones.',
    },
    role,
    beats: [
      {
        from: 0,
        title: { fr: 'Lobby', en: 'Lobby' },
        text: {
          fr: 'Un code à 6 chiffres ou un QR code, et les joueurs arrivent sans créer de compte.',
          en: 'A 6-digit code or a QR code, and players join without creating an account.',
        },
      },
      {
        from: 30,
        title: { fr: 'Question', en: 'Question' },
        text: {
          fr: 'Horloge synchronisée : tous les écrans affichent le même compte à rebours, même si l’heure d’un téléphone est fausse.',
          en: 'Synchronised clock: every screen shows the same countdown, even when a phone’s clock is wrong.',
        },
      },
      {
        from: 60,
        title: { fr: 'Résultats', en: 'Results' },
        text: {
          fr: 'Le serveur est la seule source de vérité : il note les réponses, et la bonne n’est jamais envoyée avant la fin.',
          en: 'The server is the single source of truth: it scores answers, and the right one is never sent early.',
        },
      },
      {
        from: 78,
        title: { fr: 'Podium', en: 'Podium' },
        text: {
          fr: 'Timeline GSAP et canvas-confetti, sons générés avec la Web Audio API, reconnexion automatique des joueurs.',
          en: 'GSAP timeline and canvas-confetti, sounds generated with the Web Audio API, automatic player reconnection.',
        },
      },
    ],
    facts: [
      { value: 6, label: { fr: 'chiffres pour rejoindre', en: 'digits to join' } },
      { value: 3, label: { fr: 'paquets : web, serveur, code partagé', en: 'packages: web, server, shared code' } },
      { value: 18, label: { fr: 'fichiers de tests Vitest', en: 'Vitest test files' } },
    ],
    stack: ['React 19', 'Vite', 'Zustand', 'Node.js', 'Express 5', 'Socket.IO', 'PostgreSQL', 'Prisma', 'Zod', 'Framer Motion', 'GSAP', 'Docker'],
    demo: 'https://quiz-live-hk3r.onrender.com',
    code: 'https://github.com/MohamedAlicode/online-quiz',
    demoNote: {
      fr: 'Hébergement gratuit : la première ouverture peut prendre une trentaine de secondes.',
      en: 'Free hosting: the first visit can take about thirty seconds.',
    },
    url: 'quiz-live-hk3r.onrender.com',
    poster: {
      fr: 'Démo de Quiz Live : lobby avec code, compte à rebours, question sur l’écran et le téléphone, résultats, podium avec confettis.',
      en: 'Quiz Live demo: lobby with code, countdown, question on screen and phone, results, podium with confetti.',
    },
  },
]
