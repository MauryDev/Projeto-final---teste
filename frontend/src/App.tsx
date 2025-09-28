import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import VagasDeEstacionamento from "./pages/VagasDeEstacionamento";
import PrivateRoute from "./components/PrivateRoute";
import Reserva from "./pages/Reserva";
import MinhasReservas from "./pages/MinhasReservas";
import GerenciarVeiculos from "./pages/GerenciarVeiculos";
import PerfilUsuario from "./pages/PerfilUsuario";
import GerenciarVagas from "./pages/GerenciarVagas";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout"; // Importe o componente de Layout

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Use o componente de Layout como o elemento pai para todas as rotas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route
              path="/vagas"
              element={
                <PrivateRoute>
                  <VagasDeEstacionamento />
                </PrivateRoute>
              }
            />
            <Route
              path="/reservar/:id"
              element={
                <PrivateRoute>
                  <Reserva />
                </PrivateRoute>
              }
            />
            <Route
              path="/minhas-reservas"
              element={
                <PrivateRoute>
                  <MinhasReservas />
                </PrivateRoute>
              }
            />
            <Route
              path="/gerenciar-veiculos"
              element={
                <PrivateRoute>
                  <GerenciarVeiculos />
                </PrivateRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <PerfilUsuario />
                </PrivateRoute>
              }
            />
            <Route
              path="/gerenciar-vagas"
              element={
                <AdminRoute>
                  <GerenciarVagas />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}