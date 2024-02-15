import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useToast } from "./ui/use-toast";
import { AxiosError } from "axios";
import { FormEvent, ReactNode } from "react";
import { IItemsResponse } from "@/pages/app/items";
import { useDeleteItemMutate } from "@/hooks/useDeleteItemMutate";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface IDeleteItemProps {
  item: IItemsResponse;
}

interface IDeleteItemResponse {
  data: {
    message: string;
  };
}

export const DeleteItemModal = ({ item }: IDeleteItemProps) => {
  const { mutate, isPending } = useDeleteItemMutate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  function handleSubmitDeleteItem(e: FormEvent) {
    e.preventDefault();

    mutate(item.id, {
      onSuccess: (data: IDeleteItemResponse) => {
        toast({
          title: data.data.message,
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
            title: "Erro na deleção",
            description: errorMessage as ReactNode,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro na deleção",
            description: "Erro desconhecido ao processar a solicitação.",
            variant: "destructive",
          });
        }
      },
    });
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Deletar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar item</DialogTitle>
            <DialogDescription>
              Tem certeza que quer deletar o item {item.name}? Não será possivel
              recuperar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <form onSubmit={handleSubmitDeleteItem}>
              {isPending ? (
                <Button className="rounded-md" disabled>
                  Carregando
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="rounded-md"
                  variant="destructive"
                >
                  Sim
                </Button>
              )}
            </form>
            <DialogClose asChild>
              <Button type="button" className="rounded-md">
                Não
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
