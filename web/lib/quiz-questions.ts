export type ProfileSlug = "salarie" | "aspirant" | "surcharge" | "scale" | "pas-pret";

/** Localized string — FR is the source of truth, EN is the natural translation. */
export type LocalizedString = { fr: string; en: string };

/** Supported quiz locales. */
export type QuizLocale = "fr" | "en";

export type Answer = {
  id: "a" | "b" | "c" | "d";
  /** Display label, per locale. */
  label: LocalizedString;
  scores: Partial<Record<ProfileSlug, number>>;
  redFlag?: boolean;
};

export type Question = {
  id: string;
  /** Question text, per locale. */
  text: LocalizedString;
  answers: Answer[];
  isMotivationFilter?: boolean;
  isTiebreaker?: boolean;
};

/**
 * Resolve a localized string. Falls back to FR if the requested locale is missing —
 * FR is the canonical source.
 */
export function pickLocalized(value: LocalizedString, locale: QuizLocale): string {
  return value[locale] ?? value.fr;
}

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: {
      fr: "Aujourd'hui, tu te décrirais comment ?",
      en: "How would you describe yourself right now?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "J'ai un business qui tourne, je veux scaler",
          en: "I've got a business that's working — I want to scale it",
        },
        scores: { scale: 3 },
      },
      {
        id: "b",
        label: {
          fr: "J'ai lancé mais ça galère encore",
          en: "I've launched, but I'm still grinding",
        },
        scores: { aspirant: 2, surcharge: 1 },
      },
      {
        id: "c",
        label: {
          fr: "Je suis employé, je veux passer entrepreneur",
          en: "I have a job and I want to make the jump",
        },
        scores: { salarie: 3 },
      },
      {
        id: "d",
        label: {
          fr: "J'explore, je cherche encore mon truc",
          en: "I'm exploring — still looking for my thing",
        },
        scores: { aspirant: 2, "pas-pret": 1 },
      },
    ],
  },
  {
    id: "q2",
    text: {
      fr: "Laquelle de ces phrases te ressemble le plus ?",
      en: "Which of these lines sounds the most like you?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "«Je sais ce que je veux. Il me manque les bons leviers.»",
          en: "\"I know what I want. I'm missing the right levers.\"",
        },
        scores: { scale: 3 },
      },
      {
        id: "b",
        label: {
          fr: "«J'ai des idées, mais je passe jamais à l'action.»",
          en: "\"I have ideas, but I never actually move on them.\"",
        },
        scores: { aspirant: 2, "pas-pret": 1 },
      },
      {
        id: "c",
        label: {
          fr: "«Je suis débordé. Je sais plus par où prendre le truc.»",
          en: "\"I'm overwhelmed. I don't know where to grab this thing anymore.\"",
        },
        scores: { surcharge: 3 },
      },
      {
        id: "d",
        label: {
          fr: "«Je teste, je tâtonne. Je cherche ce qui colle.»",
          en: "\"I'm testing, feeling my way around. Looking for what sticks.\"",
        },
        scores: { aspirant: 1, "pas-pret": 2 },
      },
    ],
  },
  {
    id: "q3",
    text: {
      fr: "Par semaine, combien d'heures tu perds sur des tâches répétitives que tu détestes ?",
      en: "How many hours a week do you lose to repetitive tasks you hate?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "Moins de 5h — j'ai déjà bien optimisé",
          en: "Less than 5 — I've already cleaned this up",
        },
        scores: { scale: 3 },
      },
      {
        id: "b",
        label: {
          fr: "Entre 5h et 15h — y a clairement du gras",
          en: "Between 5 and 15 — there's clearly fat to cut",
        },
        scores: { scale: 1, surcharge: 2 },
      },
      {
        id: "c",
        label: {
          fr: "Plus de 15h — je passe ma vie là-dedans",
          en: "More than 15 — I basically live in there",
        },
        scores: { surcharge: 3 },
      },
      {
        id: "d",
        label: {
          fr: "Aucune idée, j'ai jamais compté",
          en: "No idea, I've never counted",
        },
        scores: { aspirant: 1, salarie: 2 },
      },
    ],
  },
  {
    id: "q4",
    text: {
      fr: "Ton revenu principal aujourd'hui, il vient d'où ?",
      en: "Where does your main income come from today?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "Mon business — j'en vis bien, je veux le faire grossir",
          en: "My business — I'm living off it, I want to grow it",
        },
        scores: { scale: 3 },
      },
      {
        id: "b",
        label: {
          fr: "Mon business — mais c'est tendu, ou pas régulier",
          en: "My business — but it's tight, or not consistent",
        },
        scores: { surcharge: 2, aspirant: 1 },
      },
      {
        id: "c",
        label: {
          fr: "Mon salaire — j'ai un job, je veux en sortir",
          en: "My salary — I have a job, I want out",
        },
        scores: { salarie: 3 },
      },
      {
        id: "d",
        label: {
          fr: "Un peu de tout — freelance, side hustles, rien de stable",
          en: "A bit of everything — freelance, side hustles, nothing stable",
        },
        scores: { aspirant: 2, "pas-pret": 1 },
      },
    ],
  },
  {
    id: "q5",
    text: {
      fr: "Demain t'as 10 000€ à mettre dans ton activité. Tu les mets où ?",
      en: "Tomorrow you've got 10,000€ to put into your business. Where does it go?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "Automatisation et systèmes — gagner du temps direct",
          en: "Automation and systems — buy back time directly",
        },
        scores: { scale: 2, surcharge: 2 },
      },
      {
        id: "b",
        label: {
          fr: "Trouver plus de clients — pub, prospection, contenu",
          en: "Find more clients — ads, outreach, content",
        },
        scores: { scale: 2, surcharge: 1, aspirant: 2 },
      },
      {
        id: "c",
        label: {
          fr: "Me former, comprendre le terrain avant d'agir",
          en: "Get trained — understand the ground before moving",
        },
        scores: { aspirant: 2, salarie: 2 },
      },
      {
        id: "d",
        label: {
          fr: "Honnêtement, je saurais pas trop quoi en faire",
          en: "Honestly, I wouldn't really know what to do with it",
        },
        scores: { "pas-pret": 3 },
      },
    ],
  },
  {
    id: "q6",
    text: {
      fr: "Ton niveau en IA aujourd'hui, c'est quoi concrètement ?",
      en: "Your AI level today — concretely, where are you?",
    },
    answers: [
      {
        id: "a",
        label: {
          fr: "J'utilise déjà des agents ou des automations dans mon taf",
          en: "I'm already running agents or automations in my work",
        },
        scores: { scale: 3 },
      },
      {
        id: "b",
        label: {
          fr: "Je joue avec ChatGPT, je vois ce que ça peut faire — mais je build rien",
          en: "I play with ChatGPT, I see what it can do — but I don't build anything",
        },
        scores: { surcharge: 1, aspirant: 2, salarie: 1 },
      },
      {
        id: "c",
        label: {
          fr: "Je regarde du contenu sur le sujet, j'ai pas encore mis les mains dedans",
          en: "I watch content about it — haven't put my hands in yet",
        },
        scores: { salarie: 2, aspirant: 1 },
      },
      {
        id: "d",
        label: {
          fr: "C'est flou pour moi, je vois pas où ça s'applique chez moi",
          en: "It's blurry to me — I don't see where it fits in my world",
        },
        scores: { "pas-pret": 2, salarie: 1 },
      },
    ],
  },
  {
    id: "q7",
    text: {
      fr: "Dans 12 mois, c'est quoi le scénario qui te ferait dire «ouais, ça a vraiment bougé» ?",
      en: "12 months from now, what scenario would make you say \"yeah, that actually moved\"?",
    },
    isTiebreaker: true,
    answers: [
      {
        id: "a",
        label: {
          fr: "Mon business tourne avec moins d'heures de ma part — j'ai des systèmes qui bossent à ma place",
          en: "My business runs on fewer of my hours — I've got systems doing the work for me",
        },
        scores: { scale: 6 },
      },
      {
        id: "b",
        label: {
          fr: "J'ai lancé pour de vrai — j'ai des clients qui paient, c'est plus une idée dans ma tête",
          en: "I've launched for real — paying clients, no longer just an idea in my head",
        },
        scores: { aspirant: 4, surcharge: 2 },
      },
      {
        id: "c",
        label: {
          fr: "J'ai quitté mon job — je vis de mon activité, même petitement",
          en: "I've quit my job — I'm living off my business, even on a small scale",
        },
        scores: { salarie: 6 },
      },
      {
        id: "d",
        label: {
          fr: "J'y vois plus clair — je sais ce que je veux faire et j'ai un plan",
          en: "I see clearly — I know what I want to do and I have a plan",
        },
        scores: { "pas-pret": 3, aspirant: 2 },
      },
    ],
  },
  {
    id: "q8",
    text: {
      fr: "Honnêtement, combien de temps par semaine tu peux mettre là-dessus ?",
      en: "Honestly, how much time per week can you actually put on this?",
    },
    isMotivationFilter: true,
    answers: [
      {
        id: "a",
        label: {
          fr: "Aucune idée, j'ai déjà aucun temps libre",
          en: "No idea — I already have zero free time",
        },
        scores: { "pas-pret": 4 },
        redFlag: true,
      },
      {
        id: "b",
        label: {
          fr: "1 à 3 heures, faut que je me cale ça",
          en: "1 to 3 hours — I need to carve it out",
        },
        scores: { aspirant: 1, salarie: 1 },
      },
      {
        id: "c",
        label: {
          fr: "4 à 8 heures, je peux dégager du créneau",
          en: "4 to 8 hours — I can open up the slot",
        },
        scores: { scale: 2, aspirant: 2, surcharge: 1 },
      },
      {
        id: "d",
        label: {
          fr: "Plus de 8 heures, c'est ma priorité",
          en: "More than 8 hours — this is my priority",
        },
        scores: { scale: 3, aspirant: 2, surcharge: 2 },
      },
    ],
  },
  {
    id: "q9",
    text: {
      fr: "Dernière. Laquelle de ces phrases te ressemble vraiment ?",
      en: "Last one. Which of these really sounds like you?",
    },
    isMotivationFilter: true,
    answers: [
      {
        id: "a",
        label: {
          fr: "«J'aimerais des résultats sans avoir à m'y mettre vraiment»",
          en: "\"I'd like results without really having to dig in\"",
        },
        scores: { "pas-pret": 4 },
        redFlag: true,
      },
      {
        id: "b",
        label: {
          fr: "«Je suis prêt à bosser, mais faut que ce soit le bon plan»",
          en: "\"I'm ready to work, but it has to be the right plan\"",
        },
        scores: { aspirant: 2, salarie: 2 },
      },
      {
        id: "c",
        label: {
          fr: "«Je bosse déjà beaucoup, je veux juste être mieux dirigé»",
          en: "\"I already work a lot — I just want better direction\"",
        },
        scores: { surcharge: 2, scale: 1 },
      },
      {
        id: "d",
        label: {
          fr: "«Donne-moi la prochaine étape, je l'exécute»",
          en: "\"Give me the next step — I'll execute it\"",
        },
        scores: { scale: 3, aspirant: 2 },
      },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
