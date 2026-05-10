# Reven

> Grimpe vers ta meilleure version — une journée à la fois.

Application mobile de suivi d'addiction sur 30 jours. Le principe : un grimpeur monte un mur selon ta consommation journalière. Chaque jour sans consommation te fait gagner un niveau. Chaque rechute te fait redescendre. Le sommet = 30 niveaux = 6000 points.

---

## Stack

- **Expo SDK 54** + **Expo Router** (file-based routing)
- **React Native** + **TypeScript**
- **Zustand** (state management)
- **AsyncStorage** (persistance locale)
- **expo-notifications** (rappels journaliers)

---

## Installation

```bash
npm install
npx expo start
```

Scanner le QR avec **Expo Go** sur iOS ou Android.

---

## Tester l'app

Scanner le QR code avec **Expo Go** sur iOS ou Android, ou ouvrir directement :
[Ouvrir dans Expo Go](https://expo.dev/preview/update?message=update+icon&updateRuntimeVersion=1.0.0&createdAt=2026-05-10T13%3A27%3A30.403Z&slug=exp&projectId=d70b276e-fefc-4133-a759-032ff5d02255&group=71d212c6-5dc3-4257-b251-35df64bab325)

![Scanner pour ouvrir dans Expo Go](images/qrcode_expo.png)

## Niveaux

| Niveau | Score requis |
|--------|-------------|
| 1 | 200 pts |
| 5 | 1000 pts |
| 10 | 2000 pts |
| 15 | 3000 pts |
| 20 | 4000 pts |
| 25 | 5000 pts |
| 30 | 6000 pts |

Chaque palier (5, 10, 15, 20, 25, 30) débloque un trophée et déclenche une animation sur le mur.

---

## Fonctionnalités

- Mur d'escalade animé avec avatar personnalisé
- 7 types d'addictions avec courbes de score dédiées
- Système de trophées (10 trophées à débloquer)
- Timer horaire avec score futur affiché
- Déclaration de rechute avec compteur et message de motivation
- Historique des 30 jours avec code couleur
- Notifications journalières configurables
- Stats complètes (streak, meilleur streak, moyenne, jours clean)

---