import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Footer from "./components/footer";
import VagasDeEstacionamento from "./pages/VagasDeEstacionamento";
import PrivateRoute from "./components/PrivateRoute";
import CadastroVeiculo from "./pages/CadastroVeiculo";
import Reserva from "./pages/Reserva";
import MinhasReservas from "./pages/MinhasReservas";
import GerenciarVeiculos from "./pages/GerenciarVeiculos";

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
          <Route path="/cadastrar-veiculo" element={<CadastroVeiculo />} />
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
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}