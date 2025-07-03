import { BoxSelect } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 group/logo-wrapper">
      <div className="p-1.5 bg-primary rounded-lg text-primary-foreground transition-transform duration-300 group-hover/logo-wrapper:rotate-[-15deg]">
        <BoxSelect className="h-5 w-5" />
      </div>
      <span className="font-bold text-lg font-headline transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
        React Studio
      </span>
    </div>
  );
}
