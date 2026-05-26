import type { ProfileSlug } from "./quiz-questions";

/**
 * Canonical `from` taxonomy used across quiz → result → free-n8n-pack flow.
 *
 *   from=quiz-gate    User submitted their email at the quiz gate before seeing the result.
 *   from=quiz-skip    User skipped the email gate and went straight to the result.
 *   from=qcm-result   User arrived from a result page CTA (typically the pas-pret profile
 *                     redirected to /free-n8n-pack).
 *
 * Consumers:
 *   - /qcm/resultat/[profil]   reads `from` to decide whether to hide the lead-capture form
 *                              (already gave email upstream = quiz-gate).
 *   - /free-n8n-pack           reads `from=qcm-result` to swap kicker copy and show the
 *                              "back to your profile" link.
 */

/** Date the result pages were first published — fed into JSON-LD datePublished. */
export const RESULTS_DATE_PUBLISHED = "2026-05-25";

export type ProfileResult = {
  slug: ProfileSlug;
  label: string;
  name: string;
  tagline: string;
  body: { text: string; tone: "ink" | "muted" }[];
  useGradient: boolean;
  cta: { label: string; href: string; meta?: string; external?: boolean } | null;
  ps: string;
};

export type ProfileResultLocalized = {
  fr: ProfileResult;
  en: ProfileResult;
};

const SKOOL_URL = "https://www.skool.com/taiyka";
const CALENDLY_URL = "https://calendly.com/manu-uhila-taiyka/30min";

export const RESULTS: Record<ProfileSlug, ProfileResultLocalized> = {
  salarie: {
    fr: {
      slug: "salarie",
      label: "Employé Lucide",
      name: "L'Employé Lucide",
      tagline:
        "Tu as un job. Tu vois que le monde change. Tu veux pas le subir — tu veux le devancer.",
      body: [
        {
          tone: "ink",
          text:
            "Le matin t'ouvres ton ordi, t'enchaînes des réunions et des process que tu pourrais décrire à un stagiaire en 10 minutes. Le soir tu regardes l'IA arriver et tu sens que ton job dans 5 ans, c'est pas garanti. Ta plus grande frustration en ce moment, c'est probablement de voir ce qu'il faudrait construire à côté sans savoir par où commencer sans tout casser.",
        },
        {
          tone: "ink",
          text:
            "La vérité c'est que ton salaire, c'est pas ton destin — c'est ton levier. Tu as déjà des choses que les pures débutants n'ont pas : un revenu stable, du temps qui t'appartient le soir, et l'observation directe de tous les process inefficaces de ta boîte. C'est exactement la matière première dont tu as besoin pour construire à côté.",
        },
        {
          tone: "muted",
          text:
            "Ce qui te bloque, c'est pas la compétence. C'est de pas voir l'enchaînement clair entre «où je suis» et «où je veux aller». Un PDF te le donnera pas. Un endroit où d'autres font le même trajet en ce moment, oui.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Entrer dans la communauté Skool →",
        href: SKOOL_URL,
        external: true,
        meta: "Tarif fondateur pour les 100 premiers · Verrouillé à vie",
      },
      ps: "La communauté est en lancement — accès fondateur pour les premiers membres, je relève le prix après.",
    },
    en: {
      slug: "salarie",
      label: "Clear-Eyed Employee",
      name: "The Clear-Eyed Employee",
      tagline:
        "You have a job. You see the world changing. You don't want to be run over by it — you want to get out front.",
      body: [
        {
          tone: "ink",
          text:
            "Every morning you open your laptop and grind through meetings and processes you could explain to an intern in 10 minutes. Every evening you watch AI roll in and feel that your job in 5 years isn't guaranteed. Your biggest frustration right now is probably seeing what you should be building on the side, without knowing where to start without blowing everything up.",
        },
        {
          tone: "ink",
          text:
            "The truth is your salary isn't your destiny — it's your leverage. You already have things pure beginners don't: a stable income, your evenings to yourself, and direct observation of every inefficient process in your company. That's exactly the raw material you need to build something on the side.",
        },
        {
          tone: "muted",
          text:
            "What's blocking you isn't skill. It's not seeing the clear path from \"where I am\" to \"where I want to go.\" A PDF won't give you that. A room where other people are walking the same path right now — that will.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Enter the Skool community →",
        href: SKOOL_URL,
        external: true,
        meta: "Founder pricing for the first 100 · Locked for life",
      },
      ps: "The community is launching — founder access for the first members, I raise the price after.",
    },
  },

  aspirant: {
    fr: {
      slug: "aspirant",
      label: "Aspirant Méthodique",
      name: "L'Aspirant Méthodique",
      tagline:
        "Tu as l'idée, l'envie, le feu. Il te manque juste de passer du brouillon au shipped.",
      body: [
        {
          tone: "ink",
          text:
            "T'as lu les threads, t'as suivi les chaînes YouTube, t'as un Notion avec 40 idées et 3 templates à moitié remplis. Le truc qui te ronge, c'est de te dire le dimanche soir «cette semaine je me lance pour de vrai», et de te retrouver le jeudi à prendre encore des notes au lieu de shipper. T'as le feu, t'as le temps. Ce qui manque, c'est le déclic qui te fait passer à l'action pour de bon.",
        },
        {
          tone: "ink",
          text:
            "Le truc, c'est que t'as pas besoin de plus d'infos. T'as déjà 80% de ce qu'il te faut dans ta tête. Ce qui te manque, c'est un environnement où shipper c'est la norme, pas l'exception. Un endroit où sortir un premier projet bancal c'est valorisé, pas jugé.",
        },
        {
          tone: "muted",
          text:
            "Tu peux continuer seul. Beaucoup le font. Dans 6 mois t'auras un Notion plein d'idées et zéro client. Ou tu te poses dans un groupe de gens qui buildent en même temps que toi. Le résultat à 6 mois est pas le même.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Entrer dans la communauté Skool →",
        href: SKOOL_URL,
        external: true,
        meta: "Tarif fondateur pour les 100 premiers · Verrouillé à vie",
      },
      ps: "La communauté est en lancement — accès fondateur pour les premiers membres, je relève le prix après.",
    },
    en: {
      slug: "aspirant",
      label: "Methodical Aspirant",
      name: "The Methodical Aspirant",
      tagline:
        "You have the idea, the drive, the fire. What's missing is going from draft to shipped.",
      body: [
        {
          tone: "ink",
          text:
            "You read the threads, you followed the YouTube channels, you have a Notion with 40 ideas and 3 half-filled templates. You probably recognize yourself in that loop where you take notes instead of shipping. Your biggest frustration right now is probably feeling that you have the fire and the time, but not the click that makes you actually move.",
        },
        {
          tone: "ink",
          text:
            "The thing is, you don't need more info. You already have 80% of what you need in your head. What you're missing is an environment where shipping is the norm, not the exception. A room where putting out a first scrappy project gets respect, not judgment.",
        },
        {
          tone: "muted",
          text:
            "You can keep going solo. Plenty do. In 6 months you'll have a Notion full of ideas and zero clients. Or you sit down in a group of people building alongside you. The 6-month outcome isn't the same.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Enter the Skool community →",
        href: SKOOL_URL,
        external: true,
        meta: "Founder pricing for the first 100 · Locked for life",
      },
      ps: "The community is launching — founder access for the first members, I raise the price after.",
    },
  },

  surcharge: {
    fr: {
      slug: "surcharge",
      label: "Stratège Surchargé",
      name: "Le Stratège Surchargé",
      tagline:
        "Ton business tourne. Toi, tu tournes plus. C'est pas un problème de plan, c'est un problème de levier.",
      body: [
        {
          tone: "ink",
          text:
            "Tu connais la scène : il est 22h, tes gamins dorment, t'ouvres ton ordi pour rattraper. 80 mails non lus, 5 clients à relancer, un devis à envoyer, une facture en retard. Tu cours partout et tu sais déjà que demain ce sera pareil. Le pire, c'est que tu vois exactement ce qu'il faudrait déléguer ou automatiser — t'as juste pas une seule heure libre pour le mettre en place.",
        },
        {
          tone: "ink",
          text:
            "J'y suis passé. Le piège classique : tu sais ce qu'il faut faire, mais t'es coincé dans l'exécution quotidienne. Tu lis sur l'automatisation le dimanche, et le lundi tu replonges dans tes 80 mails et tes relances clients. Le bottleneck c'est plus toi en tant que personne — c'est que t'as construit un business qui tourne uniquement à travers toi.",
        },
        {
          tone: "muted",
          text:
            "Le bon move pour toi, c'est pas une formation. C'est de voir 5 ou 6 systèmes concrets que d'autres gérants ont déjà câblés, et de copier ce qui marche. Pas réinventer. Copier. La communauté Skool est faite exactement pour ça — agents IA, workflows n8n, scripts. Tu prends, tu adaptes, tu reprends ta semaine.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Entrer dans la communauté Skool →",
        href: SKOOL_URL,
        external: true,
        meta: "Tarif fondateur pour les 100 premiers · Verrouillé à vie",
      },
      ps: "La communauté est en lancement — accès fondateur pour les premiers membres, je relève le prix après.",
    },
    en: {
      slug: "surcharge",
      label: "Overloaded Strategist",
      name: "The Overloaded Strategist",
      tagline:
        "Your business runs. You don't anymore. It's not a plan problem, it's a leverage problem.",
      body: [
        {
          tone: "ink",
          text:
            "You're stacking 60-hour weeks. 80 unread emails, 5 client follow-ups, a quote to send, an invoice past due. You feel like you're running everywhere and moving on nothing important. Your biggest frustration right now is probably knowing exactly what should be delegated or automated, without having a single hour to set it up.",
        },
        {
          tone: "ink",
          text:
            "I've been there. The classic trap: you know what needs to happen, but you're stuck in daily execution. You read about automation on Sunday, and Monday you dive back into 80 emails and client follow-ups. The bottleneck isn't you as a person anymore — it's that you've built a business that only runs through you.",
        },
        {
          tone: "muted",
          text:
            "The right move for you isn't a course. It's seeing 5 or 6 concrete systems other operators have already wired up, and copying what works. Don't reinvent. Copy. The Skool community is built exactly for this — AI agents, n8n workflows, scripts. You take, you adapt, you get your week back.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Enter the Skool community →",
        href: SKOOL_URL,
        external: true,
        meta: "Founder pricing for the first 100 · Locked for life",
      },
      ps: "The community is launching — founder access for the first members, I raise the price after.",
    },
  },

  scale: {
    fr: {
      slug: "scale",
      label: "Builder Prêt à Scaler",
      name: "Le Builder Prêt à Scaler",
      tagline:
        "Ton business marche. Tu sais où tu vas. Il te manque le bon partenaire technique pour aller plus vite.",
      body: [
        {
          tone: "ink",
          text:
            "Soyons clairs : tu fais déjà des chiffres que la plupart des gens qui passent ce QCM rêvent de toucher. Tu sais où va ton business, tu sais ce qui marche, t'as pas besoin qu'on t'explique le game. Si t'es là, c'est que t'as une liste de 10 leviers IA et automation à activer dans la tête, et que t'as pas trouvé le bon interlocuteur technique pour les câbler proprement. C'est pas un problème de stratégie. C'est un problème d'exécution propre.",
        },
        {
          tone: "ink",
          text:
            "Tu es minoritaire. La plupart des gens qui passent ce QCM sont en phase de construction. Toi t'es en phase de déploiement — c'est un autre game. Tu cherches pas de formation, tu cherches pas une communauté, tu cherches un partenaire qui peut câbler un système qui tourne pendant que toi tu fais ce que toi seul peut faire.",
        },
        {
          tone: "ink",
          text:
            "Si tu es ici, c'est qu'on a probablement des choses à se dire. 30 minutes — pas de pitch, juste une discussion. On regarde où t'en es, ce que tu veux automatiser, et si on est sur la même longueur d'onde, on parle de la suite. Si on l'est pas, t'auras au moins une vue claire de ce que je ferais à ta place.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Réserver un appel privé",
        href: CALENDLY_URL,
        external: true,
        meta: "Calendrier ouvert · Pas de pitch, juste une discussion.",
      },
      ps: "Prends un créneau maintenant — je relance pas, c'est à toi de venir.",
    },
    en: {
      slug: "scale",
      label: "Builder Ready to Scale",
      name: "The Builder Ready to Scale",
      tagline:
        "Your business works. You know where you're going. What's missing is the right technical partner to move faster.",
      body: [
        {
          tone: "ink",
          text:
            "You're already doing numbers most people taking this quiz dream of hitting. You know where your business is going, you know what works. What brings you here is that you've identified 10 AI and automation levers to activate, and you can't find the right technical partner to wire them up properly. Your frustration isn't strategy — it's clean technical execution.",
        },
        {
          tone: "ink",
          text:
            "You're in the minority. Most people taking this quiz are in the building phase. You're in the deployment phase — that's a different game. You're not looking for a course, not looking for a community, you're looking for a partner who can wire up a system that runs while you do what only you can do.",
        },
        {
          tone: "ink",
          text:
            "If you're here, we probably have things to talk about. 30 minutes — no pitch, just a conversation. We look at where you are, what you want to automate, and if we're on the same wavelength, we talk about next steps. If we're not, you'll at least have a clear view of what I'd do in your spot.",
        },
      ],
      useGradient: true,
      cta: {
        label: "Book a private call",
        href: CALENDLY_URL,
        external: true,
        meta: "Calendar open · No pitch, just a conversation.",
      },
      ps: "Grab a slot now — I don't chase, it's on you to show up.",
    },
  },

  "pas-pret": {
    fr: {
      slug: "pas-pret",
      label: "Explorateur",
      name: "L'Explorateur",
      tagline:
        "T'es au début. C'est pas un défaut. C'est juste l'étape où la plupart se perdent.",
      body: [
        {
          tone: "ink",
          text:
            "Tu es au début. Et c'est OK — j'y suis passé aussi. Y a un moment où on a plein d'envie et zéro plan, où on regarde tout ce qui passe sans savoir où poser les mains. C'est pas un mauvais endroit. C'est juste un endroit où on peut rester très, très longtemps si on fait pas attention.",
        },
        {
          tone: "ink",
          text:
            "Ce qui te bloque aujourd'hui, c'est pas le manque de stratégie ou d'outils. C'est que t'as pas encore décidé que c'était vraiment pour toi. Tant que cette décision-là est pas prise — pour de vrai, pas dans une story d'un soir — aucun plan d'action ne marchera. Aucun.",
        },
        {
          tone: "muted",
          text:
            "Pas grave. Je t'envoie chaque semaine ce qui m'a aidé à passer ce cap quand j'y étais. Tu liras, ou tu liras pas. Le jour où t'es prêt, tu sauras où me trouver.",
        },
      ],
      useGradient: false,
      cta: {
        label: "Récupérer le pack n8n gratuit",
        href: "/free-n8n-pack?from=qcm-result",
        external: false,
        meta: "5 workflows · PDF · Pour démarrer doucement",
      },
      ps: "Je t'envoie un email par semaine — du contenu utile, pas de pitch. Tu te désabonneras quand tu veux, en un clic.",
    },
    en: {
      slug: "pas-pret",
      label: "Explorer",
      name: "The Explorer",
      tagline:
        "You're at the start. That's not a flaw. It's just the stage where most people get lost.",
      body: [
        {
          tone: "ink",
          text:
            "You're at the start. And that's OK — I went through it too. There's a moment where you have all the drive and zero plan, where you watch everything pass without knowing where to put your hands. It's not a bad place. It's just a place you can stay in for a very, very long time if you're not careful.",
        },
        {
          tone: "ink",
          text:
            "What's blocking you today isn't lack of strategy or tools. It's that you haven't actually decided this is really for you. Until that decision is made — for real, not in a Sunday-night burst of motivation — no action plan will work. Not one.",
        },
        {
          tone: "muted",
          text:
            "No worries. I send you every week what helped me get past that stage when I was there. You'll read it, or you won't. The day you're ready, you'll know where to find me.",
        },
      ],
      useGradient: false,
      cta: {
        label: "Get the free n8n pack",
        href: "/free-n8n-pack?lang=en&from=qcm-result",
        external: false,
        meta: "5 workflows · PDF · To start slow",
      },
      ps: "I send you one email a week — useful content, no pitch. Unsubscribe whenever, one click.",
    },
  },
};
