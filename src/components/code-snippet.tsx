"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clipboard, Check, Expand, Minimize } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CodeSnippetProps {
  filePath: string;
  code: string;
}

export function CodeSnippet({ filePath, code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="my-2 bg-muted overflow-hidden transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between p-2 border-b bg-muted/50">
        <CardTitle className="text-xs font-mono font-semibold text-muted-foreground">{filePath}</CardTitle>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-7 w-7 text-muted-foreground hover:bg-accent" aria-label={isExpanded ? 'Collapse code snippet' : 'Expand code snippet'}>
            {isExpanded ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 text-muted-foreground hover:bg-accent" aria-label="Copy code">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className={cn("transition-all duration-300", isExpanded ? 'h-[60vh]' : 'h-48')}>
            <pre className="p-3 text-sm whitespace-pre-wrap font-code text-foreground">{code}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
