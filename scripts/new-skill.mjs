#!/usr/bin/env node
// Scaffolds skills/<name> from templates/skill and registers it in the marketplace.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SKILLS_DIR, MARKETPLACE, NAME_RE, readMarketplace } from "./lib.mjs";

const name = process.argv[2];
if (!name || !NAME_RE.test(name)) {
  console.error("usage: npm run new -- <skill-name>   (lowercase, hyphen-separated)");
  process.exit(1);
}
const dest = join(SKILLS_DIR, name);
if (existsSync(dest)) {
  console.error(`skills/${name} already exists`);
  process.exit(1);
}

cpSync(join(ROOT, "templates", "skill"), dest, { recursive: true });

const title = name.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const skillMd = join(dest, "SKILL.md");
writeFileSync(
  skillMd,
  readFileSync(skillMd, "utf8").replace("name: skill-name", `name: ${name}`).replace("# Skill Name", `# ${title}`)
);

const marketplace = readMarketplace();
const plugin = marketplace.plugins[0];
plugin.skills = [...new Set([...(plugin.skills ?? []), `./skills/${name}`])].sort();
writeFileSync(MARKETPLACE, JSON.stringify(marketplace, null, 2) + "\n");

console.log(`Created skills/${name} and registered it in marketplace.json.`);
console.log(`Next: edit skills/${name}/SKILL.md, then run npm run validate.`);
