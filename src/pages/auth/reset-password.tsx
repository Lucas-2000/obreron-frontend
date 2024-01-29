import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useResetPasswordMutate } from "@/hooks/useResetPasswordMutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";

export interface IResetPasswordForm {
  email: string;
}

interface IResetPasswordFormResponse {
  data: {
    message: string;
  };
}

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email inválido",
    })
    .max(255, {
      message: "Email tem no máximo 255 caracteres.",
    }),
});

export const ResetPassword = () => {
  const { mutate, isPending } = useResetPasswordMutate();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function handleSubmitResetPasswordForm(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data: IResetPasswordFormResponse) => {
        toast({
          title: data.data.message,
        });
        form.reset({
          email: "",
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
            title: "Erro na submissão",
            description: errorMessage as ReactNode,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro na submissão",
            description: "Erro desconhecido ao processar a solicitação.",
            variant: "destructive",
          });
        }
      },
    });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="p-4 w-full">
        <section className="flex items-end justify-end">
          <ModeToggle />
        </section>
        <div className="mt-4 h-full flex items-center justify-center">
          <Card className="w-1/4">
            <div className="p-4">
              <Button variant={"outline"} onClick={() => navigate("/")}>
                Voltar
              </Button>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold">
                Reset de senha
              </CardTitle>
              <CardDescription>Preencha os dados obrigatórios</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Form {...form}>
                <form
                  method="POST"
                  onSubmit={form.handleSubmit(handleSubmitResetPasswordForm)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            placeholder="Digite seu email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isPending ? (
                    <Button className="py-2 px-4 rounded-md" disabled>
                      Carregando
                    </Button>
                  ) : (
                    <Button type="submit" className="py-2 px-4 rounded-md">
                      Cadastrar
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
