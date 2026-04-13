import { parse } from 'csv-parse/sync';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvPath = join(__dirname, '..', 'data.csv');
const outputPath = join(__dirname, '..', 'src', 'data', 'drugs.json');

const csvContent = readFileSync(csvPath, 'utf-8');

const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
});

interface RawRecord {
  id: string;
  category: string;
  trade_name: string;
  generic_name: string;
  dosage: string;
  notes: string;
  is_important: string;
  memo: string;
}

const drugs = (records as RawRecord[]).map((row) => ({
  id: parseInt(row.id, 10),
  category: row.category,
  trade_name: row.trade_name,
  generic_name: row.generic_name,
  dosage: row.dosage,
  notes: row.notes,
  is_important: row.is_important === '1',
  memo: row.memo || '',
}));

// Validate count
console.log(`Parsed ${drugs.length} drug records from data.csv`);
if (drugs.length < 100) {
  throw new Error(`Expected at least 100 records, got ${drugs.length}`);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(drugs, null, 2), 'utf-8');
console.log(`Written to ${outputPath}`);
