"use client";

import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

const COPY_SUCCESS_TEXT = "Copied successfully";

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children ?? "");
  }

  return "";
}

function isConnectionString(value: string): boolean {
  const text = value.trim();

  if (text.length === 0) {
    return false;
  }

  return (
    /[a-z][a-z\d+.-]*:\/\//i.test(text) ||
    /\b(?:nc|ncat|netcat|telnet)\s+\S+\s+\d{2,5}\b/i.test(text) ||
    /\b[a-z\d.-]+:\d{2,5}\b/i.test(text)
  );
}

function useCopyTooltip() {
  const copyText = useCallback(async (value: string) => {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(value);
    toast.success(COPY_SUCCESS_TEXT);
  }, []);

  return { copyText };
}

function CopyableInlineCode({ className, value, children }: { className?: string; value: string; children: ReactNode }) {
  const { copyText } = useCopyTooltip();

  return (
    <button
      type="button"
      className="inline-flex cursor-pointer rounded-sm align-baseline"
      onClick={() => {
        void copyText(value);
      }}
      aria-label="Copy connection string"
    >
      <code className={className}>{children}</code>
    </button>
  );
}

function CopyableCodeBlock({ children, value }: { children: ReactNode; value: string }) {
  const { copyText } = useCopyTooltip();

  return (
    <div className="relative">
      <pre>{children}</pre>
      <button
        type="button"
        className="absolute inset-0 cursor-pointer rounded-md"
        onClick={() => {
          void copyText(value);
        }}
        aria-label="Copy connection string"
      />
    </div>
  );
}

export function ChallengeMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          const codeElement = Children.only(children) as ReactElement<{ children?: ReactNode }>;
          const value = extractText(codeElement.props.children).replace(/\n$/, "");

          if (!isConnectionString(value)) {
            return <pre>{children}</pre>;
          }

          return <CopyableCodeBlock value={value}>{children}</CopyableCodeBlock>;
        },
        code({ className, children }) {
          const value = extractText(children).replace(/\n$/, "");

          if (className != null) {
            return <code className={className}>{children}</code>;
          }

          if (!isConnectionString(value)) {
            return <code>{children}</code>;
          }

          return <CopyableInlineCode value={value}>{children}</CopyableInlineCode>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
