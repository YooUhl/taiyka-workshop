import type { MetadataRoute } from "next";

// PWA manifest — powers the branded "Add to Home Screen" icon and splash colors.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'Atelier",
    short_name: "L'Atelier",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F14",
    theme_color: "#0B0F14",
    icons: [],
  };
}
