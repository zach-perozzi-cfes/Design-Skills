#!/usr/bin/env node
// Zips each skill into dist/<name>.zip for upload to claude.ai (Settings > Capabilities > Skills).
// Pass skill names to package only those; default is all skills.
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, SKILLS_DIR, listSkillDirs } from "./lib.mjs";

const dist = join(ROOT, "dist");
mkdirSync(dist, { recursive: true });

const names = process.argv.length > 2 ? process.argv.slice(2) : listSkillDirs();
for (const name of names) {
  if (!existsSync(join(SKILLS_DIR, name, "SKILL.md"))) {
    console.error(`skip ${name}: no skills/${name}/SKILL.md`);
    process.exitCode = 1;
    continue;
  }
  const out = join(dist, `${name}.zip`);
  rmSync(out, { force: true });
  if (process.platform === "win32") {
    // Windows' bundled bsdtar writes forward-slash paths; Compress-Archive writes backslashes.
    // Use the System32 binary explicitly so Git Bash's GNU tar (no zip support) can't shadow it.
    const tar = join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe");
    execFileSync(tar, ["-a", "-cf", out, name], { cwd: SKILLS_DIR });
  } else {
    execFileSync("zip", ["-rq", out, name, "-x", "*.DS_Store"], { cwd: SKILLS_DIR });
  }
  console.log(`packaged dist/${name}.zip`);
}
