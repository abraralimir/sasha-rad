"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clipboard, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CodeSnippetProps {
  filePath: string;
  code: string;
}

export function CodeSnippet({ filePath, code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="my-2 bg-background/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-2 border-b bg-muted/50">
        <CardTitle className="text-xs font-mono font-semibold">{filePath}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48">
            <pre className="p-3 text-xs whitespace-pre-wrap font-code">{code}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
