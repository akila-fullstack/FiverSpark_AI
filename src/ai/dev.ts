import { config } from 'dotenv';
config();

import '@/ai/flows/extract-keywords.ts';
import '@/ai/flows/generate-gig-description.ts';
import '@/ai/flows/generate-gig-title.ts';