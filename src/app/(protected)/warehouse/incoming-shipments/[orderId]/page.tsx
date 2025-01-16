export default function Page({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const orderId = params.orderId;
  return <p>Incoming Shipment Details for Order {orderId}</p>;
}
