"use client";

import { PortletFile } from "@/lib/portlet-data";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCode2, Code } from "lucide-react";

interface CodeEditorProps {
  file: PortletFile | null;
  onContentChange: (newContent: string) => void;
}

export function CodeEditor({ file, onContentChange }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <Code className="h-16 w-16 mb-4" />
        <h2 className="text-xl font-semibold font-headline">Select a file</h2>
        <p>Choose a file from the explorer to start editing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 border-b bg-muted/50">
        <div className="inline-flex items-center p-2 border-b-2 border-primary bg-background">
          <FileCode2 className="h-4 w-4 mr-2 text-primary" />
          <span className="font-semibold text-sm font-headline">{file.name}</span>
        </div>
      </div>
      <ScrollArea className="flex-1 bg-background">
        <Textarea
          value={file.content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full h-full p-4 font-code text-sm !border-none !ring-0 !outline-none resize-none leading-relaxed bg-transparent"
          placeholder="Start coding..."
        />
      </ScrollArea>
    </div>
  );
}
