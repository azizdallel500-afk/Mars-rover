# Instructions de review

## Passes

Fais trois passes sur le changement et indique la passe de chaque constat.

- Bugs : erreurs de logique, cas limites cassés, régressions discrètes.
- Sécurité : entrée non validée, secret dans un fichier versionné, donnée
  sensible affichée.
- Conformité : le changement respecte intent/mars-rover/spec.md,
  intent/mars-rover/plan.md et les règles de la skill clean-code.

## Ce que veut dire Important

Réserve Important aux constats qui cassent un comportement, exposent une
donnée ou enfreignent une règle. Le style et le nommage sont des remarques
mineures.

## Limite les remarques mineures

Signale au plus cinq remarques mineures par review et résume les autres par
leur nombre.

## Ne signale pas

Ce que make test vérifie déjà, les fichiers produits par un outil et le style
du code que le changement ne touche pas.
