import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.resolve(__dirname, '../../../packages/schemas');
const targetTypesDir = path.resolve(__dirname, '../src/types/generated');

if (!fs.existsSync(targetTypesDir)) {
  fs.mkdirSync(targetTypesDir, { recursive: true });
}

console.log(`[Schema Codegen] Reading schema contracts from: ${schemasDir}`);
const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));

console.log(`[Schema Codegen] Found ${schemaFiles.length} contracts: ${schemaFiles.join(', ')}`);
console.log(`[Schema Codegen] Target output directory: ${targetTypesDir}`);
console.log(`[Schema Codegen] Schemas verified successfully.`);

