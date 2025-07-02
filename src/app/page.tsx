"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { initialProject, PortletFile, PortletFolder, findFileById, updateFileContent } from "@/lib/portlet-data";
import { FileExplorer } from "@/components/file-explorer";
import { CodeEditor } from "@/components/code-editor";
import { Chatbot, type Message } from "@/components/chatbot";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { handleUiToCode, handleProjectUpload } from "@/app/actions";
import type { UiToCodeOutput } from "@/ai/flows/ui-to-code";
import type { UnzipProjectOutput } from "@/ai/flows/unzip-project";

const initialMessages: Message[] = [
    {
      sender: "bot",
      content: "Hi! I'm Sasha, your AI portlet assistant. I can help you build and modify your project from a simple feature to a complete view.\n\nWhat can we build today?\n\n- **Request a feature**: 'Build a complete sign-up page' or 'Create a feedback form with a 5-star rating.'\n- **Upload a UI image**: I'll generate the JSP code to match the design.\n- **Upload a JSON file**: I can use it as a specification to generate a form.\n- **Upload a project**: Upload a .zip file to load your entire project and I can help you with it.",
    },
];

export default function Home() {
  const [project, setProject] = React.useState<PortletFolder>(initialProject);
  const [activeFileId, setActiveFileId] = React.useState<string | null>("MyStandardPortlet/src/main/webapp/WEB-INF/jsp/view.jsp");
  const { toast } = useToast();

  // Chat state lifted to the main page
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = React.useState(false);
  
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
    const fileId = filePath;
    const fileExists = findFileById(project, fileId);
    
    let updatedProject: PortletFolder;

    if (fileExists) {
        updatedProject = updateFileContent(project, fileId, newContent);
    } else {
        console.warn(`File not found: ${filePath}. Cannot update.`);
        updatedProject = project;
    }
    
    setProject(updatedProject);
    setActiveFileId(fileId);
  };

  const handleProjectUpdate = (newProject: PortletFolder) => {
    setProject(newProject);
    const newViewJsp = findFileById(newProject, `${newProject.name}/src/main/webapp/WEB-INF/jsp/view.jsp`);
    setActiveFileId(newViewJsp ? newViewJsp.id : null);
  };

  const handleClearSession = () => {
    setMessages(initialMessages);
    toast({
      title: "Chat Cleared",
      description: "Your conversation with Sasha has been reset.",
    });
  }

  const handleDownloadProject = async () => {
    const zip = new JSZip();
    
    const addFolderToZip = (pFolder: PortletFolder, jszipFolder: JSZip) => {
        for (const child of pFolder.children) {
            if (child.type === 'folder') {
                const newJszipFolder = jszipFolder.folder(child.name);
                if (newJszipFolder) {
                    addFolderToZip(child, newJszipFolder);
                }
            } else {
                jszipFolder.file(child.name, child.content);
            }
        }
    }

    const rootFolder = zip.folder(project.name);
    if (rootFolder) {
        addFolderToZip(project, rootFolder);
    }

    try {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${project.name}.zip`);
        toast({
          title: "Project Downloaded",
          description: "Your project has been successfully zipped and downloaded.",
        });
    } catch (e) {
        console.error(e);
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: "There was an error while creating the zip file.",
        });
    }
  };
  
  const activeFile = activeFileId ? findFileById(project, activeFileId) : null;

  // --- Chat Handlers ---
  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', content: messageContent }]);
    setIsLoading(true);

    try {
      const result: UiToCodeOutput = await handleUiToCode({ prompt: messageContent });
      
      setMessages(prev => [...prev, { sender: 'bot', content: result.message, files: result.files }]);

      if (result.success && result.files && result.files.length > 0) {
        result.files.forEach(file => handleSashaCodeUpdate(file.path, file.content));
        toast({ title: "Success", description: "Project files have been updated." });
      } else if (!result.success && result.message) {
         toast({ variant: "destructive", title: "Info", description: result.message });
      }

    } catch (error) {
      console.error(error);
      const errorMessage = "An unexpected network error occurred. Please check your connection and try again.";
      setMessages(prev => [...prev, { sender: 'bot', content: errorMessage }]);
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const processGenericUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        const result = await handleUiToCode({ fileDataUri });

        setMessages(prev => [...prev, { sender: 'bot', content: result.message, files: result.files }]);

        if (result.success && result.files) {
            result.files.forEach(file => handleSashaCodeUpdate(file.path, file.content));
            toast({ title: "Success", description: "Project files have been updated." });
        } else if (!result.success && result.message) {
            toast({ variant: "destructive", title: "Info", description: result.message });
        }
      } catch (error) {
        console.error(error);
        const errorMessage = "Sorry, I encountered an unexpected error. The AI model might be busy. Please try again in a moment.";
        setMessages(prev => [...prev, { sender: 'bot', content: errorMessage }]);
        toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setIsLoading(false);
        setMessages(prev => [...prev, { sender: 'bot', content: "Sorry, I couldn't read that file." }]);
        toast({ variant: "destructive", title: "Error", description: "File could not be read." });
    }
  };

  const processZipUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const zipFileDataUri = reader.result as string;
        const result: UnzipProjectOutput = await handleProjectUpload({ zipFileDataUri });

        setMessages(prev => [...prev, { sender: 'bot', content: result.message }]);

        if (result.success && result.project) {
            handleProjectUpdate(result.project);
            toast({ title: "Success", description: "Project loaded from zip file." });
        } else if (!result.success) {
            toast({ variant: "destructive", title: "Error", description: "Could not process zip file." });
        }
      } catch (error) {
        console.error(error);
        const errorMessage = "An unexpected error occurred while processing the zip file.";
        setMessages(prev => [...prev, { sender: 'bot', content: errorMessage }]);
        toast({ variant: "destructive", title: "Error", description: "Failed to process zip file." });
      } finally {
        setIsLoading(false);
      }
    };
     reader.onerror = () => {
        setIsLoading(false);
        setMessages(prev => [...prev, { sender: 'bot', content: "Sorry, I couldn't read that file." }]);
        toast({ variant: "destructive", title: "Error", description: "File could not be read." });
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', content: `Uploaded ${file.name}` }]);

    if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        await processZipUpload(file);
    } else {
        await processGenericUpload(file);
    }
  };

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
        <SidebarFooter>
            <Button variant="ghost" onClick={handleClearSession}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Session
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen max-h-screen">
          <header className="flex items-center justify-between gap-4 border-b p-2 h-14 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hidden md:flex"/>
              <h1 className="text-lg font-semibold font-headline flex-1">Portlet IDE</h1>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={handleDownloadProject}>
                  <Download className="h-5 w-5 mr-2" />
                  Download Project
                </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Bot className="h-5 w-5 mr-2" />
                    Sasha AI
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[500px] sm:w-[540px] p-0 flex flex-col border-l">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Sasha AI Assistant</SheetTitle>
                    <SheetDescription>
                      Your AI-powered portlet development assistant. Ask questions, upload files, or request code changes.
                    </SheetDescription>
                  </SheetHeader>
                   <Chatbot 
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onFileUpload={handleFileUpload}
                  />
                </SheetContent>
              </Sheet>
            </div>
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
