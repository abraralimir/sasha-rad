"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Bot, User, Loader2, Wand2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { UiToCodeOutput } from "@/ai/flows/ui-to-code";
import { CodeSnippet } from "@/components/code-snippet";

export type Message = {
  sender: "user" | "bot";
  content: string;
  files?: UiToCodeOutput['files'];
};

interface ChatbotProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  onClose?: () => void;
}

export function Chatbot({ messages, isLoading, onSendMessage, onFileUpload, onClose }: ChatbotProps) {
  const [inputValue, setInputValue] = React.useState("");
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


  const handleFileUploadEvent = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await onFileUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessageEvent = async () => {
    const messageToSend = inputValue;
    setInputValue("");
    await onSendMessage(messageToSend);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold font-headline">Sasha AI</h2>
        </div>
        <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-accent" />
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
                <X className="h-5 w-5" />
              </Button>
            )}
        </div>
      </header>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2", message.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/32x32/6699CC/FFFFFF.png" alt="Sasha AI" data-ai-hint="robot" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-xs md:max-w-md rounded-lg", message.sender === 'user' ? "bg-primary text-primary-foreground p-3" : "w-full")}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.files && message.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.files.map((file) => (
                        <CodeSnippet key={file.path} filePath={file.path} code={file.content} />
                    ))}
                  </div>
                )}
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
            placeholder="e.g., 'Build a feedback form with a 5-star rating...'"
            className="pr-20 min-h-[60px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessageEvent();
                }
            }}
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
             <input type="file" ref={fileInputRef} onChange={handleFileUploadEvent} className="hidden" accept="image/*,application/json,text/xml,.xml,.war,application/java-archive,application/zip,.java,.jsp" disabled={isLoading} />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading} aria-label="Upload file">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={handleSendMessageEvent} disabled={isLoading || !inputValue.trim()} aria-label="Send message">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
