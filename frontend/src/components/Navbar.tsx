import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { username, logout } = useAuth();

  const handleLogout = () => {
    // Esta função deve ser assíncrona ou apenas chamar a função do hook useAuth
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-md">
      <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand: Usando /favicon.png */}
        <Link className="navbar-brand font-bold text-xl" to="/">
          <img
            src="/favicon.png" // Caminho correto para o arquivo na pasta public
            alt="Logo do Estacionamento"
            // Removidas classes Tailwind de tamanho e usado estilo inline para garantir tamanho de ícone no Bootstrap.
            className="rounded-sm me-2"
            style={{ height: '24px', width: 'auto' }}
          />
        </Link>

        {/* Toggler para Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Links e Dropdown do Lado Esquerdo (HOME e PARK Dropdown) */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              {/* Home */}
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>

            {/* Dropdown "PARK" - Visível apenas se o usuário estiver logado */}
            {username && (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle bg-transparent border-0 text-white hover:text-white focus:text-white"
                  id="parkDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <i className="bi bi-p-square-fill me-1"></i> Park
                </button>
                <ul className="dropdown-menu" aria-labelledby="parkDropdown">
                  {/* OPÇÃO 1: Ver Vagas */}
                  <li>
                    <Link className="dropdown-item" to="/vagas">
                      <i className="bi bi-geo-alt-fill me-2"></i> Ver Vagas
                    </Link>
                  </li>

                  {/* OPÇÃO 2: Minhas Reservas */}
                  <li>
                    <Link className="dropdown-item" to="/minhas-reservas">
                      <i className="bi bi-calendar-check-fill me-2"></i> Minhas Reservas
                    </Link>
                  </li>

                  {/* OPÇÃO 3: Gerenciar Veículos (Meus Veículos) */}
                  <li>
                    <Link className="dropdown-item" to="/gerenciar-veiculos">
                      <i className="bi bi-car-front-fill me-2"></i> Gerenciar Veículos
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Links e Dropdown do Lado Direito (Autenticação/Usuário) */}
          <ul className="navbar-nav">
            {!username ? (
              // Links visíveis quando o usuário NÃO está logado (LOGIN/CADASTRO)
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cadastro">Cadastro</Link>
                </li>
              </>
            ) : (
              // Dropdown do Usuário Logado (Menu de Conta)
              <li className="nav-item dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i> {username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">

                  {/* OPÇÃO 1: Perfil */}
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="bi bi-person-lines-fill me-2"></i> Perfil
                    </Link>
                  </li>

                  {/* OPÇÃO 2: Sair (Logout) */}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sair
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
