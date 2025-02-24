const POSSIBLE_DOC_TYPES: Record<string, string> = {
  pdf: "PDF",
  doc: "Word",
  docx: "Word",
  xls: "Excel",
  xlsx: "Excel",
};

export const getDocumentType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return POSSIBLE_DOC_TYPES[extension] || "Document";
};
