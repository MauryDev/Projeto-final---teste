import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { username, loading, role } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se o usuário não estiver logado ou não for um ADMIN, redireciona para a home.
  if (!username || role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Se o usuário for um ADMIN, renderiza o componente.
  // Certifique-se de que children não é nulo/undefined antes de renderizá-lo.
  if (!children) {
    return null; // Retorna null ou um componente de fallback se não houver filhos.
  }

  return <>{children}</>;
}