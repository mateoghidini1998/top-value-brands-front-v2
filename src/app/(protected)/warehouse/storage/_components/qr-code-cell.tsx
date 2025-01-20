"use client";
import { Pallet } from "@/types";
import { QrCodeDialog } from "./qr-code-dialog";

type QrCodeCellProps = {
  incomingOrder: Pallet;
};

const QrCodeCell = ({ incomingOrder }: QrCodeCellProps) => {
  console.log(incomingOrder);

  return (
    <QrCodeDialog
      palletNumber={incomingOrder.pallet_number}
      palletId={incomingOrder.id}
      orderNumber={incomingOrder.purchase_order_number}
    />
  );
};

export default QrCodeCell;
