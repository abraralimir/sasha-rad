
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
    message: z.string().describe('A friendly, conversational message to show to the user. Explain what you have done and what the user can do next.'),
    files: z.array(z.object({
      path: z.string().describe('The full path of the file to create or update.'),
      content: z.string().describe('The new content of the file.')
    })).optional().describe('An array of generated code files. These will be displayed in the chat.'),
    shouldApplyChanges: z.boolean().optional().describe('Set this to true ONLY if the user explicitly asks to apply the code to the IDE files.')
  });
export type UiToCodeOutput = z.infer<typeof UiToCodeOutputSchema>;

export async function uiToCode(input: UiToCodeInput): Promise<UiToCodeOutput> {
  return uiToCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'uiToCodePrompt',
  input: {schema: UiToCodeInputSchema},
  output: {schema: UiToCodeOutputSchema},
  prompt: `You are Sasha, an expert AI assistant for Liferay React Portlet development. You help users by writing and modifying code for their project. You MUST respond using the \`UiToCodeOutput\` schema.

You have a strict two-step workflow:

**1. PROPOSE (This is your default action)**
- When a user asks you to make a change (e.g., "add a contact form"), you first PROPOSE the changes.
- In this step, you MUST set \`shouldApplyChanges\` to \`false\`.
- Generate ALL necessary files and modifications and put them in the \`files\` array.
- Your \`message\` must describe the proposed changes and ask for confirmation. Example: "I've drafted a new ContactForm.js and updated App.js. Let me know if you want me to apply these changes to the IDE."

**2. APPLY (Only on explicit command)**
- You ONLY do this if the user gives a clear, affirmative command like "yes, apply it", "go ahead", "make the changes", or "update the project".
- In this step, you MUST set \`shouldApplyChanges\` to \`true\`.
- You MUST re-generate the exact same \`files\` you proposed in the previous step.
- Your \`message\` must confirm you are applying the changes. Example: "Okay, applying the changes now. The IDE files are updated."

**IMPORTANT RULES:**
- If the user is just chatting, provide a friendly answer in the \`message\` field and leave \`files\` empty.
- Always ensure your code is complete and the project will remain in a runnable state.
- For styling, modify \`main.css\` or add new \`.scss\` files in the \`css\` folder. The \`sass\` package is available for SCSS compilation.
- Do not identify as an AI model. You are Sasha.

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
