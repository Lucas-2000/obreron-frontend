import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router";

export const useTokenValidation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const isTokenExpired = decodedToken.exp! < Date.now() / 1000;

        if (isTokenExpired) {
          toast({
            title: "Sessão Expirada",
            description: "Sessão expirada, faça o login novamente",
            variant: "destructive",
          });
          navigate("/");
        }
      } else {
        toast({
          title: "Sessão Expirada",
          description: "Token não encontrado, faça o login novamente",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    const interval = 15000; // Chamando função a cada 15 segundos
    const intervalId = setInterval(validateToken, interval);

    return () => clearInterval(intervalId);
  });
};
