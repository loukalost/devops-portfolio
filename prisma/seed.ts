/**
 * Seed de la base : 3 projets + 3 articles de blog, pour que le portfolio
 * fonctionne immédiatement après installation.
 *
 *   npm run db:seed
 *
 * Idempotent : relançable sans créer de doublons (upsert sur le slug).
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const projects = [
  {
    slug: "portfolio-devops",
    title: "Portfolio DevOps",
    description:
      "Ce portfolio : Next.js 16, Tailwind v4, Magic UI et PostgreSQL via Prisma. Entièrement configurable par variables d'environnement.",
    content:
      "## Objectif\n\nUn template de portfolio prêt à l'emploi, personnalisable en quelques minutes via un simple fichier `.env`.\n\n## Stack technique\n\n- **Next.js 16** (App Router, React Server Components)\n- **Tailwind CSS v4** + composants **Magic UI**\n- **PostgreSQL** + **Prisma** pour le blog et les projets\n- Scripts CLI pour ajouter du contenu sans toucher au code\n\n## Points clés\n\nLe contenu dynamique (articles, projets) est stocké en base, tandis que les informations personnelles sont injectées via l'environnement.",
    coverImage: "",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Tailwind"],
    githubUrl: "https://github.com/loukalost/portfolio",
    demoUrl: "",
    featured: true,
    published: true,
    order: 1,
  },
  {
    slug: "api-gestion-taches",
    title: "API de gestion de tâches",
    description:
      "API REST sécurisée (authentification JWT) pour gérer des tâches et des projets collaboratifs, avec tests automatisés.",
    content:
      "## Contexte\n\nUne API back-end robuste pour une application de gestion de tâches en équipe.\n\n## Fonctionnalités\n\n- Authentification et autorisation par **JWT**\n- CRUD complet sur les tâches, projets et utilisateurs\n- Validation des entrées et gestion d'erreurs centralisée\n- Suite de **tests unitaires et d'intégration**\n\n## Stack\n\nNode.js, NestJS, PostgreSQL et Prisma.",
    coverImage: "",
    tags: ["Node.js", "NestJS", "PostgreSQL", "JWT"],
    githubUrl: "https://github.com/loukalost/tasks-api",
    demoUrl: "",
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: "pipeline-cicd-conteneurise",
    title: "Pipeline CI/CD conteneurisé",
    description:
      "Mise en place d'un pipeline d'intégration et de déploiement continus : build Docker, tests et déploiement automatique.",
    content:
      "## Objectif\n\nAutomatiser entièrement le cycle de vie d'une application, du commit à la production.\n\n## Pipeline\n\n1. **Lint & tests** à chaque push\n2. Build d'une image **Docker** multi-stage optimisée\n3. Publication de l'image sur un registre\n4. **Déploiement automatique** sur l'environnement cible\n\n## Outils\n\nGitHub Actions, Docker, Docker Compose et un registre de conteneurs.",
    coverImage: "",
    tags: ["Docker", "GitHub Actions", "CI/CD", "DevOps"],
    githubUrl: "https://github.com/loukalost/cicd-demo",
    demoUrl: "",
    featured: false,
    published: true,
    order: 3,
  },
];

const posts = [
  {
    slug: "conteneuriser-application-nextjs-docker",
    title: "Conteneuriser une application Next.js avec Docker",
    excerpt:
      "Comment empaqueter une application Next.js dans une image Docker légère grâce à un build multi-stage et au mode standalone.",
    content: `# Conteneuriser une application Next.js avec Docker

Conteneuriser son application garantit qu'elle tourne de la même façon partout : sur votre machine, en CI et en production.

## Pourquoi un build multi-stage ?

Un \`Dockerfile\` multi-stage permet de séparer l'étape de **build** de l'étape d'**exécution**. L'image finale ne contient que le strict nécessaire, ce qui la rend bien plus légère.

## Le mode standalone

Next.js peut produire une sortie \`standalone\` qui regroupe uniquement les fichiers requis au runtime :

\`\`\`ts
// next.config.ts
const nextConfig = { output: "standalone" };
\`\`\`

## Bonnes pratiques

- Utiliser une image de base \`alpine\` pour réduire la taille
- Copier d'abord les fichiers de dépendances pour profiter du cache
- Exécuter le conteneur avec un utilisateur non-root

Avec ces quelques principes, on obtient une image rapide à construire et sûre à déployer.`,
    coverImage: "",
    tags: ["Docker", "Next.js", "DevOps"],
    published: true,
    publishedAt: new Date("2026-05-20T09:00:00Z"),
  },
  {
    slug: "pipeline-cicd-github-actions",
    title: "Mettre en place un pipeline CI/CD avec GitHub Actions",
    excerpt:
      "Un guide pas à pas pour automatiser le lint, les tests et le déploiement de votre application à chaque push.",
    content: `# Mettre en place un pipeline CI/CD avec GitHub Actions

L'intégration continue (CI) et le déploiement continu (CD) automatisent les tâches répétitives et fiabilisent vos livraisons.

## Un workflow minimal

Un workflow se déclare dans \`.github/workflows/ci.yml\` :

\`\`\`yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm run build
\`\`\`

## Les bonnes pratiques

- **Échouer vite** : lancer le lint et les tests en premier
- **Mettre en cache** les dépendances pour accélérer les exécutions
- Séparer les jobs de **CI** et de **CD**
- Stocker les secrets dans les *GitHub Secrets*

Un bon pipeline, c'est moins de stress au moment de livrer.`,
    coverImage: "",
    tags: ["CI/CD", "GitHub Actions", "Automatisation"],
    published: true,
    publishedAt: new Date("2026-04-12T09:00:00Z"),
  },
  {
    slug: "prisma-7-driver-adapter",
    title: "Prisma 7 : comprendre les driver adapters",
    excerpt:
      "Prisma 7 change la façon de se connecter à la base. Tour d'horizon des driver adapters et de la nouvelle configuration.",
    content: `# Prisma 7 : comprendre les driver adapters

Prisma 7 apporte des changements notables dans la configuration de la connexion à la base de données.

## La fin de l'URL dans le schéma

L'URL de connexion ne se met plus dans le bloc \`datasource\` du schéma. Elle se configure désormais dans \`prisma.config.ts\` pour la CLI, et via un **driver adapter** pour le runtime.

## Un adapter au runtime

Pour PostgreSQL, on utilise \`@prisma/adapter-pg\` :

\`\`\`ts
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
\`\`\`

## Pourquoi ce changement ?

Les driver adapters permettent à Prisma d'utiliser des drivers natifs et de mieux s'intégrer aux environnements *serverless* et *edge*.

C'est exactement l'approche utilisée par ce portfolio.`,
    coverImage: "",
    tags: ["Prisma", "PostgreSQL", "Backend"],
    published: true,
    publishedAt: new Date("2026-03-03T09:00:00Z"),
  },
];

async function main() {
  console.log("🌱 Seed en cours...");

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`  ✓ Projet : ${project.title}`);
  }

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`  ✓ Article : ${post.title}`);
  }

  console.log("✅ Seed terminé.");
}

main()
  .catch((error) => {
    console.error("❌ Erreur de seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
