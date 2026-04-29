"use client";

import * as React from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
  label?: string;
}

export function CopyButton({
  value,
  label = "Copy",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard unavailable (e.g. insecure context). Silently fail —
      // the text is still selectable in the <pre> block.
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onCopy}
      aria-label={copied ? "Copied" : label}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {copied ? (
        <IconCheck className="size-4" aria-hidden="true" />
      ) : (
        <IconCopy className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">{copied ? "Copied" : label}</span>
    </Button>
  );
}
