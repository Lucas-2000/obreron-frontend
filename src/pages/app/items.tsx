import { DeleteItemModal } from "@/components/delete-item-modal";
import { Header } from "@/components/header";
import { ItemModal } from "@/components/item-modal";
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
import { useItemsData } from "@/hooks/useItemsData";
import { truncateText } from "@/utils/truncate-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export interface IItemsResponse {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
}

const formSchema = z.object({
  name: z.string(),
});

export const Items = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");

  let { data: itemsData } = useItemsData(name);
  const { isPending } = useItemsData(name);

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
    itemsData = itemsData?.filter((item) => item.name.includes(name));
  }

  return (
    <>
      <Header />
      <main className="container p-4">
        <h1 className="text-2xl">Itens</h1>
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
            <ItemModal buttonName="Novo Item" />
          </div>
        </div>
        <div className="mt-4">
          {isPending ? (
            <SkeletonTable />
          ) : (
            <Table>
              <TableCaption>
                Lista com todos os itens cadastrados para seu restaurante.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Disponível</TableHead>
                  <TableHead>Tempo de preparação</TableHead>
                  <TableHead>Ingredientes</TableHead>
                  <TableHead>Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsData &&
                  itemsData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {truncateText(item.description, 50)}
                      </TableCell>
                      <TableCell>
                        {(item.priceInCents / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>{item.available ? "Sim" : "Não"}</TableCell>
                      <TableCell>{item.preparationTime} min</TableCell>
                      <TableCell>
                        {truncateText(item.ingredients.join(", "), 50)}
                      </TableCell>
                      <TableCell className="flex items-center justify-center gap-4">
                        <ItemModal buttonName="Editar" item={item} />
                        <DeleteItemModal item={item} />
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
