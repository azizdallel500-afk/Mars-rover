# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This repository has no implementation yet. It currently contains only the Intent and Spec artifacts for a single feature (`mars-rover-simulator`); the Build phase (actual source code, build tooling, tests) has not started. There are no build, lint, or test commands to run until that phase begins.

Read `intent/mars-rover-simulator/spec.md` (and its referenced `intent.md`) before writing any code — it is the accepted source of truth for requirements (EX-01…EX-09), design decisions (wrap-around at map edges, coordinate convention, obstacle symbol mapping, the `"<x> <y> <direction>"` return format), and open questions. Do not re-derive or re-negotiate decisions already marked "Accepté" / "résolue" in that file.

All process documents (`intent.md`, `spec.md`) are written in French; match that language when editing them.

## Workflow: Intent → Spec → Build

This repo follows a staged process, each stage gated by human (Product Owner) approval via a PR merge to `main`, implemented as custom skills under `.claude/skills/`:

1. **Intent** (`.claude/skills/intent/SKILL.md`, invoked as `/intent`): turns a raw idea into a structured `intent/<slug>/intent.md` (Problème, Résultat proposé, Utilisateurs et systèmes concernés, Contraintes, Questions ouvertes). One question at a time to the author; no product decisions or technical solutions invented on their behalf. Requires explicit draft validation before writing the file, and confirmation before commit/push/PR. A branch named `claude/intent-<slug>` is created for this phase.
2. **Spec** (`.claude/skills/spec/SKILL.md`, invoked as `/spec <path-to-intent.md>`): once an intent is accepted on `main`, writes `spec.md` next to it — stable-ID requirements (`EX-NN`) each with a scenario (situation, action, expected result), a "Conception proposée" section distinguishing accepted choices from proposals, and a "Réserves" section for ambiguities that block precise scenarios. Every open question from the intent must be carried forward and explicitly tracked as answered/still-open. Decisions from the Product Owner are recorded with author, date, and justification — never fabricated. No code or implementation plan is written at this stage.
3. **Build** (not yet defined in this repo): implementation, including the technology choice, is deferred to this phase per the spec's open questions.

Key invariants across both existing skills, worth preserving if you operate as either:
- Never decide on the author's/Product Owner's behalf; unresolved points go into "Questions ouvertes" rather than being assumed.
- Never commit, push, or open a PR without explicit human confirmation at the point the skill specifies.
- A skill never merges its own PR — merging (acceptance) is a human/Product Owner action.
- When revising an existing `intent.md`/`spec.md`, preserve prior recorded decisions; only the points the revision request calls out get reopened.
- `spec.md`'s "Contexte de génération" section records the exact invoking prompt and the git commit of each skill version used — keep this trail accurate on every revision.

## Branching

Each phase's work happens on its own branch (`claude/intent-<slug>` for Intent; a Design-phase branch created from the latest `main` for Spec), never directly on `main`. If already on a working branch that contains the accepted prior-phase artifact, continue on it instead of branching again.
