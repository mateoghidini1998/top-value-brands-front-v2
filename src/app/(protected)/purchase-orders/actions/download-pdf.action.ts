import { apiRequest } from "@/helpers/http.adapter";

export interface DownloadPDFProps {
  orderId: number;
}

export const downloadPDF = async ({
  orderId,
}: DownloadPDFProps): Promise<void> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/download/${orderId}`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      // No es necesario Content-Type para descargas
    },
  };

  try {
    // Cambia el tipo esperado a Blob
    const blob = await apiRequest<Blob>(url, options);

    // Crear un enlace de descarga
    const pdfUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `purchase-order-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
};
