export default function generateId(supplier_name: string): string {
  // Generar un ID de pedido unico con el timestamp de 6 dígitos
  const PO_ID = new Date().getTime().toString().slice(-6);
  // Obtener las iniciales del suppliername
  const supplierInitials = supplier_name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase();

  return `${supplierInitials}#${PO_ID}`;
}
