# Architecture Frontend - Worduel

## Organisation des Dossiers et Fichiers

L'arborescence ci-dessous rend le code plus facilement réutilisable et maintenable.

```
src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navbar.tsx
├── features/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── game/
│   │   ├── SoloGame.tsx
│   │   └── DuelGame.tsx
│   └── user/
│       ├── Profile.tsx
│       ├── History.tsx
│       └── Leaderboard.tsx
├── context/
│   ├── authContext.tsx
│   ├── gameContext.tsx
│   └── userContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useGame.ts
│   └── useLeaderboard.ts
├── Pages/
│   ├── Home.tsx
│   ├── SoloGame.tsx
│   ├── DuelGame.tsx
│   ├── GameModeSelection.tsx
│   ├── HistoryPage.tsx
│   ├── LeaderboardPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFound.tsx
├── styles/
│   ├── globals.css
│   └── tailwind.config.js
├── utils/
│   ├── api.ts
│   ├── constants.ts
│   ├── formatters.ts
│   └── validators.ts
├── App.tsx
├── index.tsx
├── vite.config.ts
└── tsconfig.json
```

### Détails des Dossiers

1. **`assets/`** : Contient les ressources statiques telles que les images, icônes, et polices utilisées dans l'application.
2. **`components/`** : Contient les composants réutilisables.
   - **`common/`** : Composants génériques tels que les boutons, modals, inputs, etc.
   - **`layout/`** : Composants de mise en page comme le header, footer, et navbar.
3. **`features/`** : Contient les fonctionnalités principales du projet (authentification, jeu, utilisateur).
   - Chaque fonctionnalité a ses propres composants et son état géré via **useContext**.
4. **`context/`** : Contient les fichiers liés à **useContext** pour gérer l'état global.
5. **`hooks/`** : Contient les hooks personnalisés, tels que `useAuth` pour l'authentification ou `useGame` pour la gestion de l'état du jeu.
6. **`pages/`** : Contient les pages principales de l'application. Chaque page est un point d'entrée de l'application, représentée par un composant React.
7. **`styles/`** : Contient les fichiers de style globaux, ainsi que la configuration de **Tailwind CSS**.
8. **`utils/`** : Contient les utilitaires comme les appels API, les variables constantes globales, les formateurs et les validateurs.

## Convention de Nommage

### Nommage des Dossiers et Fichiers

- **Dossiers** : Les noms des dossiers doivent être en **camelCase** (par exemple : `gameSelection`, `userProfile`).
- **Fichiers TypeScript** : Les fichiers de composants doivent être nommés en **PascalCase** (par exemple : `GameSelection.tsx`, `UserProfile.tsx`).
- **Fichiers de state** : Les fichiers de gestion d'état doivent être nommés avec le suffixe `Context` (par exemple : `authContext.ts`, `gameContext.ts`).
- **Hooks** : Les fichiers de hooks personnalisés doivent commencer par le préfixe `use` (par exemple : `useAuth.ts`, `useGame.ts`).
- **Fichiers utilitaires** : Les utilitaires doivent être en **camelCase** (par exemple : `api.ts`, `constants.ts`, `someFile.ts`).

### Nommage des Variables et Fonctions

- **Composants** : Les composants React doivent être nommés en **PascalCase** (par exemple : `GameSelection`, `LeaderboardPage`).
- **Variables** : Les variables doivent être en **camelCase** (par exemple : `currentUser`, `gameStatus`).
- **Constantes** : Les constantes globales doivent être en **UPPER_SNAKE_CASE** (par exemple : `MAX_ATTEMPTS`, `API_URL`).
- **Fonctions** : Les fonctions doivent être en **camelCase** (par exemple : `handleSubmit`, `fetchUserData`).