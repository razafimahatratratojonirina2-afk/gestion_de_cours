# Mon cahier de cours (React + Vite)

Gestion de cours particuliers (collège, 6e à 3e) : élèves, séances du mercredi et du samedi,
présences, paiements et relances WhatsApp.

## Prérequis
Node.js 18 ou plus récent.

## Lancer
```bash
npm install
npm run dev        # http://localhost:5173
```

## Construire et déployer
```bash
npm run build      # génère le dossier dist/
npm run preview    # tester la version de production
```
Dépose le contenu de `dist/` sur Netlify, Vercel, GitHub Pages, etc.

## Structure
```
src/
  main.jsx               point d'entrée
  App.jsx                navigation, modales, génération des séances
  utils.js               constantes, formats, calcul des soldes
  hooks/useLocalStorage.js   état persistant dans le navigateur
  components/
    Home.jsx  Students.jsx  Sessions.jsx  Payments.jsx
    SessionCard.jsx  Modal.jsx  Forms.jsx (élève, séance, paiement)
  styles.css             thème clair/sombre, mobile-first
```

## Données
Stockées dans le `localStorage` (clé `coursapp.v1`), donc propres à chaque navigateur.
solde = (séances « effectuée » où l'élève est « Présent » × tarif) − paiements.

## Évolutions possibles
Backend (Node/Express + PostgreSQL ou Supabase), authentification, export PDF/Excel,
React Router, tests avec Vitest, portail parent, passage de classe en fin d'année.
