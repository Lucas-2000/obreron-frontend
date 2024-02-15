import LogoLight from "../assets/logo-light.svg";
import LogoDark from "../assets/logo-dark.svg";
import {
  LogOut,
  NotepadText,
  ShoppingCart,
  SmilePlus,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { RestaurantModal } from "./restaurant-modal";
import { useUserData } from "@/hooks/useUserData";
import { useTokenValidation } from "@/hooks/useTokenValidation";

export const Header = () => {
  const { theme } = useTheme();
  const { data } = useUserData();

  useTokenValidation();

  function handleExit() {
    localStorage.removeItem("token");
  }

  return (
    <>
      <header>
        <nav className="p-4 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app/dashboard" className="mr-4">
              {theme === "dark" || theme === "system" ? (
                <img src={LogoLight} alt="logo" className="w-12 h-12" />
              ) : (
                <img src={LogoDark} alt="logo" className="w-12 h-12" />
              )}
            </Link>
            <Button variant="outline">
              <Link
                to="/app/dashboard"
                className="flex justify-center items-center gap-2"
              >
                Dashboard
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex justify-center items-center gap-2"
                asChild
              >
                <Button variant="outline">Ferramentas</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    to="/app/items"
                    className="flex justify-center items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Itens
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    className="flex justify-center items-center gap-2"
                    to="/app/customers"
                  >
                    <SmilePlus size={20} />
                    Clientes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    className="flex justify-center items-center gap-2"
                    to="/app/orders"
                  >
                    <NotepadText size={20} />
                    Pedidos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <RestaurantModal />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Usuário</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{data?.email}</DropdownMenuLabel>
                <DropdownMenuLabel>{data?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    className="w-full flex items-center gap-2"
                    to="/app/profile"
                  >
                    <User size={20} /> Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    className="text-red-400 w-full flex items-center gap-2"
                    to="/"
                    onClick={handleExit}
                  >
                    <LogOut size={20} /> Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>
      <hr />
    </>
  );
};
