import fs from 'fs/promises';
import path from 'path';

export interface ReadingRecord {
  id: string;
  timestamp: string;
  consumption: number;
  current: number;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'readings.json');

async function ensureDbFile() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf8');
  }
}

async function readDbFile(): Promise<ReadingRecord[]> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw) as ReadingRecord[];
}

async function writeDbFile(records: ReadingRecord[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(records, null, 2), 'utf8');
}

export async function getReadings(): Promise<ReadingRecord[]> {
  const records = await readDbFile();
  return records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function addReading(reading: Omit<ReadingRecord, 'id'>): Promise<ReadingRecord> {
  const records = await readDbFile();
  const nextRecord = { id: `${Date.now()}-${records.length + 1}`, ...reading };
  records.push(nextRecord);
  await writeDbFile(records);
  return nextRecord;
}
