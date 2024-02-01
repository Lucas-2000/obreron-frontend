import { Header } from "@/components/header";
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
import { useUpdateUserMutate } from "@/hooks/useUpdateUserMutate";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface IProfileResponse {
  data: {
    message: string;
  };
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, {
        message: "Senha precisa ter pelo menos 8 caracteres.",
      })
      .max(255, {
        message: "Senha tem no máximo 255 caracteres.",
      }),
    rePassword: z
      .string()
      .min(8, {
        message: "Redigitação precisa ter pelo menos 8 caracteres.",
      })
      .max(255, {
        message: "Redigitação tem no máximo 255 caracteres.",
      }),
  })
  .refine((data) => {
    return (
      data.password === data.rePassword,
      {
        message: "As senhas não coincidem",
      }
    );
  });

export const Profile = () => {
  const { toast } = useToast();

  const { mutate, isPending } = useUpdateUserMutate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      rePassword: "",
    },
  });

  function handleSubmitUpdatePasswordForm(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data: IProfileResponse) => {
        toast({
          title: data.data.message,
        });
        form.reset({
          password: "",
          rePassword: "",
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

  return (
    <>
      <Header />
      <main className="p-4">
        <div className="mt-4 h-full flex items-center justify-center">
          <Card className="w-1/4">
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold">
                Atualizar senha
              </CardTitle>
              <CardDescription>Preencha os dados obrigatórios</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Form {...form}>
                <form
                  method="POST"
                  onSubmit={form.handleSubmit(handleSubmitUpdatePasswordForm)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            placeholder="Digite sua senha"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redigitar senha</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            placeholder="Redigite sua senha"
                            type="password"
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
                      Enviar
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};
