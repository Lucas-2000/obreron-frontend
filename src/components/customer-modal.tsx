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
import { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { ReactNode, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ICustomersResponse } from "@/pages/app/customers";
import {
  CustomerGender,
  EnumCustomerGender,
} from "@/utils/enum-customer-gender";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCreateCustomerMutate } from "@/hooks/useCreateCustomerMutate";
import { useUpdateCustomerMutate } from "@/hooks/useUpdateCustomerMutate";
import { format } from "date-fns";

interface CustomerModalProps {
  buttonName: string;
  customer?: ICustomersResponse;
}

export interface CreateCustomerRequest {
  id?: string;
  name: string;
  birthDate: Date;
  phone: string;
  address: string;
  email: string;
  gender: CustomerGender;
  isActive: boolean;
  observation: string;
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
  birthDate: z
    .string()
    .min(1, {
      message: "Data tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Data tem no máximo 255 caracteres.",
    }),
  phone: z
    .string()
    .min(1, {
      message: "Preço tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Preço tem no máximo 255 caracteres.",
    }),
  address: z
    .string()
    .min(1, {
      message: "Endereço tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Endereço tem no máximo 255 caracteres.",
    }),
  email: z
    .string()
    .min(1, {
      message: "Email tem no mínimo 1 caracteres.",
    })
    .max(255, {
      message: "Email tem no máximo 255 caracteres.",
    }),
  isActive: z.boolean(),
  gender: EnumCustomerGender.refine((data) => data !== undefined, {
    message: "Selecione pelo menos um gênero.",
  }),
  observation: z.string(),
});

export const CustomerModal = ({ buttonName, customer }: CustomerModalProps) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const { mutate: mutateCreateCustomer, isPending: isPendingCreate } =
    useCreateCustomerMutate();
  const { mutate: mutateUpdateCustomer, isPending: isPendingUpdate } =
    useUpdateCustomerMutate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      phone: "",
      address: "",
      email: "",
      gender: undefined,
      isActive: true,
      observation: "",
    },
  });

  useEffect(() => {
    if (customer) {
      const formattedBirthDate = customer.birthDate
        ? format(new Date(customer.birthDate), "yyyy-MM-dd")
        : "";

      form.setValue("name", customer.name || "");
      form.setValue("birthDate", formattedBirthDate || "");
      form.setValue("phone", customer.phone || "");
      form.setValue("address", customer.address || "");
      form.setValue("email", customer.email || "");
      form.setValue("gender", customer.gender || undefined);
      form.setValue("isActive", customer.isActive || true);
      form.setValue("observation", customer.observation || "");
    }
  }, [customer, form]);

  function handleSubmitCustomerForm(values: z.infer<typeof formSchema>) {
    const [year, month, day] = values.birthDate.split("-").map(Number);
    const formattedBirthDate = new Date(Date.UTC(year, month - 1, day + 1));

    if (!customer) {
      const valuesToCreate = {
        ...values,
        birthDate: formattedBirthDate,
      };

      mutateCreateCustomer(valuesToCreate, {
        onSuccess: () => {
          toast({
            title: "Cliente",
            description: "Cliente criado com sucesso",
          });
          form.setValue("name", "");
          form.setValue("birthDate", "");
          form.setValue("phone", "");
          form.setValue("address", "");
          form.setValue("email", "");
          form.setValue("gender", "M");
          form.setValue("isActive", true);
          form.setValue("observation", "");

          queryClient.invalidateQueries({ queryKey: ["customers-data", name] });
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
        id: customer.id,
        ...values,
        birthDate: formattedBirthDate,
      };

      mutateUpdateCustomer(valuesToUpdate, {
        onSuccess: () => {
          toast({
            title: "Cliente",
            description: "Cliente atualizado com sucesso",
          });

          queryClient.invalidateQueries({ queryKey: ["customers-data", name] });
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
          <DialogTitle>Cliente</DialogTitle>
          <DialogDescription>Dados do cliente</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            method="POST"
            onSubmit={form.handleSubmit(handleSubmitCustomerForm)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                      placeholder="Digite o telefone do cliente"
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
                      placeholder="Digite o endereço do cliente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite o email do cliente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EnumCustomerGender.Enum).map(
                          (gender) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
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
              name="isActive"
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
                          Ativo
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
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite as observações do cliente"
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
