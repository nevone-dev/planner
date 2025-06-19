import { contextBridge } from 'electron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../db.json');

function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

contextBridge.exposeInMainWorld('api', {
  ping: () => 'pong',
  save: (key, value) => {
    const db = readDb();
    db[key] = value;
    writeDb(db);
  },
  load: (key) => {
    const db = readDb();
    return db[key];
  },
});
