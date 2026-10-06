# TMU Course & Student Group Recommender

A web app that helps first-year engineering students at Toronto Metropolitan University (TMU) find two things:

- **A liberal studies elective:** ranked matches from the **121 Table A courses** open to engineering students.
- **A design team or student group:** ranked matches from **53 groups** run through the Faculty of Engineering & Architectural Science (FEAS): 18 design teams, 33 student groups and 2 student government bodies.

Students pick the interests that appeal to them, and the app returns ranked matches. Each match comes with a short explanation of why it was recommended.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Playwright

## Features

**Liberal studies path** (`/liberals`)
- Interest picker with **36 interests**, built from the actual course catalogue
- Ranked results split into "Your Top Matches" and "You Might Also Like"
- Courses that also count toward one of **69 TMU minors** are flagged
- Program restrictions are shown on each course card, with a note when they haven't been confirmed yet
- Browse page listing every eligible course (`/liberals/courses`)

**Student groups path** (`/groups`)
- Optional program selection (9 engineering programs, Architectural Science or undeclared)
- Interest picker with **33 interests** in two sections: "What you'd build" and "How you'd spend time"
- Your program's course union is shown separately from the interest-based matches
- A warning appears when a group's listed contact info may be out of date
- General workshop suggestions (CAD, 3D printing, leadership)

## How matching works

Both paths use one scoring engine ([`lib/matching.ts`](lib/matching.ts)). Each dataset converts its records to a common `Recommendable` shape before scoring.

- **Coverage score:** an item scores higher the more of the student's selected interests it matches. A minimum score ensures a single-interest match still shows up meaningfully.
- **Specificity penalty:** items tagged with many interests lose a small amount of score, capped so it can never cancel out a real match.
- **Deterministic tie-breaking:** ties are broken with an FNV-1a hash seeded on the student's selected interests. Results stay the same on reload and don't favour whatever comes first alphabetically.
- **Eligibility before ranking:** courses that exclude engineering students are filtered out before scoring, so an ineligible course can never outrank an eligible one.
- **Discipline boost (groups only):** groups in the student's own discipline get a +20 boost. It can only reorder groups that match the same number of interests, never lift a weaker match above a stronger one.
- **Clear winner:** if the top course leads the next score by 15 points or more, it is shown alone. Otherwise the top three are shown together.

## Data

Every dataset is a JSON file in [`data/`](data/). Each record stores its source URL and a verification status.

| File | Contents | Source |
| --- | --- | --- |
| `tmu_table_a_liberals.json` | 121 engineering-eligible courses (101 fully verified, 20 partially verified) | TMU 2026–27 Undergraduate Calendar, Table A |
| `tmu_student_groups.json` | 53 FEAS design teams, student groups and government bodies | FEAS Student Involvement page |
| `tmu_minors.json` | 69 minors and their course requirements | TMU 2026–27 Undergraduate Calendar |
| `derived/minor-credit.json` | Which courses count toward which minors (generated) | Built by `scripts/build-minor-credit.mjs` |
| `tmu_clubs.json` | Campus-wide clubs (imported from CSV) | Built by `scripts/import-clubs-csv.mjs` |

Descriptions are paraphrased from the official pages, not copied. When a fact couldn't be confirmed, the field is left empty or marked unverified rather than guessed.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

### Scripts

```bash
npm run build                                   # production build
npm run lint                                    # ESLint
npm run test:e2e                                # Playwright end-to-end tests
node scripts/verify-taxonomy.mjs                # check interest taxonomy and course tags
node scripts/build-minor-credit.mjs             # regenerate data/derived/minor-credit.json
node scripts/import-clubs-csv.mjs <file.csv>    # replace data/tmu_clubs.json from a CSV
```

## Project structure

```
app/          Pages for the home screen, liberal studies path and student groups path
components/   UI components (interest picker, course and group cards, ...)
lib/          Matching engine, recommenders and types
data/         Datasets and interest lists
scripts/      Data build, import and verification scripts
e2e/          Playwright tests
```
