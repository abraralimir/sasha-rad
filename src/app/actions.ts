"use server";

import { uiToCode, UiToCodeInput, UiToCodeOutput } from "@/ai/flows/ui-to-code";
import { generateCssStyles, GenerateCssStylesOutput } from "@/ai/flows/generate-css-styles";
import { z } from "zod";

export async function handleUiToCode(input: UiToCodeInput): Promise<UiToCodeOutput> {
  // The input is already validated by the flow's schema, but we can add more validation here if needed
  try {
    const result = await uiToCode(input);
    return result;
  } catch (error) {
    console.error("Error in handleUiToCode:", error);
    throw new Error("Failed to generate code from UI.");
  }
}

const GenerateCssStylesClientInputSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
});

export async function handleGenerateCss(input: z.infer<typeof GenerateCssStylesClientInputSchema>): Promise<GenerateCssStylesOutput> {
    const validatedInput = GenerateCssStylesClientInputSchema.parse(input);

    try {
        const result = await generateCssStyles({
            // These values are based on the app's theme
            primaryColor: '#6699CC',
            backgroundColor: '#F0F8FF',
            accentColor: '#FFB347',
            headlineFont: 'Poppins, sans-serif',
            bodyFont: 'PT Sans, sans-serif',
            layoutPreferences: validatedInput.prompt, // Use user prompt for layout prefs
            portletElements: "buttons, forms, titles, containers, text", // Style a default set of elements
        });
        return result;
    } catch (error) {
        console.error("Error in handleGenerateCss:", error);
        throw new Error("Failed to generate CSS styles.");
    }
}
