import { QUESTIONS, type ProfileSlug } from "./quiz-questions";

export type AnswerKey = "a" | "b" | "c" | "d";
export type AnswersMap = Partial<Record<string, AnswerKey>>;
export type Scores = Record<ProfileSlug, number>;

const MAIN_PROFILES: Exclude<ProfileSlug, "pas-pret">[] = [
  "salarie",
  "aspirant",
  "surcharge",
  "scale",
];

export function computeScores(answers: AnswersMap): Scores {
  const scores: Scores = {
    salarie: 0,
    aspirant: 0,
    surcharge: 0,
    scale: 0,
    "pas-pret": 0,
  };

  for (const question of QUESTIONS) {
    const picked = answers[question.id];
    if (!picked) continue;
    const answer = question.answers.find((a) => a.id === picked);
    if (!answer) continue;
    for (const [profile, points] of Object.entries(answer.scores) as [ProfileSlug, number][]) {
      scores[profile] += points;
    }
  }

  return scores;
}

export function computeProfile(answers: AnswersMap): ProfileSlug {
  // Hard-reject rule: Q8=A AND Q9=A → force pas-pret
  if (answers.q8 === "a" && answers.q9 === "a") {
    return "pas-pret";
  }

  const scores = computeScores(answers);

  // Find highest among main profiles
  let bestMainScore = -1;
  let bestMainProfile: ProfileSlug = "aspirant";
  for (const p of MAIN_PROFILES) {
    if (scores[p] > bestMainScore) {
      bestMainScore = scores[p];
      bestMainProfile = p;
    }
  }

  // If pas-pret outscores all main profiles, route there
  if (scores["pas-pret"] > bestMainScore) {
    return "pas-pret";
  }

  // Tiebreaker on main profiles: if multiple tied at bestMainScore, use Q7's primary profile
  const tied = MAIN_PROFILES.filter((p) => scores[p] === bestMainScore);
  if (tied.length > 1) {
    const q7Answer = answers.q7;
    const q7Map: Record<AnswerKey, ProfileSlug> = {
      a: "scale",
      b: "aspirant",
      c: "salarie",
      d: "pas-pret",
    };
    if (q7Answer && q7Map[q7Answer]) {
      const q7Profile = q7Map[q7Answer];
      if (tied.includes(q7Profile as Exclude<ProfileSlug, "pas-pret">)) {
        return q7Profile;
      }
    }
  }

  return bestMainProfile;
}

export function isValidProfile(slug: string): slug is ProfileSlug {
  return ["salarie", "aspirant", "surcharge", "scale", "pas-pret"].includes(slug);
}
