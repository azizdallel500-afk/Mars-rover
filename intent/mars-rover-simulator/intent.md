# Intent : Simulateur Mars Rover
Auteur : non renseigné.

## Problème
Développer un simulateur Mars Rover dans le cadre d'un exercice technique (kata), destiné à être appelé par un autre système/API plutôt qu'utilisé directement par une personne.

## Résultat proposé
Le simulateur reçoit :
- un point de départ (x, y) et une orientation initiale (N, S, E ou W) ;
- une carte plaçant les obstacles (symboles 🟩/🌳 ou 🟫/🪨) ;
- une liste de commandes.

Il interprète les commandes : le rover peut avancer d'une case ou tourner de 90° à droite ou à gauche. Si un obstacle bloque son avancée, le rover reste immobile sur cette commande.

Le résultat (position et direction finales) est restitué comme une valeur retournée par une fonction/API, consommée par le système appelant.

## Utilisateurs et systèmes concernés
Un autre système ou une API qui invoque le simulateur et consomme la valeur de résultat retournée.

## Contraintes
- Format d'entrée : point (x, y), orientation (N/S/E/W), carte avec obstacles, liste de commandes.
- Commandes possibles : avancer, tourner à droite (90°), tourner à gauche (90°).
- Un obstacle bloque l'avancée : le rover reste immobile sur la commande concernée (pas d'erreur ni d'arrêt du programme).
- La carte peut utiliser deux jeux de symboles pour les obstacles : 🟩/🌳 ou 🟫/🪨.

## Questions ouvertes
- Comment le rover gère-t-il les bords de la carte (arrêt, erreur, wrap-around) ?
- Langage/techno imposé ou délai particulier ?
- Format exact de la valeur retournée (structure de l'objet/tuple) ?
