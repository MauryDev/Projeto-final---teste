import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Footer from "./components/footer";
import VagasDeEstacionamento from "./pages/VagasDeEstacionamento";
import PrivateRoute from "./components/PrivateRoute";
import Reserva from "./pages/Reserva";
import MinhasReservas from "./pages/MinhasReservas";
import GerenciarVeiculos from "./pages/GerenciarVeiculos";
import PerfilUsuario from "./pages/PerfilUsuario";
import GerenciarVagas from "./pages/GerenciarVagas";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/reservar/:id" element={<Reserva />} />
          <Route
            path="/vagas"
            element={
              <PrivateRoute>
                <VagasDeEstacionamento />
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
              </AdminRoute>}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}