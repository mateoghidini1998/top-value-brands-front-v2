export default function Page({ params }: { params: { orderId: string } }) {
  return <div>{params.orderId}</div>;
}
