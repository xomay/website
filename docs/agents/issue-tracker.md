# Issue tracker: GitHub

Issues and specs live at https://github.com/xomay/website/issues.
Use the `gh` CLI from this repository.

## Conventions

- Verify the target with `gh repo view --json nameWithOwner`.
  It must be `xomay/website`.
- Create: `gh issue create --title "..." --body-file <path>`.
- Read: `gh issue view <number> --json number,title,body,labels,comments`.
- List: `gh issue list --state open`.
- Comment: `gh issue comment <number> --body-file <path>`.
- Labels: `gh issue edit <number> --add-label "..."` or
  `--remove-label "..."`.
- Close: post an explanation, then run `gh issue close <number>`.

Use GitHub sub-issues for parent-child relationships and native
issue dependencies for blockers. If unavailable, record
`Part of #<parent>` and `Blocked by: #<number>` in the issue body.
A ticket is unblocked when all its blockers are closed.

## Skill operations

“Publish to the issue tracker” means create a GitHub issue.
“Fetch the relevant ticket” means read the referenced GitHub issue.

## Pull requests as a triage surface

PRs as a request surface: no.

## Wayfinding operations

- Map: one issue labelled `wayfinder:map`, containing Notes,
  Decisions-so-far, and Fog.
- Children: sub-issues labelled `wayfinder:<type>`, where type is
  research, prototype, grilling, or task.
- Frontier: open, unblocked, unassigned children, in map order.
- Claim: assign the issue to the driving developer before work.
- Resolve: comment with the answer, close the child, and append
  a summary and link to the map's Decisions-so-far.
