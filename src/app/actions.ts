"use server";

import { uiToCode, UiToCodeInput, UiToCodeOutput } from "@/ai/flows/ui-to-code";
import { unzipProject, UnzipProjectInput, UnzipProjectOutput } from "@/ai/flows/unzip-project";

export async function handleUiToCode(input: UiToCodeInput): Promise<UiToCodeOutput> {
  // The input is already validated by the flow's schema, but we can add more validation here if needed
  try {
    const result = await uiToCode(input);
    return result;
  } catch (error) {
    console.error("Error in handleUiToCode:", error);
    return {
      success: false,
      message: "Sorry, I couldn't process that. The AI model might be busy or the request wasn't supported. Please try again.",
    };
  }
}

export async function handleProjectUpload(input: UnzipProjectInput): Promise<UnzipProjectOutput> {
    try {
        const result = await unzipProject(input);
        return result;
    } catch (error) {
        console.error("Error in handleProjectUpload:", error);
        return {
            success: false,
            message: "Sorry, I couldn't process that zip file. It might be corrupted or in an unsupported format. Please try again.",
        };
    }
}
