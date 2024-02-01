import { useDeleteUserMutate } from "@/hooks/useDeleteUserMutate";
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
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { FormEvent, ReactNode } from "react";

interface IDeleteUserFormResponse {
  data: {
    message: string;
  };
}

export const DeleteAccountModal = () => {
  const { mutate, isPending } = useDeleteUserMutate();
  const { toast } = useToast();
  const navigate = useNavigate();

  function handleSubmitDeleteUserForm(e: FormEvent) {
    e.preventDefault();

    mutate(undefined, {
      onSuccess: (data: IDeleteUserFormResponse) => {
        toast({
          title: data.data.message,
        });
        localStorage.clear();
        navigate("/");
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
            <DialogTitle>Deletar conta</DialogTitle>
            <DialogDescription>
              Tem certeza que quer deletar sua conta? Todos os dados serão
              perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <form onSubmit={handleSubmitDeleteUserForm}>
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
