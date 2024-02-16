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
import { useDeleteCustomerMutate } from "@/hooks/useDeleteCustomerMutate";
import { ICustomersResponse } from "@/pages/app/customers";

interface IDeleteCustomerProps {
  customer: ICustomersResponse;
}

interface IDeleteCustomerResponse {
  data: {
    message: string;
  };
}

export const DeleteCustomerModal = ({ customer }: IDeleteCustomerProps) => {
  const { mutate, isPending } = useDeleteCustomerMutate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");

  function handleSubmitDeleteCustomer(e: FormEvent) {
    e.preventDefault();

    mutate(customer.id, {
      onSuccess: (data: IDeleteCustomerResponse) => {
        toast({
          title: data.data.message,
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
            <DialogTitle>Deletar cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que quer deletar o cliente {customer.name}? Não será
              possivel recuperar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <form onSubmit={handleSubmitDeleteCustomer}>
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
