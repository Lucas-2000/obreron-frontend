import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRestaurantData } from "@/hooks/useRestaurantData";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ReactNode, useEffect } from "react";
import { useCreateRestaurantMutate } from "@/hooks/useCreateRestaurantMutate";
import { useUpdateRestaurantMutate } from "@/hooks/useUpdateRestaurantMutate";
import {
  EnumRestaurantCategory,
  RestaurantCategory,
} from "@/utils/enum-restaurant-category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";
import { AxiosError } from "axios";

export interface IRestaurantFormRequest {
  id?: string;
  name: string;
  address: string;
  phone: string;
  category: RestaurantCategory;
  description?: string;
  openingHour: number;
  closingHour: number;
}

export interface IRestaurantResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: RestaurantCategory;
  description?: string;
  openingHour: number;
  closingHour: number;
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nome tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Nome tem no máximo 255 caracteres.",
    }),
  address: z
    .string()
    .min(1, {
      message: "Endereço tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Endereço tem no máximo 255 caracteres.",
    }),
  phone: z
    .string()
    .min(11, {
      message: "Telefone precisa ter 11 caracteres.",
    })
    .max(11, {
      message: "Telefone precisa ter 11 caracteres.",
    }),
  description: z
    .string()
    .max(255, {
      message: "Descrição tem no máximo 255 caracteres.",
    })
    .optional(),
  category: EnumRestaurantCategory.refine((data) => data !== undefined, {
    message: "Selecione pelo menos uma categoria.",
  }),
  openingHour: z
    .string()
    .refine((data) => /^(0?[0-9]|1[0-9]|2[0-3])$/.test(data), {
      message:
        "Horário de abertura precisa ser um número positivo entre 0 e 23.",
    }),
  closingHour: z
    .string()
    .refine((data) => /^(0?[0-9]|1[0-9]|2[0-3])$/.test(data), {
      message:
        "Horário de fechamento precisa ser um número positivo entre 0 e 23.",
    }),
});

export const RestaurantModal = () => {
  const { data: restaurantData } = useRestaurantData();
  const { mutate: mutateCreateRestaurant, isPending: isPendingCreate } =
    useCreateRestaurantMutate();
  const { mutate: mutateUpdateRestaurant, isPending: isPendingUpdate } =
    useUpdateRestaurantMutate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      description: "",
      category: undefined,
      openingHour: "",
      closingHour: "",
    },
  });

  useEffect(() => {
    if (restaurantData) {
      form.setValue("name", restaurantData.name || "");
      form.setValue("address", restaurantData.address || "");
      form.setValue("phone", restaurantData.phone || "");
      form.setValue("description", restaurantData.description || "");
      form.setValue("category", restaurantData.category || "");
      form.setValue("openingHour", String(restaurantData.openingHour) || "0");
      form.setValue("closingHour", String(restaurantData.closingHour) || "0");
    }
  }, [restaurantData, form]);

  function handleSubmitUpdateRestaurantForm(
    values: z.infer<typeof formSchema>
  ) {
    if (!restaurantData) {
      const valuesToCreate = {
        ...values,
        openingHour: Number(values.openingHour),
        closingHour: Number(values.closingHour),
      };

      mutateCreateRestaurant(valuesToCreate, {
        onSuccess: () => {
          toast({
            title: "Restaurante",
            description: "Restaurante criado com sucesso",
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
    } else {
      const valuesToUpdate = {
        id: restaurantData?.id,
        ...values,
        openingHour: Number(values.openingHour),
        closingHour: Number(values.closingHour),
      };

      mutateUpdateRestaurant(valuesToUpdate, {
        onSuccess: () => {
          toast({
            title: "Restaurante",
            description: "Restaurante atualizado com sucesso",
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
        <Button variant="outline">Restaurante</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restaurante</DialogTitle>
          <DialogDescription>Dados do seu restaurante</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(handleSubmitUpdateRestaurantForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite o nome do restaurante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite o endereço do restaurante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite o telefone do restaurante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite a descrição do restaurante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EnumRestaurantCategory.Enum).map(
                          (category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
              name="openingHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de abertura</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite o horário de abertura do restaurante"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closingHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de fechamento</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border p-2 rounded-md"
                      placeholder="Digite o horário de fechamento do restaurante"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPendingCreate || isPendingUpdate ? (
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
