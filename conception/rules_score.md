# Documentation des Règles de Calcul des Scores pour le Mode Multijoueur (Duel)

## Objectif

Cette documentation détaille les règles de calcul du score dans le mode multijoueur (Duel) de l'application Wordle. Le score des joueurs est influencé par plusieurs facteurs, tels que le temps, le nombre de tentatives, la précision des lettres bien ou mal placées, et la différence de MMR (Matchmaking Rating) entre les adversaires. Le gagnant voit son score ajusté en fonction du MMR de son adversaire, tandis que le perdant reçoit un score négatif, également pondéré par le MMR de l'adversaire.

## Table des Matières

- [Documentation des Règles de Calcul des Scores pour le Mode Multijoueur (Duel)](#documentation-des-règles-de-calcul-des-scores-pour-le-mode-multijoueur-duel)
  - [Objectif](#objectif)
  - [Table des Matières](#table-des-matières)
  - [Vue d'Ensemble](#vue-densemble)
    - [Pondérations des éléments](#pondérations-des-éléments)
  - [Formule Générale pour le Gagnant](#formule-générale-pour-le-gagnant)
    - [Détails des composants :](#détails-des-composants-)
      - [Score par temps :](#score-par-temps-)
      - [Score par tentatives :](#score-par-tentatives-)
      - [Score par lettres :](#score-par-lettres-)
      - [Bonus de victoire :](#bonus-de-victoire-)
  - [Formule Générale pour le Perdant](#formule-générale-pour-le-perdant)
  - [Pondération du MMR](#pondération-du-mmr)
  - [Détail des Calculs](#détail-des-calculs)
    - [Score par temps (gagnant et perdant)](#score-par-temps-gagnant-et-perdant)
    - [Score par tentatives](#score-par-tentatives)
    - [Score par lettres (uniquement pour le gagnant)](#score-par-lettres-uniquement-pour-le-gagnant)
    - [Bonus pour victoire (uniquement pour le gagnant)](#bonus-pour-victoire-uniquement-pour-le-gagnant)
  - [Exemples de Calcul](#exemples-de-calcul)
    - [Cas 1 : Gagnant avec MMR plus faible](#cas-1--gagnant-avec-mmr-plus-faible)
      - [Calcul du score du gagnant](#calcul-du-score-du-gagnant)
    - [Cas 2 : Perdant avec MMR plus élevé](#cas-2--perdant-avec-mmr-plus-élevé)
      - [Calcul du score du perdant](#calcul-du-score-du-perdant)
    - [Cas 3 : Gagnant avec MMR plus élevé que le perdant](#cas-3--gagnant-avec-mmr-plus-élevé-que-le-perdant)
      - [Pondération MMR pour le gagnant :](#pondération-mmr-pour-le-gagnant-)
      - [Score total du gagnant :](#score-total-du-gagnant-)
    - [Cas 4 : Perdant avec MMR plus faible que le gagnant](#cas-4--perdant-avec-mmr-plus-faible-que-le-gagnant)
      - [Pondération MMR pour le perdant :](#pondération-mmr-pour-le-perdant-)
      - [Score total du perdant :](#score-total-du-perdant-)
    - [Calcul du MMR a ajouter au mmr final du joueur](#calcul-du-mmr-a-ajouter-au-mmr-final-du-joueur)
  - [Conclusion](#conclusion)

## Vue d'Ensemble

Dans le mode multijoueur (Duel), le score final est influencé par plusieurs éléments clés :

- Le temps pris pour deviner le mot.
- Le nombre de tentatives pour deviner le mot.
- La précision des lettres bien placées ou mal placées.
- Le MMR (Matchmaking Rating), qui pondère le score en fonction de la différence de niveaux entre les joueurs.

### Pondérations des éléments

Les pondérations suivantes sont appliquées dans le calcul des scores :

- 𝛼 (score_by_time) = 0.7
- 𝛽 (score_by_guesses) = 0.3
- 𝛾 (perdant) = 1.5
- 𝛿 (gagnant) = 1.5

## Formule Générale pour le Gagnant

Le score total du gagnant est calculé en fonction de sa performance (temps, tentatives, lettres correctes/mal placées) et pondéré par le MMR de l'adversaire.

score_total_gagnant = (𝛿 × MMR_adversaire / MMR_joueur) × (𝛼 × score_by_time + 𝛽 × score_by_guesses + score_by_letters + score_bonus)

### Détails des composants :

#### Score par temps :
```
score_by_time = 100 − (temps_pris / temps_max) × 100
```

#### Score par tentatives :
```
score_by_guesses = 100 − (tentatives_utilisées / tentatives_max) × 100
```

#### Score par lettres :
```
score_by_letters = 5 × lettres_correctes + 2 × lettres_mal_placées
```

#### Bonus de victoire :
```
score_bonus = 50 + (20 s'il fini en moins de 20 secondes)
```

## Formule Générale pour le Perdant

Le perdant reçoit toujours un score négatif, pondéré par le MMR de l'adversaire et basé sur ses performances.

```
score_total_perdant = −(𝛾 × MMR_adversaire / MMR_joueur) × (𝛼 × score_by_time + 𝛽 × score_by_guesses)
```

## Pondération du MMR

- Si le perdant a un MMR plus élevé que le gagnant, la victoire du gagnant sera plus gratifiante et la pénalité du perdant sera plus importante.
- Si le gagnant a un MMR plus élevé que le perdant, la victoire sera moins gratifiante et la perte pour le perdant sera réduite.

## Détail des Calculs

### Score par temps (gagnant et perdant)
```
score_by_time = 100 − (temps_pris / temps_max) × 100
```

### Score par tentatives
```
score_by_guesses = 100 − (tentatives_utilisees / tentatives_max) × 100
```

### Score par lettres (uniquement pour le gagnant)
```
score_by_letters = 5 × lettres_correctes + 2 × lettres_mal_placées
```

### Bonus pour victoire (uniquement pour le gagnant)
```
score_bonus = 50 points + 20 points (si le temps est inférieur à 40 secondes)
```

## Exemples de Calcul

### Cas 1 : Gagnant avec MMR plus faible

- Nombre de tentatives : 3
- Temps pris : 35 secondes
- Lettres correctes : 3
- Lettres mal placées : 2
- MMR du gagnant : 1000
- MMR du perdant : 1200

#### Calcul du score du gagnant

Score par temps :
```
score_by_time = 100 − (35 / 60) × 100 = 100 − 58.33 = 41.67 points
```

Score par tentatives :
```
score_by_guesses = 100 − (3 / 6) × 100 = 100 − 50 = 50 points
```

Score par lettres :
```
score_by_letters = 5 × 3 + 2 × 2 = 15 + 4 = 19 points
```

Bonus de victoire :
```
score_bonus = 50 points (victoire)
```

Pondération MMR :
```
MMR_adversaire / MMR_joueur = 1200 / 1000 = 1.2
```

Score total du gagnant :
```
score_total_gagnant = 1.5 × 1.2 × (0.7 × 41.67 + 0.3 × 50 + 19 + 50) = 1.5 × 1.2 × (29.17 + 15 + 19 + 50) = 1.5 × 1.2 × 113.17 = 203.71 points
```

### Cas 2 : Perdant avec MMR plus élevé

- Nombre de tentatives : 4
- Temps pris : 55 secondes
- MMR du perdant : 1200
- MMR du gagnant : 1000

#### Calcul du score du perdant

Score par temps :
```
score_by_time = 100 − (55 / 60) × 100 = 100 − 91.67 = 8.33 points
```

Score par tentatives :
```
score_by_guesses = 100 − (4 / 6) × 100 = 100 − 66.67 = 33.33 points
```

Pondération MMR :
```
MMR_gagnant / MMR_perdant = 1000 / 1200 = 0.83
```

Score total du perdant :
```
score_total_perdant = −(1.5 × 0.83) × (0.7 × 8.33 + 0.3 × 33.33)
= −1.245 × (5.83 + 10) = −1.245 × 15.83 = −19.72 points
```

### Cas 3 : Gagnant avec MMR plus élevé que le perdant

- MMR du gagnant : 1300
- MMR du perdant : 1200

#### Pondération MMR pour le gagnant :
```
MMR_adversaire / MMR_joueur = 1200 / 1300 = 0.92
```

#### Score total du gagnant :
```
score_total_gagnant = 1.5 × 0.92 × (𝛼 × score_by_time + 𝛽 × score_by_guesses + score_by_letters + score_bonus)
```

### Cas 4 : Perdant avec MMR plus faible que le gagnant

- MMR du perdant : 1000
- MMR du gagnant : 1300

#### Pondération MMR pour le perdant :
```
MMR_adversaire / MMR_joueur = 1300 / 1000 = 1.3
```

#### Score total du perdant :
```
score_total_perdant = −(1.5 × 1.3) × (0.7 × score_by_time + 0.3 × score_by_guesses)
```

### Calcul du MMR a ajouter au mmr final du joueur

```
MMR_gain = (𝛿 × (MMR_adversaire / MMR_joueur)) × coefficient_gain
```

- 𝛿 est une constante (dans l'exemple donné, 𝛿 = 1.5).

- MMR_adversaire / MMR_joueur reflète la différence de MMR entre les joueurs.

- coefficient_gain est un facteur dépendant du système de jeu pour ajuster le gain final, basé sur des paramètres comme les performances globales. ici vaut 10.

```
MMR_gain = 1.5 × (1200 / 1000) × coefficient_gain
MMR_gain = 1.5 × 1.2 × coefficient_gain = 1.8 × coefficient_gain

MMR_gain = 1.8 × 10 = 18 points
```

## Conclusion

Toutes ces formules sont à revoir et à ajuster au cours des tests. Elles nous permettront de trouver les bonnes pondérations pour chaque élément et de travailler sur une base solide.

> [!NOTE]
> Revoir si on garde le score total end game avec pondération par mmr.
> 
> Voir l'utilité du score_total_multi.