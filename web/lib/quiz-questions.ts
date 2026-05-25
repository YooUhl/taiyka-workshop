export type ProfileSlug = "salarie" | "aspirant" | "surcharge" | "scale" | "pas-pret";

export type Answer = {
  id: "a" | "b" | "c" | "d";
  label: string;
  scores: Partial<Record<ProfileSlug, number>>;
  redFlag?: boolean;
};

export type Question = {
  id: string;
  text: string;
  answers: Answer[];
  isMotivationFilter?: boolean;
  isTiebreaker?: boolean;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Aujourd'hui, tu te décrirais comment ?",
    answers: [
      { id: "a", label: "J'ai un business qui tourne, je veux scaler", scores: { scale: 3 } },
      { id: "b", label: "J'ai lancé mais ça galère encore", scores: { aspirant: 2, surcharge: 1 } },
      { id: "c", label: "Je suis employé, je veux passer entrepreneur", scores: { salarie: 3 } },
      { id: "d", label: "J'explore, je cherche encore mon truc", scores: { aspirant: 2, "pas-pret": 1 } },
    ],
  },
  {
    id: "q2",
    text: "Laquelle de ces phrases te ressemble le plus ?",
    answers: [
      { id: "a", label: "«Je sais ce que je veux. Il me manque les bons leviers.»", scores: { scale: 3 } },
      { id: "b", label: "«J'ai des idées, mais je passe jamais à l'action.»", scores: { aspirant: 2, "pas-pret": 1 } },
      { id: "c", label: "«Je suis débordé. Je sais plus par où prendre le truc.»", scores: { surcharge: 3 } },
      { id: "d", label: "«Je teste, je tâtonne. Je cherche ce qui colle.»", scores: { aspirant: 1, "pas-pret": 2 } },
    ],
  },
  {
    id: "q3",
    text: "Par semaine, combien d'heures tu perds sur des tâches répétitives que tu détestes ?",
    answers: [
      { id: "a", label: "Moins de 5h — j'ai déjà bien optimisé", scores: { scale: 3 } },
      { id: "b", label: "Entre 5h et 15h — y a clairement du gras", scores: { scale: 1, surcharge: 2 } },
      { id: "c", label: "Plus de 15h — je passe ma vie là-dedans", scores: { surcharge: 3 } },
      { id: "d", label: "Aucune idée, j'ai jamais compté", scores: { aspirant: 1, salarie: 2 } },
    ],
  },
  {
    id: "q4",
    text: "Ton revenu principal aujourd'hui, il vient d'où ?",
    answers: [
      { id: "a", label: "Mon business — j'en vis bien, je veux le faire grossir", scores: { scale: 3 } },
      { id: "b", label: "Mon business — mais c'est tendu, ou pas régulier", scores: { surcharge: 2, aspirant: 1 } },
      { id: "c", label: "Mon salaire — j'ai un job, je veux en sortir", scores: { salarie: 3 } },
      { id: "d", label: "Un peu de tout — freelance, side hustles, rien de stable", scores: { aspirant: 2, "pas-pret": 1 } },
    ],
  },
  {
    id: "q5",
    text: "Demain t'as 10 000€ à mettre dans ton activité. Tu les mets où ?",
    answers: [
      { id: "a", label: "Automatisation et systèmes — gagner du temps direct", scores: { scale: 2, surcharge: 2 } },
      { id: "b", label: "Trouver plus de clients — pub, prospection, contenu", scores: { scale: 2, surcharge: 1, aspirant: 2 } },
      { id: "c", label: "Me former, comprendre le terrain avant d'agir", scores: { aspirant: 2, salarie: 2 } },
      { id: "d", label: "Honnêtement, je saurais pas trop quoi en faire", scores: { "pas-pret": 3 } },
    ],
  },
  {
    id: "q6",
    text: "Ton niveau en IA aujourd'hui, c'est quoi concrètement ?",
    answers: [
      { id: "a", label: "J'utilise déjà des agents ou des automations dans mon taf", scores: { scale: 3 } },
      { id: "b", label: "Je joue avec ChatGPT, je vois ce que ça peut faire — mais je build rien", scores: { surcharge: 1, aspirant: 2, salarie: 1 } },
      { id: "c", label: "Je regarde du contenu sur le sujet, j'ai pas encore mis les mains dedans", scores: { salarie: 2, aspirant: 1 } },
      { id: "d", label: "C'est flou pour moi, je vois pas où ça s'applique chez moi", scores: { "pas-pret": 2, salarie: 1 } },
    ],
  },
  {
    id: "q7",
    text: "Dans 12 mois, c'est quoi le scénario qui te ferait dire «ouais, ça a vraiment bougé» ?",
    isTiebreaker: true,
    answers: [
      { id: "a", label: "Mon business tourne avec moins d'heures de ma part — j'ai des systèmes qui bossent à ma place", scores: { scale: 6 } },
      { id: "b", label: "J'ai lancé pour de vrai — j'ai des clients qui paient, c'est plus une idée dans ma tête", scores: { aspirant: 4, surcharge: 2 } },
      { id: "c", label: "J'ai quitté mon job — je vis de mon activité, même petitement", scores: { salarie: 6 } },
      { id: "d", label: "J'y vois plus clair — je sais ce que je veux faire et j'ai un plan", scores: { "pas-pret": 3, aspirant: 2 } },
    ],
  },
  {
    id: "q8",
    text: "Honnêtement, combien de temps par semaine tu peux mettre là-dessus ?",
    isMotivationFilter: true,
    answers: [
      { id: "a", label: "Aucune idée, j'ai déjà aucun temps libre", scores: { "pas-pret": 4 }, redFlag: true },
      { id: "b", label: "1 à 3 heures, faut que je me cale ça", scores: { aspirant: 1, salarie: 1 } },
      { id: "c", label: "4 à 8 heures, je peux dégager du créneau", scores: { scale: 2, aspirant: 2, surcharge: 1 } },
      { id: "d", label: "Plus de 8 heures, c'est ma priorité", scores: { scale: 3, aspirant: 2, surcharge: 2 } },
    ],
  },
  {
    id: "q9",
    text: "Dernière. Laquelle de ces phrases te ressemble vraiment ?",
    isMotivationFilter: true,
    answers: [
      { id: "a", label: "«J'aimerais des résultats sans avoir à m'y mettre vraiment»", scores: { "pas-pret": 4 }, redFlag: true },
      { id: "b", label: "«Je suis prêt à bosser, mais faut que ce soit le bon plan»", scores: { aspirant: 2, salarie: 2 } },
      { id: "c", label: "«Je bosse déjà beaucoup, je veux juste être mieux dirigé»", scores: { surcharge: 2, scale: 1 } },
      { id: "d", label: "«Donne-moi la prochaine étape, je l'exécute»", scores: { scale: 3, aspirant: 2 } },
    ],
  },
];

export const QUESTION_COUNT = QUESTIONS.length;
