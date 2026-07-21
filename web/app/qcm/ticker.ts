// Shared ticker strings for the /qcm funnel (landing, quiz, resultat).
// One source so the three surfaces can never drift apart.
// Lives in its own module because Next.js forbids extra exports from page files.

export const QCM_TICKER: Record<"fr" | "en", string[]> = {
  fr: [
    "9 questions · 2 minutes",
    "5 profils d'entrepreneur",
    "Résultat immédiat",
    "Sans email avant la fin",
  ],
  en: [
    "9 questions · 2 minutes",
    "5 entrepreneur profiles",
    "Instant result",
    "No email until the end",
  ],
};
