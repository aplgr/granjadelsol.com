# AGENTS.md

## Repository scope

This repository contains the public website for **Granja del Sol**.

The `main` branch is production. Changes merged into `main` may become publicly visible on `https://granjadelsol.com` through GitHub Pages.

## Branching and release rules

- **Never commit directly to `main`.**
- Create or use a dedicated development / feature branch for every change.
- Commit work only to that branch while content, layout, copy, assets, or behavior are still being developed or reviewed.
- Use pull requests to bring completed work toward `main`.
- Do **not** merge a pull request into `main` merely because the implementation is functional.
- A merge into `main` is an explicit release decision and should happen only when the change is considered a real release candidate and has been reviewed as appropriate.
- Experimental, draft, incomplete, placeholder, or discussion-stage content must remain outside `main`.

## Development workflow

1. Start from the current `main` branch unless another base branch was explicitly requested.
2. Create a clearly named working branch, for example `dev/...`, `feature/...`, `fix/...`, or `content/...`.
3. Make and review changes on that branch.
4. Open a pull request when the work is ready for review or when a PR is useful as a review workspace.
5. Keep iterating on the branch / pull request until the change is explicitly approved for release.
6. Merge to `main` only after an explicit release decision.

## Content and implementation principles

- Preserve the existing multilingual structure (`/de/`, `/en/`, `/es/`, `/pt/`) unless a task explicitly changes it.
- Keep factual statements about the property distinct from illustrative concepts, possible future uses, or unverified development ideas.
- Clearly label illustrative floor plans, land-use concepts, parceling examples, or similar visuals as non-binding concepts where appropriate.
- Do not present conceptual layouts as approved construction plans, permits, profitability guarantees, or confirmed legal development rights.
- Prefer incremental changes that fit the existing website style over unnecessary redesigns or added complexity.
