// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that generates CSS styles based on UI color and layout preferences,
 * ensuring portlet styling conventions are followed.
 *
 * - generateCssStyles - A function that handles the CSS styles generation process.
 * - GenerateCssStylesInput - The input type for the generateCssStyles function.
 * - GenerateCssStylesOutput - The return type for the generateCssStyles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCssStylesInputSchema = z.object({
  primaryColor: z
    .string()
    .describe('The primary color for the UI, in hex format (e.g., #6699CC).'),
  backgroundColor: z
    .string()
    .describe('The background color for the UI, in hex format (e.g., #F0F8FF).'),
  accentColor: z
    .string()
    .describe('The accent color for the UI, in hex format (e.g., #FFB347).'),
  headlineFont: z
    .string()
    .describe('The font family for headlines (e.g., Poppins, sans-serif).'),
  bodyFont: z
    .string()
    .describe('The font family for body text (e.g., PT Sans, sans-serif).'),
  layoutPreferences: z
    .string()
    .describe(
      'Description of the desired UI layout and arrangement of elements.'
    ),
  portletElements: z
    .string()
    .describe(
      'List of portlet elements to style, comma separated (e.g., buttons, forms, titles)'
    ),
});

export type GenerateCssStylesInput = z.infer<typeof GenerateCssStylesInputSchema>;

const GenerateCssStylesOutputSchema = z.object({
  cssStyles: z.string().describe('The generated CSS styles.'),
});

export type GenerateCssStylesOutput = z.infer<typeof GenerateCssStylesOutputSchema>;

export async function generateCssStyles(
  input: GenerateCssStylesInput
): Promise<GenerateCssStylesOutput> {
  return generateCssStylesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCssStylesPrompt',
  input: {schema: GenerateCssStylesInputSchema},
  output: {schema: GenerateCssStylesOutputSchema},
  prompt: `You are an expert CSS stylist for enterprise portal applications, specializing in creating clean, maintainable, and effective styles for portlets.

  Based on the provided UI color and layout preferences, generate CSS styles that adhere to portlet styling conventions.
  Ensure the generated CSS rules are well-formed and target the specified portlet elements.

  Use the following UI preferences:

  Primary Color: {{{primaryColor}}}
  Background Color: {{{backgroundColor}}}
  Accent Color: {{{accentColor}}}
  Headline Font: {{{headlineFont}}}
  Body Font: {{{bodyFont}}}
  Layout Preferences: {{{layoutPreferences}}}

  Generate CSS styles for the following portlet elements: {{{portletElements}}}

  The generated CSS styles should be comprehensive, covering the basic styling needs of the specified portlet elements, and should be easy to integrate into a portlet project.
  Do not include any introductory or explanatory text, only the CSS. Do not use !important unless absolutely necessary.
  Do not provide code fences around the CSS code.

  CSS Styles:`,
});

const generateCssStylesFlow = ai.defineFlow(
  {
    name: 'generateCssStylesFlow',
    inputSchema: GenerateCssStylesInputSchema,
    outputSchema: GenerateCssStylesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
