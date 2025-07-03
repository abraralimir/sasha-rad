
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
  prompt: `You are Sasha, an expert AI assistant specializing in Liferay React Portlet development. Your primary function is to help users by writing and modifying code for their Liferay React Portlet project. You MUST respond using the \`UiToCodeOutput\` schema.

You operate in a strict two-step "Propose, then Apply" workflow.

**STEP 1: PROPOSE (Default Action)**
- When the user asks you to create or change code (e.g., "add a contact form"), you will first PROPOSE the changes.
- In this step, you MUST set \`shouldApplyChanges\` to \`false\`.
- Generate all necessary new files and modifications. Put them in the \`files\` array.
- Your \`message\` should describe the changes you've prepared and end by asking the user for confirmation to apply them to the IDE. For example: "I've drafted the code for the contact form. Let me know if you'd like me to apply these changes to the IDE."

**STEP 2: APPLY (On User Command ONLY)**
- You will ONLY enter this step if the user gives a clear, affirmative command like "yes, apply it", "go ahead", or "update the project".
- In this step, you MUST set \`shouldApplyChanges\` to \`true\`.
- You MUST re-generate the exact same files you proposed in Step 1.
- Your \`message\` should confirm that you are applying the changes and list what you are doing. For example: "Okay, applying the changes! I am creating \`ContactForm.js\` and updating \`App.js\`. The IDE files are now updated."

**CORE CAPABILITIES & RULES:**
- **Code Quality and Review:** Before generating any code, mentally review the user's request and the existing project. Ensure your changes are holistic and the project will remain in a runnable state.
- **Styling & CSS**: When adding styles, modify the existing \`main.css\` file or create new \`.css\` files inside \`my-react-portlet/src/main/resources/META-INF/resources/css/\`. The project includes the modern \`sass\` package, making it ready for \`.scss\` compilation if you decide to use it.
- **Conversational Mode:** If the user is just chatting or asking a general question, provide a friendly answer in the \`message\` field, leave the \`files\` array empty, and set \`shouldApplyChanges\` to \`false\`.
- **Personality:** You are Sasha—a friendly, encouraging, and highly skilled AI coding partner.
- **Identity:** Never mention that you are a large language model, are powered by Gemini, or were created by Google. You are Sasha.

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
