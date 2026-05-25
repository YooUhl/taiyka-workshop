import type { Metadata } from "next";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "QCM — En cours · Taiyka",
  description:
    "Réponds à 9 questions et découvre ton profil d'entrepreneur. Personnalisé, sans détour.",
  alternates: {
    canonical: "/qcm/quiz",
  },
  openGraph: {
    images: ["/og/qcm-quiz.png"],
  },
};

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: "fr" | "en" = sp?.lang === "en" ? "en" : "fr";
  return <QuizClient lang={lang} />;
}
