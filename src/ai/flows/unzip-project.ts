// This file is machine-generated - edit at your own risk!

'use server';
/**
 * @fileOverview An agent that unzips a project archive, analyzes it, and returns its file structure.
 *
 * - unzipProject - A function that handles the unzipping and analysis process.
 * - UnzipProjectInput - The input type for the unzipProject function.
 * - UnzipProjectOutput - The return type for the unzipProject function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';
import type { PortletFolder, PortletEntry } from '@/lib/portlet-data';

// Zod schema for validating the portlet file structure, including recursion
const PortletFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal('file'),
  path: z.string(),
  content: z.string(),
});

// We have to use z.lazy to handle the recursive type definition for folders containing children.
const LazyPortletFolderSchema: z.ZodType<PortletFolder> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.literal('folder'),
    path: z.string(),
    children: z.array(z.union([PortletFileSchema, LazyPortletFolderSchema])),
  })
);

const UnzipProjectInputSchema = z.object({
  zipFileDataUri: z
    .string()
    .describe(
      "A zip file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/zip;base64,<encoded_data>'."
    ),
});
export type UnzipProjectInput = z.infer<typeof UnzipProjectInputSchema>;

const UnzipProjectOutputSchema = z.object({
  success: z.boolean().describe('Whether the operation was successful.'),
  message: z.string().describe('A message to show to the user about the result of the operation.'),
  project: LazyPortletFolderSchema.optional().describe('The unzipped project structure.'),
});
export type UnzipProjectOutput = z.infer<typeof UnzipProjectOutputSchema>;

export async function unzipProject(
  input: UnzipProjectInput
): Promise<UnzipProjectOutput> {
  return unzipProjectFlow(input);
}

const analyzeProjectPrompt = ai.definePrompt({
    name: 'analyzeProjectPrompt',
    input: {schema: z.object({fileList: z.string()})},
    output: {schema: z.object({analysis: z.string()})},
    prompt: `You are an expert software architect. A user has uploaded a zip file containing a project. Based on the following list of file paths, provide a friendly, one-paragraph analysis of the project's likely purpose and technology stack. Start your response with "I've loaded your project. Here's what I see:".

File paths:
{{{fileList}}}
`
});


const unzipProjectFlow = ai.defineFlow(
  {
    name: 'unzipProjectFlow',
    inputSchema: UnzipProjectInputSchema,
    outputSchema: UnzipProjectOutputSchema,
  },
  async (input) => {
    try {
      const b64 = input.zipFileDataUri.substring(
        input.zipFileDataUri.indexOf(',') + 1
      );
      const zip = await JSZip.loadAsync(b64, { base64: true });

      const fileEntries = Object.values(zip.files).filter((file) => !file.dir);
      if (fileEntries.length === 0) {
        return { success: false, message: 'The zip file is empty or does not contain any files.' };
      }

      // Determine a root folder name. Use the name of the first entry's top-level directory.
      const firstPath = fileEntries[0].name;
      const projectName = firstPath.includes('/') ? firstPath.split('/')[0] : 'unzipped-project';

      const rootFolder: PortletFolder = {
        id: projectName,
        name: projectName,
        type: 'folder',
        path: projectName,
        children: [],
      };

      await Promise.all(
        fileEntries.map(async (file) => {
          const content = await file.async('string');
          addFileToTree(file.name, content, rootFolder);
        })
      );
      
      const filePaths = fileEntries.map(file => file.name).join('\n');
      const { output } = await analyzeProjectPrompt({fileList: filePaths});
      const analysisMessage = output?.analysis || "I've loaded your project from the zip file.";
      
      // If the root folder has only one child that is also a folder, it's likely a container directory.
      // In that case, we can "unwrap" it to provide a cleaner file tree.
      if (rootFolder.children.length === 1 && rootFolder.children[0].type === 'folder') {
          return {
            success: true,
            message: analysisMessage,
            project: rootFolder.children[0] as PortletFolder,
          };
      }


      return {
        success: true,
        message: analysisMessage,
        project: rootFolder,
      };

    } catch (error: any) {
      console.error("Failed to unzip project:", error);
      return { success: false, message: `I ran into an error trying to unzip that file: ${error.message}` };
    }
  }
);


function addFileToTree(filePath: string, content: string, root: PortletFolder) {
    const parts = filePath.split('/').filter(p => p.length > 0);
    let currentNode: PortletFolder = root;
    let currentPath = root.path;

    // Traverse or create folders for the file's path
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        currentPath = `${currentPath}/${part}`;
        let nextNode = currentNode.children.find(
            (child): child is PortletFolder => child.name === part && child.type === 'folder'
        );

        if (!nextNode) {
            nextNode = {
                id: currentPath,
                name: part,
                type: 'folder',
                path: currentPath,
                children: [],
            };
            currentNode.children.push(nextNode);
        }
        currentNode = nextNode;
    }

    // Add the file to the final folder
    const fileName = parts[parts.length - 1];
    if (fileName) {
        currentPath = `${currentPath}/${fileName}`;
        currentNode.children.push({
            id: currentPath,
            name: fileName,
            type: 'file',
            path: currentPath,
            content: content,
        });
    }
}
