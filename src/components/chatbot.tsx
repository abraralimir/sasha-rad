"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Bot, User, Loader2, Wand2 } from "lucide-react";
import { handleUiToCode, handleGenerateCss, handleProjectUpload, type GenerateCssClientOutput } from "@/app/actions";
import type { UnzipProjectOutput } from "@/ai/flows/unzip-project";
import type { PortletFolder } from "@/lib/portlet-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatbotProps {
  onCodeUpdate: (filePath: string, newContent: string) => void;
  onProjectUpdate: (project: PortletFolder) => void;
}

type Message = {
  sender: "user" | "bot";
  content: string;
};

export function Chatbot({ onCodeUpdate, onProjectUpdate }: ChatbotProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: "bot",
      content: "Hi! I'm Sasha, your AI portlet assistant. I can help you code, style elements, or analyze files. \n\nWhat can we build today? \n\n- Ask me to make changes (e.g., 'Make all buttons orange').\n- Upload a UI image, JSON, or source file for me to analyze.\n- Upload a .zip file to load an entire project.",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const processGenericUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        const result = await handleUiToCode({ fileDataUri });

        if (result.message) {
            setMessages(prev => [...prev, { sender: 'bot', content: result.message }]);
        }
        if (result.success && result.files) {
            result.files.forEach(file => onCodeUpdate(file.path, file.content));
            toast({ title: "Success", description: "Project files have been updated." });
        } else if (!result.success) {
            toast({ variant: "destructive", title: "Info", description: "Please see the message from Sasha for details." });
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

        if (result.message) {
            setMessages(prev => [...prev, { sender: 'bot', content: result.message }]);
        }
        if (result.success && result.project) {
            onProjectUpdate(result.project);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', content: `Uploaded ${file.name}` }]);

    if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        await processZipUpload(file);
    } else {
        await processGenericUpload(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const result: GenerateCssClientOutput = await handleGenerateCss({ prompt: userMessage });
      
      if (result.success && result.cssStyles) {
        const cssPath = "MyStaticPortlet/src/main/webapp/css/styles.css";
        onCodeUpdate(cssPath, result.cssStyles);
        setMessages(prev => [...prev, { sender: 'bot', content: "I've analyzed your request and updated styles.css with new styles." }]);
        toast({ title: "Success", description: "styles.css has been updated." });
      } else {
        const errorMessage = result.message || "I had some trouble with that request. Could you try rephrasing?";
        setMessages(prev => [...prev, { sender: 'bot', content: errorMessage }]);
        toast({ variant: "destructive", title: "Error", description: "Could not generate CSS styles." });
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

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold font-headline">Sasha AI</h2>
        </div>
        <Wand2 className="h-5 w-5 text-accent" />
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/32x32/6699CC/FFFFFF.png" alt="Sasha AI" data-ai-hint="robot" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-xs md:max-w-md p-3 rounded-lg", message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
               {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User/></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/32x32/6699CC/FFFFFF.png" alt="Sasha AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-3 border-t bg-background flex-shrink-0">
        <div className="relative">
          <Textarea
            placeholder="e.g., 'Make all buttons orange with rounded corners.'"
            className="pr-20 min-h-[60px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/json,text/xml,.xml,.war,application/java-archive,application/zip,.java,.jsp" disabled={isLoading} />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading} aria-label="Upload file">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
