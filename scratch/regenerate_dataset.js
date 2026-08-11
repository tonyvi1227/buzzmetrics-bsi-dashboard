import fs from 'fs';
import path from 'path';
import { parseCSVData } from '../src/utils/csvParser.ts';
import { rawCSV } from '../src/data/campaignDataset.ts';

const updatedRecords = parseCSVData(rawCSV);
console.log(`Parsed ${updatedRecords.length} records with new rules.`);

const typeCounts = {};
updatedRecords.forEach(r => {
  typeCounts[r.campaignType] = (typeCounts[r.campaignType] || 0) + 1;
});
console.log('New Type Distribution:', typeCounts);

// Generate new campaignDataset.ts file content
const newContent = `import { parseCSVData } from '../utils/csvParser';
import { CampaignRecord } from '../types/dashboard';

export const rawCSV = ${JSON.stringify(rawCSV)};

export const initialCampaigns: CampaignRecord[] = parseCSVData(rawCSV);

export default initialCampaigns;
`;

fs.writeFileSync(path.resolve('src/data/campaignDataset.ts'), newContent, 'utf8');
console.log('Successfully updated src/data/campaignDataset.ts!');
