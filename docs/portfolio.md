# Cadrage du portfolio de Mathys Dubois

Décisions validées pendant l’entretien de conception. L’auteur a confirmé la synthèse finale avant de demander sa transformation en spécification.

## Objectif et public

- Présenter un étudiant en fin d’études d’ingénieur informatique et IA à l’INSA Rennes.
- Viser en priorité les responsables de recherche et recruteurs en IA appliquée à la santé.
- Soutenir la recherche actuelle de stage et une éventuelle candidature en thèse à l’avenir.
- Stage de fin d’études de six mois à partir du 15 février 2027 ; mobilité géographique en France.
- Présenter uniquement des réalisations réelles et identifier explicitement les projets en cours.
- Aucun projet médical n’est actuellement commencé. La classification de radiographies pour la pneumonie est une idée, pas une réalisation.

## Langues

- Anglais par défaut ; version française accessible par un sélecteur de langue.

## Présentation et navigation

- Avatar anatomique stylisé représentant l’auteur, aux proportions indicatives de 1,75 m et 60 kg, sans recherche de ressemblance précise du visage.
- Enveloppe translucide et organes simplifiés ; fond clair légèrement cassé, couleurs douces, typographie sobre et mouvements subtils.
- Les organes donnent accès aux projets médicaux associés ; la valisette donne accès aux projets sans lien avec la médecine.
- Les principaux organes restent visibles. Ceux sans projet sont discrets et indiquent « Aucun projet pour le moment » à la sélection.
- Organes retenus pour la première version : cerveau, cœur et poumons.
- La sélection d’un organe ouvre un panneau de projets ; chaque projet dispose ensuite d’une page partageable.
- Une vue « Tous les projets » donne accès au même contenu sans exploration de l’avatar.
- Vue initiale de trois quarts, rotation limitée, léger zoom et bouton de retour à la vue initiale ; boutons portant les noms des organes.
- Sur mobile, accès direct aux projets et présentation adaptée ; alternative statique à la 3D si nécessaire.
- Navigation accessible au clavier, sans dépendance au survol ; respect de la préférence de réduction des mouvements.
- Le profil, les liens et les projets sont consultables pendant le chargement de l’avatar. Une silhouette statique est affichée pendant ce chargement et conservée si la 3D échoue.

## Contenu prévu

- Profil, recherche de stage, projets existants, CV et liens de contact.
- Un seul projet au lancement : l’ERP Ouest INSA. Le dépôt local `Flower` sert de source pour documenter ce projet.
- Les autres projets cités dans le CV ne sont pas présentés dans le portfolio pour le moment.
- Une fiche projet présente le problème, les données, la méthode, la contribution personnelle, les résultats, les limites et le code lorsque ces éléments sont disponibles.
- Les idées de projets restent distinctes des réalisations et des projets effectivement commencés.
- Les idées médicales ne sont pas publiées parmi les projets ; les intérêts pour l’imagerie médicale, l’oncologie et les neurosciences sont présentés dans le profil.
- Liens publics : GitHub `https://github.com/xomay` et LinkedIn `https://www.linkedin.com/in/mathys-dubois-43a728263/`.
- L’adresse électronique INSA `mathys.dubois@insa-rennes.fr` est conservée comme moyen de contact public et dans le PDF téléchargeable, conformément à la clarification finale de l’auteur. Ne pas afficher de coordonnées postales ni de restriction de mobilité à Rennes.
- Le PDF destiné au téléchargement est celui fourni le 11 novembre 2026 : `/home/xomay/.codex/attachments/036a6a27-bfef-473f-99eb-5fdcedea1318/CV DUBOIS Mathys 2026.pdf`. Conserver ce document sans retirer l’adresse électronique.
- Les projets et leurs traductions sont entretenus dans des fichiers du dépôt, sans interface d’administration pour la première version.

## Réalisation et hébergement

- Site statique : ni serveur applicatif ni base de données. La 3D fonctionne dans le navigateur.
- Le choix du nom de domaine est reporté ; aucun fournisseur d’hébergement n’est encore arrêté.

## Présentation validée de Flower

« Contribution au développement et à la maintenance de Flower, l’ERP/CRM de Ouest INSA : gestion des études et avenants, génération de documents et amélioration des interfaces. »

- Détailler les contributions avec deux ou trois exemples vérifiables dans le code, sans inventer de gains chiffrés.
- Commencer les illustrations par un schéma de fonctionnement. Ajouter des captures ultérieurement, lorsque des exemples montrables seront disponibles.

## Points à préciser

- Choix techniques détaillés et fournisseur d’hébergement à déterminer pendant la réalisation, dans les contraintes validées.

## Sources pour la fiche Flower

Constats issus de la lecture du dépôt local `/home/xomay/Flower`, à distinguer des choix éditoriaux restant à valider :

- Le README décrit Flower comme l’ERP/CRM développé par l’équipe SI de Ouest INSA.
- Stack observée : Vue 3 et JavaScript côté interface ; Python, Django et Django REST Framework côté serveur ; MySQL/MariaDB.
- Fonctions observées : gestion des études, phases, exigences, avenants, intervenants, actions commerciales et génération de documents.
- L’historique attribué à Mathys montre notamment des contributions aux avenants (`60059fd`), à la génération PDF (`440732d`), aux exigences et phases (`fda8be9`, `a289832`) et au vivier d’intervenants (`ddf441d`). Plusieurs auteurs contribuent au projet : ne pas revendiquer une réalisation individuelle de l’ensemble.
- Le dépôt `https://github.com/xomay/Flower` a été vérifié public via les métadonnées GitHub le 11 novembre 2026.
- L’auteur a validé la formulation de contribution et le principe de deux ou trois exemples vérifiables avec un schéma de fonctionnement ; ne pas inventer de mesures de gain. Les captures sont reportées jusqu’à disponibilité d’exemples montrables.
