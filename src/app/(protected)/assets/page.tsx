import { QrCodeDialog } from "../warehouse/storage/_components/qr-code-dialog";

export default function AssetsPage() {
  return (
    <section>
      <h1>Component testing page</h1>
      <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QrCodeDialog
          palletNumber="1"
          palletId={1}
          orderNumber="1"
          warehouseLocation="A1"
        />
      </div>
    </section>
  );
}
