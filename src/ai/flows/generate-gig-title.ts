'use server';

/**
 * @fileOverview A flow to generate an optimized gig title based on trending keywords.
 *
 * - generateOptimizedGigTitle - A function that generates an optimized gig title.
 * - GenerateOptimizedGigTitleInput - The input type for the generateOptimizedGigTitle function.
 * - GenerateOptimizedGigTitleOutput - The return type for the generateOptimizedGigTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimizedGigTitleInputSchema = z.object({
  category: z.string().describe('The Fiverr gig category or search term.'),
  keywords: z.array(z.string()).describe('The top relevant keywords extracted from trending gig data.'),
  userPlan: z.string().describe("The user's plan for their gig, including skills and technologies."),
});
export type GenerateOptimizedGigTitleInput = z.infer<typeof GenerateOptimizedGigTitleInputSchema>;

const GenerateOptimizedGigTitleOutputSchema = z.object({
  title: z.string().describe('The generated keyword-optimized gig title.'),
});
export type GenerateOptimizedGigTitleOutput = z.infer<typeof GenerateOptimizedGigTitleOutputSchema>;

export async function generateOptimizedGigTitle(input: GenerateOptimizedGigTitleInput): Promise<GenerateOptimizedGigTitleOutput> {
  return generateOptimizedGigTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGigTitlePrompt',
  input: {schema: GenerateOptimizedGigTitleInputSchema},
  output: {schema: GenerateOptimizedGigTitleOutputSchema},
  prompt: `You are an expert Fiverr gig optimization specialist. Your goal is to generate a highly compelling and keyword-optimized gig title based on the provided category, keywords, and user plan.

  Category: {{{category}}}
  Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  User's Plan: {{{userPlan}}}

  Instructions:
  - The title should be concise, catchy, and directly address search intent.
  - It MUST incorporate the provided keywords and the user's technologies naturally and strategically.
  - Aim for a length that is optimized for Fiverr's platform (typically under 80 characters).
  - Focus on highlighting the core value proposition of the gig based on the user's plan.
  - Your final output should be ONLY the title.

  Example: I will design a modern minimalist logo and brand identity for your business`,
});

const generateOptimizedGigTitleFlow = ai.defineFlow(
  {
    name: 'generateOptimizedGigTitleFlow',
    inputSchema: GenerateOptimizedGigTitleInputSchema,
    outputSchema: GenerateOptimizedGigTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
