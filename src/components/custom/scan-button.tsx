"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScanBarcode } from "lucide-react";
import React, { useRef, useState } from "react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";

const ScanButton: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scan, setScan] = useState<MediaStream | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { open: sidebarIsOpen } = useSidebar();

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
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Button
            variant="outline"
            size="icon"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ScanBarcode className="w-6 h-6 text-blue-500" />
          </Button>
          <div
            className={`grid flex-1 text-left text-sm leading-tight ${
              !sidebarIsOpen ? "hidden" : ""
            }`}
          >
            <span className="truncate ">{"Open Scanner"}</span>
          </div>
        </SidebarMenuButton>
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
