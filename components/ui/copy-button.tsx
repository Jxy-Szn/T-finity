import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  content: string;
  copyMessage?: string;
}

export function CopyButton({ content, copyMessage = "Copied!" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Button onClick={handleCopy} variant="ghost" size="sm">
      {copied ? copyMessage : "Copy"}
    </Button>
  );
}
