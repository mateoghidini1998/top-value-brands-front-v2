"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import { useState } from "react";
import type { Shipment } from "@/types/shipments/get.types";

export const PrintManifest = ({ shipment }: { shipment: Shipment }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "", "width=600,height=600");
    if (!printWindow) return;

    // Create the print content
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shipment Manifest</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .shipment-details {
              border: 1px solid #ccc;
              padding: 20px;
              border-radius: 4px;
            }
            .shipment-item {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Shipment Manifest</h1>
            </div>
            <div class="shipment-details">
              <div class="shipment-item">
                <span class="label">Shipment Number:</span>
                <span>${shipment.shipment_number}</span>
              </div>
              <div class="shipment-item">
                <span class="label">FBA Shipment ID:</span>
                <span>${shipment.fba_shipment_id}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.write(content);
    printWindow.document.close();

    // Print the window
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Manifest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print Shipment Manifest</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipment Number</div>
            <div className="text-sm text-muted-foreground">
              {shipment.shipment_number}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="font-medium">FBA Shipment ID</div>
            <div className="text-sm text-muted-foreground">
              {shipment.fba_shipment_id}
            </div>
          </div>
          <Button
            onClick={() => {
              setIsOpen(false);
              handlePrint();
            }}
            className="w-full"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
