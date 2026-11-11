# Mathys Dubois — portfolio

La page anglaise est un document HTML statique. Depuis ce dossier, lancer `npm run dev` (Node.js et Python 3), puis ouvrir http://127.0.0.1:4173. Le dossier `site` est directement servi, sans compilation.

Le profil et le catalogue anglais sont dans `site/index.html`. Chaque entrée du catalogue porte un identifiant stable (`data-project`), un classement (`data-category`), le statut connu (`data-status`) et un lien vers sa fiche. Pour Flower, `undocumented` signifie que le statut du projet collectif reste à confirmer. La fiche publiée se trouve dans `site/projects/flower/index.html` et contient le récit, le schéma et les liens publics.

L’Avatar anatomique reprend les entrées du catalogue anglais. La Valisette sélectionne les projets `non-medical`. Un projet `medical` peut déclarer plusieurs associations, par exemple `data-organs="brain lungs"`. Les boutons, l’instruction, le message vide et l’action de fermeture sont traduisibles dans le HTML. Le panneau lit son titre sur le bouton sélectionné.

Pour ajouter une langue, créer un document localisé avec le même identifiant de projet, les mêmes clés d’organes, les mêmes feuilles de style et les mêmes ressources, dont le CV français. La silhouette, les liens du catalogue et le profil restent disponibles sans JavaScript.

## Vérification

Avec Node.js 22, Python 3 et les bibliothèques système requises par Chromium :

    npm ci
    npx playwright install chromium --only-shell
    npm run typecheck
    npm test

Playwright lance le serveur local et teste deux tailles d’écran. Le test de téléchargement compare le fichier reçu au PDF validé par Mathys. En cas de remplacement intentionnel du CV, recalculer l’empreinte du nouveau document et actualiser le test.

La miniature provient du CV fourni. La silhouette a été créée avec l’outil ImageGen intégré et est servie localement en WebP. Les polices Instrument Serif et DM Sans sont servies localement avec leurs licences OFL.

<details>
<summary>Consigne de génération de la silhouette</summary>

Use case: scientific-educational. Create a single restrained atlas illustration for a designer’s anatomical portfolio navigator. Full-length slender young male engineering student, short softly wavy hair, relaxed three-quarter pose. A translucent pale sage outer silhouette reveals only a clearly recognizable folded brain, two muted lavender-grey lungs and a small terracotta anatomical heart between them. He holds a closed dark moss-green rectangular briefcase with handle, set away from the leg. Understated archival ink contours and watercolor washes, simplified face and anatomy, discreet clothing contours and shoes. Gentle paper-white background, portrait composition, centered, complete body visible from head to feet. No labels, lettering, leader lines, border, grid or other objects.

</details>
