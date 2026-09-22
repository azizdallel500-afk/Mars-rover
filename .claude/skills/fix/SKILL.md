---
name: fix
description: >-
  Corrige un défaut sous protection des tests, en commençant par le test qui
  le reproduit lorsque le défaut relève du périmètre de la suite. À utiliser
  pour un comportement signalé comme pour un constat de review.
disable-model-invocation: true
---

# Corriger sous protection des tests

## Quand utiliser cette skill

Utilise cette skill dès qu'une correction du code est demandée, qu'elle vienne d'un comportement signalé ou d'un constat de review.

## Par où commencer

Détermine d'abord si le défaut est un comportement du programme que la suite de tests a vocation à vérifier. La question n'est pas de savoir si elle le couvre aujourd'hui, mais si ce comportement relève de son périmètre, celui que `make test` exécute.

- Si oui, commence par son test de reproduction, étapes 1 à 4.
- Si non, dis pourquoi et passe à l'étape 5.

Annonce ta conclusion avant d'agir.

## Démarche

1. Rejoue le comportement signalé et montre la sortie obtenue. Lance `make test` et montre la sienne. Dis si la suite couvre ce comportement et sur quelle exigence de `spec.md` il repose.
2. Écris le test qui reproduit ce comportement, à sa place dans la suite existante. Lance-le et montre son échec. Dis ce qu'il attend et d'où vient cette attente dans `spec.md`. Ne corrige pas le code. Arrête-toi et demande la confirmation que l'échec vient de la cause attendue.
3. Commit ce seul test. Ne modifie pas le code.
4. Arrête-toi. Demande l'autorisation de corriger.
5. Lance `make fix-start` pour protéger les fichiers de tests.
6. Corrige le code sans modifier les tests. Lance `make test` et `make run`. Montre leurs sorties et le diff de la correction.
7. Arrête-toi. Demande si la correction est acceptée. Dis que l'acceptation ferme le mode correction, enregistre le changement et pousse la branche.
8. Lance `make fix-end` une fois la correction acceptée.
9. Cherche si ce défaut répète une erreur déjà corrigée dans ce projet. Regarde la section des erreurs récurrentes de `CLAUDE.md` et l'historique Git des fichiers que tu viens de modifier. Dis ce que tu as cherché et ce que tu as trouvé.
10. Si c'est une répétition, propose la règle qui l'évite et attends sa validation avant de l'ajouter dans cette section.
11. Commit la correction acceptée et push la branche courante.

## Règles

- Ne modifie jamais un test pour le faire passer, n'en supprime aucun et n'en ignore aucun.
- N'écris jamais le test après le correctif. Un test rédigé en connaissant la solution ne prouve rien.
- Ne saute aucun arrêt, même si la correction te paraît évidente.
- N'ouvre pas de pull request.
