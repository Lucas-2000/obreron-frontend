import { IOrdersResponse } from "@/pages/app/orders";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface OrderDetailsModalProps {
  order: IOrdersResponse;
}

export const OrderDetailsModal = ({ order }: OrderDetailsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Detalhes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido {order.id}</DialogTitle>
          <DialogDescription>Veja detalhes do pedido</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="mb-2 font-semibold">Cliente: {order.customer.name}</p>
          <p className="mb-2">Endereço: {order.address}</p>
          <p className="mb-2">
            Total da compra:{" "}
            <span className="text-green-600 font-bold">
              {(order.amount / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p className="mb-2">
            Tipo do pagamento:{" "}
            <span className="text-blue-600 font-medium">
              {order.paymentType}
            </span>
          </p>
          <p className="mb-2">
            Status atual do pedido:{" "}
            <span className="text-purple-600 font-medium">
              {order.deliveryStatus}
            </span>
          </p>
          <p className="mb-2 font-semibold">Itens do pedido:</p>
          <ul className="list-disc pl-6">
            {order.orderItems.map((item) => (
              <li key={item.itemId} className="mb-2">
                <p className="font-semibold">Nome: {item.item}</p>
                <p>
                  Valor:{" "}
                  <span className="text-green-600 font-bold">
                    {(item.amount / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </p>
                <p>Quantidade: {item.quantity}</p>
                <p className="italic">Observação: {item.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
