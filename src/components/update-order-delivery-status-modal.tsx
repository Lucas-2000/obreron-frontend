import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ReactNode, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { IOrdersResponse } from "@/pages/app/orders";
import {
  DeliveryStatus,
  EnumDeliveryStatus,
} from "@/utils/enum-delivery-status";
import { useUpdateOrderMutate } from "@/hooks/useUpdateOrderMutate";
import { PaymentType } from "@/utils/enum-payment-type";

interface UpdateOrderModalProps {
  order: IOrdersResponse;
}

export interface UpdateOrderRequest {
  id?: string;
  address: string;
  paymentType: PaymentType;
  deliveryStatus: DeliveryStatus;
  customerId: string;
  orderItems: {
    quantity: number;
    notes: string;
    itemId: string;
  }[];
}

const formSchema = z.object({
  deliveryStatus: EnumDeliveryStatus.refine((data) => data !== undefined, {
    message: "Selecione pelo menos um status.",
  }),
});

export const UpdateOrderDeliveryStatusModal = ({
  order,
}: UpdateOrderModalProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const { mutate: mutateUpdateOrder, isPending: isPendingUpdate } =
    useUpdateOrderMutate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryStatus: undefined,
    },
  });

  useEffect(() => {
    if (order) {
      form.setValue("deliveryStatus", order.deliveryStatus || undefined);
    }
  }, [order, form]);

  function handleSubmitUpdateOrderForm(values: z.infer<typeof formSchema>) {
    if (order) {
      const itemsOfOrder: {
        quantity: number;
        notes: string;
        itemId: string;
      }[] = [];

      order.orderItems.map((item) =>
        itemsOfOrder.push({
          quantity: item.quantity,
          notes: item.notes,
          itemId: item.itemId,
        })
      );

      const valuesToUpdate = {
        id: order.id,
        address: order.address,
        paymentType: order.paymentType,
        ...values,
        customerId: order.customer.customerId,
        orderItems: itemsOfOrder,
      };

      mutateUpdateOrder(valuesToUpdate, {
        onSuccess: () => {
          toast({
            title: "Pedido",
            description: "Pedido atualizado com sucesso",
          });

          queryClient.invalidateQueries({ queryKey: ["orders-data", name] });
        },
        onError: (error) => {
          const err = error as AxiosError;

          if (
            err.response &&
            err.response.data &&
            typeof err.response.data === "object" &&
            "error" in err.response.data
          ) {
            const errorMessage = err.response.data.error;

            toast({
              title: "Erro na atualização",
              description: errorMessage as ReactNode,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro na atualização",
              description: "Erro desconhecido ao processar a solicitação.",
              variant: "destructive",
            });
          }
        },
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{order?.deliveryStatus}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido</DialogTitle>
          <DialogDescription>Atualize o status do pedido</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(handleSubmitUpdateOrderForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="deliveryStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EnumDeliveryStatus.Enum).map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPendingUpdate ? (
              <Button className="py-2 px-4 rounded-md" disabled>
                Carregando
              </Button>
            ) : (
              <Button type="submit" className="py-2 px-4 rounded-md mr-4">
                Salvar
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="destructive" className="py-2 px-4 rounded-md ">
                Cancelar
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
