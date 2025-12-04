import fs from 'fs';
import path from 'path';

export interface IOSInput {
  category: string;
  description: string;
  items: string[];
}

interface CSVRow {
  capability: string;
  library: string;
  link: string;
}

// Simple CSV parser
function parseCSV(content: string): CSVRow[] {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: CSVRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 3) {
      rows.push({
        capability: values[0],
        library: values[1],
        link: values[2]
      });
    }
  }
  
  return rows;
}

export function parseInputs(): IOSInput[] {
  const filePath = path.join(process.cwd(), 'inputs.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(content);
  
  // Group by library
  const libraryMap = new Map<string, string[]>();
  
  rows.forEach(row => {
    if (!libraryMap.has(row.library)) {
      libraryMap.set(row.library, []);
    }
    libraryMap.get(row.library)!.push(row.capability);
  });
  
  const inputs: IOSInput[] = [];
  libraryMap.forEach((items, library) => {
    inputs.push({
      category: library,
      description: '',
      items
    });
  });
  
  return inputs;
}

export function getRandomInput(): { category: string; item: string; library: string; link: string } {
  const filePath = path.join(process.cwd(), 'inputs.csv');
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCSV(content);
  
  const randomRow = rows[Math.floor(Math.random() * rows.length)];
  return {
    category: randomRow.library,
    item: randomRow.capability,
    library: randomRow.library,
    link: randomRow.link
  };
}

