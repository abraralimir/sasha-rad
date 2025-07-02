'use server';

/**
 * @fileOverview This flow takes a UI image or JSON file describing the UI and generates the corresponding code for the portlet.
 *
 * - uiToCode - A function that handles the UI to code generation process.
 * - UiToCodeInput - The input type for the uiToCode function.
 * - UiToCodeOutput - The return type for the uiToCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UiToCodeInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A data URI containing either a UI image or a JSON file describing the UI.  Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
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
  prompt: `You are an expert portlet code generator and analyst. You will receive a file uploaded by the user. Your task is to analyze the file and generate or update the necessary project files. Your goal is to be as helpful as possible, acting as an AI assistant for portlet development.

You must adhere to the following rules based on the file type:

1.  **UI Image (e.g., PNG, JPG) or JSON Description**: If you receive a UI image or a JSON file describing a UI, your primary task is to generate the corresponding view code.
    *   Generate clean, well-structured JSP code for the portlet's view.
    *   Place this code in the 'MyStaticPortlet/src/main/webapp/WEB-INF/jsp/view.jsp' file.
    *   Set 'success' to true and provide a friendly success message about the UI generation.

2.  **portlet.xml file**: If you receive a 'portlet.xml' file, analyze its contents.
    *   Extract details like portlet-name, display-name, portlet-class, and supported modes.
    *   Update the project's 'MyStaticPortlet/src/main/webapp/WEB-INF/portlet.xml' to match the uploaded file's configuration.
    *   Set 'success' to true and provide a message confirming the update and summarizing what was changed.

3.  **Java or JSP file (.java, .jsp)**: If you receive a Java or JSP source file, analyze it for common issues.
    *   Review the code for potential bugs, missing imports, or deviations from JSR 286 portlet standards.
    *   If you find issues, generate a corrected version of the file's content.
    *   If the code is valid, provide a brief analysis of what the code does and suggest a potential improvement or optimization.
    *   Return the updated content for the *same file path* it would logically belong to in the project structure. If the file doesn't exist, you can add it. For example, a file named \`MyNewPortlet.java\` should be placed in \`MyStaticPortlet/src/main/java/com/example/portlet/MyNewPortlet.java\`.
    *   Set 'success' to true and your message should summarize your findings and actions.

4.  **WAR file (.war)**: If you detect the file is a WAR archive, you CANNOT read its contents.
    *   Set 'success' to false.
    *   Your message MUST explain this limitation clearly and politely. Suggest that the user upload source files instead, such as 'portlet.xml', a JSP file, a Java file, or a UI image. Do not return any files to update.

5.  **Other files**: For any other file type, explain that you are not configured to handle it, set 'success' to false, and provide a helpful message.

Always populate the output schema correctly. For successful operations, provide the file path(s) and new content in the 'files' array.

Input File:
{{media url=fileDataUri}}
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
