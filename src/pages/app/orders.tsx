import { CreateOrderModal } from "@/components/create-order-modal";
import { DeleteOrderModal } from "@/components/delete-order-modal";
import { Header } from "@/components/header";
import { OrderDetailsModal } from "@/components/order-details-modal";
import { SkeletonTable } from "@/components/skeleton-table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpdateOrderDeliveryStatusModal } from "@/components/update-order-delivery-status-modal";
import { useOrdersData } from "@/hooks/useOrdersData";
import {
  DeliveryStatus,
  EnumDeliveryStatus,
} from "@/utils/enum-delivery-status";
import { PaymentType } from "@/utils/enum-payment-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export interface IOrdersResponse {
  id: string;
  address: string;
  amount: number;
  paymentType: PaymentType;
  deliveryStatus: DeliveryStatus;
  userId: string;
  restaurantId: string;
  customer: {
    customerId: string;
    name: string;
  };
  orderItems: {
    quantity: number;
    notes: string;
    itemId: string;
    item: string;
    amount: number;
  }[];
}

const formSchema = z.object({
  name: z.string(),
});

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");
  const active = searchParams.get("active");
  const status = searchParams.get("status");

  let { data: ordersData } = useOrdersData(name, active, status);
  const { isPending } = useOrdersData(name, active, status);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    values: {
      name: name ?? "",
    },
  });

  function handleSubmitFilterForm({ name }: z.infer<typeof formSchema>) {
    setSearchParams((state) => {
      if (name) {
        state.set("name", name);
      } else {
        state.delete("name");
      }

      return state;
    });
  }

  if (name) {
    ordersData = ordersData?.filter((order) =>
      order.customer.name.includes(name)
    );
  }

  if (active && active !== "Todos") {
    ordersData = ordersData?.filter(
      (order) => !order.deliveryStatus.includes("Entregue")
    );
  }

  if (status && status !== "Todos") {
    ordersData = ordersData?.filter((order) => order.deliveryStatus === status);
  }

  const handleFilterChange = (value: string) => {
    setSearchParams((state) => {
      if (value && value !== "Todos") {
        state.set("active", value);
      } else {
        state.delete("active");
      }

      return state;
    });
  };

  const handleStatusChange = (value: string) => {
    setSearchParams((state) => {
      if (value && value !== "Todos") {
        state.set("status", value);
      } else {
        state.delete("status");
      }

      return state;
    });
  };

  return (
    <>
      <Header />
      <main className="container p-4">
        <h1 className="text-2xl">Pedidos</h1>
        <div className="mt-4 flex items-center justify-between">
          <div className="gap-4 flex items-center justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitFilterForm)}
                className="flex items-center justify-center gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="w-52" placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="outline">
                  Buscar
                </Button>
              </form>
            </Form>
            <Select
              defaultValue={active ?? ""}
              onValueChange={(value: string) => handleFilterChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Ativos"> Ativos</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={status ?? ""}
              onValueChange={(value: string) => handleStatusChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {Object.values(EnumDeliveryStatus.Enum).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <CreateOrderModal />
          </div>
        </div>
        <div className="mt-4">
          {isPending ? (
            <SkeletonTable />
          ) : (
            <Table>
              <TableCaption>
                Lista com todos os pedidos do seu restaurante.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Tipo Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData &&
                  ordersData.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.paymentType}</TableCell>
                      <TableCell>
                        <UpdateOrderDeliveryStatusModal order={order} />
                      </TableCell>
                      <TableCell>
                        {" "}
                        {(order.amount / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="flex items-center justify-center gap-4">
                        <OrderDetailsModal order={order} />
                        <DeleteOrderModal order={order} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </>
  );
};
