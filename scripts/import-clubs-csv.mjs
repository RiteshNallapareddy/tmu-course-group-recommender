#!/usr/bin/env node
/**
 * Bulk-imports TMU clubs from a CSV export into data/tmu_clubs.json.
 *
 * Usage:
 *   node scripts/import-clubs-csv.mjs <path-to-csv>
 *
 * Expected columns (header row required, any order):
 *   id            optional. Slug for the club. Auto-generated from `name`
 *                 if left blank (e.g. "TMU Chess Club" -> "tmu-chess-club").
 *   name          required.
 *   categories    optional. Pipe-separated, e.g. "Games|Social".
 *   contactEmail  optional.
 *   instagram     optional. Handle only -- a leading "@" or a full
 *                 instagram.com URL is normalized down to the bare handle.
 *   active        required. One of: true/false, yes/no, 1/0 (case-insensitive).
 *
 * See scripts/sample-clubs.csv for a 2-row example.
 *
 * Every run fully REPLACES data/tmu_clubs.json's `clubs` array with what's
 * in the given CSV -- this isn't a merge/upsert. That matches the workflow
 * of periodically re-exporting the full club list and re-checking which
 * ones are still active, rather than needing to track deletions separately.
 *
 * Validation is split into hard errors (block the write -- fix the CSV and
 * re-run) and warnings (reported, but the import still proceeds):
 *   Errors:   missing `name`; duplicate `id` after slugifying; `active`
 *             not a recognized boolean token.
 *   Warnings: `contactEmail` present but not a plausible email shape;
 *             `instagram` present but contains whitespace; no categories.
 *
 * Dependency-free (no csv-parse, no papaparse) to match this repo's other
 * scripts/*.mjs -- see scripts/verify-taxonomy.mjs for the same convention.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUTPUT_PATH = path.join(ROOT, "data/tmu_clubs.json");

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/import-clubs-csv.mjs <path-to-csv>");
  console.error("See scripts/sample-clubs.csv for the expected format.");
  process.exit(1);
}

const absCsvPath = path.resolve(process.cwd(), csvPath);
if (!fs.existsSync(absCsvPath)) {
  console.error(`CSV not found: ${absCsvPath}`);
  process.exit(1);
}

// ---- RFC4180-ish CSV parsing (handles quoted fields with embedded commas,
// quotes, and newlines) -- no dependency needed for this. -------------------

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  // Normalize line endings so \r\n inside/outside quotes behaves the same.
  const s = text.replace(/\r\n/g, "\n");

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  // Last field/row (file may or may not end with a newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

const raw = fs.readFileSync(absCsvPath, "utf8");
const rows = parseCsv(raw);
if (rows.length === 0) {
  console.error("CSV is empty.");
  process.exit(1);
}

const header = rows[0].map((h) => h.trim());
const dataRows = rows.slice(1);

const REQUIRED_COLUMNS = ["name", "active"];
const KNOWN_COLUMNS = ["id", "name", "categories", "contactEmail", "instagram", "active"];
for (const col of REQUIRED_COLUMNS) {
  if (!header.includes(col)) {
    console.error(`Missing required column "${col}" in CSV header: ${header.join(", ")}`);
    process.exit(1);
  }
}
for (const col of header) {
  if (!KNOWN_COLUMNS.includes(col)) {
    console.warn(`Unknown column "${col}" in CSV header -- ignoring it.`);
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TRUE_TOKENS = new Set(["true", "yes", "1"]);
const FALSE_TOKENS = new Set(["false", "no", "0"]);
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeInstagram(value) {
  if (!value) return null;
  let v = value.trim();
  v = v.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "");
  v = v.replace(/^@/, "");
  v = v.replace(/\/$/, "");
  return v || null;
}

const errors = [];
const warnings = [];
const clubs = [];
const seenIds = new Map(); // id -> 1-based data row number, for duplicate reporting

dataRows.forEach((cells, idx) => {
  const rowNum = idx + 2; // +1 for header, +1 for 1-based
  const record = {};
  header.forEach((col, i) => {
    record[col] = (cells[i] ?? "").trim();
  });

  const name = record.name ?? "";
  if (!name) {
    errors.push(`Row ${rowNum}: missing required "name".`);
    return;
  }

  const id = record.id ? slugify(record.id) : slugify(name);
  if (!id) {
    errors.push(`Row ${rowNum} ("${name}"): could not derive a usable id.`);
    return;
  }
  if (seenIds.has(id)) {
    errors.push(
      `Row ${rowNum} ("${name}"): duplicate id "${id}" (first seen on row ${seenIds.get(id)}).`
    );
    return;
  }
  seenIds.set(id, rowNum);

  const activeRaw = (record.active ?? "").toLowerCase();
  let active;
  if (TRUE_TOKENS.has(activeRaw)) active = true;
  else if (FALSE_TOKENS.has(activeRaw)) active = false;
  else {
    errors.push(
      `Row ${rowNum} ("${name}"): "active" value "${record.active}" is not one of true/false/yes/no/1/0.`
    );
    return;
  }

  const categories = (record.categories ?? "")
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);
  if (categories.length === 0) {
    warnings.push(`Row ${rowNum} ("${name}"): no categories given.`);
  }

  const contactEmail = record.contactEmail || null;
  if (contactEmail && !EMAIL_SHAPE.test(contactEmail)) {
    warnings.push(`Row ${rowNum} ("${name}"): "${contactEmail}" doesn't look like a valid email.`);
  }

  const instagramRaw = record.instagram || null;
  const instagram = normalizeInstagram(instagramRaw);
  if (instagramRaw && instagram && /\s/.test(instagram)) {
    warnings.push(`Row ${rowNum} ("${name}"): instagram handle "${instagram}" contains whitespace.`);
  }

  clubs.push({ id, name, categories, contactEmail, instagram, active });
});

if (warnings.length > 0) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings) console.log(`  - ${w}`);
  console.log("");
}

if (errors.length > 0) {
  console.log(`ERRORS (${errors.length}) -- data/tmu_clubs.json was NOT written:`);
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}

const output = {
  meta: {
    title: "TMU Clubs -- All Campus Clubs (not FEAS-specific)",
    schemaVersion: 1,
    totalRecords: clubs.length,
    lastImportedAt: new Date().toISOString(),
    sourceNote: `Imported from ${path.relative(ROOT, absCsvPath)} via scripts/import-clubs-csv.mjs. Each import fully replaces this array -- re-export the full list, don't hand-edit around it.`,
  },
  clubs,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n");

const activeCount = clubs.filter((c) => c.active).length;
console.log(
  `Wrote ${clubs.length} clubs to data/tmu_clubs.json (${activeCount} active, ${clubs.length - activeCount} inactive).`
);
