# Publication sur GitHub Pages

Le site se trouve dans `prototype` et doit être compilé avec Vite avant publication.
Le workflow `.github/workflows/deploy-pages.yml` installe les dépendances, construit
le site et publie uniquement `prototype/dist`.

Dans les paramètres du dépôt, ouvrir **Settings → Pages → Build and deployment**
et choisir **GitHub Actions** comme source. Le choix « Deploy from a branch » ne
permet de sélectionner que la racine ou `docs`, pas un dossier arbitraire.

Le déploiement démarre après un push dans `master` qui modifie le site ou le
workflow. Il peut aussi être lancé depuis **Actions → Deploy portfolio to GitHub
Pages → Run workflow**. Le résultat et l’adresse publiée apparaissent dans ce workflow.

Le chemin public est calculé depuis la configuration Pages du dépôt : `/website/`
pour `https://xomay.github.io/website/`, ou `/` si un domaine personnalisé est configuré.
La configuration du serveur de développement local reste inchangée.

Pour vérifier localement la compilation avec le chemin du dépôt :

```sh
cd prototype
npm ci
npm run build -- --base=/website/
npx vite preview --host 127.0.0.1 --port 4176
```

Puis ouvrir `http://127.0.0.1:4176/website/`.
