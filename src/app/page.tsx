"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { initialProject, PortletFile, PortletFolder, findFileById, updateFileContent } from "@/lib/portlet-data";
import { FileExplorer } from "@/components/file-explorer";
import { CodeEditor } from "@/components/code-editor";
import { Chatbot } from "@/components/chatbot";
import { Logo } from "@/components/logo";

export default function Home() {
  const [project, setProject] = React.useState<PortletFolder>(initialProject);
  const [activeFileId, setActiveFileId] = React.useState<string | null>("view.jsp");
  
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleContentChange = (newContent: string) => {
    if (activeFileId) {
      setProject(prevProject => updateFileContent(prevProject, activeFileId, newContent));
    }
  };

  const handleSashaCodeUpdate = (filePath: string, newContent: string) => {
    setProject(prevProject => updateFileContent(prevProject, filePath, newContent));
    setActiveFileId(filePath);
  };
  
  const activeFile = activeFileId ? findFileById(project, activeFileId) : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen">
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
            <header className="flex items-center gap-2 border-b p-2 h-14">
              <SidebarTrigger className="hidden md:flex"/>
              <h1 className="text-lg font-semibold font-headline">Portlet IDE</h1>
            </header>
            <main className="flex-1 grid md:grid-cols-5 gap-4 p-4 overflow-hidden">
              <Card className="md:col-span-3 h-full flex flex-col">
                <CodeEditor file={activeFile} onContentChange={handleContentChange} />
              </Card>
              <Card className="md:col-span-2 h-full flex flex-col">
                <Chatbot onCodeUpdate={handleSashaCodeUpdate} />
              </Card>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
