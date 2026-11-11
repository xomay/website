# Mathys Dubois — portfolio

La page anglaise est un document HTML statique. Depuis ce dossier, lancer `npm run dev` (Node.js et Python 3), puis ouvrir http://127.0.0.1:4173. Le dossier `site` est directement servi, sans compilation.

Le profil et le catalogue anglais sont dans `site/index.html`. Chaque entrée du catalogue porte un identifiant stable (`data-project`), un classement (`data-category`), le statut connu (`data-status`) et un lien vers sa fiche. Pour Flower, `undocumented` signifie que le statut du projet collectif reste à confirmer. La fiche publiée se trouve dans `site/projects/flower/index.html` et contient le récit, le schéma et les liens publics. Toute entrée vers Flower, y compris depuis la future Valisette, peut pointer vers cette même URL.

Pour ajouter une langue, créer un document localisé avec le même identifiant de projet, les mêmes feuilles de style et les mêmes ressources, dont le CV français. Les documents et leurs liens fonctionnent sans JavaScript.

## Vérification

Avec Node.js 22, Python 3 et les bibliothèques système requises par Chromium :

    npm ci
    npx playwright install chromium --only-shell
    npm run typecheck
    npm test

Playwright lance le serveur local et teste deux tailles d’écran. Le test de téléchargement compare le fichier reçu au PDF validé par Mathys. En cas de remplacement intentionnel du CV, recalculer l’empreinte du nouveau document et actualiser le test.

La miniature provient du CV fourni. L’illustration du cerveau provient de la [planche 726 de Gray’s Anatomy](https://commons.wikimedia.org/wiki/File:Gray726.png), dans le domaine public. Les polices Instrument Serif et DM Sans sont servies localement avec leurs licences OFL.
