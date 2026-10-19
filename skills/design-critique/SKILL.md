---
name: design-critique
description: Give a structured, actionable critique of a visual design — a screenshot, mockup, web page, slide, flyer, or UI. Use when the user asks for design feedback, a critique, a review, "what's wrong with this layout", "how can I make this look better", or shares an image of a design and asks for opinions, even if they never say "critique".
---

# Design Critique

Produce a critique that a designer can act on immediately: specific problems, why they matter, and the concrete fix, ordered by impact.

## When to use

- The user shares a design (image, URL, HTML, slide) and wants feedback
- The user asks why a design "feels off" or how to improve it

Do not use for: building a new design from scratch, or proofreading copy only.

## Workflow

1. **Establish context.** Identify the design's purpose, audience, and medium. If none is given, infer it and state the assumption in one line rather than asking.
2. **Look before judging.** Describe the primary focal point and the reading path a viewer's eye actually follows.
3. **Evaluate against the checklist** in [references/checklist.md](references/checklist.md): hierarchy, layout and spacing, typography, color and contrast, consistency, and accessibility.
4. **Prioritize.** Keep the 3–7 issues that most affect whether the design achieves its purpose. Drop nitpicks unless the design is otherwise strong.
5. **Prescribe fixes.** Every issue gets a concrete change (values, not adjectives: "increase body text to 16px", not "make text bigger").

## Output format

```
**Read:** <one sentence on purpose + what the eye hits first>

**What's working**
- <1–3 strengths worth keeping>

**Fix first** (highest impact)
1. <Issue> — <why it hurts the goal>. **Fix:** <specific change>.

**Then**
- <Lower-priority issue> — **Fix:** <change>.
```

Keep it tight. A critique the user can apply in ten minutes beats an exhaustive audit.
