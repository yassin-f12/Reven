# 🧗 Reven

> Grimpe vers ta meilleure version — une journée à la fois.

Application mobile de suivi d'addiction sur 30 jours. Le principe : un grimpeur monte ou descend un mur selon ta consommation journalière. Zéro journée = +3 cases vers le sommet.

## Stack

- **Expo SDK 50** + **Expo Router** (file-based routing)
- **React Native** + **TypeScript**
- **Zustand** (state management)
- **AsyncStorage** (persistance locale)
- **expo-notifications** (rappels journaliers)
- **expo-linear-gradient** (UI)

## Installation

\`\`\`bash
npm install
npx expo start
\`\`\`

Scanner le QR avec **Expo Go** sur iOS ou Android.

## Structure

\`\`\`
app/          → Écrans (Expo Router)
src/
  components/ → ClimberWall, DayTracker
  store/      → useStore (Zustand)
  utils/      → theme, notifications, calculations
  data/       → avatars, motivations
  types.ts    → Types TypeScript centraux
\`\`\`

## Logique de jeu

| Conso | Effet |
|-------|-------|
| 0 | +3 cases ⬆️ |
| 1-2 | stable |
| 3-5 | -1 case ⬇️ |
| 6-10 | -3 cases ⬇️ |
| 10+ | -5 cases ⬇️ |

## Roadmap v2

- [ ] Partage de progression
- [ ] Thèmes visuels
- [ ] Mode multijoueur / défi entre amis
- [ ] Statistiques avancées (graphiques)
\`\`\`