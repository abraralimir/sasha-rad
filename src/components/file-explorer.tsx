"use client";

import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PortletEntry, PortletFolder } from "@/lib/portlet-data";
import { FileText, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
  project: PortletFolder;
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
}

export function FileExplorer({ project, activeFileId, onFileSelect }: FileExplorerProps) {
  return (
    <div className="p-2">
      <FileTree items={[project]} activeFileId={activeFileId} onFileSelect={onFileSelect} defaultOpen={true} />
    </div>
  );
}

interface FileTreeProps {
  items: PortletEntry[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  defaultOpen?: boolean;
}

function FileTree({ items, activeFileId, onFileSelect, defaultOpen = false }: FileTreeProps) {
  const [openFolders, setOpenFolders] = React.useState<string[]>(defaultOpen ? items.filter(item => item.type === 'folder').map(item => item.id) : []);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  return (
    <Accordion type="multiple" value={openFolders} onValueChange={setOpenFolders} className="w-full">
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {item.type === "folder" ? (
            <AccordionItem value={item.id} className="border-none">
              <AccordionTrigger 
                className={cn(
                  "py-1 px-2 rounded-md hover:no-underline hover:bg-sidebar-accent text-sidebar-foreground",
                  "data-[state=open]:bg-sidebar-accent"
                )}
              >
                <div className="flex items-center gap-2">
                  {openFolders.includes(item.id) ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4" />}
                  <span className="font-sans text-sm">{item.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4 border-l border-sidebar-border ml-2">
                <FileTree items={item.children} activeFileId={activeFileId} onFileSelect={onFileSelect} />
              </AccordionContent>
            </AccordionItem>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-8 px-2 py-1 my-0.5",
                activeFileId === item.id && "bg-primary/20 text-primary-foreground font-semibold"
              )}
              onClick={() => onFileSelect(item.id)}
            >
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="font-sans text-sm truncate">{item.name}</span>
            </Button>
          )}
        </React.Fragment>
      ))}
    </Accordion>
  );
}
