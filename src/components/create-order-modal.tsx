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
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { EnumPaymentType, PaymentType } from "@/utils/enum-payment-type";
import {
  DeliveryStatus,
  EnumDeliveryStatus,
} from "@/utils/enum-delivery-status";
import { useCreateOrderMutate } from "@/hooks/useCreateOrderMutate";
import { useItemsData } from "@/hooks/useItemsData";
import { useCustomersData } from "@/hooks/useCustomersData";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface CreateOrderRequest {
  address: string;
  paymentType: PaymentType;
  deliveryStatus: DeliveryStatus;
  restaurantId: string;
  customerId: string;
  orderItems: {
    quantity: string;
    notes?: string;
    itemId: string;
  }[];
}

const formSchema = z.object({
  address: z
    .string()
    .min(1, {
      message: "Endereço tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Endereço tem no máximo 255 caracteres.",
    }),
  paymentType: EnumPaymentType.refine((data) => data !== undefined, {
    message: "Selecione um tipo de pagamento.",
  }),
  customerId: z
    .string()
    .min(1, {
      message: "Cliente tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Cliente tem no máximo 255 caracteres.",
    }),
  orderItems: z.array(
    z.object({
      quantity: z.string().min(1, {
        message: " Precisa ter pelo menos 1 quantidade do item",
      }),
      notes: z.string().optional(),
      itemId: z
        .string()
        .min(1, {
          message: "Item tem no mínimo 1 caracteres.",
        })
        .max(255, {
          message: "Item tem no máximo 255 caracteres.",
        }),
    })
  ),
});

export const CreateOrderModal = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const status = searchParams.get("status");
  const active = searchParams.get("active");
  const { mutate: mutateCreateOrder, isPending: isPendingCreate } =
    useCreateOrderMutate();
  const { data: resturantData } = useRestaurantData();
  const { data: itemsData } = useItemsData(name);
  const { data: customersData } = useCustomersData(name);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      customerId: "",
      paymentType: undefined,
      orderItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "orderItems",
  });

  function handleSubmitOrderForm(values: z.infer<typeof formSchema>) {
    if (resturantData) {
      const valuesToCreate = {
        ...values,
        deliveryStatus: EnumDeliveryStatus.Values.Pendente,
        restaurantId: resturantData.id,
      };

      mutateCreateOrder(valuesToCreate, {
        onSuccess: () => {
          toast({
            title: "Pedido",
            description: "Pedido criado com sucesso",
          });
          form.setValue("address", "");
          form.setValue("customerId", "");
          form.setValue(
            "paymentType",
            EnumPaymentType.Values["Cartão de crédito"]
          );
          form.setValue("orderItems", []);

          queryClient.invalidateQueries({
            queryKey: ["orders-data", name, active, status],
          });
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
              title: "Erro no cadastro",
              description: errorMessage as ReactNode,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro no cadastro",
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
        <Button>Novo pedido</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido</DialogTitle>
          <DialogDescription>Dados do pedido</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(handleSubmitOrderForm)}
            className="space-y-4 overflow-auto max-h-96"
          >
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o endereço do pedido"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de pagamento</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EnumPaymentType.Enum).map(
                          (paymentType) => (
                            <SelectItem key={paymentType} value={paymentType}>
                              {paymentType}
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
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customersData?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={() => append({ quantity: "1", notes: "", itemId: "" })}
              className="py-2 px-4 rounded-md mr-4 block"
            >
              Adicionar Item
            </Button>
            {fields.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <FormField
                  control={form.control}
                  name={`orderItems.${index}.itemId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um item" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemsData?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`orderItems.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantidade"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`orderItems.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input placeholder="Observações" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="py-2 px-4 rounded-md mr-4"
                >
                  Remover Item
                </Button>
              </div>
            ))}
            {isPendingCreate ? (
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
