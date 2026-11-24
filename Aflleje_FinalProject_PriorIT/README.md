# PriorIT

**A Rule-Based Expert System for IT Support Ticket Prioritization and Decision Support**

## Introduction and problem statement

IT support teams receive requests that vary in urgency, scope, and age. Manual triage can produce inconsistent classifications and leave urgent issues waiting. PriorIT applies explicit policies to classify support requests and explain the recommended response.

## Objectives

The general objective is to support consistent, explainable IT ticket triage.

- Capture, update, search, and filter support requests.
- Classify tickets as HIGH, MEDIUM, or LOW using ordered IF–THEN rules.
- Explain the winning rule, conditions evaluated, and recommended action.
- Track ticket totals and surface unresolved high-priority issues.
- Provide a dataset, automated tests, and steps to reproduce classifications in KNIME.

## System architecture and reasoning

| Expert system component | Implementation |
| --- | --- |
| Working memory | Current ticket facts loaded from the form or LocalStorage |
| Knowledge base | Eight ordered rules in src/engine/ruleEngine.js |
| Inference engine | Validates facts and evaluates R1 through R8 |
| Decision support | Looks up the recommended action for the assigned priority |
| Explanation facility | Shows the winning rule, explanation, and condition trace |

The engine starts with known facts and evaluates the rules in order. A rule matches when all its conditions pass. The first match supplies the priority, which determines the recommended action. R8 covers cases where earlier rules fail. The trace records actual values and pass or fail outcomes through the matching rule. Resolved tickets count toward priority totals and are excluded from active escalation alerts.

## Scope and limitations

The app runs in a local browser using React, Vite, JavaScript, Tailwind CSS, Lucide React, and Recharts. LocalStorage retains tickets for the current browser profile and origin. Clearing site data removes saved tickets. Use one tab for edits. Waiting hours are entered manually. Staff carry out the recommended actions. The project has no backend, login, or cloud storage.

## Installation and testing

Use Node.js 22 or newer. In the PriorIT folder run:

    npm install
    npm run dev

Open the address Vite prints, usually http://localhost:5173. First launch loads 25 fictional tickets. Reset sample data in Ticket Management restores those tickets after confirmation and replaces saved edits.

    npm test
    npm run build

Vitest covers rule thresholds, precedence, resolved statuses, validation, the explanation trace, and parity with the expected-results CSV. The production build is written to dist/. Serve it locally with npm run preview.

## KNIME

See [GUIDE.txt](GUIDE.txt) for KNIME import and rerun steps.