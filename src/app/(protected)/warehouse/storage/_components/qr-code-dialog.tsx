"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createPDFWithDetailsAndQRCode,
  downloadQrCode,
  generateQrCode,
  printQrCode,
} from "@/lib/qr-code";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type QrCodeDialogProps = {
  palletNumber: string;
  palletId: number;
  open?: boolean;
  orderNumber: string;
  classNames?: string;
};

export function QrCodeDialog({
  palletNumber,
  palletId,
  open = false,
  orderNumber,
  classNames,
}: QrCodeDialogProps) {
  const [src, setSrc] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  const handleGenerateQrCode = useCallback(async () => {
    const url = `${process.env.NEXT_PUBLIC_FRONT_URL}/warehouse/storage/${palletId}`;
    const qrCodeData = await generateQrCode(url);
    setSrc(qrCodeData);
  }, [palletId]);

  const handleDownloadQrCode = () => {
    downloadQrCode(src, `pallet-${palletNumber}.png`);
  };

  const handlePrintQrCode = () => {
    printQrCode(src, palletNumber, orderNumber);
  };

  const handleCreatePDF = () => {
    const doc = createPDFWithDetailsAndQRCode(src, palletId, palletNumber);
    doc.save(`pallet-${palletNumber}.pdf`);
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerateQrCode();
    }
  }, [isOpen, handleGenerateQrCode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span
          className={
            classNames
              ? classNames
              : "text-[#438EF3] hover:underline cursor-pointer"
          }
          onClick={handleGenerateQrCode}
        >
          View QR
        </span>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>Pallet {palletNumber}</DialogTitle>
          <span>Purchase Order Number: {orderNumber}</span>
          <DialogDescription>
            Anyone who has this QR code will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Image
            src={src || "/placeholder.svg"}
            width={250}
            height={250}
            alt="QR Code"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="w-full h-fit py-4 flex flex-col items-center justify-center gap-4">
            <DialogClose asChild>
              <Button
                className="w-[250px]"
                type="button"
                variant="outline"
                onClick={handleDownloadQrCode}
              >
                Download QR
              </Button>
            </DialogClose>
            <Button
              className="w-[250px] ml-2"
              type="button"
              variant="outline"
              onClick={handlePrintQrCode}
            >
              Print QR
            </Button>
            <Button
              className="w-[250px] ml-2"
              type="button"
              variant="outline"
              onClick={handleCreatePDF}
            >
              Create PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
