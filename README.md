# Reven

> Grimpe vers ta meilleure version — une journée à la fois.

Application mobile de suivi d'addiction sur 30 jours. Un grimpeur monte un mur selon ta progression : chaque jour loggé maintient ton streak, chaque rechute remet le timer à zéro. Le sommet = 30 niveaux = 6000 points.

---

## Stack

- **Expo SDK 54** + **Expo Router** (file-based routing)
- **React Native** + **TypeScript**
- **Zustand** (state management)
- **AsyncStorage** (persistance locale)
- **expo-av** (sons dans le mini-jeu)

---

## Installation

```bash
npm install
npx expo start
```

Scanner le QR avec **Expo Go** sur iOS ou Android.

---

## Tester l'app

[Ouvrir dans Expo Go](https://expo.dev/preview/update?message=V2.1&updateRuntimeVersion=1.0.0&createdAt=2026-05-22T10%3A30%3A57.846Z&slug=exp&projectId=d70b276e-fefc-4133-a759-032ff5d02255&group=b8ee7190-8568-4013-b328-d69de670657d)

![Scanner pour ouvrir dans Expo Go](assets/images/qrcode_expo.png)

---

## Système de niveaux

| Niveau | Score requis |
|--------|-------------|
| 1 | 200 pts |
| 5 | 1 000 pts |
| 10 | 2 000 pts |
| 15 | 3 000 pts |
| 20 | 4 000 pts |
| 25 | 5 000 pts |
| 30 | 6 000 pts |

Chaque palier (5, 10, 15, 20, 25, 30) débloque un trophée et déclenche une animation sur le mur.

---

## Timer de points

+50 pts accordés par tick dans la plage active **7h–23h**. L'intervalle augmente avec le niveau :

| Niveau | Intervalle |
|--------|-----------|
| 0–4 | 1h |
| 5–9 | 1h30 |
| 10–14 | 2h |
| 15–19 | 2h30 |
| 20–24 | 3h |
| 25–29 | 3h30 |
| 30 | 4h |

Le timer affiche le vrai temps restant même après une longue absence (fermeture de l'app, nuit). Hors plage active, le décompte est suspendu.

---

## Streak

Le streak compte les **jours calendaires consécutifs loggés**, peu importe la consommation. Un jour sans log remet le streak à 0. Logger = maintenir son streak.

---

## Score par log

| Cigarettes | Points |
|------------|--------|
| 0 | +200 |
| 1 | +150 |
| 2 | +100 |
| 3–12 | dégressif selon niveau |
| 13+ | malus selon niveau (jusqu'à −400) |

Les malus s'amplifient avec le niveau (×1 à partir du niveau 10, ×5 au niveau 30).

---

## Fonctionnalités

- Mur d'escalade animé avec avatar personnalisé, animations de milestone et écran de victoire
- Système de streak lié au log quotidien (pas à la consommation)
- Timer actif 7h–23h avec vrai temps restant après absence
- Objectif journalier avec compteur "ma main a glissé"
- Déclaration de rechute (remet le timer à zéro, compteur journalier)
- Mode résistance "Chute libre" : respiration guidée, tips anti-craving, mini-jeu Esquive
- Mini-jeu Esquive avec sons (musique de fond, mort, contact, déplacement)
- 10 trophées à débloquer
- Historique des 30 jours avec code couleur
- Stats complètes (streak, meilleur streak, moyenne, jours clean, jours loggés)

---