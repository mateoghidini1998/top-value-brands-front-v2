"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Upload, Download, Loader2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncomingOrdersService } from "@/services/incoming-orders-service";
import { apiRequest } from "@/helpers/http.adapter";
import { cn } from "@/lib/utils";
import { getDocumentType } from "@/helpers";

const incomingOrdersService = new IncomingOrdersService(apiRequest);

export default function UploadInvoiceFile({ orderId }: { orderId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const fileList = await incomingOrdersService.listInvoiceFiles(orderId);
      setFiles(fileList);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      await incomingOrdersService.uploadInvoiceFile(file, orderId);
      await fetchFiles();
      setFile(null);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
      alert(
        "Upload failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    setDownloadingFile(fileName);
    try {
      const blob = await incomingOrdersService.downloadInvoiceFile(
        orderId,
        fileName
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "Download failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background border rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Purchase Order Documents
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload and manage purchase order related documents
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 group">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-muted-foreground transition-colors",
              "group-hover:border-primary group-hover:text-primary",
              "dark:group-hover:border-blue-400 dark:group-hover:text-blue-400"
            )}
          >
            <Upload className="mr-2 h-4 w-4" />
            {file ? file.name : "Choose file"}
          </Button>
        </div>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={cn(
            "min-w-[100px]",
            "bg-blue-600 hover:bg-blue-500",
            "dark:bg-blue-500 dark:hover:bg-blue-400"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Available Files</h4>
          {files.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoadingFiles ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((fileName) => (
              <li
                key={fileName}
                className={cn(
                  "flex items-center justify-between p-3",
                  "bg-muted/50 hover:bg-muted/80 rounded-lg",
                  "transition-colors duration-200"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-md bg-background p-2 border">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {fileName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {`${getDocumentType(fileName)} Document`}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(fileName)}
                  disabled={downloadingFile === fileName}
                  className="ml-4 shrink-0"
                >
                  {downloadingFile === fileName ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-lg">
            <File className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              No documents uploaded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
