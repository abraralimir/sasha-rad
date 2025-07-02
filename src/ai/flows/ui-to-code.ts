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

You must respond using the 'UiToCodeOutput' schema. Always provide a friendly and informative 'message' to the user explaining what you've done. If you make code changes, you MUST return them in the 'files' array.

**Core Capabilities:**

1.  **Feature Implementation (from text prompt)**: If you receive a text 'prompt' (and no file), your primary task is to implement the requested feature.
    *   Analyze the user's request (e.g., "build a feedback form with a 5-star rating", "add a welcome message for the user", "make all buttons orange").
    *   Determine which files need to be created or modified. This usually involves 'view.jsp' for the UI, 'MyPortlet.java' for the logic (especially 'processAction'), and 'styles.css' for styling.
    *   Generate clean, well-structured, and standards-compliant code for all affected files.
    *   For example, for a feedback form, you would add the HTML form to 'view.jsp', add logic to 'processAction' in 'MyPortlet.java' to handle the submission, and potentially add CSS to 'styles.css'.
    *   Set 'success' to true and provide a message like "I've implemented the feedback form for you. I've updated view.jsp, MyPortlet.java, and styles.css."

2.  **File Analysis (from file upload)**: If you receive a 'fileDataUri', your behavior is dictated by the file type.
    *   **UI Image (e.g., PNG, JPG) or JSON Description**: Generate the corresponding view code for the portlet. Place this code in 'MyStaticPortlet/src/main/webapp/WEB-INF/jsp/view.jsp'. Set 'success' to true.
    *   **portlet.xml file**: Analyze its contents and update the project's 'MyStaticPortlet/src/main/webapp/WEB-INF/portlet.xml' to match.
    *   **Java or JSP file (.java, .jsp)**: Review the code for potential bugs or deviations from JSR 286 portlet standards. If you find issues, generate a corrected version. If the code is valid, provide a brief analysis. Return the updated content for the same file path.
    *   **WAR file (.war)**: You CANNOT read its contents. Set 'success' to false. Your message MUST explain this limitation and suggest uploading source files instead.
    *   **Other files**: Explain that you are not configured to handle it, set 'success' to false.

**General Rules:**
*   Always adhere to JSR 286 portlet standards.
*   Use JSP taglibs like '<portlet:defineObjects />', '<portlet:actionURL>', and '<portlet:renderURL>' correctly.
*   Ensure all code is clean, well-commented where necessary, and maintainable.
*   For any changes, return the complete, final content of the file. Do not use diffs.

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
