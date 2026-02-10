// ============================================================
// ZENTRALE KONFIGURATION — Hier alles Kundenspezifische eintragen
// ============================================================

// --- Types ---

export interface NavItem {
  name: string;
  href: string;
  isCTA?: boolean;
}

export interface SocialLink {
  platform: "linkedin" | "xing" | "instagram" | "facebook" | "youtube" | "github";
  url: string;
  label: string;
}

export interface SiteConfig {
  // Basis
  name: string;
  domain: string;
  language: string;
  locale: string;

  // Inhaber
  owner: {
    name: string;
    role: string;
    location: string;
    email: string;
  };

  // Branding
  branding: {
    tagline: string;
    logo: {
      type: "text" | "svg" | "image";
      value: string;
      accentChar?: string;
    };
    colors: {
      accent: string;
      accentDark: string;
    };
  };

  // Navigation
  navigation: NavItem[];

  // Footer
  footer: {
    description: string;
    navigation: NavItem[];
    legal: NavItem[];
  };

  // Social Links
  social: SocialLink[];

  // SEO Defaults
  seo: {
    defaultDescription: string;
    defaultOgImage: string;
    author: string;
    themeColor: string;
  };

  // Features (an/aus)
  features: {
    blog: boolean;
    youtubeEmbeds: boolean;
    optimizedImages: boolean;
  };

  // Deployment
  deploy: {
    host: "febas" | "ionos" | "custom";
    ftpServerDir: string;
  };
}

// --- Konfiguration ---

export const siteConfig: SiteConfig = {
  // Basis
  name: "Kundenname",
  domain: "https://example.de",
  language: "de",
  locale: "de_DE",

  // Inhaber
  owner: {
    name: "Max Mustermann",
    role: "Beruf / Taetigkeit",
    location: "Berlin",
    email: "kontakt@example.de",
  },

  // Branding
  branding: {
    tagline: "Kurze Beschreibung des Angebots",
    logo: {
      type: "text",
      value: "FIRMENNAME",
      accentChar: ".",
    },
    colors: {
      accent: "#D81B86",
      accentDark: "#B31269",
    },
  },

  // Navigation
  navigation: [
    { name: "Start", href: "/" },
    { name: "Ueber mich", href: "/ueber-mich" },
    { name: "Leistungen", href: "/leistungen" },
    { name: "Kontakt", href: "/kontakt", isCTA: true },
  ],

  // Footer
  footer: {
    description: "Kurze Beschreibung fuer den Footer-Bereich.",
    navigation: [
      { name: "Start", href: "/" },
      { name: "Ueber mich", href: "/ueber-mich" },
      { name: "Leistungen", href: "/leistungen" },
      { name: "Kontakt", href: "/kontakt" },
    ],
    legal: [
      { name: "Impressum", href: "/impressum" },
      { name: "Datenschutz", href: "/datenschutz" },
    ],
  },

  // Social Links
  social: [
    { platform: "linkedin", url: "https://linkedin.com/in/dein-profil", label: "LinkedIn" },
  ],

  // SEO Defaults
  seo: {
    defaultDescription: "Beschreibung fuer Suchmaschinen (150-160 Zeichen)",
    defaultOgImage: "/images/og-default.jpg",
    author: "Max Mustermann",
    themeColor: "#D81B86",
  },

  // Features
  features: {
    blog: false,
    youtubeEmbeds: false,
    optimizedImages: true,
  },

  // Deployment
  deploy: {
    host: "ionos",
    ftpServerDir: "/",
  },
};
