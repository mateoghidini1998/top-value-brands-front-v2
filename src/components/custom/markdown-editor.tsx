"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Importamos dinámicamente para evitar problemas de SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Escribe tus notas en markdown...",
  height = 200,
}: MarkdownEditorProps) {
  // Estado local para manejar el valor
  const [markdownValue, setMarkdownValue] = useState<string>(value);

  // Actualizar el estado local cuando cambia el valor de prop
  useEffect(() => {
    setMarkdownValue(value);
  }, [value]);

  // Manejar cambios y propagar al componente padre
  const handleChange = (val: string | undefined) => {
    const newValue = val || "";
    setMarkdownValue(newValue);
    onChange(newValue);
  };

  return (
    <div data-color-mode="auto">
      <MDEditor
        // light mode
        data-color-mode="light"
        value={markdownValue}
        onChange={handleChange}
        height={height}
        preview="edit"
        // @ts-expect-error @typescript-eslint/no-unsafe-member-access
        placeholder={placeholder}
        className="w-full rounded-lg border-gray-300 bg-white"
      />
    </div>
  );
}
