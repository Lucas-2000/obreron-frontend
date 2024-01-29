import { ModeToggle } from "@/components/mode-toggle";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegisterMutate } from "../../hooks/useRegisterMutate";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

export interface IRegisterForm {
  email: string;
  username: string;
  password: string;
  rePassword: string;
}

interface IRegisterFormResponse {
  data: {
    message: string;
  };
}

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "Email inválido",
      })
      .max(255, {
        message: "Email tem no máximo 255 caracteres.",
      }),
    username: z
      .string()
      .min(5, {
        message: "Username precisa ter pelo menos 5 caracteres.",
      })
      .max(255, {
        message: "Username tem no máximo 255 caracteres.",
      }),
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

export const Register = () => {
  const { mutate, isPending } = useRegisterMutate();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      rePassword: "",
    },
  });

  function handleSubmitRegisterForm(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data: IRegisterFormResponse) => {
        toast({
          title: data.data.message,
        });
        form.reset({
          email: "",
          username: "",
          password: "",
          rePassword: "",
        });
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
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="w-full p-4">
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
                Faça seu cadastro
              </CardTitle>
              <CardDescription>Preencha os dados obrigatórios</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Form {...form}>
                <form
                  method="POST"
                  onSubmit={form.handleSubmit(handleSubmitRegisterForm)}
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
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            placeholder="Digite seu username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            type="password"
                            placeholder="Digite sua senha"
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
                        <FormLabel>Redigite Senha</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full border p-2 rounded-md"
                            type="password"
                            placeholder="Redigite sua senha"
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
