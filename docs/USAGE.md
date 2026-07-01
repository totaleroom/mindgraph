# MindGraph — User Guide

This guide walks through everything MindGraph can do. It doubles as the content for the
project [Wiki](#publishing-this-as-a-github-wiki).

- [Getting into the app](#getting-into-the-app)
- [Capturing thoughts](#capturing-thoughts)
- [Thought types](#thought-types)
- [Voice capture](#voice-capture)
- [The knowledge graph](#the-knowledge-graph)
- [Managing thoughts](#managing-thoughts)
- [Weekly Synthesis (insights)](#weekly-synthesis-insights)
- [Using AI (Bring Your Own Key)](#using-ai-bring-your-own-key)
- [Settings & your data](#settings--your-data)
- [Privacy](#privacy)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [FAQ](#faq)
- [Publishing this as a GitHub Wiki](#publishing-this-as-a-github-wiki)

---

## Getting into the app

Open the site and click **Start Thinking — Free** on the landing page, or navigate directly
to `/#/app`. There's no sign‑up: the app is ready immediately, pre‑seeded with a few example
thoughts so the graph isn't empty on first run.

The workspace has three parts:

- **Capture bar** (top) — where you add thoughts.
- **Thoughts list** (left) — a searchable, filterable list of everything you've captured.
- **Knowledge graph** (right) — a live visualization of your thoughts and their connections.
- **Stat counters** — a running total of thoughts and detected connections.

## Capturing thoughts

1. Type into the box labeled *"Dump a thought freely…"*.
2. Pick a **type** (see below) — it defaults to *Idea*.
3. Click **Capture**, or press `⌘ + Enter` (macOS) / `Ctrl + Enter` (Windows/Linux).

The thought appears instantly at the top of the list and as a new node in the graph.

## Thought types

Each thought is one of four types, color‑coded throughout the app:

| Type | Color | Use it for |
| --- | --- | --- |
| **Idea** | Yellow | Sparks, possibilities, "what if"s |
| **Worry** | Pink | Anxieties, risks, open concerns |
| **Task** | Green | Actionable to‑dos (can be marked done) |
| **Insight** | Purple | Realizations and conclusions |

*Task* thoughts get a checkbox — tick it to mark the task complete (the card shows it struck
through).

## Voice capture

In browsers that support the Web Speech API (e.g. Chrome), a **microphone** button appears in
the capture bar. Click it and speak; your words are transcribed into the capture box, where
you can edit them before saving. If your browser doesn't support speech recognition, the mic
button is hidden.

## The knowledge graph

Thoughts become **nodes**; shared topics become **links** between them.

- **Node color** = the thought's type.
- **Node size** = how connected it is (bigger = more links).
- **Click a node** to select it: its connections are emphasized and unrelated nodes dim.
- **Click empty space** to deselect.

Connections are recomputed automatically every time you add, edit, or remove a thought.

## Managing thoughts

From the list on the left you can:

- **Search** — type in the search box to filter by content.
- **Filter by type** — use the chips (All / Idea / Worry / Task / Insight).
- **Edit** — hover a card and click the pencil to change its text or type.
- **Delete** — hover a card and click the trash icon.
- **Complete tasks** — click the check on a *Task* card.
- **Select** — click a card to highlight the matching node in the graph.

## Weekly Synthesis (insights)

Click **Insights** (the sparkle button) to open the *Weekly Synthesis*. The **local engine**
(no key required) reports:

- how many thoughts you captured and your most frequent topics,
- your mix of ideas / worries / tasks / insights,
- how many connections were found,
- your central "hub" thought,
- a nudge if worries are piling up.

For a richer, narrative synthesis, add a Gemini key and click **Deepen with Gemini AI**.

## Using AI (Bring Your Own Key)

AI is entirely optional. To enable it:

1. Create a key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open **Settings** → paste it into **Gemini API key** → pick a **model** → **Save**.
3. Open **Insights** → **Deepen with Gemini AI**.

The key lives only in your browser and is used solely to call Google's API on your behalf.

## Settings & your data

Open **Settings** (gear icon) to:

- set your **Gemini API key** and **model**,
- **Clear all thoughts** (permanent — asks for confirmation).

All thoughts and settings are saved in your browser's `localStorage` under keys prefixed with
`mindgraph.`. Clearing your browser data for the site removes everything.

## Privacy

- No account, no server, no analytics.
- Your thoughts never leave your device.
- The only outbound network request the app can make is to Google's Gemini API — and only
  when *you* trigger an AI synthesis with *your* key.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘ + Enter` / `Ctrl + Enter` | Capture the current thought |

## FAQ

**Do I need an API key?** No. Everything except the AI deep dive works without one.

**Where is my data stored?** In your browser (`localStorage`). It is not synced or uploaded.

**Can I use it offline?** Yes — once installed as a PWA (or after first load on a deployed
HTTPS site), it works offline.

**Why don't two related thoughts connect?** Connections are based on shared keywords. If two
thoughts don't share meaningful words, they won't link. Editing a thought to include a shared
term will connect them.

## Publishing this as a GitHub Wiki

GitHub Wikis live in a separate repository and must be enabled from the web UI. To mirror
these docs into the Wiki:

1. In the repo, open the **Wiki** tab and click **Create the first page** (this initializes
   the wiki repo).
2. Clone it: `git clone https://github.com/totaleroom/mindgraph.wiki.git`.
3. Copy the files from this `docs/` folder into the wiki repo (e.g. `USAGE.md` →
   `Usage-Guide.md`), commit, and push.

Alternatively, just link to this `docs/` folder — GitHub renders it directly.
