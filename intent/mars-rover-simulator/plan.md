# Plan de réalisation : Simulateur Mars Rover

Spécification de référence : intent/mars-rover-simulator/spec.md
Intention de référence : intent/mars-rover-simulator/intent.md

## Technologie retenue

**TypeScript / Node.js**, décision du Product Owner (2026-09-22), conforme aux critères posés dans la spec pour le choix technologique de la phase Build (performance, fiabilité, adéquation à une application web ; Python avait été explicitement écarté). Justification du choix :
- bon compromis performance / adéquation web ;
- écosystème de test mature (vitest) pour une couverture précise des exigences EX-01 à EX-09 ;
- facilite une exposition ultérieure du simulateur comme API HTTP, conformément à l'usage décrit dans l'intention (« destiné à être appelé par un autre système/API »).

## Décisions de conception techniques (Build)

Ces décisions lèvent des zones grises que la spec laisse volontairement ouvertes au niveau de l'implémentation (elles ne remettent en cause aucune décision déjà actée dans la spec — R-01, R-02, format du wrap-around, format du résultat) :

- **Style fonctionnel, sans classes** : le simulateur est composé de types de données simples et de fonctions pures, conformément au choix « fonction pure de simulation » déjà accepté dans la spec.
- **Séparation calcul / formatage** : le cœur de simulation renvoie une valeur structurée `{ position, direction }` ; la conversion vers la chaîne `"<x> <y> <direction>"` (EX-08) est isolée dans une fonction de formatage dédiée.
- **Ordre wrap-around → obstacle (EX-09 + EX-06)** : pour une commande « avancer », l'algorithme suit strictement 3 étapes : (1) calcul de la position brute cible (peut être hors carte, y compris négative) ; (2) rebouclage de cette position brute sur les dimensions de la carte (EX-09) ; (3) si la case reboucleée est un obstacle, le rover reste sur sa position **courante avant la commande** (EX-06) ; sinon il se déplace vers la case reboucleée. Ce point n'est illustré par aucun scénario de la spec (seul un bord sans obstacle est illustré en EX-09) ; il sera couvert par un test dédié.
- **Format d'entrée de la carte** : la carte est reçue comme un tableau de lignes déjà segmentées en symboles unitaires (un symbole par case), plutôt que comme des chaînes de caractères brutes. Les symboles d'obstacles (🟩/🌳, 🟫/🪨) sont des caractères Unicode hors du plan multilingue de base : un découpage naïf de chaîne (`charAt`, index direct) romprait ces symboles. Recevoir la carte déjà segmentée évite ce risque au niveau du contrat d'entrée du simulateur.
- **Format d'entrée des commandes** : en l'absence de format externe fixé par la spec pour les commandes (« avancer », « tourner à droite », « tourner à gauche » y sont des concepts, pas un format d'API), le cœur du simulateur prend un type strict à 3 valeurs (union discriminée). Aucun analyseur de commandes en langage naturel n'est construit tant qu'un format d'entrée concret n'est pas demandé (à traiter, le cas échéant, comme une nouvelle question ouverte plutôt que d'être anticipé maintenant).
- **Indexation de la grille** : la carte est stockée en mémoire avec une correspondance directe entre l'axe y et l'index de ligne, sans inversion verticale implicite, pour éviter une source de bugs discrète (aucun rendu destiné à un humain n'étant requis par la spec).
- **Langue des identifiants de code** : identifiants en anglais (convention standard de l'écosystème TypeScript/Node.js), avec des tests nommés ou commentés par référence aux identifiants `EX-NN` de la spec pour garder la traçabilité entre exigence et test.

## Architecture des fichiers

Réalisation en petites étapes, chacune validée par les tests (`vitest run`) avant de passer à la suivante.

### Étape 0 — Scaffolding du projet
- `package.json`, `tsconfig.json` (mode `strict` activé), configuration vitest, scripts `build`/`test`.
- Ajout de `node_modules/` et `dist/` au `.gitignore` existant (actuellement orienté uniquement Python).

### Étape 1 — `src/types.ts`
Types partagés : `Position`, `Direction` (`'N'|'E'|'S'|'W'`), `Command` (`'ADVANCE'|'TURN_RIGHT'|'TURN_LEFT'`), `Cell` (`'FREE'|'OBSTACLE'`), `MapModel` (largeur, hauteur, grille de cases).

### Étape 2 — `src/direction.ts`
- `turnRight(direction)`, `turnLeft(direction)` : rotation cyclique.
- `deltaFor(direction)` : vecteur de déplacement selon la convention de repère de la spec (x croissant vers l'est, y croissant vers le nord — décision R-02).

### Étape 3 — `src/map.ts`
- `parseMap(grid)` : convertit une grille de symboles (🟩/🌳 ou 🟫/🪨) en `MapModel`, selon la correspondance actée en R-01.
- `isObstacle(map, position)`.
- `wrapPosition(map, position)` : rebouclage indépendant sur x et sur y (modulo positif).

### Étape 4 — `src/simulate.ts`
Fonction pure `simulate(start, initialDirection, map, commands)` retournant `{ position, direction }`. Applique séquentiellement chaque commande à l'état résultant de la précédente (EX-07) : rotation pour `TURN_RIGHT`/`TURN_LEFT`, algorithme en 3 étapes ci-dessus pour `ADVANCE`.

### Étape 5 — `src/format.ts`
`formatResult({ position, direction })` produisant la chaîne `"<x> <y> <direction>"` (EX-08).

### Étape 6 — `src/index.ts`
Point d'entrée public unique, l'« API » mentionnée dans l'intention : `simulateRover(start, initialDirection, map, commands) -> string`, composition de `simulate` et `formatResult`.

### Différé, hors scope de la phase Build actuelle
Tout adaptateur de parsing de commandes en langage naturel (français ou autre) : aucun format d'entrée externe n'étant fixé par la spec, il n'est pas anticipé.

## Plan de tests

### `direction.test.ts`
- `turnRight` : N→E→S→W→N (EX-04).
- `turnLeft` : N→W→S→E→N (EX-05).
- `turnRight` puis `turnLeft` (et inversement) ramènent à la direction initiale.
- `deltaFor` correct pour les 4 directions, selon la convention R-02.

### `map.test.ts`
- EX-02 avec le jeu 🟩/🌳 : case marquée 🌳 → obstacle, autres cases → libres.
- Même scénario avec le jeu 🟫/🪨 → résultat strictement identique (garde-fou de non-régression sur R-01).
- `wrapPosition` : position en bordure haute après un pas → 0 ; position négative → dernière case de l'axe ; position déjà dans les bornes → inchangée.
- Carte 1×1 : toute position se reboucle vers `(0,0)`.

### `simulate.test.ts` / `index.test.ts` (traçabilité explicite des exigences, mêmes données que la spec)
- **EX-01** : départ (2,3,N), liste de commandes vide → (2,3,N).
- **EX-03** : (2,3,N) + avancer, (2,4) libre → (2,4,N).
- **EX-04** : (2,3,N) + tourner à droite → (2,3,E).
- **EX-05** : (2,3,N) + tourner à gauche → (2,3,W).
- **EX-06** : (2,3,N), (2,4) obstacle, [avancer, tourner à droite] → (2,3,N) après avancer, puis (2,3,E).
- **EX-07** : (0,0,N) + [avancer, avancer, tourner à droite, avancer], aucun obstacle → (1,2,E).
- **EX-08** : vérification du format exact de la chaîne retournée, ex. `"1 2 E"`.
- **EX-09** : carte 5×5, (4,3,E), (0,3) libre, avancer → (0,3,E).

### Cas limites complémentaires (non illustrés explicitement par la spec, à couvrir néanmoins)
- Rebouclage sur les 4 bords (ouest, nord, sud — la spec n'illustre que le bord est).
- Combinaison rebouclage + obstacle (EX-09 + EX-06) : la case d'arrivée après rebouclage est elle-même un obstacle → le rover reste sur sa position d'origine en bordure. C'est le point le plus à risque de l'implémentation ; aucun scénario de la spec ne le couvre explicitement.
- Carte 1×1 : des commandes « avancer » répétées laissent le rover sur son unique case (si elle est libre).
- Des rotations seules ne déclenchent jamais de rebouclage ni de vérification d'obstacle, même en case de bordure ou d'angle.
- Trajet plus long mêlant plusieurs obstacles et plusieurs commandes bloquées/libres.
- Pureté de la fonction : deux appels avec les mêmes entrées produisent le même résultat, sans mutation des objets d'entrée (carte, liste de commandes).
- Équivalence stricte des deux jeux de symboles sur un scénario complet (rejeu d'EX-07 encodé en 🟫/🪨).

## Étapes suivantes

Ce document couvre la planification de la réalisation. Le scaffolding et l'implémentation (étapes 0 à 6 ci-dessus) seront réalisés dans des commits ultérieurs séparés, une fois ce plan validé.
