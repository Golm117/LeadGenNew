# PROTOCOL — How Agents Operate in This Repo

Every agent and every Claude Code (CC) session reads this file first. It defines
the document hierarchy, the order things are read, how work is claimed, and how
work is handed off. Nothing here is optional.

---

## 1. Document hierarchy (precedence)

When two documents disagree, the higher one wins:

1. **`PRD.md`** — the **source of truth**. The product definition. Agents never edit it.
2. **`decisions.md`** — the human-in-the-loop ledger. Resolves anything the PRD left
   open or ambiguous. Append-only; only a human (or an agent relaying a human answer)
   adds entries. Agents never silently overrule a logged decision.
3. **`Task.md`** — the live work board. What must be built, by whom, in what order,
   and its current state.
4. **`notepad.md`** — the shared whiteboard. Scratch, findings, questions-in-flight,
   coordination chatter. Append-only.

`roster.md` is reference, not hierarchy: it tells every agent who exists and who to
hand off to.

---

## 2. Session start: read order

On every new CC session or agent activation, in this order:

1. `PROTOCOL.md` (this file)
2. `PRD.md`
3. `decisions.md` — so you never re-ask a settled question
4. `roster.md` — so you know the team and the handoff map
5. `Task.md` — to find what to do
6. `notepad.md` — recent entries, for in-flight context

---

## 3. Agent onboarding (run once per agent, before any build work)

Two phases, in order:

**Phase A — Self-description.** Each agent reads *its own* `.claude/agents/<name>.md`
and writes, in its own words, a short statement of what it is designed to do and what
it covers. It appends this to `roster.md` under its own heading.

**Phase B — All-hands.** The CC session (or the human) reviews every agent's
self-description, then runs an "all-hands": each agent's role + coverage is shared so
that **every agent knows every other agent's job**. The result is the
**handoff map** in `roster.md` — for each agent, who it typically hands off to and
who hands off to it. After all-hands, an agent finishing its slice of a task knows
exactly who takes over.

No agent claims build work until all-hands is complete and `roster.md` is populated.

---

## 4. Pull model: claiming work

Sessions/agents are not pushed work. They pull it.

- An agent scans `Task.md` for the next task whose `status: pending`, whose
  `depends-on` tasks are all `done`, and whose `domain` matches its role.
- To claim: edit that task's `status` to `claimed` and set `owner` to its own name in
  the same edit. Claiming and naming ownership happen together so ownership is never
  ambiguous.
- Then move it to `in-progress` while working.

---

## 5. Handoff

When an agent finishes its portion of a task:

1. Set the task `status` to `done` (or `blocked` if it cannot proceed).
2. Write a **handoff note** in the task block: what was produced, where it lives, and
   anything the next owner needs.
3. Set `handoff-to` to the agent that takes over next (read it off the handoff map in
   `roster.md`), or `unassigned` if the next step is open for any matching agent to pull.
4. Append a one-line entry to `notepad.md` announcing the handoff.

---

## 6. notepad.md rules

- **Append-only.** Never edit or delete another agent's lines.
- Every entry is prefixed `[YYYY-MM-DD HH:MM][agent-name]`.
- Use it for findings, decisions-in-flight, questions, and handoff announcements.
- If something becomes a settled decision, it must be promoted into `decisions.md`
  (notepad is not authoritative).

---

## 7. decisions.md rules

- Each entry is a resolved question: the question, the chosen answer, who decided, when.
- **Append-only and treated as immutable** once written. If a decision is reversed, add
  a new entry that supersedes the old one (and reference it) — do not rewrite history.
- An OPEN question that needs a human goes in the "Open / awaiting human" section. An
  agent blocked on it sets its task `status: blocked` and stops, rather than guessing.

---

## 8. Escalation

If an agent hits a question the PRD and decisions.md don't answer, and guessing would
be load-bearing: append the question to `decisions.md` (Open section) and to
`notepad.md`, set the task `blocked`, name the human as the owner of the answer, and
move on to the next pullable task.
