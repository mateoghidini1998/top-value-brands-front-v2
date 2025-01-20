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
// import jsPDF from "jspdf";
import QRCode from "qrcode";
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

  const generateQrCode = useCallback(async () => {
    await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/warehouse/storage/${palletId}`
    ).then(setSrc);
  }, [palletId]);

  const downloadQrCode = () => {
    const link = document.createElement("a");
    link.download = `pallet-${palletNumber}.png`;
    link.href = src;
    link.click();
  };

  const printQrCode = (palletNumber: string, orderNumber: string) => {
    const printWindow = window.open("", "_blank", "width=600,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Pallet #${palletNumber}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 0;
                height: 100vh;
                background-color: white;

                font-family: Arial, sans-serif;
              }

              .data-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
              }
            </style>
          </head>
          <body>
          <div class="data-container">
          <h2>Pallet Number: ${palletNumber}</h2>
          <h3>Order Number: ${orderNumber}</h3>
          </div>
            <img src="${src}" alt="QR Code" style="width: 350px; height: 350px;" />
            <script>
              window.onload = function () {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // to download as PDF with details just return it and the we can doc.save();
  // const createPDFWithDetailsAndQRCode = () => {
  //   const doc = new jsPDF();
  //   doc.text("Pallet Details", 10, 10);
  //   doc.text(`Pallet ID: ${palletId}`, 10, 20);
  //   doc.text(`Pallet Number: ${palletNumber}`, 10, 30);
  //   doc.addImage(src, "png", 10, 40, 100, 100);
  //   doc.save(`pallet-${palletNumber}.pdf`);
  //   return doc;
  // };

  // Generar el QR automáticamente si el diálogo está abierto
  useEffect(() => {
    if (isOpen) {
      generateQrCode();
    }
  }, [isOpen, generateQrCode]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span
          className={
            classNames
              ? classNames
              : "text-[#438EF3] hover:underline cursor-pointer"
          }
          onClick={generateQrCode}
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
          <Image src={src} width={250} height={250} alt="QR Code" />
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="w-full h-fit py-4 flex flex-col items-center justify-center gap-4">
            <DialogClose asChild>
              <Button
                className="w-[250px]"
                type="button"
                variant="outline"
                onClick={downloadQrCode}
              >
                Download QR
              </Button>
            </DialogClose>
            <Button
              className="w-[250px] ml-2"
              type="button"
              variant="outline"
              onClick={() => printQrCode(palletNumber, orderNumber)}
            >
              Print QR
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
