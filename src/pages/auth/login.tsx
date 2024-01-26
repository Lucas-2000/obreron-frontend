import { ModeToggle } from "@/components/mode-toggle";
import HomePageSideImage from "../../assets/home-page-side-image.jpg";
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
import { useLoginMutate } from "@/hooks/useLoginMutate";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ReactNode } from "react";

export interface ILoginForm {
  username: string;
  password: string;
}

interface ILoginFormResponse {
  data: {
    token: string;
    user: {
      username: string;
      email: string;
    };
  };
}

const formSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: "Username precisa ter pelo menos 5 caracteres.",
    })
    .max(255, {
      message: "Senha tem no máximo 20 caracteres.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Senha precisa ter pelo menos 8 caracteres.",
    })
    .max(255, {
      message: "Senha tem no máximo 255 caracteres.",
    }),
});

export const Login = () => {
  const { mutate, isPending } = useLoginMutate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function handleSubmitLoginForm(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data: ILoginFormResponse) => {
        if (data.data.token) {
          localStorage.setItem("token", data.data.token);
        }
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
            title: "Erro no login",
            description: errorMessage as ReactNode,
          });
        } else {
          toast({
            title: "Erro no login",
            description: "Erro desconhecido ao processar a solicitação.",
          });
        }
      },
    });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/2 h-full">
        <img
          src={HomePageSideImage}
          alt="home-page-side-image"
          className="w-full h-full object-cover"
        />
      </aside>
      <main className="p-4 w-1/2">
        <section className="flex items-end justify-end">
          <ModeToggle />
        </section>
        <div className="mt-4 h-full flex items-center justify-center">
          <Card className="w-1/2">
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-semibold">
                Faça seu login
              </CardTitle>
              <CardDescription>Preencha os dados obrigatórios</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Form {...form}>
                <form
                  method="POST"
                  onSubmit={form.handleSubmit(handleSubmitLoginForm)}
                  className="space-y-4"
                >
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
                  {isPending ? (
                    <Button className="py-2 px-4 rounded-md" disabled>
                      Carregando
                    </Button>
                  ) : (
                    <Button className="py-2 px-4 rounded-md">Logar</Button>
                  )}

                  <p className="text-sm mt-4">
                    Não possui uma conta?{" "}
                    <a
                      href="/register"
                      className="text-blue-500 hover:underline"
                    >
                      Clique aqui para cadastrar
                    </a>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
