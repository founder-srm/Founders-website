import { cn } from "@/lib/utils";
import React from "react";

interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys?: string[];
  size?: "sm" | "md";
}

export function KeyboardShortcut({ 
  className, 
  keys = [], 
  size = "md",
  ...props 
}: KeyboardShortcutProps) {
  return (
    <span className={cn("flex gap-1 items-center", className)} {...props}>
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className={cn(
            "flex h-5 items-center justify-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground",
            size === "sm" && "h-4 px-1 text-[9px]"
          )}>
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-xs text-muted-foreground">+</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
