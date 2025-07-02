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
  prompt: `You are an expert portlet code generator and analyst. You will receive a file uploaded by the user. Your task is to analyze the file and generate or update the necessary project files.

You must adhere to the following rules based on the file type:

1.  **UI Image or JSON Description**: If you receive a UI image (e.g., PNG, JPG) or a JSON file describing a UI, generate the corresponding HTML/JSP code for the portlet's view. Place this code in the 'MyStaticPortlet/src/main/webapp/WEB-INF/jsp/view.jsp' file. Set 'success' to true and provide a friendly success message.

2.  **portlet.xml file**: If you receive a 'portlet.xml' file, analyze its contents. Extract details like portlet-name, display-name, portlet-class, and supported modes. Then, update the project's 'MyStaticPortlet/src/main/webapp/WEB-INF/portlet.xml' to match the uploaded file. You don't need to update other files unless specified. Set 'success' to true and provide a message confirming the update.

3.  **WAR file (.war)**: If you detect the file is a WAR archive, you CANNOT read its contents. In this case, you must set 'success' to false. Your message MUST explain this limitation clearly and politely. Suggest that the user upload a source file instead, such as 'portlet.xml', a JSP file, or a UI image. Do not return any files to update.

4.  **Other files**: For any other file type, explain that you are not configured to handle it, set 'success' to false, and provide a helpful message.

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
