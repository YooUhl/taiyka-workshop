# UFC Gym — App de gestion pour salle de sport

> Check-in membres, abonnements, notifications WhatsApp et capacité en temps réel — pensée pour une salle au bout du monde.

## Le problème
UFC Wallis, salle de sport à Wallis-et-Futuna (Pacifique français), gérait ses membres sur papier et Excel. Pas de check-in fiable, pas de suivi d'abonnements, pas de rappels automatiques. La connexion internet est instable et l'équipe n'est pas technique — la solution devait être ultra simple, rapide, et tolérer une mauvaise connexion.

## La solution
J'ai développé une web app full-stack Next.js avec deux rôles : staff et membre. Les membres se check-in via QR code ou recherche par nom, le staff gère les abonnements et voit la capacité en temps réel, et des notifications WhatsApp partent automatiquement pour les renouvellements et les rappels. Tout est en français, conforme RGPD, et déployé sur Vercel avec Supabase comme base de données. L'UI est construite avec shadcn/ui pour rester rapide à maintenir.

## Stack
`Next.js` · `TypeScript` · `Tailwind` · `shadcn/ui` · `Supabase` · `Vercel` · `WhatsApp API`

## Résultats
- Check-in passé de papier à QR code — quelques secondes par membre
- Renouvellements d'abonnement automatisés via WhatsApp (zéro relance manuelle)
- Capacité de la salle visible en temps réel pour le staff
- FR natif, conforme RGPD, fonctionne sur connexion limitée

## Statut
Livré, en production à Wallis.

---

# UFC Gym — Gym Management App

> Member check-in, subscriptions, WhatsApp notifications, live capacity — built for a gym at the edge of the world.

## The problem
UFC Wallis, a gym in Wallis and Futuna Islands (French Pacific), was running its membership on paper and Excel. No reliable check-in, no subscription tracking, no automatic reminders. Internet connectivity is unstable and the team isn't technical — the solution had to be dead simple, fast, and tolerate a bad connection.

## The solution
I built a full-stack Next.js web app with two roles: staff and member. Members check in via QR code or name search, staff manage subscriptions and see live capacity, and WhatsApp notifications go out automatically for renewals and reminders. Everything in French, GDPR compliant, deployed on Vercel with Supabase as the database. The UI uses shadcn/ui to stay fast to maintain.

## Stack
`Next.js` · `TypeScript` · `Tailwind` · `shadcn/ui` · `Supabase` · `Vercel` · `WhatsApp API`

## Outcome
- Check-in moved from paper to QR code — seconds per member
- Subscription renewals automated through WhatsApp (zero manual follow-up)
- Live gym capacity visible to staff at any time
- Native French, GDPR compliant, works on limited connection

## Status
Shipped, running in production in Wallis.
