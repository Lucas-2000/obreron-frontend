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
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { IOrdersResponse } from "@/pages/app/orders";
import { useDeleteOrderMutate } from "@/hooks/useDeleteOrderMutate";

interface IDeleteOrderProps {
  order: IOrdersResponse;
}

interface IDeleteOrderResponse {
  data: {
    message: string;
  };
}

export const DeleteOrderModal = ({ order }: IDeleteOrderProps) => {
  const { mutate, isPending } = useDeleteOrderMutate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  function handleSubmitDeleteOrder(e: FormEvent) {
    e.preventDefault();

    mutate(order.id, {
      onSuccess: (data: IDeleteOrderResponse) => {
        toast({
          title: data.data.message,
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
            <DialogTitle>Deletar pedido</DialogTitle>
            <DialogDescription>
              Tem certeza que quer deletar o pedido {order.id}? Não será
              possivel recuperar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <form onSubmit={handleSubmitDeleteOrder}>
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
