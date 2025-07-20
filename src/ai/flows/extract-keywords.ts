// src/ai/flows/extract-keywords.ts
'use server';

/**
 * @fileOverview Extracts relevant keywords from trending gig data using AI.
 *
 * - extractRelevantKeywords - A function that extracts keywords from gig data.
 * - ExtractRelevantKeywordsInput - The input type for the extractRelevantKeywords function.
 * - ExtractRelevantKeywordsOutput - The return type for the extractRelevantKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRelevantKeywordsInputSchema = z.object({
  searchQuery: z.string().describe('The user provided search query'),
});
export type ExtractRelevantKeywordsInput = z.infer<
  typeof ExtractRelevantKeywordsInputSchema
>;

const ExtractRelevantKeywordsOutputSchema = z.object({
  keywords: z
    .array(z.string())
    .describe('An array of the most relevant keywords.'),
});
export type ExtractRelevantKeywordsOutput = z.infer<
  typeof ExtractRelevantKeywordsOutputSchema
>;

// This is a placeholder for a real tool that would fetch trending gig data.
const getTrendingGigs = ai.defineTool(
  {
    name: 'getTrendingGigs',
    description: 'Get trending gig data for a given category/search query.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({query}) => {
    // In a real application, this would fetch data from an external API or scrape a website.
    // For now, we'll return some sample data based on the query.
    if (query.toLowerCase().includes('logo design')) {
      return `
        "I will design a modern minimalist business logo design" - 5-star rated, 1k+ reviews. Services include multiple concepts, high-resolution files, and vector files.
        "I will do 3 modern minimalist logo design" - Top-rated seller. Offers brand style guides and social media kits.
        "I will create a unique minimalist logo for your business" - Pro seller. Focus on luxury and modern aesthetics.
      `;
    }
    return `
      "I will build a professional website for your business" - Includes responsive design, e-commerce functionality, and SEO optimization.
      "I will develop a custom web application with React and Node.js" - Fast delivery, clean code, and includes deployment.
      "I will be your front end web developer in react js, next js" - Specializes in converting Figma/XD designs to pixel-perfect websites.
    `;
  }
);


export async function extractRelevantKeywords(
  input: ExtractRelevantKeywordsInput
): Promise<ExtractRelevantKeywordsOutput> {
  return extractRelevantKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRelevantKeywordsPrompt',
  input: {schema: ExtractRelevantKeywordsInputSchema},
  output: {schema: ExtractRelevantKeywordsOutputSchema},
  tools: [getTrendingGigs],
  prompt: `You are an expert in Fiverr gig optimization.

  Analyze the following trending gig data and extract the most relevant keywords related to the Fiverr gig category or search term.
  Return the keywords as an array of strings.

  Search Query: {{{searchQuery}}}
  `,
});

const extractRelevantKeywordsFlow = ai.defineFlow(
  {
    name: 'extractRelevantKeywordsFlow',
    inputSchema: ExtractRelevantKeywordsInputSchema,
    outputSchema: ExtractRelevantKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
