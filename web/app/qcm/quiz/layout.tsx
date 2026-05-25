import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Question — QCM · Taiyka",
  description: "Réponds à 9 questions et découvre ton profil d'entrepreneur.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
