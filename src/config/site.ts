/**
 * Configuration du site, alimentée par les variables d'environnement.
 *
 * Toutes les infos personnelles vivent dans `.env` (voir `.env.example`).
 * Les valeurs ci-dessous servent de repli si une variable n'est pas définie,
 * afin que le template fonctionne « out of the box ».
 *
 * ⚠️ Les variables NEXT_PUBLIC_* sont inlinées au build : il faut les référencer
 *    par accès statique (process.env.NEXT_PUBLIC_XXX) — ne pas les lire dynamiquement.
 */

const firstName = process.env.NEXT_PUBLIC_FIRST_NAME || "Louka";
const lastName = process.env.NEXT_PUBLIC_LAST_NAME || "Lemonnier";

export const siteConfig = {
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  role: process.env.NEXT_PUBLIC_ROLE || "Développeur Full-Stack",
  tagline:
    process.env.NEXT_PUBLIC_TAGLINE ||
    "Je conçois et déploie des applications web modernes, du front à l'infra.",
  bio:
    process.env.NEXT_PUBLIC_BIO ||
    "Étudiant en M1 DevOps, passionné par le développement web et l'automatisation. J'aime construire des produits soignés, des pipelines CI/CD fiables et apprendre de nouvelles technologies.",
  location: process.env.NEXT_PUBLIC_LOCATION || "Nantes, France",
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || "",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "",
  email: process.env.NEXT_PUBLIC_EMAIL || "lk.lemonnier@gmail.com",
  phone: process.env.NEXT_PUBLIC_PHONE || "0769190682",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  socials: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/loukalost",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/louka-lemonnier/",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/LemonnierLouka",
    website: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://www.youtube.com/watch?v=xvFZjo5PgG0",
  },
} as const;

export type SiteConfig = typeof siteConfig;
