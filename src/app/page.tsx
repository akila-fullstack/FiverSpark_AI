"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Loader2, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { generateOptimizedGig } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  searchQuery: z
    .string()
    .min(3, { message: "Please enter a category with at least 3 characters." }),
  userPlan: z.string().min(10, {
    message: "Please describe your plan with at least 10 characters.",
  }),
});

interface AnalysisResult {
  keywords: string[];
  title: string;
  description: string;
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: "",
      userPlan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await generateOptimizedGig(values);

    if (result.error) {
      setError(result.error);
    } else {
      setAnalysisResult(result as AnalysisResult);
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: "The generated text has been copied to your clipboard.",
    });
  };

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-gray-800 dark:text-white">
              FiverrSpark
            </h1>
          </div>
          <p className="text-sm text-muted-foreground -mt-2 mb-4">
            by Akila Dasanayaka
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ignite your Fiverr success. Turn your skills into high-converting
            gig titles and descriptions with the power of AI.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Wand2 className="h-6 w-6" />
                Create Your Optimized Gig
              </CardTitle>
              <CardDescription>
                Enter a category and your plan to generate optimized content. The AI will analyze top gigs for you.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="searchQuery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-base">
                          1. Gig Category or Search Term
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 'Logo Design', 'AI Web App'"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="userPlan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-base">
                          2. What are you planning to do?
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the services you'll offer, the technologies you'll use, or what makes your gig unique. e.g., 'I will build a full-stack web app using React, Next.js, and Firebase. It will have user authentication and a dashboard.'"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This data is used to personalize your gig title and description.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Analyze & Generate
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {analysisResult && (
            <div className="mt-8 space-y-8">
              <Card className="shadow-lg animate-in fade-in-50 duration-500">
                <CardHeader>
                  <CardTitle className="font-headline">
                    Extracted Keywords
                  </CardTitle>
                  <CardDescription>
                    These are the top keywords identified from trending gigs in your category.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg animate-in fade-in-50 duration-700">
                <CardHeader>
                  <CardTitle className="font-headline">
                    Generated Gig Title
                  </CardTitle>
                   <CardDescription>
                    A catchy, keyword-optimized title for your gig.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="relative">
                     <p className="text-lg font-semibold p-4 rounded-md bg-muted pr-12">
                      {analysisResult.title}
                     </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      onClick={() =>
                        copyToClipboard(analysisResult.title, "Title")
                      }
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg animate-in fade-in-50 duration-1000">
                <CardHeader>
                  <CardTitle className="font-headline">
                    Generated Gig Description
                  </CardTitle>
                  <CardDescription>
                    A persuasive and structured description ready for your gig page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="prose dark:prose-invert prose-sm sm:prose-base max-w-none p-4 rounded-md bg-muted whitespace-pre-wrap font-body">
                      {analysisResult.description}
                    </div>
                     <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-2 text-muted-foreground hover:text-primary"
                      onClick={() =>
                        copyToClipboard(
                          analysisResult.description,
                          "Description"
                        )
                      }
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <footer className="text-center mt-12 text-sm text-muted-foreground">
            <p>Built with Firebase Studio. Powered by Genkit.</p>
        </footer>
      </div>
    </main>
  );
}
