'use server';

/**
 * @fileOverview A flow to generate an optimized gig description based on keywords and category.
 *
 * - generateGigDescription - A function that generates the gig description.
 * - GenerateGigDescriptionInput - The input type for the generateGigDescription function.
 * - GenerateGigDescriptionOutput - The return type for the generateGigDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGigDescriptionInputSchema = z.object({
  category: z.string().describe('The Fiverr gig category or search term.'),
  keywords: z.array(z.string()).describe('The top keywords extracted from trending gig data.'),
  userPlan: z.string().describe("The user's plan for their gig, including skills and technologies."),
});
export type GenerateGigDescriptionInput = z.infer<typeof GenerateGigDescriptionInputSchema>;

const GenerateGigDescriptionOutputSchema = z.object({
  gigDescription: z.string().describe('The AI-generated, keyword-optimized gig description.'),
});
export type GenerateGigDescriptionOutput = z.infer<typeof GenerateGigDescriptionOutputSchema>;

export async function generateGigDescription(input: GenerateGigDescriptionInput): Promise<GenerateGigDescriptionOutput> {
  return generateGigDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGigDescriptionPrompt',
  input: {schema: GenerateGigDescriptionInputSchema},
  output: {schema: GenerateGigDescriptionOutputSchema},
  prompt: `You are an expert Fiverr gig optimization specialist. Your goal is to create a compelling and keyword-optimized gig description that attracts potential buyers.

  Based on the following category, keywords, and user plan, generate a persuasive and structured gig description:

  Category: {{{category}}}
  Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  User's Plan: {{{userPlan}}}

  The gig description should include:
  - A strong hook/introduction.
  - A clear articulation of what the gig offers, leveraging the user's plan.
  - Key benefits for the buyer.
  - A strong call to action.
  - Natural and strategic integration of the identified keywords and technologies from the user's plan throughout the text.
  - Sections like "Why Choose Me?", "What You'll Get," or "My Tech Stack".

  Ensure the description is persuasive, well-structured, and optimized for search.
  The output should be in markdown format.
  `,
});

const generateGigDescriptionFlow = ai.defineFlow(
  {
    name: 'generateGigDescriptionFlow',
    inputSchema: GenerateGigDescriptionInputSchema,
    outputSchema: GenerateGigDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
