#!/usr/bin/env node
// Validates every skill in skills/ and checks it is registered in the marketplace.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { SKILLS_DIR, NAME_RE, listSkillDirs, readMarketplace, parseFrontmatter } from "./lib.mjs";

const errors = [];
const warnings = [];
const err = (skill, msg) => errors.push(`${skill}: ${msg}`);
const warn = (skill, msg) => warnings.push(`${skill}: ${msg}`);

const dirs = listSkillDirs();
const marketplace = readMarketplace();
const registered = new Set(
  marketplace.plugins.flatMap((p) => (p.skills ?? []).map((s) => s.replace(/^\.\/skills\//, "")))
);

for (const dir of dirs) {
  const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
  if (!existsSync(skillPath)) {
    err(dir, "missing SKILL.md");
    continue;
  }
  const text = readFileSync(skillPath, "utf8");
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    err(dir, "SKILL.md must start with YAML frontmatter delimited by ---");
    continue;
  }
  const { name, description } = parsed.data;

  if (!name) err(dir, "frontmatter is missing `name`");
  else {
    if (name !== dir) err(dir, `name "${name}" must match folder name "${dir}"`);
    if (!NAME_RE.test(name)) err(dir, "name must be lowercase letters, digits, and single hyphens");
    if (name.length > 64) err(dir, "name must be 64 characters or fewer");
    if (/anthropic|claude/.test(name)) err(dir, 'name must not contain "anthropic" or "claude"');
  }

  if (!description) err(dir, "frontmatter is missing `description`");
  else {
    if (description.length > 1024) err(dir, `description is ${description.length} chars (max 1024)`);
    if (/[<>]/.test(description)) err(dir, "description must not contain < or >");
    if (!/\buse (this skill )?(when|whenever|for)\b/i.test(description))
      warn(dir, 'description should say when to use the skill (e.g. "Use when ...")');
  }

  if (/\bTODO\b/.test(text)) err(dir, "SKILL.md still contains TODO placeholders from the template");

  const bodyLines = parsed.body.split("\n").length;
  if (bodyLines > 500) warn(dir, `SKILL.md body is ${bodyLines} lines; move detail into references/`);

  for (const [, target] of parsed.body.matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)) {
    if (/^[a-z]+:/i.test(target)) continue;
    if (!existsSync(join(dirname(skillPath), target))) err(dir, `broken link: ${target}`);
  }

  if (!registered.has(dir)) err(dir, "not listed in .claude-plugin/marketplace.json");
}

for (const s of registered) {
  if (!dirs.includes(s)) err(s, "listed in marketplace.json but skills/" + s + " does not exist");
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${dirs.length} skill(s) checked: ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
