"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Bot, User, Loader2, Wand2 } from "lucide-react";
import { handleUiToCode, handleGenerateCss } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatbotProps {
  onCodeUpdate: (filePath: string, newContent: string) => void;
}

type Message = {
  sender: "user" | "bot";
  content: string;
};

export function Chatbot({ onCodeUpdate }: ChatbotProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: "bot",
      content: "Hi! I'm Sasha, your AI portlet assistant. How can I help you today? You can ask me to style elements or upload a UI design.",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { sender: 'user', content: `Uploaded ${file.name}` }]);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        const result = await handleUiToCode({ fileDataUri });
        
        const viewJspPath = "MyStaticPortlet/src/main/webapp/WEB-INF/jsp/view.jsp";
        onCodeUpdate(viewJspPath, result.code);
        setMessages(prev => [...prev, { sender: 'bot', content: "I've updated view.jsp based on your upload. Take a look!" }]);
        toast({ title: "Success", description: "view.jsp has been updated." });

      } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, { sender: 'bot', content: "Sorry, I had trouble processing that file." }]);
        toast({ variant: "destructive", title: "Error", description: "Could not generate code from file." });
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { sender: 'user', content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simplified logic: assume any message is a style request
      const result = await handleGenerateCss({ prompt: userMessage });
      const cssPath = "MyStaticPortlet/src/main/webapp/css/styles.css";
      onCodeUpdate(cssPath, result.cssStyles);
      setMessages(prev => [...prev, { sender: 'bot', content: "I've analyzed your request and updated styles.css with new styles." }]);
      toast({ title: "Success", description: "styles.css has been updated." });
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', content: "I had some trouble with that request. Could you try rephrasing?" }]);
      toast({ variant: "destructive", title: "Error", description: "Could not generate CSS styles." });
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
                <p className="text-sm">{message.content}</p>
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
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/json" disabled={isLoading} />
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
