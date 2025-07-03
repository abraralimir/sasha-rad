

"use client";

import * as React from "react";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { initialProject, PortletFolder, findFileById, updateFileContent, addFileToTree } from "@/lib/portlet-data";
import { FileExplorer } from "@/components/file-explorer";
import { CodeEditor } from "@/components/code-editor";
import { Chatbot, type Message } from "@/components/chatbot";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Bot, Download, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { handleUiToCode, handleProjectUpload } from "@/app/actions";
import type { UiToCodeOutput } from "@/ai/flows/ui-to-code";
import type { UnzipProjectOutput } from "@/ai/flows/unzip-project";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

const CHAT_STORAGE_KEY = "sasha-chat-history-portlet";

const initialMessages: Message[] = [
    {
      sender: "bot",
      content: "Hi! I'm Sasha, your AI assistant for Liferay React Portlets. I can help you build and modify your portlet project, from a single component to a complete application.\n\nWhat can we build today?",
    },
];

export default function Home() {
  const [project, setProject] = React.useState<PortletFolder>(initialProject);
  const [activeFileId, setActiveFileId] = React.useState<string | null>("my-react-portlet/src/main/resources/META-INF/resources/js/App.js");
  const { toast } = useToast();

  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isHistoryLoaded, setIsHistoryLoaded] = React.useState(false);

  // Load messages from localStorage on mount
  React.useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
      setMessages(initialMessages);
    } finally {
        setIsHistoryLoaded(true);
    }
  }, []);

  // Save messages to localStorage whenever they change, but only after initial load
  React.useEffect(() => {
    if (isHistoryLoaded) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages to local storage", error);
      }
    }
  }, [messages, isHistoryLoaded]);
  
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleContentChange = (newContent: string) => {
    if (activeFileId) {
      const updatedProject = updateFileContent(project, activeFileId, newContent);
      setProject(updatedProject);
    }
  };

  const handleSashaBatchUpdate = (files: Array<{path: string, content: string}>) => {
    if (!files || files.length === 0) return;

    setProject(currentProject => {
        let updatedProject = currentProject;
        // Process all file changes in a loop, operating on the result of the previous change.
        // This makes the process atomic and avoids state update race conditions.
        for (const file of files) {
            const fileExists = findFileById(updatedProject, file.path);
            if (fileExists) {
                updatedProject = updateFileContent(updatedProject, file.path, file.content);
            } else {
                updatedProject = addFileToTree(updatedProject, file.path, file.content);
            }
        }
        return updatedProject;
    });

    // Set the last file in the batch as the active one to show the user the result.
    setActiveFileId(files[files.length - 1].path);
  };
  
  const findFirstFile = (folder: PortletFolder): string | null => {
    for (const child of folder.children) {
        if (child.type === 'file' && child.name.endsWith('.js')) {
            return child.id;
        }
        if (child.type === 'folder') {
            const foundId = findFirstFile(child);
            if (foundId) return foundId;
        }
    }
    return null;
  }


  const handleProjectUpdate = (newProject: PortletFolder) => {
    setProject(newProject);
    const firstFile = findFirstFile(newProject);
    setActiveFileId(firstFile);
  };

  const handleClearSession = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
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

    addFolderToZip(project, zip);
    
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

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', content: messageContent }]);
    setIsLoading(true);

    try {
      const result: UiToCodeOutput = await handleUiToCode({ prompt: messageContent });
      
      setMessages(prev => [...prev, { sender: 'bot', content: result.message, files: result.files }]);

      if (result.success && result.files && result.files.length > 0) {
        if (result.shouldApplyChanges) {
            handleSashaBatchUpdate(result.files);
            toast({ title: "Success", description: "Project files have been updated." });
        }
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

        if (result.success && result.files && result.shouldApplyChanges) {
            handleSashaBatchUpdate(result.files);
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

  if (isChatOpen) {
    return (
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
            <SheetContent className="w-full sm:w-full sm:max-w-none h-full p-0 flex flex-col">
                 <SheetHeader className="p-3 border-b flex-shrink-0">
                    <SheetTitle className="sr-only">Sasha AI</SheetTitle>
                    <SheetDescription className="sr-only">An AI assistant for Liferay React Portlet development.</SheetDescription>
                </SheetHeader>
                 <Chatbot 
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onFileUpload={handleFileUpload}
                    onClose={() => setIsChatOpen(false)}
                />
            </SheetContent>
        </Sheet>
    );
  }

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
                Clear Session
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen max-h-screen">
          <header className="flex items-center justify-between gap-4 border-b p-2 h-14 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="hidden md:flex"/>
              <h1 className="text-lg font-semibold font-headline flex-1">Portlet Studio</h1>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={handleDownloadProject}>
                  Download Project
                </Button>
              <Button onClick={() => setIsChatOpen(true)}>
                <Bot className="h-5 w-5 mr-2" />
                Sasha AI
              </Button>
              <ThemeToggle />
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
