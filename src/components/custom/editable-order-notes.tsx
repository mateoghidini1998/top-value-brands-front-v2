"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Pencil, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MarkdownViewer from "./markdown-preview";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

// Editor cargado solo en cliente
const MarkdownEditor = dynamic(() => import("./markdown-editor"), {
  ssr: false,
});

interface EditableOrderNotesProps {
  notes: string;
  orderId: string;
  onAction: (args: { notes: string; orderId: string }) => void;
}

export default function EditableOrderNotes({
  notes,
  orderId,
  onAction,
}: EditableOrderNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(notes);

  // Si las notas externas cambian, resetea el borrador
  useEffect(() => {
    setDraft(notes);
  }, [notes]);

  const startEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setDraft(notes);
    setIsEditing(false);
  };
  const saveEdit = () => {
    onAction({ orderId, notes: draft });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex items-center">
        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={startEdit}
            className="ml-auto"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
        ) : (
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={saveEdit}>
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEdit}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <MarkdownEditor
            value={draft}
            onChange={setDraft}
            placeholder="Escribe tus notas en markdown..."
            height={200}
          />
        ) : draft ? (
          <MarkdownViewer markdown={draft} />
        ) : (
          <p className="text-xs text-muted-foreground">No notes available</p>
        )}
      </CardContent>
    </Card>
  );
}
