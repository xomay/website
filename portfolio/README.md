# Mathys Dubois — portfolio

La page anglaise est un document HTML statique. Depuis ce dossier, lancer `npm run dev` (Node.js et Python 3), puis ouvrir http://127.0.0.1:4173. Le dossier `site` est directement servi, sans compilation.

Le contenu anglais est dans `site/index.html`. Pour ajouter une autre langue, créer un document localisé utilisant la même feuille de style et les mêmes ressources, dont le CV français. Le document et les liens essentiels fonctionnent sans JavaScript.

## Vérification

Avec Node.js 22, Python 3 et les bibliothèques système requises par Chromium :

    npm ci
    npx playwright install chromium --only-shell
    npm run typecheck
    npm test

Playwright lance le serveur local et teste deux tailles d’écran. Le test de téléchargement compare le fichier reçu au PDF validé par Mathys. En cas de remplacement intentionnel du CV, recalculer l’empreinte du nouveau document et actualiser le test.

La miniature provient du CV fourni. L’illustration du cerveau provient de la [planche 726 de Gray’s Anatomy](https://commons.wikimedia.org/wiki/File:Gray726.png), dans le domaine public. Les polices Instrument Serif et DM Sans sont servies localement avec leurs licences OFL.
