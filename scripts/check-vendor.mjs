import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        stdio: "inherit",
        ...options
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function collectHtmlFiles(dir) {
    const htmlFiles = [];

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === "node_modules" || entry.name === ".git") {
            continue;
        }

        const entryPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            htmlFiles.push(...collectHtmlFiles(entryPath));
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            htmlFiles.push(path.relative(root, entryPath));
        }
    }

    return htmlFiles;
}

const checkedPaths = [
    "assets/vendor",
    "package.json",
    "package-lock.json",
    ...collectHtmlFiles(root)
];

function changedTrackedFiles() {
    const diffNames = spawnSync(
        "git",
        ["diff", "--name-only", "--", ...checkedPaths],
        { encoding: "utf-8" }
    );

    if (diffNames.error) {
        throw diffNames.error;
    }

    if (diffNames.status !== 0) {
        process.exit(diffNames.status ?? 1);
    }

    return diffNames.stdout
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
}

const beforeSync = new Set(changedTrackedFiles());

run(process.execPath, ["scripts/sync-vendor.mjs"]);

const changedFiles = changedTrackedFiles()
    .filter(file => !beforeSync.has(file));

if (changedFiles.length > 0) {
    console.error("");
    console.error("Vendored assets are out of sync.");
    console.error("Files changed by vendor sync:");
    for (const file of changedFiles) {
        console.error(`- ${file}`);
    }
    console.error("");
    console.error("Run 'npm run vendor:sync' locally and commit the updated files.");
    process.exit(1);
}

console.log("Vendored assets are in sync.");
