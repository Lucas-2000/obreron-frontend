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
import { Input } from "./ui/input";
import { useCreateItemMutate } from "@/hooks/useCreateItemMutate";
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ReactNode, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IItemsResponse } from "@/pages/app/items";
import { useUpdateItemMutate } from "@/hooks/useUpdateItemMutate";

interface ItemModalProps {
  buttonName: string;
  item?: IItemsResponse;
}

export interface CreateItemRequest {
  id?: string;
  name: string;
  description: string;
  priceInCents: string;
  available: boolean;
  preparationTime: string;
  ingredients: string;
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
  description: z
    .string()
    .min(1, {
      message: "Descrição tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Descrição tem no máximo 255 caracteres.",
    }),
  priceInCents: z.string().min(1, {
    message: "Preço tem no mínimo 1 caracteres.",
  }),
  available: z.boolean(),
  preparationTime: z.string().min(1, {
    message: "Tempo de preparação tem no mínimo 1 caracteres.",
  }),
  ingredients: z.string().min(1, {
    message: "Ingredientes tem no mínimo 1 caracteres.",
  }),
});

export const ItemModal = ({ buttonName, item }: ItemModalProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const { mutate: mutateCreateItem, isPending: isPendingCreate } =
    useCreateItemMutate();
  const { mutate: mutateUpdateItem, isPending: isPendingUpdate } =
    useUpdateItemMutate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: "",
      available: true,
      preparationTime: "",
      ingredients: "",
    },
  });

  useEffect(() => {
    if (item) {
      form.setValue("name", item.name || "");
      form.setValue("description", item.description || "");
      form.setValue("priceInCents", String(item.priceInCents / 100) || "0");
      form.setValue("available", item.available || true);
      form.setValue("preparationTime", String(item.preparationTime) || "0");
      form.setValue(
        "ingredients",
        item.ingredients ? item.ingredients.join(", ") : ""
      );
    }
  }, [item, form]);

  function handleSubmitItemForm(values: z.infer<typeof formSchema>) {
    if (!item) {
      mutateCreateItem(values, {
        onSuccess: () => {
          toast({
            title: "Item",
            description: "Item criado com sucesso",
          });
          form.setValue("name", "");
          form.setValue("description", "");
          form.setValue("priceInCents", "");
          form.setValue("available", true);
          form.setValue("preparationTime", "");
          form.setValue("ingredients", "");

          queryClient.invalidateQueries({ queryKey: ["items-data", name] });
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
        id: item.id,
        ...values,
      };

      mutateUpdateItem(valuesToUpdate, {
        onSuccess: () => {
          toast({
            title: "Item",
            description: "Item atualizado com sucesso",
          });

          queryClient.invalidateQueries({ queryKey: ["items-data", name] });
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
        <Button>{buttonName}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item</DialogTitle>
          <DialogDescription>Dados do item</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(handleSubmitItemForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do item" {...field} />
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
                      placeholder="Digite a descrição do item"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o preço"
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
              name="available"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="items-top flex space-x-2">
                      <Input
                        type="checkbox"
                        onChange={field.onChange}
                        defaultChecked={true}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Disponível
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparationTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Preparação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o tempo de preparação"
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
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredientes</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite os ingredientes (separados por virgula)"
                      type="text"
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
