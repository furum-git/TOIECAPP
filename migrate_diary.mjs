import fs from "fs";
import path from "path";

const extractedBase = "C:\\Users\\furum\\OneDrive\\デスクトップ\\日記\\extracted";
const destDir = "C:\\Users\\furum\\Documents\\Journal\\Daily";

let copied = 0, skipped = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full);
    } else if (entry.name.endsWith(".md")) {
      processFile(full);
    }
  }
}

function processFile(fpath) {
  const content = fs.readFileSync(fpath, "utf-8");
  const firstLine = content.split("\n")[0];
  const m = firstLine.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!m) return;
  const year = m[1];
  const month = String(parseInt(m[2])).padStart(2, "0");
  const day = String(parseInt(m[3])).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  const dest = path.join(destDir, `${dateStr}.md`);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(fpath, dest);
    console.log(`コピー: ${dateStr}.md`);
    copied++;
  } else {
    console.log(`スキップ（既存）: ${dateStr}.md`);
    skipped++;
  }
}

walkDir(extractedBase);
console.log(`\n完了: ${copied}件コピー, ${skipped}件スキップ`);
