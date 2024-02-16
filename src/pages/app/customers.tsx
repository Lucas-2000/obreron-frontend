import { CustomerModal } from "@/components/customer-modal";
import { DeleteCustomerModal } from "@/components/delete-customer-modal";
import { Header } from "@/components/header";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomersData } from "@/hooks/useCustomersData";
import { CustomerGender } from "@/utils/enum-customer-gender";
import { truncateText } from "@/utils/truncate-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export interface ICustomersResponse {
  id: string;
  name: string;
  birthDate: string;
  phone: string;
  address: string;
  email: string;
  gender: CustomerGender;
  isActive: boolean;
  observation: string;
}

const formSchema = z.object({
  name: z.string(),
});

export const Customers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");

  let { data: customersData } = useCustomersData(name);
  const { isPending } = useCustomersData(name);

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
    customersData = customersData?.filter((customer) =>
      customer.name.includes(name)
    );
  }

  return (
    <>
      <Header />
      <main className="container p-4">
        <h1 className="text-2xl">Clientes</h1>
        <div className="mt-4 flex items-center justify-between">
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
                      <Input placeholder="Nome" {...field} />
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
          <div>
            <CustomerModal buttonName="Novo Cliente" />
          </div>
        </div>
        <div className="mt-4">
          {isPending ? (
            <SkeletonTable />
          ) : (
            <Table>
              <TableCaption>
                Lista com todos os clientes cadastrados para seu restaurante.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data Nasc.</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Genêro</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Observação</TableHead>
                  <TableHead>Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersData &&
                  customersData.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>
                        {format(new Date(customer.birthDate), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.gender}</TableCell>
                      <TableCell>{customer.isActive ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        {truncateText(customer.observation, 50)}
                      </TableCell>
                      <TableCell className="flex items-center justify-center gap-4">
                        <CustomerModal
                          buttonName="Editar"
                          customer={customer}
                        />
                        <DeleteCustomerModal customer={customer} />
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
