# Publication sur GitHub Pages

Le site se trouve dans `prototype` et doit être compilé avec Vite avant publication.
La branche `gh-pages` contient uniquement le contenu compilé de `prototype/dist`
et un fichier `.nojekyll`. Le code source reste sur `master`.

Dans les paramètres du dépôt, ouvrir **Settings → Pages → Build and deployment**
et choisir **Deploy from a branch**, puis la branche **gh-pages** et le dossier
**/ (root)**. Ce mode ne permet de sélectionner que la racine ou `docs`, pas un
dossier arbitraire comme `prototype`.

Le site est publié à `https://xomay.github.io/website/`. Après une modification,
compiler avec `npm run build -- --base=/website/` depuis `prototype`, puis publier
le contenu de `prototype/dist` à la racine de `gh-pages`, avec `.nojekyll`.
Un push de code source sur `master` ne met pas à jour cette branche automatiquement.

Le workflow `.github/workflows/deploy-pages.yml` constitue une alternative manuelle
qui construit et déploie le site depuis les sources. Lors du premier essai,
GitHub a refusé de démarrer le job à cause d’un problème de facturation du compte.
Pour utiliser ce workflow après résolution, sélectionner **GitHub Actions** comme
source dans Pages, puis **Actions → Deploy portfolio to GitHub Pages → Run workflow**.
Il déduit alors le chemin public de la configuration Pages. Le serveur de
développement local reste inchangé dans les deux modes.

Pour vérifier localement la compilation avec le chemin du dépôt :

```sh
cd prototype
npm ci
npm run build -- --base=/website/
npx vite preview --host 127.0.0.1 --port 4176
```

Puis ouvrir `http://127.0.0.1:4176/website/`.
