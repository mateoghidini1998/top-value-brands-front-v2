"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScanBarcode } from "lucide-react";

const ScanButton: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scan, setScan] = useState<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCamera = async () => {
    if (!scan) {
      try {
        const mediaScan = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setScan(mediaScan);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaScan;
        }
      } catch (error) {
        console.error("Error opening camera", error);
      }
    } else {
      scan.getTracks().forEach((track) => track.stop());
      setScan(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      toggleCamera();
    } else {
      if (scan) {
        scan.getTracks().forEach((track) => track.stop());
        setScan(null);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-10 right-[20px] z-50 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 shadow-lg hover:bg-blue-100 dark:hover:bg-gray-700"
        >
          <ScanBarcode className="w-6 h-6 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[450px] h-[450px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <DialogHeader>
          <DialogTitle>Scan UPC or QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-2 border-white opacity-50 pointer-events-none"></div>
        </div>
        <Button onClick={() => handleOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScanButton;
