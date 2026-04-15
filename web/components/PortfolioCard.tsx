import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lang, PortfolioProject } from "@/lib/portfolio";

type Props = {
  project: PortfolioProject;
  lang: Lang;
};

const LABELS = {
  fr: {
    problem: "Le problème",
    solution: "La solution",
    stack: "Stack",
    outcome: "Résultats",
    status: "Statut",
  },
  en: {
    problem: "The problem",
    solution: "The solution",
    stack: "Stack",
    outcome: "Outcome",
    status: "Status",
  },
};

export default function PortfolioCard({ project, lang }: Props) {
  const content = project[lang];
  const labels = LABELS[lang];

  return (
    <Card className="bg-card/60 border-border overflow-hidden">
      {/* Inline SVG — render raw markup so colors/fonts inside the SVG render */}
      <div
        className="bg-white p-3 [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-h-72"
        dangerouslySetInnerHTML={{ __html: project.diagramSvg }}
      />

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl leading-tight">
            {content.title}
          </CardTitle>
          <Badge variant="default" className="shrink-0">
            {content.status}
          </Badge>
        </div>
        {content.tagline && (
          <p className="text-sm text-muted-foreground mt-1 italic">
            {content.tagline}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <section>
          <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">
            {labels.problem}
          </h3>
          <p className="text-card-foreground/90 leading-relaxed">
            {content.problem}
          </p>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-1">
            {labels.solution}
          </h3>
          <p className="text-card-foreground/90 leading-relaxed">
            {content.solution}
          </p>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
            {labels.stack}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {content.stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">
            {labels.outcome}
          </h3>
          <ul className="space-y-1.5 text-card-foreground/90">
            {content.outcome.map((item, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="text-primary mt-1 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
