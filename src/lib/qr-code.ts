import QRCode from "qrcode";
import jsPDF from "jspdf";

export const generateQrCode = async (url: string): Promise<string> => {
  return await QRCode.toDataURL(url);
};

export const downloadQrCode = (src: string, fileName: string) => {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = src;
  link.click();
};

export const printQrCode = (
  src: string,
  palletNumber: string,
  orderNumber: string
) => {
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

export const createPDFWithDetailsAndQRCode = (
  src: string,
  palletId: number,
  palletNumber: string
) => {
  const doc = new jsPDF();
  doc.text("Pallet Details", 10, 10);
  doc.text(`Pallet ID: ${palletId}`, 10, 20);
  doc.text(`Pallet Number: ${palletNumber}`, 10, 30);
  doc.addImage(src, "png", 10, 40, 100, 100);
  return doc;
};
