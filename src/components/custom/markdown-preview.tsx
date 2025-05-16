"use client";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";

// Importamos dinámicamente para evitar problemas de SSR
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

interface MarkdownViewerProps {
  markdown: string;
  className?: string;
}

export default function MarkdownViewer({
  markdown,
  className = "",
}: MarkdownViewerProps) {
  return (
    <div data-color-mode="light" className={className}>
      <MarkdownPreview source={markdown} />
    </div>
  );
}
