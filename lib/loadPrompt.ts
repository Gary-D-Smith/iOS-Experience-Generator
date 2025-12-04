import fs from 'fs';
import path from 'path';

export function loadPromptTemplate(): string {
  const filePath = path.join(process.cwd(), 'prompt-template.txt');
  return fs.readFileSync(filePath, 'utf-8');
}

export function formatPrompt(input: string, output: string): string {
  const template = loadPromptTemplate();
  return template
    .replace(/{input}/g, input)
    .replace(/{output}/g, output);
}




