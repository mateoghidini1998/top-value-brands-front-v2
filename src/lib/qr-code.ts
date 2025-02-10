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
  orderNumber: string,
  warehouseLocation: string
) => {
  const printWindow = window.open("", "_blank", "width=600,height=800");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pallet #${palletNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
            
            body {
              font-family: 'Roboto', sans-serif;
              background-color: #f0f4f8;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            
            .container {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 40px;
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            
            .logo {
              width: 120px;
              height: auto;
              margin-bottom: 20px;
            }
            
            h1 {
              color: #2c3e50;
              font-size: 24px;
              margin-bottom: 20px;
            }
            
            .info {
              margin-bottom: 30px;
            }
            
            .info-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 16px;
            }
            
            .info-label {
              font-weight: bold;
              color: #34495e;
            }
            
            .info-value {
              color: #7f8c8d;
            }
            
            .qr-code {
              width: 250px;
              height: 250px;
              margin: 0 auto 30px;
            }
            
            .footer {
              font-size: 14px;
              color: #95a5a6;
            }
            
            @media print {
              body {
                background-color: white;
              }
              
              .container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Pallet Information</h1>
            <div class="info">
              <div class="info-item">
                <span class="info-label">Pallet Number:</span>
                <span class="info-value">${palletNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Order Number:</span>
                <span class="info-value">${orderNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Warehouse Location:</span>
                <span class="info-value">${warehouseLocation}</span>
              </div>
            </div>
            <img src="${src}" alt="QR Code" class="qr-code">
            <div class="footer">
              Scan the QR code for more information
            </div>
          </div>
          <script>
            window.onload = function () {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
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
