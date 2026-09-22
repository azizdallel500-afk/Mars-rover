# Spec : Simulateur Mars Rover

Intention de référence : intent/mars-rover-simulator/intent.md

## Périmètre

Besoin couvert : fournir un moteur de simulation, appelé par un autre système/API, qui interprète un point de départ, une orientation initiale, une carte avec obstacles et une liste de commandes, et restitue la position et la direction finales du rover comme valeur de retour.

Exclusions (aucune interface humaine ni persistance n'étant mentionnées dans l'intention) :
- aucune interface utilisateur destinée à une personne (l'intention précise que le simulateur est « destiné à être appelé par un autre système/API plutôt qu'utilisé directement par une personne ») ;
- le système ou l'API appelant lui-même n'est pas couvert, seul le point d'entrée du simulateur l'est ;
- aucune persistance des données (position, carte, historique de commandes) n'est demandée.

## Exigences

### EX-01 — Initialisation du rover

Origine dans l'intention : « Le simulateur reçoit : un point de départ (x, y) et une orientation initiale (N, S, E ou W) »
Comportement attendu : le simulateur positionne le rover au point de départ fourni, avec l'orientation initiale fournie, avant toute exécution de commande.

Scénario
- Situation de départ : point de départ (x=2, y=3), orientation initiale N, carte sans obstacle sur cette case.
- Action : le simulateur est invoqué avec une liste de commandes vide.
- Résultat attendu : la position finale retournée est (2,3) et la direction finale est N.

### EX-02 — Interprétation de la carte et de ses obstacles

Origine dans l'intention : « une carte plaçant les obstacles (symboles 🟩/🌳 ou 🟫/🪨) »
Comportement attendu : le simulateur détermine, pour chaque case de la carte fournie, si elle est libre ou occupée par un obstacle, quel que soit le jeu de symboles utilisé (🟩/🌳 ou 🟫/🪨).

Scénario
- Situation de départ : une carte utilisant le jeu de symboles 🟩/🌳, où la case (2,4) porte le symbole 🌳 et les autres cases portent le symbole 🟩.
- Action : le simulateur interprète cette carte.
- Résultat attendu : la case (2,4) est identifiée comme occupée par un obstacle, toutes les autres cases comme libres (🟩 = case libre, 🌳 = obstacle ; même règle pour 🟫 = case libre et 🪨 = obstacle — décision R-01).

### EX-03 — Avancer d'une case

Origine dans l'intention : « le rover peut avancer d'une case »
Comportement attendu : sur une commande « avancer », si la case immédiatement devant le rover (dans sa direction courante) est libre, le rover s'y déplace ; sa direction ne change pas.

Scénario
- Situation de départ : rover en (2,3) orienté N ; la case (2,4) est libre.
- Action : commande « avancer ».
- Résultat attendu : manque — le sens dans lequel les coordonnées évoluent pour chaque orientation (convention de repère) n'est pas confirmé par le Product Owner (voir réserve R-02) ; sous la convention proposée en Conception, la position finale serait (2,4) et la direction N.

### EX-04 — Tourner à droite

Origine dans l'intention : « tourner de 90° à droite »
Comportement attendu : sur une commande « tourner à droite », le rover pivote de 90° sur lui-même (N→E→S→W→N) sans changer de position.

Scénario
- Situation de départ : rover en (2,3) orienté N.
- Action : commande « tourner à droite ».
- Résultat attendu : position inchangée (2,3), direction finale E.

### EX-05 — Tourner à gauche

Origine dans l'intention : « tourner de 90° [...] à gauche »
Comportement attendu : sur une commande « tourner à gauche », le rover pivote de 90° sur lui-même (N→W→S→E→N) sans changer de position.

Scénario
- Situation de départ : rover en (2,3) orienté N.
- Action : commande « tourner à gauche ».
- Résultat attendu : position inchangée (2,3), direction finale W.

### EX-06 — Blocage sur obstacle

Origine dans l'intention : « Si un obstacle bloque son avancée, le rover reste immobile sur cette commande. »
Comportement attendu : sur une commande « avancer », si la case immédiatement devant le rover est un obstacle, le rover reste sur sa position courante pour cette commande (pas d'erreur, pas d'arrêt du programme), et l'exécution des commandes suivantes se poursuit normalement.

Scénario
- Situation de départ : rover en (2,3) orienté N ; la case (2,4) est un obstacle.
- Action : liste de commandes [« avancer », « tourner à droite »].
- Résultat attendu : après « avancer », position inchangée (2,3), direction N ; après « tourner à droite », position (2,3), direction E. (Case (2,4) marquée 🌳 ou 🪨, conformément à la décision R-01.)

### EX-07 — Exécution séquentielle d'une liste de commandes

Origine dans l'intention : « une liste de commandes » / « Il interprète les commandes »
Comportement attendu : le simulateur applique les commandes de la liste dans l'ordre fourni ; chaque commande s'applique à l'état (position, direction) résultant de la commande précédente.

Scénario
- Situation de départ : rover en (0,0) orienté N ; aucune case du trajet n'est un obstacle.
- Action : liste de commandes [« avancer », « avancer », « tourner à droite », « avancer »].
- Résultat attendu : manque — dépend de la convention de repère non confirmée (réserve R-02) ; sous la convention proposée en Conception, la position finale serait (1,2) et la direction E.

### EX-08 — Restitution du résultat final

Origine dans l'intention : « Le résultat (position et direction finales) est restitué comme une valeur retournée par une fonction/API, consommée par le système appelant. »
Comportement attendu : après exécution de toutes les commandes de la liste, le simulateur retourne une valeur unique portant la position finale et la direction finale du rover, sans sortie destinée à une personne.

Scénario
- Situation de départ : rover ayant terminé l'exécution d'une liste de commandes quelconque.
- Action : fin de l'exécution de la liste de commandes.
- Résultat attendu : manque — le format exact de la valeur retournée (structure de l'objet/tuple) n'est pas défini ; c'est une question ouverte de l'intention à trancher par le Product Owner avant la phase Build.

### EX-09 — Comportement en bord de carte

Origine dans l'intention : question ouverte « Comment le rover gère-t-il les bords de la carte (arrêt, erreur, wrap-around) ? »
Comportement attendu : non déterminé.

Scénario
- Situation de départ : rover positionné sur une case en bordure de la carte, orienté vers l'extérieur de la carte.
- Action : commande « avancer ».
- Résultat attendu : manque — dépend de la décision du Product Owner entre immobilité (par analogie avec un obstacle), erreur, ou rebouclage sur le bord opposé (wrap-around).

## Conception proposée

- **Fonction pure de simulation** : le simulateur est conçu comme une fonction sans effet de bord, prenant en entrée (point de départ, orientation initiale, carte, liste de commandes) et renvoyant en sortie (position finale, direction finale). Ce choix découle directement de l'intention (« valeur retournée par une fonction/API ») — accepté.
- **Modèle de carte** : la carte est interprétée comme une grille 2D où chaque case est soit libre, soit occupée par un obstacle, indépendamment du jeu de symboles utilisé en entrée (🟩/🌳 ou 🟫/🪨) ; les deux jeux sont traités comme fonctionnellement équivalents une fois convertis en cases libres/obstacles : 🟩 et 🟫 représentent une case libre, 🌳 et 🪨 représentent un obstacle. Accepté (décision R-01, 2026-09-22).
- **Modèle d'orientation** : l'orientation est une énumération cyclique (N, E, S, W) ; « tourner à droite » avance d'un cran dans ce cycle, « tourner à gauche » recule d'un cran. Proposition à valider.
- **Convention de repère** : proposition à valider (réserve R-02) — axe x croissant vers l'est, axe y croissant vers le nord (convention cartésienne standard), utilisée uniquement pour illustrer les scénarios EX-03 et EX-07 ci-dessus.
- **Traitement séquentiel des commandes** : chaque commande de la liste est appliquée l'une après l'autre à l'état courant (position, direction) ; une commande « avancer » vérifie l'état d'obstacle de la case cible avant de déplacer le rover, une commande de rotation ne modifie que la direction. Ce choix découle directement de l'intention — accepté.
- **Gestion du blocage par obstacle** : une commande « avancer » vers une case occupée laisse la position inchangée et poursuit avec la commande suivante, sans lever d'erreur. Ce choix découle directement de l'intention (« pas d'erreur ni d'arrêt du programme ») — accepté.
- **Gestion des bords de carte** : aucune proposition n'est faite tant que la question ouverte correspondante (réserve reprise en EX-09) n'est pas tranchée par le Product Owner.
- **Format du résultat retourné** : aucune proposition de structure n'est faite tant que la question ouverte correspondante (EX-08) n'est pas tranchée par le Product Owner.

## Réserves

### R-01 — Correspondance symbole ↔ statut de case

Origine : l'intention mentionne des symboles d'obstacles « 🟩/🌳 ou 🟫/🪨 » sans préciser si chaque paire associe un symbole de case libre à un symbole d'obstacle, ni lequel des deux symboles de chaque paire représente l'obstacle.
Exigences concernées : EX-02, EX-06.
Conséquences : sans cette précision, les scénarios liés à la lecture de la carte et au blocage par obstacle ne peuvent pas indiquer de résultat observable exact.
Décision : confirmée — 🟩 et 🟫 représentent des cases libres, 🌳 et 🪨 représentent des obstacles.
Auteur : Product Owner.
Date : 2026-09-22.
Justification : confirmation directe de l'hypothèse de conception proposée, sans réserve supplémentaire.
Éléments modifiés : scénarios EX-02 et EX-06, choix « Modèle de carte » en Conception proposée.
Statut : résolue.

### R-02 — Convention de repère (axes et correspondance avec N/S/E/W)

Origine : l'intention ne précise pas le sens des axes (x, y) ni la correspondance entre une orientation cardinale et le déplacement de coordonnées qu'elle produit.
Exigences concernées : EX-03, EX-07, EX-09.
Conséquences : sans cette précision, les scénarios de déplacement ne peuvent pas indiquer de résultat observable exact.
Décision attendue du Product Owner : confirmer (ou corriger) la convention proposée en Conception (x croissant vers l'est, y croissant vers le nord).
Statut : ouverte.

## Questions ouvertes

- **Gestion des bords de carte** (arrêt, erreur, wrap-around ?) — reprise de l'intention, reste ouverte. Voir EX-09. Bloquante pour le passage à la phase Build : le comportement en bord de carte ne peut pas être implémenté ni testé tant qu'elle n'est pas tranchée.
- **Langage/technologie imposé ou délai particulier ?** — reprise de l'intention, reste ouverte. Bloquante pour le passage à la phase Build : le choix technique conditionne la mise en œuvre.
- **Format exact de la valeur retournée (structure de l'objet/tuple) ?** — reprise de l'intention, reste ouverte. Voir EX-08. Bloquante pour le passage à la phase Build : l'interface consommée par le système appelant ne peut pas être implémentée ni testée tant qu'elle n'est pas tranchée.

## Contexte de génération

### Demande initiale

Commande `/spec intent/mars-rover/intent.md`

### Skills utilisées

| Chemin | Commit Git de la version utilisée |
| --- | --- |
| .claude/skills/spec/SKILL.md | c0b6177f2e575cd24736033fca5bc6b28df46793 |

### Révisions

Aucune révision à ce jour.
