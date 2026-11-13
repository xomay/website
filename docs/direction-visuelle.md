# Direction du portfolio — reprise du 12 novembre 2026

## Demande exprimée

- L’arrivée sur la page met au premier plan un véritable modèle humain en trois dimensions représentant Mathys, sans exigence de réalisme ou de fidélité précise.
- Son apparence est opaque au repos ; le survol révèle les organes vitaux.
- Le survol des organes déclenche une animation et permet de découvrir les projets associés.
- L’apparence des organes doit rendre leur caractère interactif perceptible avant le survol.
- Le design est très graphique, moderne, sobre et scientifique, avec une inspiration médicale et une touche de jeu.
- La palette est claire, dominée par le blanc avec un accent bleu.
- Une topbar simplifiée reste accessible et mène notamment aux projets et au contact.
- Les sections projets et contact sont accessibles en défilant sous le personnage.
- Référence fournie par l’auteur : https://humantaste.dev/templates/rifqieh-portfolio
- Lien de démonstration précisé par l’auteur : https://humantaste.dev/library/rifqieh-portfolio/demo/portfolio-home

## Décisions validées

- Personnage beaucoup plus grand et principal, cadré de la tête au bassin, centré dans l’accueil ; nom et courte présentation autour.
- Personnage virtuel stylisé inspiré de la capture fournie : volumes doux et travaillés, visage expressif et proportions classiques. La référence précise le style de modélisation du personnage.
- Personnage opaque au repos, organes révélés au survol, éclairage doux et fond blanc légèrement nuancé. Le bleu structure l’identité visuelle ; le personnage peut comporter d’autres couleurs et les organes ont des couleurs proches du réel.
- Le personnage effectue une légère rotation de gauche à droite suivant la position de la souris.
- Au survol, un organe s’illumine, une courte animation accompagne le retour visuel et une carte présente les projets associés. Des repères bleus rendent les interactions perceptibles au repos.
- La carte de projet est fixe, apparaît au survol d’un organe et permet de rejoindre le projet en cliquant sur la carte. Elle reste ouverte pendant le passage vers la carte et tant que le pointeur reste sur l’organe ou la carte, avec un court délai de fermeture.
- Le clic sur la carte rejoint le projet dans la page.
- Sur téléphone, un toucher donne accès à la carte.
- Les organes sans projet affichent leur nom, l’intérêt de recherche correspondant et « Aucun projet publié pour le moment ».
- La plaquette de notes remplace la valisette. Elle est tenue dans la main droite du personnage et donne accès aux autres projets. Son design actuel est validé.
- Les projets sous le personnage sont présentés sous forme de cartes graphiques avec aperçu et résumé, puis détails dépliables dans la page. L’arrivée depuis l’avatar met brièvement en évidence le projet ciblé.

## Première étape de réalisation

L’auteur demande de concentrer le début du développement sur le personnage 3D et l’accueil visible au lancement, afin de valider la direction artistique et le style global.

Cette étape comprend le personnage cadré au bassin, les organes révélés au survol, la plaquette tenue dans la main droite, la composition de l’accueil, la topbar, la rotation légère suivant la souris et les réactions au survol. Le rendu est évalué dans une scène 3D fonctionnelle avant le développement complet des sections inférieures.

## Références visuelles fournies

- Photo du 12 novembre 2026 : position d’une plaquette de notes tenue dans une main à côté du torse.
- Capture du portfolio Rifqieh du 12 novembre 2026 : style de personnage virtuel 3D, volumes doux, visage et cheveux travaillés. La palette du portfolio reste blanche avec accent bleu et couleurs anatomiques.

## Évolution demandée le 13 novembre 2026

- Renforcer le style cartoon vers la référence Rifqieh et inspirer le personnage du portrait fourni par Mathys, notamment ses cheveux bruns courts ondulés, son visage souriant et sa légère pilosité faciale.
- Afficher le haut du corps jusqu’au bassin, avec une taille à l’écran nettement plus importante.
- Révélation globale des organes dès le survol du personnage, validée après comparaison de complexité avec le disque local. Carte fixe cliquable.
- Tenue validée : polo bleu marine inspiré du portrait, cheveux bruns courts ondulés, légère barbe et visage souriant cartoon.
- Le travail courant porte uniquement sur le personnage, son cadrage et ses interactions. La mise en page actuelle de l’accueil est conservée ; sa refonte est reportée.
- Le maintien de la carte pendant le passage du pointeur vers elle est validé.
- L’auteur autorise à changer de technologie ou de méthode si nécessaire pour la réalisation du personnage.

- L’amplitude de rotation gauche-droite est augmentée à la demande de l’auteur. Le changement de méthode vers une séquence précalculée est autorisé si elle améliore le rendu ou le poids ; cette version conserve une scène 3D à organes distincts.

## Référence figurine et animation du regard

- L’auteur a choisi le personnage B de la planche comparative, au style figurine aux volumes doux et matières mates.
- Le visage est rasé et les iris gris-vert restent discrets.
- Pour la suite, le regard suit la souris par un déplacement léger des yeux. La pose du personnage devient fixe.
- L’auteur demande un torse légèrement plus grand et une plaquette décalée vers l’extérieur dans sa main droite pour dégager les organes du thorax.
- La référence révisée est validée par l’auteur et conservée dans `references/personnage-valide.png`. La pose est fixe et le mouvement souhaité concerne les yeux.

## Livrable du personnage et du regard

Le personnage détouré est intégré à l’accueil sous forme de PNG transparent. Les deux iris gris-vert sont dessinés sur des calques séparés et leur mouvement suit la souris avec lissage, bornes de déplacement et retour au centre. La préférence de réduction des mouvements désactive ce suivi. La révélation des organes sur cette nouvelle image appartient à l’étape suivante.

## Révélation anatomique sur la figurine validée

La révélation du cerveau, des poumons et du cœur est intégrée au survol de la silhouette et à la sélection des contrôles. Les calques anatomiques sont alignés sur le personnage fixe et les zones correspondantes donnent accès aux cartes. Le passage vers une carte conserve son affichage ; la carte de la plaquette ouvre Flower plus bas dans la page. Sur téléphone, le toucher permet de sélectionner une zone et un bouton ferme la carte. Les organes médicaux affichent leur intérêt de recherche et leur état sans projet publié. Le suivi du regard validé reste actif.

## Intégration volumétrique des organes

L’état anatomique utilise désormais une représentation complète du personnage avec une enveloppe bleutée translucide. Les contours de la tête, les épaules, le col et les reflets de surface conservent le volume extérieur ; le cerveau, les poumons et le cœur sont rendus à l’intérieur de cette enveloppe. Une transition entre les deux états remplace les ouvertures circulaires et les organes superposés. Les zones de sélection du thorax sont recalées sur ce rendu. Les parcours de survol, de passage vers les cartes, de navigation vers Flower et de toucher mobile ont été vérifiés dans Chromium.

## Simplification du rendu anatomique

À la demande de l’auteur, l’état anatomique adopte une transparence douce et mate, les couleurs naturelles du personnage et des organes, des contours discrets et un éclairage diffus. Les repères de la page sont atténués pour une présentation plus épurée.

## État de survol validé inspiré de la 3D

L’auteur a validé une silhouette très légère aux contours bleutés, avec traits du visage et vêtements estompés, cerveau et poumons rose doux et cœur corail visibles à l’intérieur. Ce rendu remplace l’état anatomique mat précédent. La plaquette conserve son bleu opaque, la main devient discrètement translucide et les iris animés sont estompés pendant la révélation. Les interactions sur les trois organes et la plaquette restent accessibles au clavier et au toucher.

## Indices d’interaction au survol

Les organes et la plaquette survolés gagnent en contraste et en couleur, avec un agrandissement discret et un repère bleu. Un curseur circulaire apparaît sur la silhouette et les cartes ; il affiche un signe « + » sur les zones sélectionnables. Le curseur standard revient en dehors de l’exploration et aucun curseur personnalisé n’est affiché au toucher. La préférence de réduction des mouvements conserve la mise en évidence sans agrandissement animé. Les quatre zones, le passage vers la carte et le comportement tactile ont été vérifiés dans Chromium.

Le survol est simplifié à la demande de l’auteur : éclairage renforcé et léger grossissement de la zone concernée, avec un curseur « + ». Les contours, halos et fonds de sélection ajoutés autour des organes sont retirés.

Le dernier choix de l’auteur conserve uniquement le contour bleu et le léger grossissement de la zone sélectionnée. L’éclairage renforcé est supprimé. Le curseur redevient le cercle bleu avec un « + » sur les zones interactives.

Les états normal et anatomique partagent désormais le contour alpha exact du portrait validé. Le rendu anatomique est recalé au chargement sur cette silhouette commune, avec prolongement local des couleurs aux bords pour éviter le décalage du bras et du torse pendant la transition. L’égalité des contours et les interactions ont été vérifiées dans Chromium.

## Correction du grossissement local

Le survol conserve uniquement un grossissement discret de 2,5 %, sans contour ni éclairage ajouté, et le curseur circulaire avec « + ». L'ancienne copie agrandie avec découpes est supprimée : elle dédoublait les bords et coupait les doigts autour de la plaquette. Une déformation locale continue agit désormais directement sur l'unique toile anatomique, avec raccord progressif à l'image et interpolation des couleurs tenant compte de la transparence. Les doigts suivent la plaquette, le cœur est protégé pendant le grossissement des poumons et la silhouette alpha reste inchangée. Chaque image est calculée à partir de l'original pour garantir le retour exact, y compris lors de changements rapides de zone. La préférence de réduction des mouvements désactive ce grossissement.

## Animations discrètes du personnage

Le personnage opaque cligne des yeux à intervalles irréguliers, parfois deux fois, et incline occasionnellement la tête de moins d’un degré autour du cou. Les yeux accompagnent cette inclinaison et continuent de suivre le pointeur ; le torse et la plaquette restent fixes. Ces animations restent actives lorsque le visiteur déplace la souris ailleurs sur la page. Dès que l’état translucide apparaît, elles s’arrêtent et retrouvent la pose neutre. Elles sont également suspendues hors écran, dans un onglet masqué et lorsque la réduction des mouvements est demandée. Les calques de tête sont préparés à partir du portrait existant, sans téléchargement d’images supplémentaires.
