# Portfolio de Mathys Dubois — avatar anatomique interactif

## Problem Statement

Mathys Dubois, étudiant ingénieur en informatique spécialisé en IA à l’INSA Rennes (2022–2027), souhaite présenter son parcours à des responsables de recherche et recruteurs en IA appliquée à la santé. Il recherche un stage de fin d’études de six mois à partir du 15 février 2027, avec une mobilité géographique en France, et envisage ensuite une thèse.

Son CV présente son expérience, mais ne permet pas une exploration interactive de ses travaux ni de développer sa contribution à chaque projet. Il souhaite un portfolio personnel distinctif, sobre et léger, capable de montrer dès aujourd’hui son expérience réelle et d’accueillir ses futurs projets médicaux. Aucun projet médical n’est actuellement commencé : une idée de classification de radiographies pour la pneumonie ne doit pas être présentée comme une réalisation.

Le visiteur doit pouvoir comprendre rapidement le profil et la disponibilité de Mathys, consulter son travail et le contacter, sans devoir manipuler une scène 3D.

## Solution

Créer un portfolio statique bilingue, en anglais par défaut et consultable en français. L’accueil associe le profil de Mathys à un **Avatar anatomique** stylisé, avec une enveloppe translucide, un cerveau, un cœur, des poumons et une **Valisette**.

La sélection d’un organe ouvre un panneau présentant les projets médicaux associés. Au lancement, ces panneaux indiquent qu’aucun projet n’est disponible. La Valisette donne accès aux projets sans lien avec la médecine : seul Flower, l’ERP/CRM de Ouest INSA, est publié dans cette première version. Une vue **Tous les projets** donne accès au même contenu sans explorer l’avatar. Chaque réalisation possède une **Fiche projet** partageable.

Le profil, la recherche de stage, les coordonnées et le contenu sont utilisables pendant le chargement de la 3D. Une silhouette statique est disponible pendant ce chargement et si le rendu 3D échoue. L’expérience reste adaptée au mobile, au clavier et aux préférences de réduction des mouvements.

## User Stories

Les intitulés français entre guillemets reprennent le vocabulaire du glossaire ; les libellés visibles sont traduits selon la langue sélectionnée.

1. As a recruiter, I want to identify Mathys Dubois and his engineering and AI background immediately, so that I can understand whose portfolio I am visiting.
2. As a research supervisor, I want to understand his interest in applied AI for health, so that I can assess the relevance of his profile to my team.
3. As a recruiter, I want to see that he is seeking a six-month internship starting on 15 February 2027, so that I can compare his availability with my needs.
4. As a recruiter, I want to see his geographical mobility across France, so that I do not assume his search is restricted to Rennes.
5. As a research supervisor, I want to distinguish his current internship search from his possible future PhD plans, so that I can understand his immediate objective.
6. As an international visitor, I want the initial site experience to be in English, so that I can read the portfolio without first changing its language.
7. As a French-speaking visitor, I want a visible French-language option, so that I can read the portfolio in French.
8. As a visitor, I want navigation, project descriptions, empty states and interaction instructions to use the selected language, so that the experience remains coherent.
9. As a visitor, I want changing language to preserve the project or panel I am viewing, so that I can continue reading without finding it again.
10. As a visitor, I want to see a personal, stylized "Avatar anatomique", so that I can understand the relationship between the portfolio and its author's interests.
11. As a visitor, I want the brain, heart and lungs to be recognizable through the translucent silhouette, so that I can identify the available anatomical navigation areas.
12. As a visitor, I want an initial three-quarter view, so that I can discover the organs and the "Valisette" together.
13. As a visitor, I want limited rotation and a small amount of zoom, so that I can explore the avatar while keeping its navigation understandable.
14. As a visitor, I want a reset control, so that I can return to the initial view after manipulating the avatar.
15. As a visitor, I want subtle feedback when I hover over or select an interactive area, so that I can understand what I am about to open.
16. As a touch-device user, I want to select organs and the "Valisette" without hover, so that I can use the same navigation on my device.
17. As a keyboard user, I want named controls for the organs and the "Valisette", so that I can access their content without interacting with a canvas.
18. As a visitor, I want selecting an organ to open its project panel, so that I can discover work associated with that organ.
19. As a visitor, I want an organ without projects to display a clear, localized empty state, so that I understand that no work has been published there yet.
20. As a visitor, I want organs without projects to remain visible but visually discreet, so that I can understand the concept without mistaking them for completed work.
21. As a visitor, I want to close or leave a panel and return to exploration, so that selecting an area does not trap me in that view.
22. As a visitor, I want selecting the "Valisette" to show the non-medical projects, so that I can discover Mathys's existing engineering work.
23. As a visitor in a hurry, I want a visible "Tous les projets" entry, so that I can consult the work without exploring the avatar.
24. As a visitor, I want the "Valisette" and "Tous les projets" to lead to the same Flower project, so that I encounter consistent information through either route.
25. As a visitor, I want to open Flower's "Fiche projet", so that I can read more than a short project summary.
26. As a visitor, I want to open or refresh a direct link to the "Fiche projet", so that I can share it and return to it reliably.
27. As a recruiter, I want to understand the problem Flower addresses and the people it serves, so that I can evaluate the purpose of the work.
28. As a recruiter, I want Mathys's personal contributions to be distinguished from the team's work, so that I can assess his experience fairly.
29. As a technical reviewer, I want concrete examples of contributions and the technologies used, so that I can understand the engineering involved.
30. As a technical reviewer, I want a functional diagram and a link to Flower's public code, so that I can explore how the project works.
31. As a research supervisor, I want available outcomes and limitations to be described honestly, so that I can assess the evidence without invented performance claims.
32. As a visitor, I want published work to be distinguished from a "Projet en cours" and an "Idée de projet", so that I am not misled about what has actually been implemented.
33. As a visitor, I want to read Mathys's medical research interests without seeing hypothetical projects presented as achievements, so that I understand both his direction and his current experience.
34. As a recruiter, I want to download the supplied CV, so that I can retain a concise summary of his profile.
35. As a recruiter, I want an email contact link, so that I can contact Mathys directly about a suitable opportunity.
36. As a visitor, I want working GitHub and LinkedIn links, so that I can consult his other professional profiles.
37. As a mobile visitor, I want readable content and directly accessible projects, so that I can use the portfolio on a small screen.
38. As a visitor on a slow connection, I want the profile, contact links and projects before the 3D finishes loading, so that I can act without waiting for the avatar.
39. As a visitor whose browser cannot render the 3D scene, I want a static silhouette and access to all content, so that the rendering failure does not block my visit.
40. As a visitor who prefers reduced motion, I want optional ambient animation to be reduced or disabled, so that the site respects my preference.
41. As a keyboard or assistive-technology user, I want understandable control labels, visible focus and coherent focus movement, so that I can navigate the site and its panels.
42. As a visitor, I want a restrained, uncluttered visual design, so that the avatar supports rather than obscures the content.
43. As the portfolio owner, I want to maintain projects and their English and French content in repository files, so that I can update the site without an administration service.
44. As the portfolio owner, I want to add real medical work later and associate it with an organ, so that the anatomical navigation can grow with my experience.

## Implementation Decisions

- **Architecture:** static site, with the 3D scene rendered in the browser. No application server, database, authentication or administration interface is required. The frontend framework, rendering library and hosting provider have not been selected; this spec does not lock them in.
- **Boundaries:** separate the portfolio content and translations, the anatomical scene, the project navigation and panels, the project detail presentation, and the profile/contact/CV presentation. These are responsibilities, not a requirement to introduce a particular component architecture.
- **Content model:** keep project identity, translated editorial content, medical/non-medical classification, optional organ associations, lifecycle status and public links explicit. A "Projet en cours" has actually started; an "Idée de projet" has not. Do not infer a project's lifecycle from its Git activity alone.
- **Launch scope:** Flower is the only published project. The other projects and experiences in the CV must not become additional portfolio project cards. The CV itself remains the supplied document.
- **Medical navigation:** include the brain, heart and lungs. With no medical projects at launch, selecting each shows a localized equivalent of “Aucun projet pour le moment”. Do not fabricate future projects or populate those panels with proposed experiments.
- **Avatar:** simplified representation with indicative proportions of 1.75 m and 60 kg, a translucent envelope and simplified organs. Precise facial resemblance, medically accurate modeling and simulation of the author's health are not intended. Use "Avatar anatomique", not a claim of a digital patient twin.
- **Scene controls:** start in a three-quarter view, allow limited rotation and slight zoom, and provide a reset control. Show subtle selection feedback. Named, keyboard-accessible controls provide the same content access as the anatomical areas.
- **Project navigation:** organ selection opens a project panel; selecting a project opens its individual, shareable "Fiche projet". The "Valisette" and "Tous les projets" expose the same canonical non-medical project content. Direct project URLs must also work on initial navigation and refresh with the chosen static host.
- **Language:** English is the default, with a visible French option. Translate all site-owned interface text, empty states, instructions, profile and project descriptions. Keep the current project/panel context on a language change. The supplied French CV does not require an invented English replacement.
- **Visual direction:** slightly off-white background, muted organ colors, restrained typography and subtle motion. Keep organs without projects visually discreet. Ensure foreground text, focus indicators and interaction targets remain usable despite the translucent visual treatment.
- **Responsive and progressive presentation:** prioritize readable content, contacts and direct project access. Load the 3D without blocking these. Display a static silhouette while loading and retain it when rendering is unavailable or fails. Small-screen layouts must not require hover or precise canvas targeting.
- **Accessibility:** all content and essential actions must remain accessible without manipulating the canvas. Use semantic links and controls, visible focus, coherent panel focus behavior and reduced-motion handling. Reduced motion must not prevent deliberate navigation.
- **Profile facts:** Mathys Dubois, INSA Rennes computer engineering and AI specialization, degree period 2022–2027; internship of six months starting 15 February 2027; mobility in France; interest in applied AI for health, including medical imaging, oncology and neuroscience; possible later PhD. Do not imply current medical research experience or completed clinical projects.
- **Public contact:** retain `mathys.dubois@insa-rennes.fr` as a visible contact method and in the CV, with a usable email link. Use GitHub `https://github.com/xomay` and LinkedIn `https://www.linkedin.com/in/mathys-dubois-43a728263/`. Do not add postal coordinates or a telephone contact.
- **CV:** serve the latest site-specific PDF supplied by the owner, preserving its content. The earlier PDF is not the download source. The user explicitly clarified that the INSA email should remain public.
- **Flower positioning:** use the approved description: “Contribution au développement et à la maintenance de Flower, l’ERP/CRM de Ouest INSA : gestion des études et avenants, génération de documents et amélioration des interfaces.” Provide an English equivalent.
- **Flower evidence:** describe it as a collaborative ERP/CRM developed by Ouest INSA's information-systems team, using Vue 3/JavaScript, Python/Django/Django REST Framework and MySQL/MariaDB. Describe two or three concrete contributions supported by the history: study amendments, document/PDF generation, requirements/phases or the intervenant pool. Do not claim sole authorship or unsupported delivery/leadership responsibilities.
- **Flower detail:** cover the problem, approach, personal contribution, available outcomes, limitations and public code. Include a functional diagram based on the verified workflow. Do not invent benchmark figures or expose internal member/client information. Screenshots can be added later when suitable examples are available; they are not a launch prerequisite.
- **Public repository:** Flower's repository is `https://github.com/xomay/Flower`, verified public on 11 November 2026. Link to it from its "Fiche projet".
- **Maintenance:** project content and translations remain editable in the repository. The organ-to-project relationship must accommodate later medical projects without duplicating their descriptions across navigation routes.
- **Hosting:** preserve the static-site constraint. A custom domain is deferred. Registering or selecting a particular hosting provider is not a decision established by the design interview.

## Testing Decisions

- **Approved main seam:** browser-level visitor journeys against the rendered site. The owner explicitly approved this boundary during spec preparation. There is no existing application or test suite to reuse in the repository.
- **Test quality:** assert observable content, navigation, URLs, focus, usable links and recovery behavior. Do not assert private component state, rendering-library internals, exact mesh composition, arbitrary pixel coordinates or animation frames. Avoid tests that merely mirror the implementation.
- **Covered responsibilities:** exercise the scene's public controls and navigation, project panels and detail view, translated content, profile/contact/CV presentation and the progressive fallback together at the browser boundary. Add lower-level tests only if an actual concern cannot be meaningfully verified through this seam.
- **Default-language journey:** open a fresh visit and verify English, the identity/profile, internship availability, direct project access, contact links and CV download affordance.
- **Language journey:** switch to French from the home view and from a project/panel; verify localized text and empty states, unchanged selected context and still-usable links. Check the document language and accessible control names.
- **Anatomical journey:** select the brain, heart and lungs through the visible controls and scene interaction where rendering is available. Verify the correct panel, honest empty state, close/return behavior and absence of fictional medical achievements. Exercise rotation, zoom and reset through their public interactions without inspecting 3D internals.
- **Flower journey:** navigate from the "Valisette" and from "Tous les projets" to the same project. Verify the approved role, evidence-based examples, functional diagram and public code link. Open its shareable URL directly and refresh it on the actual static serving configuration.
- **Contact and CV journey:** verify the exact GitHub and LinkedIn destinations and the email target; follow the CV link and confirm a readable PDF is served rather than an HTML fallback or missing attachment. Confirm it is the latest supplied CV, not the earlier attachment.
- **Keyboard and mobile journey:** complete the meaningful paths without canvas manipulation or hover. Check visible focus, semantic names, panel focus/return behavior and responsive layouts at representative narrow and wide viewport sizes.
- **Reduced-motion journey:** emulate the preference and verify ambient motion is suppressed/reduced while controls and content still work.
- **Failure journey:** delay or block the 3D asset/module or render without WebGL. Verify the static silhouette, direct project access, contact links and CV remain available without an endless loading state. This browser-level failure check is preferred to tests of the renderer's implementation.
- **Visual and performance review:** manually review anatomical recognizability, hierarchy, restrained design, text readability and touch targets. Under a throttled connection, confirm that profile and project navigation are not gated by the 3D. No exact timing, polygon-count or bundle-size target was agreed; do not report such a threshold as an approved requirement.
- **Acceptance:** the journeys above must pass in the supported serving environment before claiming completion. Report any browser or accessibility verification that could not be performed.

## Out of Scope

- Developing the proposed pneumonia or any other medical machine-learning project as part of this portfolio task.
- Publishing medical project ideas as completed or in-progress work.
- Adding the wildlife-monitoring, deep-learning coursework or industrial dashboards as additional portfolio projects in the first version.
- Photorealistic likeness, medical-grade anatomy, health-state simulation, patient data handling or clinical functionality.
- Unrestricted camera movement, large animations or features that undermine the lightweight presentation.
- An application server, database, accounts, administration UI or contact form requiring a backend.
- Invented achievements, impact metrics, testimonials or implied sole authorship of Flower.
- Production screenshots containing internal Ouest INSA member/client data.
- A new English CV or changes to the supplied CV's contact information.
- Choosing or purchasing a custom domain, or committing to a specific hosting provider in this spec.
- Building or publishing the site as part of the `to-spec` operation itself; this operation publishes the implementation specification to the issue tracker.

## Further Notes

- The design synthesis was explicitly confirmed by the owner before this spec request. The final contact clarification overrides the earlier proposal to hide the INSA email.
- The internship year 2027 was explicitly confirmed by the owner; the PDF's original date text alone did not establish that year.
- The latest CV is the site-specific attachment provided on 11 November 2026. It retains the academic email and omits the telephone number. The implementation agent must use that attachment or a verified copy, not reconstruct it from extracted text.
- Flower was inspected locally. Its collaborative nature, technical stack and contribution examples are grounded in the README, configuration, code and Git history. The owner approved the contribution wording; numerical outcomes are not available.
- The repository currently contains configuration and design documentation, no implemented site and no established tests. An interrupted implementation attempt created only empty static-site directories locally; this spec must not treat those as a working prototype or a selected frontend stack.
- The implementation agent should verify any hosting identity left by the interrupted registration attempt before registering anything again. No successful hosting registration or deployment was confirmed in the interrupted turn.
- This issue belongs in `xomay/website` and must carry the `ready-for-agent` label. It is a complete implementation spec and does not require an additional triage pass.
