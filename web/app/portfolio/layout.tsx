import { VT323 } from "next/font/google";

// VT323 (the HUD display font) is only used under /portfolio, so it's scoped here
// instead of the root layout — its @font-face CSS no longer ships on every route.
// The .variable className exposes --font-display-hud to this subtree so the
// .font-display-hud utility (PortfolioTile / PortfolioDetail) resolves.
const displayHud = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-hud",
});

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={displayHud.variable}>{children}</div>;
}
