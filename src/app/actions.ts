'use server';

import { z } from 'zod';
import { extractRelevantKeywords } from '@/ai/flows/extract-keywords';
import { generateOptimizedGigTitle } from '@/ai/flows/generate-gig-title';
import { generateGigDescription } from '@/ai/flows/generate-gig-description';

const formSchema = z.object({
  searchQuery: z.string().min(3, 'Please enter a category or search term.'),
  userPlan: z.string().min(10, 'Please describe your plan with at least 10 characters.'),
});

interface OptimizedGigResult {
  keywords: string[];
  title: string;
  description: string;
  error?: string;
}

export async function generateOptimizedGig(
  values: z.infer<typeof formSchema>
): Promise<OptimizedGigResult> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      keywords: [],
      title: '',
      description: '',
      error: 'Invalid input.',
    };
  }

  const { searchQuery, userPlan } = validatedFields.data;

  try {
    const { keywords } = await extractRelevantKeywords({ searchQuery });

    if (!keywords || keywords.length === 0) {
      return {
        keywords: [],
        title: '',
        description: '',
        error: 'Could not extract any keywords. Please try a different search query.',
      };
    }

    const [titleResult, descriptionResult] = await Promise.all([
      generateOptimizedGigTitle({ category: searchQuery, keywords, userPlan }),
      generateGigDescription({ category: searchQuery, keywords, userPlan }),
    ]);

    return {
      keywords,
      title: titleResult.title,
      description: descriptionResult.gigDescription,
    };
  } catch (e) {
    console.error(e);
    return {
      keywords: [],
      title: '',
      description: '',
      error: 'An unexpected error occurred while generating content. Please try again.',
    };
  }
}
