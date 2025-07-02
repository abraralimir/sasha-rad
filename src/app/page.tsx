"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { initialProject, PortletFile, PortletFolder, findFileById, updateFileContent } from "@/lib/portlet-data";
import { FileExplorer } from "@/components/file-explorer";
import { CodeEditor } from "@/components/code-editor";
import { Chatbot } from "@/components/chatbot";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";


export default function Home() {
  const [project, setProject] = React.useState<PortletFolder>(initialProject);
  // Set the default active file to the new view.jsp
  const [activeFileId, setActiveFileId] = React.useState<string | null>("MyStaticPortlet/src/main/webapp/WEB-INF/jsp/view.jsp");
  
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleContentChange = (newContent: string) => {
    if (activeFileId) {
      const updatedProject = updateFileContent(project, activeFileId, newContent);
      setProject(updatedProject);
    }
  };

  const handleSashaCodeUpdate = (filePath: string, newContent: string) => {
    const fileId = filePath; // In our structure, path and id are the same
    const fileExists = findFileById(project, fileId);
    
    let updatedProject: PortletFolder;

    if (fileExists) {
        updatedProject = updateFileContent(project, fileId, newContent);
    } else {
        // This part is a bit tricky as we don't have a function to add new files.
        // For now, we assume AI will only update existing files.
        // A more robust implementation would require an `addFile` function.
        console.warn(`File not found: ${filePath}. Cannot update.`);
        updatedProject = project; // Return original project
    }
    
    setProject(updatedProject);
    setActiveFileId(fileId);
  };

  const handleProjectUpdate = (newProject: PortletFolder) => {
    setProject(newProject);
    setActiveFileId(null); // Deselect any active file
  };
  
  const activeFile = activeFileId ? findFileById(project, activeFileId) : null;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Logo />
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <FileExplorer 
            project={project} 
            activeFileId={activeFileId} 
            onFileSelect={handleFileSelect} 
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen max-h-screen">
          <header className="flex items-center gap-4 border-b p-2 h-14 shrink-0">
            <SidebarTrigger className="hidden md:flex"/>
            <h1 className="text-lg font-semibold font-headline flex-1">Portlet IDE</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Bot className="h-5 w-5 mr-2" />
                  Sasha AI
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[500px] sm:w-[540px] p-0 flex flex-col border-l">
                <SheetHeader className="sr-only">
                  <SheetTitle>Sasha AI</SheetTitle>
                  <SheetDescription>
                    Your AI-powered portlet development assistant. Ask questions, upload files, or request code changes.
                  </SheetDescription>
                </SheetHeader>
                <Chatbot onCodeUpdate={handleSashaCodeUpdate} onProjectUpdate={handleProjectUpdate} />
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex-1 p-4 overflow-hidden">
            <Card className="h-full w-full rounded-lg border overflow-hidden">
              <CodeEditor file={activeFile} onContentChange={handleContentChange} />
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
