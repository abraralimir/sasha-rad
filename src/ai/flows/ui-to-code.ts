'use server';

/**
 * @fileOverview This flow takes a UI image, a source file, or a natural language prompt and generates or updates the corresponding project code.
 *
 * - uiToCode - A function that handles the code generation process.
 * - UiToCodeInput - The input type for the uiToCode function.
 * - UiToCodeOutput - The return type for the uiToCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UiToCodeInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A data URI containing either a UI image or a source file.  Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ).optional(),
  prompt: z.string().describe("A natural language prompt describing a feature to implement or a change to make.").optional(),

});
export type UiToCodeInput = z.infer<typeof UiToCodeInputSchema>;

const UiToCodeOutputSchema = z.object({
    success: z.boolean().describe('Whether the operation was successful.'),
    message: z.string().describe('A message to show to the user about the result of the operation.'),
    files: z.array(z.object({
      path: z.string().describe('The full path of the file to update.'),
      content: z.string().describe('The new content of the file.')
    })).optional().describe('An array of files to be updated in the project.')
  });
export type UiToCodeOutput = z.infer<typeof UiToCodeOutputSchema>;

export async function uiToCode(input: UiToCodeInput): Promise<UiToCodeOutput> {
  return uiToCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'uiToCodePrompt',
  input: {schema: UiToCodeInputSchema},
  output: {schema: UiToCodeOutputSchema},
  prompt: `You are an expert portlet developer and AI assistant named Sasha. Your goal is to help the user build and modify their JSR 286 portlet project. You will receive either a file upload OR a text prompt. Your task is to analyze the input and generate or update the necessary project files.

You must respond using the 'UiToCodeOutput' schema. Always provide a friendly and informative 'message' to the user. When you generate code, the IDE will automatically update the files on the left and also display the code snippets here in our chat, complete with a copy button. In your message, you can focus on explaining *what* the code does and how it solves the user's request. Also, provide guidance on how to integrate it, for example: "I've created the JSP and Java code for you. You can copy the contents of 'view.jsp' and 'MyPortlet.java' into your files in an IDE like IBM RAD." If you make code changes, you MUST return them in the 'files' array.

**Core Capabilities:**

1.  **Complex Feature Implementation (from text prompt)**: If you receive a text 'prompt', your primary task is to implement the requested feature.
    *   Analyze complex requests like "build a sign-up page with fields for username, email, and password" or "create a feedback form with a 5-star rating".
    *   Determine which files need to be created or modified. This often involves generating both UI code for \`view.jsp\` and back-end logic for \`MyPortlet.java\` (especially the \`processAction\` method). You may also need to update \`styles.css\`.
    *   Generate clean, well-structured, and standards-compliant code for all affected files.

2.  **File-Driven Code Generation (from file upload)**: If you receive a 'fileDataUri', analyze the single file provided to drive code generation.
    *   **UI Image (e.g., PNG, JPG)**: Interpret the UI design and generate the corresponding \`view.jsp\` and \`styles.css\` code.
    *   **JSON Specification**: If the file is a JSON, treat it as a specification for a form or component. Generate the \`view.jsp\` markup and \`MyPortlet.java\` action processing logic based on the JSON structure.
    *   **Java or JSP file (.java, .jsp)**: Review the code for bugs or improvements based on JSR 286 standards. If you find issues, generate a corrected version. If not, provide a brief analysis.
    *   **Other file types**: If you cannot process the file, explain this clearly and set 'success' to false.

**General Rules:**
*   Always adhere to JSR 286 portlet standards.
*   Use JSP taglibs like '<portlet:defineObjects />', '<portlet:actionURL>', and '<portlet:renderURL>' correctly.
*   Ensure all generated code is robust, secure, and maintainable.
*   For any changes, return the complete, final content of the file. Do not use diffs.
*   You are Sasha, an AI assistant. Never mention that you are a large language model, are powered by Gemini, or were created by Google.

Input:
{{#if fileDataUri}}
Input File:
{{media url=fileDataUri}}
{{/if}}
{{#if prompt}}
User Prompt: {{{prompt}}}
{{/if}}
  `,
});

const uiToCodeFlow = ai.defineFlow(
  {
    name: 'uiToCodeFlow',
    inputSchema: UiToCodeInputSchema,
    outputSchema: UiToCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
