import MarkdownViewer from "./markdown-preview";

interface ViewOrderNotesProps {
  notes: string;
  className?: string;
}

export default function ViewOrderNotes({
  notes,
  className = "",
}: ViewOrderNotesProps) {
  if (!notes) return null;

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h3 className="font-bold mb-2">Order Notes</h3>
      <MarkdownViewer markdown={notes} />
    </div>
  );
}
